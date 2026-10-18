package io.github.vanoofiahkahi.remindplus;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** remind+ as an Android app: the live web app in a WebView, plus a small native bridge. */
public class MainActivity extends Activity {
    static final String HOST = "vanoofiahkahi.github.io";
    static final String BASE = "https://" + HOST + "/poin-mandiri/";
    private static final int REQ_FILE = 42, REQ_NOTIF = 7;

    WebView web;
    private ValueCallback<Uri[]> fileCb;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        Window w = getWindow();
        w.setStatusBarColor(0xFF090A0F);
        w.setNavigationBarColor(0xFF090A0F);

        web = new WebView(this);
        web.setBackgroundColor(0xFF090A0F);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setOffscreenPreRaster(true);  // animasi & gulir lebih mulus (pakai sedikit lebih banyak memori)
        s.setUserAgentString(s.getUserAgentString() + " remindplus-android/1");

        web.addJavascriptInterface(new Bridge(this), "RemindNative");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                return handleUrl(r.getUrl().toString());
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (fileCb != null) fileCb.onReceiveValue(null);
                fileCb = cb;
                try {
                    startActivityForResult(p.createIntent(), REQ_FILE);
                } catch (Exception e) {
                    fileCb = null;
                    return false;
                }
                return true;
            }
        });

        if (saved != null) web.restoreState(saved);
        else web.loadUrl(BASE + query(getIntent()));
    }

    private static String query(Intent i) {
        String go = i == null ? null : i.getStringExtra("go");
        return go == null ? "?app=android" : "?app=android&go=" + Uri.encode(go);
    }

    /** Keep remind+ pages inside the app; open everything else (calendar, Clock alarm intents) outside. */
    boolean handleUrl(String url) {
        Uri u = Uri.parse(url);
        if (HOST.equals(u.getHost()) && u.getPath() != null && u.getPath().startsWith("/poin-mandiri")) return false;
        try {
            if (url.startsWith("intent:")) {
                Intent it = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                it.addCategory(Intent.CATEGORY_BROWSABLE);
                it.setComponent(null);
                try {
                    startActivity(it);
                } catch (Exception e) {
                    String fb = it.getStringExtra("browser_fallback_url");
                    if (fb != null) startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(fb)));
                }
            } else {
                startActivity(new Intent(Intent.ACTION_VIEW, u));
            }
        } catch (Exception ignored) {
        }
        return true;
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        String go = intent.getStringExtra("go");
        if (go != null && web != null)
            web.evaluateJavascript("window.remindGo && window.remindGo(" + org.json.JSONObject.quote(go) + ")", null);
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        if (req == REQ_FILE && fileCb != null) {
            fileCb.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(res, data));
            fileCb = null;
        }
    }

    /** Called from the web app (via the bridge) when it wants notification permission. */
    void askNotifications() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, REQ_NOTIF);
        } else {
            permResult(Alarms.permission(this));
        }
    }

    @Override
    public void onRequestPermissionsResult(int req, String[] perms, int[] res) {
        super.onRequestPermissionsResult(req, perms, res);
        if (req == REQ_NOTIF) permResult(Alarms.permission(this));
    }

    private void permResult(String state) {
        if (web != null) web.evaluateJavascript("window.__permCb && window.__permCb(" + org.json.JSONObject.quote(state) + ")", null);
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        if (web != null) web.saveState(out);
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (web != null) web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }
}
