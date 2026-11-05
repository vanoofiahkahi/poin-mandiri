package io.github.vanoofiahkahi.remindplus;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Locale;

/**
 * Location + weather for the big widget.
 * Location: the tablet's own location (LocationManager + Geocoder, no Google Play services) or a city picked in the app.
 * Weather: Open-Meteo (free, no API key). Cached in prefs, refreshed at most every 30 minutes.
 * Prefs: "loc" = {mode: auto|city|off, lat, lon, name, at}, "wx" = {t, code, day, hi, lo, pop, lat, lon, at}.
 */
final class Weather {
    private Weather() {}

    static final long STALE = 30 * 60 * 1000L, RETRY = 5 * 60 * 1000L, LOC_STALE = 60 * 60 * 1000L;
    private static volatile boolean busy;
    private static volatile long lastTry;

    interface Done { void done(String err); }

    static SharedPreferences p(Context c) { return Alarms.prefs(c); }

    static JSONObject loc(Context c) {
        try { return new JSONObject(p(c).getString("loc", "{}")); } catch (Exception e) { return new JSONObject(); }
    }

    static JSONObject wx(Context c) {
        try { return new JSONObject(p(c).getString("wx", "{}")); } catch (Exception e) { return new JSONObject(); }
    }

    static String mode(Context c) { return loc(c).optString("mode", "auto"); }

    static boolean hasPlace(Context c) {
        JSONObject l = loc(c);
        return !"off".equals(l.optString("mode", "auto")) && l.has("lat") && l.has("lon");
    }

