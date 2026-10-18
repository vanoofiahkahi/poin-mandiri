package io.github.vanoofiahkahi.remindplus;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Home-screen widget: current lesson, plus the next one once the current lesson is past halfway. */
public class WidgetProvider extends AppWidgetProvider {
    static final String TICK = "io.github.vanoofiahkahi.remindplus.WIDGET_TICK";

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) { render(c, m, ids); }

    @Override
    public void onReceive(Context c, Intent i) {
        super.onReceive(c, i);
        if (TICK.equals(i.getAction())) updateAll(c);
    }

    @Override
    public void onDisabled(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        if (am != null) am.cancel(tickPi(c));
    }

    static void updateAll(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] ids = m.getAppWidgetIds(new ComponentName(c, WidgetProvider.class));
        if (ids != null && ids.length > 0) render(c, m, ids);
    }

    private static PendingIntent tickPi(Context c) {
        Intent i = new Intent(c, WidgetProvider.class).setAction(TICK);
        return PendingIntent.getBroadcast(c, 9001, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private static String ymd(Calendar k) {
        return String.format(Locale.US, "%04d-%02d-%02d", k.get(Calendar.YEAR), k.get(Calendar.MONTH) + 1, k.get(Calendar.DAY_OF_MONTH));
    }

    private static int color(String s, int def) {
        try { return Color.parseColor(s); } catch (Exception e) { return def; }
    }

    static void render(Context c, AppWidgetManager m, int[] ids) {
        Calendar now = Calendar.getInstance();
        String today = ymd(now);
        Calendar tm = (Calendar) now.clone();
        tm.add(Calendar.DAY_OF_MONTH, 1);
        int nm = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE);

        Map<String, String> L = new HashMap<>();
        List<WidgetLogic.Day> days = new ArrayList<>();
        String sep = ":", title = "remind+";
        String raw = Alarms.prefs(c).getString("widget", null);
        try {
            if (raw != null) {
                JSONObject o = new JSONObject(raw);
                sep = o.optString("sep", ":");
                JSONObject l = o.optJSONObject("L");
                if (l != null) for (Iterator<String> it = l.keys(); it.hasNext(); ) { String k = it.next(); L.put(k, l.optString(k)); }
                title = L.containsKey("title") ? L.get("title") : title;
                JSONArray ds = o.optJSONArray("days");
                if (ds != null) for (int i = 0; i < ds.length(); i++) {
                    JSONObject d = ds.getJSONObject(i);
                    WidgetLogic.Day day = new WidgetLogic.Day();
                    day.date = d.optString("d");
                    day.label = d.optString("label");
                    JSONArray ss = d.optJSONArray("s");
                    if (ss != null) for (int j = 0; j < ss.length(); j++) {
                        JSONObject s = ss.getJSONObject(j);
                        WidgetLogic.Slot sl = new WidgetLogic.Slot();
                        sl.a = s.optInt("a"); sl.b = s.optInt("b");
                        sl.brk = "b".equals(s.optString("k"));
                        sl.name = s.optString("n"); sl.teacher = s.optString("t"); sl.note = s.optString("note");
                        sl.color = s.optString("c", "#7B5CFF"); sl.exam = s.optInt("x") == 1;
                        day.slots.add(sl);
                    }
                    days.add(day);
                }
            }
        } catch (Exception ignored) {
        }

        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget);
        v.setTextViewText(R.id.w_title, title);
        if (raw == null) {
            v.setTextViewText(R.id.w_sub, "");
            v.setViewVisibility(R.id.b1, View.GONE);
            v.setViewVisibility(R.id.b2, View.GONE);
            v.setViewVisibility(R.id.w_empty, View.VISIBLE);
            v.setTextViewText(R.id.w_empty, "Buka remind+ sekali agar jadwal tampil di sini.");
        } else {
            WidgetLogic.Result r = WidgetLogic.compute(days, today, ymd(tm), nm, sep, L);
            v.setTextViewText(R.id.w_sub, r.sub);
            fill(v, r.main, R.id.b1, R.id.b1_bar, R.id.b1_lbl, R.id.b1_time, R.id.b1_title, R.id.b1_meta, R.id.b1_prog, R.id.b1_extra);
            fill(v, r.next, R.id.b2, R.id.b2_bar, R.id.b2_lbl, R.id.b2_time, R.id.b2_title, R.id.b2_meta, 0, 0);
            boolean empty = r.main == null;
            v.setViewVisibility(R.id.w_empty, empty ? View.VISIBLE : View.GONE);
            if (empty) v.setTextViewText(R.id.w_empty, r.empty);
            scheduleTick(c, now, r.nextUpdateMin);
        }
        v.setOnClickPendingIntent(R.id.root, Alarms.openApp(c, "jadwal", 9002));
        for (int id : ids) m.updateAppWidget(id, v);
    }

    private static void fill(RemoteViews v, WidgetLogic.Block b, int box, int bar, int lbl, int time, int title, int meta, int prog, int extra) {
        if (b == null) { v.setViewVisibility(box, View.GONE); return; }
        v.setViewVisibility(box, View.VISIBLE);
        v.setInt(bar, "setBackgroundColor", color(b.color, 0xFF7B5CFF));
        v.setTextViewText(lbl, (b.live ? "● " : "") + b.kind.toUpperCase(Locale.getDefault()));
        v.setTextColor(lbl, b.live ? 0xFF2FE0B5 : 0xB3FFFFFF);
        v.setTextViewText(time, b.time);
        v.setTextViewText(title, b.title);
        v.setTextViewText(meta, b.meta);
        v.setViewVisibility(meta, b.meta.isEmpty() ? View.GONE : View.VISIBLE);
        if (prog != 0) {
            v.setViewVisibility(prog, b.progress >= 0 ? View.VISIBLE : View.GONE);
            if (b.progress >= 0) v.setProgressBar(prog, 100, b.progress, false);
        }
        if (extra != 0) {
            v.setViewVisibility(extra, b.extra.isEmpty() ? View.GONE : View.VISIBLE);
            v.setTextViewText(extra, b.extra);
        }
    }

    /** Refresh again at the next lesson boundary / halfway point (or in a few minutes during a lesson). */
    private static void scheduleTick(Context c, Calendar now, int minuteOfDay) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        if (am == null) return;
        Calendar at = (Calendar) now.clone();
        at.set(Calendar.SECOND, 2);
        at.set(Calendar.MILLISECOND, 0);
        if (minuteOfDay >= 1440) {
            at.add(Calendar.DAY_OF_MONTH, 1);
            at.set(Calendar.HOUR_OF_DAY, 0);
            at.set(Calendar.MINUTE, 1);
        } else {
            at.set(Calendar.HOUR_OF_DAY, minuteOfDay / 60);
            at.set(Calendar.MINUTE, minuteOfDay % 60);
        }
        Alarms.setExact(am, at.getTimeInMillis(), tickPi(c));
    }
}
