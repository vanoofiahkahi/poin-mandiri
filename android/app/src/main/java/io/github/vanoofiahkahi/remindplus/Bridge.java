package io.github.vanoofiahkahi.remindplus;

import android.webkit.JavascriptInterface;

/** Methods the web app can call as window.RemindNative.*  */
public class Bridge {
    private final MainActivity a;

    Bridge(MainActivity a) { this.a = a; }

    /** Timetable data for the home-screen widget (JSON built by the web app). */
    @JavascriptInterface
    public void setWidget(String json) {
        Alarms.prefs(a).edit().putString("widget", json).apply();
        WidgetProvider.updateAll(a);
    }

    /** All upcoming reminders; scheduled natively so they fire even when the app is closed. */
    @JavascriptInterface
    public void schedule(String json) {
        Alarms.prefs(a).edit().putString("reminders", json).apply();
        Alarms.scheduleAll(a);
    }

    /** Show a notification right now (used for "Test notification"). */
    @JavascriptInterface
    public void notifyNow(String title, String body, boolean soft) {
        Alarms.show(a, title, body, soft, (int) (System.currentTimeMillis() & 0x7fffffff));
    }

    @JavascriptInterface
    public String permission() { return Alarms.permission(a); }

    @JavascriptInterface
    public void requestPermission() { a.runOnUiThread(a::askNotifications); }

    @JavascriptInterface
    public int version() { return 3; }

    // ---------- cuaca & lokasi untuk widget besar ----------

    /** {loc:{mode,lat,lon,name}, wx:{t,code,hi,lo,...}, perm:bool} */
    @JavascriptInterface
    public String wxState() { return Weather.state(a); }

    /** mode: auto | off. "auto" asks for location permission if needed, then finds the tablet's location. */
    @JavascriptInterface
    public void setWxMode(String mode) {
        if ("off".equals(mode)) {
            Weather.setMode(a, "off");
            WidgetProvider.updateAll(a);
            a.wxCb(null);
        } else {
            Weather.setMode(a, "auto");
            a.runOnUiThread(a::askLocation);
        }
    }

    /** Ask for location (permission first if needed) and refresh. */
    @JavascriptInterface
    public void locate() { a.runOnUiThread(a::askLocation); }

    /** A city picked in the app: {name, lat, lon}. */
    @JavascriptInterface
    public void setPlace(String json) {
        try {
            org.json.JSONObject o = new org.json.JSONObject(json);
            Weather.setPlace(a, "city", o.getDouble("lat"), o.getDouble("lon"), o.optString("name"));
            Weather.refreshNow(a, a::wxCb);
        } catch (Exception e) {
            a.wxCb("bad");
        }
    }

    /** Lembar bagikan Android (WebView tidak punya navigator.share). */
    @JavascriptInterface
    public void share(String title, String text) {
        a.runOnUiThread(() -> {
            try {
                android.content.Intent i = new android.content.Intent(android.content.Intent.ACTION_SEND)
                        .setType("text/plain")
                        .putExtra(android.content.Intent.EXTRA_SUBJECT, title)
                        .putExtra(android.content.Intent.EXTRA_TEXT, title + "\n" + text);
                a.startActivity(android.content.Intent.createChooser(i, title));
            } catch (Exception ignored) {
            }
        });
    }
}
