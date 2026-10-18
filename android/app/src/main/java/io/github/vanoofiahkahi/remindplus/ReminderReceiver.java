package io.github.vanoofiahkahi.remindplus;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** Fires when a scheduled reminder is due. */
public class ReminderReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        String title = i.getStringExtra("title");
        if (title == null) return;
        boolean soft = i.getBooleanExtra("soft", false);
        Alarms.show(c, (soft ? "🔔 " : "⏰ ") + title, i.getStringExtra("body"), soft, i.getIntExtra("code", (int) System.currentTimeMillis()));
        WidgetProvider.updateAll(c);
    }
}
