package io.github.vanoofiahkahi.remindplus;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/** Draws the big widget: date, location & weather, current/next lesson, and the rest of the day. */
final class Big {
    private Big() {}

    private static final int[] ROW = {R.id.r0, R.id.r1, R.id.r2, R.id.r3, R.id.r4, R.id.r5, R.id.r6};
    private static final int[] TIME = {R.id.r0_time, R.id.r1_time, R.id.r2_time, R.id.r3_time, R.id.r4_time, R.id.r5_time, R.id.r6_time};
    private static final int[] BAR = {R.id.r0_bar, R.id.r1_bar, R.id.r2_bar, R.id.r3_bar, R.id.r4_bar, R.id.r5_bar, R.id.r6_bar};
    private static final int[] TITLE = {R.id.r0_title, R.id.r1_title, R.id.r2_title, R.id.r3_title, R.id.r4_title, R.id.r5_title, R.id.r6_title};
    private static final int[] META = {R.id.r0_meta, R.id.r1_meta, R.id.r2_meta, R.id.r3_meta, R.id.r4_meta, R.id.r5_meta, R.id.r6_meta};
    private static final int[] END = {R.id.r0_end, R.id.r1_end, R.id.r2_end, R.id.r3_end, R.id.r4_end, R.id.r5_end, R.id.r6_end};

    private static String L(Map<String, String> L, String k) { String v = L.get(k); return v == null ? "" : v; }