    static boolean locPermitted(Context c) {
        return c.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || c.checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    /** Weather is missing, older than 30 min, or for another place. */
    static boolean stale(Context c) {
        if (!hasPlace(c) || busy || System.currentTimeMillis() - lastTry < RETRY) return false;
        JSONObject l = loc(c), w = wx(c);
        if (Math.abs(w.optDouble("lat", 999) - l.optDouble("lat")) > 0.01 || Math.abs(w.optDouble("lon", 999) - l.optDouble("lon")) > 0.01) return true;
        return System.currentTimeMillis() - w.optLong("at", 0) > STALE;
    }

    static void setMode(Context c, String mode) {
        try {
            JSONObject l = loc(c);
            l.put("mode", mode);
            if ("auto".equals(mode) && !"auto".equals(loc(c).optString("mode", "auto"))) { l.remove("lat"); l.remove("lon"); l.remove("name"); }
            p(c).edit().putString("loc", l.toString()).apply();
        } catch (Exception ignored) {
        }
    }

    static void setPlace(Context c, String mode, double lat, double lon, String name) {
        try {
            JSONObject l = new JSONObject();
            l.put("mode", mode).put("lat", lat).put("lon", lon).put("name", name == null ? "" : name).put("at", System.currentTimeMillis());
            p(c).edit().putString("loc", l.toString()).apply();
        } catch (Exception ignored) {
        }
    }

    /** Fetch weather on a background thread if stale, then redraw widgets. pr may be null. */
    static void refreshIfStale(Context c, BroadcastReceiver.PendingResult pr) {
        if (!stale(c)) { if (pr != null) pr.finish(); return; }
        Context app = c.getApplicationContext();
        busy = true;
        lastTry = System.currentTimeMillis();
        new Thread(() -> {
            try { fetch(app); } catch (Exception ignored) {
            } finally {
                busy = false;
                WidgetProvider.updateAll(app);
                if (pr != null) pr.finish();
            }
        }, "remind-wx").start();
    }

    /** Force a fetch now (after the place changed). */
    static void refreshNow(Context c, Done cb) {
        Context app = c.getApplicationContext();
        lastTry = 0;
        new Thread(() -> {
            String err = null;
            try { fetch(app); } catch (Exception e) { err = "net"; }
            WidgetProvider.updateAll(app);
            if (cb != null) cb.done(err);
        }, "remind-wx-now").start();
    }

    private static String get(String url) throws Exception {
        HttpURLConnection h = (HttpURLConnection) new URL(url).openConnection();
        h.setConnectTimeout(7000);
        h.setReadTimeout(7000);
        h.setRequestProperty("User-Agent", "remindplus-android");
        try (InputStream in = h.getInputStream()) {
            ByteArrayOutputStream o = new ByteArrayOutputStream();
            byte[] b = new byte[4096];
            int n;
            while ((n = in.read(b)) > 0) o.write(b, 0, n);
            return o.toString("UTF-8");
        } finally {
            h.disconnect();
        }
    }

    static void fetch(Context c) throws Exception {
        JSONObject l = loc(c);
        if (!l.has("lat")) return;
        double lat = l.getDouble("lat"), lon = l.getDouble("lon");
        String url = String.format(Locale.US, "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f"
                + "&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max"
                + "&timezone=auto&forecast_days=1", lat, lon);
        JSONObject o = new JSONObject(get(url));
        JSONObject cur = o.getJSONObject("current");
        JSONObject d = o.optJSONObject("daily");
        JSONObject w = new JSONObject();
        w.put("t", cur.optDouble("temperature_2m"));
        w.put("code", cur.optInt("weather_code"));
        w.put("day", cur.optInt("is_day", 1));
        if (d != null) {
            JSONArray hi = d.optJSONArray("temperature_2m_max"), lo = d.optJSONArray("temperature_2m_min"), pop = d.optJSONArray("precipitation_probability_max");
            if (hi != null && hi.length() > 0) w.put("hi", hi.optDouble(0));
            if (lo != null && lo.length() > 0) w.put("lo", lo.optDouble(0));
            if (pop != null && pop.length() > 0 && !pop.isNull(0)) w.put("pop", pop.optInt(0));
        }
        w.put("lat", lat).put("lon", lon).put("at", System.currentTimeMillis());
        p(c).edit().putString("wx", w.toString()).apply();
    }

    /** Weather group key (labels come from the web app) and emoji for a WMO weather code. */
    static String key(int code) {
        if (code == 0) return "w_clear";
        if (code == 1) return "w_mostly";
        if (code == 2) return "w_partly";
        if (code == 3) return "w_cloudy";
        if (code == 45 || code == 48) return "w_fog";
        if (code >= 51 && code <= 57) return "w_drizzle";
        if (code == 65 || code == 67 || code == 82) return "w_heavy";
        if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "w_rain";
        if ((code >= 71 && code <= 77) || code == 85 || code == 86) return "w_snow";
        if (code >= 95) return "w_storm";
        return "w_cloudy";
    }

    static String icon(int code, boolean day) {
        if (code == 0) return day ? "☀️" : "🌙";
        if (code == 1 || code == 2) return day ? "⛅" : "☁️";
        if (code == 3) return "☁️";
        if (code == 45 || code == 48) return "🌫️";
        if (code >= 95) return "⛈️";
        if ((code >= 71 && code <= 77) || code == 85 || code == 86) return "🌨️";
        if (code >= 51) return day ? "🌦️" : "🌧️";
        return "☁️";
    }

    // ---------- current location (only called while the app is open) ----------

    /** Find the tablet's location, name it, save it, then fetch weather. Runs cb on a background thread. */
    @SuppressLint("MissingPermission")
    static void locate(Context c, Done cb) {
        Context app = c.getApplicationContext();
        if (!locPermitted(app)) { cb.done("perm"); return; }
        LocationManager lm = app.getSystemService(LocationManager.class);
        if (lm == null) { cb.done("off"); return; }
        boolean on;
        try { on = Build.VERSION.SDK_INT >= 28 ? lm.isLocationEnabled() : (lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER) || lm.isProviderEnabled(LocationManager.GPS_PROVIDER)); } catch (Exception e) { on = false; }
        if (!on) { cb.done("off"); return; }

        Location best = null;
        try {
            for (String pr : lm.getProviders(true)) {
                Location l = lm.getLastKnownLocation(pr);
                if (l != null && (best == null || l.getTime() > best.getTime())) best = l;
            }
        } catch (SecurityException ignored) {
        }
        if (best != null && System.currentTimeMillis() - best.getTime() < 20 * 60 * 1000L) { found(app, best, cb); return; }

        String prov = pick(lm);
        if (prov == null) { if (best != null) found(app, best, cb); else cb.done("off"); return; }
        final Location fallback = best;
        final boolean[] fired = {false};
        Handler h = new Handler(Looper.getMainLooper());
        Runnable timeout = () -> { if (!fired[0]) { fired[0] = true; if (fallback != null) found(app, fallback, cb); else cb.done("none"); } };
        try {
            if (Build.VERSION.SDK_INT >= 30) {
                lm.getCurrentLocation(prov, null, app.getMainExecutor(), l -> {
                    if (fired[0]) return;
                    fired[0] = true;
                    h.removeCallbacks(timeout);
                    if (l != null) found(app, l, cb); else if (fallback != null) found(app, fallback, cb); else cb.done("none");
                });
            } else {
                lm.requestSingleUpdate(prov, new LocationListener() {
                    @Override public void onLocationChanged(Location l) {
                        if (fired[0]) return;
                        fired[0] = true;
                        h.removeCallbacks(timeout);
                        found(app, l, cb);
                    }
                    @Override public void onStatusChanged(String p, int s, Bundle b) {}
                    @Override public void onProviderEnabled(String p) {}
                    @Override public void onProviderDisabled(String p) {}
                }, Looper.getMainLooper());
            }
            h.postDelayed(timeout, 15000);
        } catch (SecurityException e) {
            cb.done("perm");
        }
    }

