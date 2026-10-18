package io.github.vanoofiahkahi.remindplus;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashSet;
import java.util.Set;

/** Native reminders: scheduled with AlarmManager so they ring even when remind+ is closed. */
final class Alarms {
    private Alarms() {}

    static final String CH_ALARM = "remind_alarm_v1", CH_SOFT = "remind_soft_v1";
    private static final long WINDOW = 3L * 24 * 60 * 60 * 1000;

    static SharedPreferences prefs(Context c) { return c.getSharedPreferences("remind", Context.MODE_PRIVATE); }

    static String permission(Context c) {
        if (Build.VERSION.SDK_INT >= 33 && c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            return "default";
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        return nm != null && nm.areNotificationsEnabled() ? "granted" : "denied";
    }

    static void channels(Context c) {
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null) return;
        if (nm.getNotificationChannel(CH_ALARM) == null) {
            NotificationChannel ch = new NotificationChannel(CH_ALARM, "Alarm ujian & deadline", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Pengingat penting: belajar sebelum ujian, deadline tugas, uang kas");
            ch.enableVibration(true);
            ch.setVibrationPattern(new long[]{0, 800, 300, 800, 300, 800});
            ch.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM),
                    new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build());
            ch.setBypassDnd(true);
            nm.createNotificationChannel(ch);
        }
        if (nm.getNotificationChannel(CH_SOFT) == null) {
            NotificationChannel ch = new NotificationChannel(CH_SOFT, "Pengingat biasa", NotificationManager.IMPORTANCE_DEFAULT);
            ch.setDescription("Pengingat sekolah, pribadi, dan pelajaran");
            ch.enableVibration(true);
            ch.setVibrationPattern(new long[]{0, 180, 90, 180});
            nm.createNotificationChannel(ch);
        }
    }

    static PendingIntent openApp(Context c, String go, int code) {
        Intent i = new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        if (go != null) i.putExtra("go", go);
        return PendingIntent.getActivity(c, code, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void show(Context c, String title, String body, boolean soft, int id) {
        if (!"granted".equals(permission(c))) return;
        channels(c);
        NotificationManager nm = c.getSystemService(NotificationManager.class);
        if (nm == null) return;
        Notification.Builder b = new Notification.Builder(c, soft ? CH_SOFT : CH_ALARM)
                .setSmallIcon(R.drawable.ic_stat)
                .setColor(0xFF7B5CFF)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new Notification.BigTextStyle().bigText(body))
                .setAutoCancel(true)
                .setShowWhen(true)
                .setContentIntent(openApp(c, null, id));
        if (!soft) b.setCategory(Notification.CATEGORY_ALARM);
        try {
            nm.notify(id, b.build());
        } catch (SecurityException ignored) {
        }
    }

    private static PendingIntent reminderPi(Context c, int code, JSONObject r, int flags) {
        Intent i = new Intent(c, ReminderReceiver.class).setAction("io.github.vanoofiahkahi.remindplus.REMIND." + code);
        if (r != null) {
            i.putExtra("title", r.optString("title"));
            i.putExtra("body", r.optString("body"));
            i.putExtra("soft", r.optBoolean("soft"));
            i.putExtra("code", code);
        }
        return PendingIntent.getBroadcast(c, code, i, flags | PendingIntent.FLAG_IMMUTABLE);
    }

    static void setExact(AlarmManager am, long at, PendingIntent pi) {
        try {
            if (Build.VERSION.SDK_INT >= 31 && !am.canScheduleExactAlarms()) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
            else am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pi);
        } catch (SecurityException e) {
            am.set(AlarmManager.RTC_WAKEUP, at, pi);
        }
    }

    /** Replace all scheduled reminders with the list the web app last sent. */
    static synchronized void scheduleAll(Context c) {
        AlarmManager am = c.getSystemService(AlarmManager.class);
        if (am == null) return;
        SharedPreferences p = prefs(c);
        Set<String> old = new HashSet<>(p.getStringSet("codes", new HashSet<>()));
        Set<String> now = new HashSet<>();
        long t = System.currentTimeMillis();
        try {
            JSONArray arr = new JSONArray(p.getString("reminders", "[]"));
            for (int k = 0; k < arr.length(); k++) {
                JSONObject r = arr.getJSONObject(k);
                long at = r.optLong("at");
                if (at <= t || at > t + WINDOW) continue;
                int code = r.optString("id").hashCode();
                setExact(am, at, reminderPi(c, code, r, PendingIntent.FLAG_UPDATE_CURRENT));
                now.add(String.valueOf(code));
            }
        } catch (Exception ignored) {
        }
        for (String s : old) {
            if (now.contains(s)) continue;
            try {
                PendingIntent pi = reminderPi(c, Integer.parseInt(s), null, PendingIntent.FLAG_NO_CREATE);
                if (pi != null) { am.cancel(pi); pi.cancel(); }
            } catch (Exception ignored) {
            }
        }
        p.edit().putStringSet("codes", now).apply();
    }
}
