package io.github.vanoofiahkahi.remindplus;

import android.annotation.SuppressLint;
import android.service.dreams.DreamService;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Android screen saver (Settings → Display → Screen saver → remind+).
 * Shows the remind+ screensaver page (?dream=1) from the files inside the APK: clock, weather, current lesson
 * with progress, rest of today, agenda, countdowns and points. Read-only; any touch closes it.
 */
public class RemindDream extends DreamService {
    private WebView web;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    public void onAttachedToWindow() {
        super.onAttachedToWindow();
        setInteractive(false);   // a touch wakes the tablet / closes the screen saver
        setFullscreen(true);
        setScreenBright(true);

        LocalFiles files = new LocalFiles(this);
        web = new WebView(this);
        web.setBackgroundColor(0xFF05060A);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setUserAgentString(s.getUserAgentString() + " remindplus-android/1");
        web.addJavascriptInterface(new DreamBridge(), "RemindNative");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                WebResourceResponse res = files.handle(r);
                return res != null ? res : super.shouldInterceptRequest(v, r);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) { return true; } // stay on the screensaver
        });
        setContentView(web);
        web.loadUrl(MainActivity.BASE + "?app=android&dream=1");
        try { Weather.refreshIfStale(this, null); } catch (Exception ignored) {}
    }

    @Override
    public void onDreamingStarted() {
        super.onDreamingStarted();
        if (web != null) web.onResume();
    }

    @Override
    public void onDreamingStopped() {
        if (web != null) web.onPause();
        super.onDreamingStopped();
    }

    @Override
    public void onDetachedFromWindow() {
        if (web != null) { web.destroy(); web = null; }
        super.onDetachedFromWindow();
    }

    /** What the screensaver page may ask for. No writes, no reminders, no sync. */
    final class DreamBridge {
        @JavascriptInterface public int version() { return 3; }
        @JavascriptInterface public boolean dream() { return true; }
        @JavascriptInterface public boolean bundled() { return true; }
        @JavascriptInterface public int build() { return 0; }
        @JavascriptInterface public String wxState() { return Weather.state(RemindDream.this); }
        @JavascriptInterface public String permission() { return "granted"; }
        @JavascriptInterface public void schedule(String json) {}
        @JavascriptInterface public void setWidget(String json) {}
    }
}