    private static String pick(LocationManager lm) {
        try {
            List<String> ps = lm.getProviders(true);
            if (Build.VERSION.SDK_INT >= 31 && ps.contains(LocationManager.FUSED_PROVIDER)) return LocationManager.FUSED_PROVIDER;
            if (ps.contains(LocationManager.NETWORK_PROVIDER)) return LocationManager.NETWORK_PROVIDER;
            if (ps.contains(LocationManager.GPS_PROVIDER)) return LocationManager.GPS_PROVIDER;
        } catch (Exception ignored) {
        }
        return null;
    }

    private static void found(Context app, Location l, Done cb) {
        new Thread(() -> {
            String name = placeName(app, l.getLatitude(), l.getLongitude());
            setPlace(app, "auto", l.getLatitude(), l.getLongitude(), name);
            String err = null;
            try { fetch(app); } catch (Exception e) { err = "net"; }
            WidgetProvider.updateAll(app);
            cb.done(err);
        }, "remind-loc").start();
    }

    @SuppressWarnings("deprecation")
    static String placeName(Context c, double lat, double lon) {
        try {
            if (!Geocoder.isPresent()) return "";
            List<Address> a = new Geocoder(c, Locale.getDefault()).getFromLocation(lat, lon, 1);
            if (a == null || a.isEmpty()) return "";
            Address x = a.get(0);
            String n = x.getLocality();
            if (n == null || n.isEmpty()) n = x.getSubAdminArea();
            if (n == null || n.isEmpty()) n = x.getAdminArea();
            return n == null ? "" : n.replaceFirst("^(Kota|Kabupaten) ", "");
        } catch (Exception e) {
            return "";
        }
    }

    /** Called when the app comes to the foreground: refresh an automatic location now and then. */
    static void onAppOpen(Context c) {
        JSONObject l = loc(c);
        if ("auto".equals(l.optString("mode", "auto")) && l.has("lat") && locPermitted(c)
                && System.currentTimeMillis() - l.optLong("at", 0) > LOC_STALE) {
            locate(c, err -> {});
        } else {
            refreshIfStale(c, null);
        }
    }

    /** State for the settings screen in the web app. */
    static String state(Context c) {
        try {
            JSONObject o = new JSONObject();
            o.put("loc", loc(c));
            o.put("wx", wx(c));
            o.put("perm", locPermitted(c));
            return o.toString();
        } catch (Exception e) {
            return "{}";
        }
    }
}
