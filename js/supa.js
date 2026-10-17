/* remind+ — klien Supabase ringan (Auth + REST), tanpa library eksternal.
   Sesi disimpan di perangkat sehingga aplikasi tetap terbuka saat offline. */
(function () {
  'use strict';
  const SKEY = 'remindplus:session';

  function SupaError(message, code, status) {
    const e = new Error(message);
    e.code = code; e.status = status;
    return e;
  }
  function msgOf(j) {
    if (!j) return '';
    return j.msg || j.error_description || j.message || j.error_msg || (typeof j.error === 'string' ? j.error : '') || '';
  }
  function withExpiry(s) {
    if (s && !s.expires_at && s.expires_in) s.expires_at = Math.floor(Date.now() / 1000) + Number(s.expires_in);
    return s;
  }

  class Supa {
    constructor(url, key) {
      this.url = String(url || '').replace(/\/+$/, '');
      this.key = key;
      this.listeners = [];
      this.refreshing = null;
      try { this.session = JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { this.session = null; }
    }
    get user() { return this.session && this.session.user; }
    on(fn) { this.listeners.push(fn); }
    _emit(ev) { this.listeners.forEach(f => { try { f(ev, this.session); } catch (e) {} }); }
    _save(s) {
      this.session = s;
      try { s ? localStorage.setItem(SKEY, JSON.stringify(s)) : localStorage.removeItem(SKEY); } catch (e) {}
    }

    async _fetch(path, { method = 'GET', body, token, headers = {} } = {}) {
      const h = Object.assign({ apikey: this.key, 'Content-Type': 'application/json', Authorization: 'Bearer ' + (token || this.key) }, headers);
      let r;
      try {
        r = await fetch(this.url + path, { method, headers: h, body: body === undefined ? undefined : JSON.stringify(body) });
      } catch (e) {
        throw SupaError('Tidak ada koneksi internet.', 'offline', 0);
      }
      const txt = await r.text();
      let j = null;
      try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
      if (!r.ok) throw SupaError(msgOf(j) || ('Kesalahan server (' + r.status + ')'), (j && (j.error_code || j.code || j.error)) || r.status, r.status);
      return j;
    }

    /* Token akses yang masih berlaku; diperbarui otomatis bila hampir habis. */
    async token() {
      const s = this.session;
      if (!s) return null;
      if ((s.expires_at || 0) * 1000 - Date.now() > 60000) return s.access_token;
      if (!this.refreshing) {
        this.refreshing = (async () => {
          try {
            const n = withExpiry(await this._fetch('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: s.refresh_token } }));
            if (!n.user) n.user = s.user;
            this._save(n);
            this._emit('TOKEN_REFRESHED');
            return n.access_token;
          } catch (e) {
            if (e.code === 'offline') return s.access_token;
            if (e.status === 400 || e.status === 401 || e.status === 403) {
              this._save(null);
              this._emit('SIGNED_OUT');
              throw SupaError('Sesi berakhir. Silakan masuk lagi.', 'no_session', 401);
            }
            throw e;
          } finally { this.refreshing = null; }
        })();
      }
      return this.refreshing;
    }
    async _authed(path, opts = {}) {
      const t = await this.token();
      if (!t) throw SupaError('Sesi berakhir. Silakan masuk lagi.', 'no_session', 401);
      return this._fetch(path, Object.assign({}, opts, { token: t }));
    }

    /* ---------- Auth ---------- */
    async signUp(email, password, name, redirectTo) {
      const q = redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : '';
      const j = await this._fetch('/auth/v1/signup' + q, { method: 'POST', body: { email, password, data: { name } } });
      if (j && j.access_token) {
        this._save(withExpiry(j));
        this._emit('SIGNED_IN');
        return { session: this.session };
      }
      return { needsConfirm: true };
    }
    async signIn(email, password) {
      const j = withExpiry(await this._fetch('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } }));
      this._save(j);
      this._emit('SIGNED_IN');
      return j;
    }
    async recover(email, redirectTo) {
      const q = redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : '';
      await this._fetch('/auth/v1/recover' + q, { method: 'POST', body: { email } });
    }
    async updateUser(attrs) {
      const u = await this._authed('/auth/v1/user', { method: 'PUT', body: attrs });
      if (this.session) { this.session.user = u; this._save(this.session); }
      this._emit('USER_UPDATED');
      return u;
    }
    async signOut() {
      try { const t = this.session && this.session.access_token; if (t) await this._fetch('/auth/v1/logout', { method: 'POST', token: t }); } catch (e) {}
      this._save(null);
      this._emit('SIGNED_OUT');
    }
    /* Menangani tautan dari email (konfirmasi akun / reset password). */
    async handleRedirect() {
      const h = location.hash && location.hash.length > 1 ? new URLSearchParams(location.hash.slice(1)) : null;
      if (!h) return null;
      const clean = () => history.replaceState(null, '', location.pathname + location.search);
      if (h.get('error') || h.get('error_description')) {
        clean();
        return { error: (h.get('error_description') || h.get('error') || '').replace(/\+/g, ' ') };
      }
      const at = h.get('access_token');
      if (!at) return null;
      clean();
      const s = withExpiry({ access_token: at, refresh_token: h.get('refresh_token'), expires_in: Number(h.get('expires_in') || 3600), token_type: 'bearer' });
      if (h.get('expires_at')) s.expires_at = Number(h.get('expires_at'));
      s.user = await this._fetch('/auth/v1/user', { token: at });
      this._save(s);
      this._emit('SIGNED_IN');
      return { type: h.get('type') || 'signin' };
    }

    /* ---------- Data ---------- */
    async getState(uid) {
      const rows = await this._authed('/rest/v1/app_state?select=data,updated_at&user_id=eq.' + encodeURIComponent(uid));
      return rows && rows[0] ? rows[0] : null;
    }
    async putState(uid, data, updatedAt) {
      await this._authed('/rest/v1/app_state?on_conflict=user_id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: { user_id: uid, data, updated_at: updatedAt }
      });
    }
    async rpc(name, args) {
      return this._authed('/rest/v1/rpc/' + name, { method: 'POST', body: args || {} });
    }
  }
  window.Supa = Supa;
})();