    /** How many list rows fit in this widget's current height. */
    static int rowsFor(AppWidgetManager m, int id) {
        try {
            Bundle o = m.getAppWidgetOptions(id);
            int h = o == null ? 0 : o.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0);
            if (h <= 0) return 5;
            return Math.max(0, Math.min(ROW.length, (h - 225) / 40));
        } catch (Exception e) {
            return 5;
        }
    }

    static RemoteViews build(Context c, WidgetLogic.Result r, Map<String, String> L, String sep, String lang, Calendar now, int maxRows) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_big);
        Locale loc = "en".equals(lang) ? Locale.UK : new Locale("id", "ID");
        v.setTextViewText(R.id.h_date, new SimpleDateFormat("EEEE, d MMMM", loc).format(now.getTime()));
        header(c, v, L);
        v.setOnClickPendingIntent(R.id.root, Alarms.openApp(c, "jadwal", 9004));
        v.setOnClickPendingIntent(R.id.h_wx, Alarms.openApp(c, "atur:widget", 9003));
        v.setOnClickPendingIntent(R.id.h_loc, Alarms.openApp(c, "atur:widget", 9003));

        if (r == null || r.main == null) {
            v.setViewVisibility(R.id.b1, View.GONE);
            v.setViewVisibility(R.id.rest, View.GONE);
            v.setViewVisibility(R.id.w_empty, View.VISIBLE);
            v.setTextViewText(R.id.w_empty, r == null ? "Buka remind+ sekali agar jadwal tampil di sini." : r.empty);
            return v;
        }
        v.setViewVisibility(R.id.w_empty, View.GONE);
        WidgetProvider.fill(v, r.main, R.id.b1, R.id.b1_bar, R.id.b1_lbl, R.id.b1_time, R.id.b1_title, R.id.b1_meta, R.id.b1_prog, R.id.b1_extra);

        List<WidgetLogic.Slot> rest = r.rest;
        int lessons = 0;
        for (WidgetLogic.Slot s : rest) if (!s.brk) lessons++;
        v.setViewVisibility(R.id.rest, View.VISIBLE);
        if (rest.isEmpty()) {
            v.setTextViewText(R.id.rest_t, L(L, "lastOne"));
            v.setTextViewText(R.id.rest_n, "");
        } else {
            v.setTextViewText(R.id.rest_t, r.restTitle.toUpperCase(loc));
            v.setTextViewText(R.id.rest_n, lessons == 1 ? L(L, "lessonsOne") : WidgetLogic.fill(L(L, "lessonsMany"), lessons));
        }
        int shown = Math.min(rest.size(), maxRows);
        for (int i = 0; i < ROW.length; i++) {
            if (i >= shown) { v.setViewVisibility(ROW[i], View.GONE); continue; }
            WidgetLogic.Slot s = rest.get(i);
            v.setViewVisibility(ROW[i], View.VISIBLE);
            v.setTextViewText(TIME[i], WidgetLogic.hm(s.a, sep));
            v.setTextViewText(END[i], WidgetLogic.hm(s.b, sep));
            if (s.brk) {
                v.setInt(BAR[i], "setBackgroundColor", 0x40FFFFFF);
                v.setTextViewText(TITLE[i], s.name == null || s.name.isEmpty() ? L(L, "brk") : s.name);
                v.setTextColor(TITLE[i], 0x99FFFFFF);
                v.setTextViewTextSize(TITLE[i], TypedValue.COMPLEX_UNIT_SP, 12.5f);
                v.setTextViewText(META[i], "");
                v.setViewVisibility(META[i], View.GONE);
                v.setTextColor(TIME[i], 0x80FFFFFF);
            } else {
                v.setInt(BAR[i], "setBackgroundColor", WidgetProvider.color(s.color));
                v.setTextViewText(TITLE[i], s.name + (s.exam ? "  ·  " + L(L, "exam") : ""));
                v.setTextColor(TITLE[i], s.exam ? 0xFFFFC857 : 0xFFFFFFFF);
                v.setTextViewTextSize(TITLE[i], TypedValue.COMPLEX_UNIT_SP, 14f);
                String meta = s.teacher == null ? "" : s.teacher;
                if (s.note != null && !s.note.isEmpty()) meta = meta.isEmpty() ? "✎ " + s.note : meta + "  ·  ✎ " + s.note;
                v.setTextViewText(META[i], meta);
                v.setViewVisibility(META[i], meta.isEmpty() ? View.GONE : View.VISIBLE);
                v.setTextColor(TIME[i], 0xCCFFFFFF);
            }
        }
        int more = rest.size() - shown;
        v.setViewVisibility(R.id.rest_more, more > 0 ? View.VISIBLE : View.GONE);
        if (more > 0) v.setTextViewText(R.id.rest_more, WidgetLogic.fill(L(L, "more"), more));
        return v;
    }

    private static void header(Context c, RemoteViews v, Map<String, String> L) {
        JSONObject l = Weather.loc(c), w = Weather.wx(c);
        String mode = l.optString("mode", "auto");
        if ("off".equals(mode)) {
            v.setViewVisibility(R.id.h_loc, View.GONE);
            v.setViewVisibility(R.id.h_wx, View.GONE);
            return;
        }
        v.setViewVisibility(R.id.h_loc, View.VISIBLE);
        if (!l.has("lat")) {
            v.setTextViewText(R.id.h_loc, "📍 " + L(L, "setLoc"));
            v.setViewVisibility(R.id.h_wx, View.GONE);
            return;
        }
        String name = l.optString("name", "");
        v.setTextViewText(R.id.h_loc, "📍 " + (name.isEmpty() ? L(L, "here") : name));
        boolean fresh = w.has("t") && System.currentTimeMillis() - w.optLong("at", 0) < 3 * 60 * 60 * 1000L
                && Math.abs(w.optDouble("lat", 999) - l.optDouble("lat")) < 0.02 && Math.abs(w.optDouble("lon", 999) - l.optDouble("lon")) < 0.02;
        if (!fresh) { v.setViewVisibility(R.id.h_wx, View.GONE); return; }
        int code = w.optInt("code");
        v.setViewVisibility(R.id.h_wx, View.VISIBLE);
        v.setTextViewText(R.id.h_icon, Weather.icon(code, w.optInt("day", 1) == 1));
        v.setTextViewText(R.id.h_temp, Math.round(w.optDouble("t")) + "°");
        String desc = L(L, Weather.key(code));
        if (w.has("hi") && w.has("lo")) desc += (desc.isEmpty() ? "" : " · ") + Math.round(w.optDouble("lo")) + "°/" + Math.round(w.optDouble("hi")) + "°";
        if (w.optInt("pop", 0) >= 30) desc += " · 💧" + w.optInt("pop") + "%";
        v.setTextViewText(R.id.h_desc, desc);
    }
}
