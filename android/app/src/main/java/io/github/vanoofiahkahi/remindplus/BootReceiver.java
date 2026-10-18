package io.github.vanoofiahkahi.remindplus;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** After a restart or app update, put reminders and the widget timer back. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent i) {
        Alarms.scheduleAll(c);
        WidgetProvider.updateAll(c);
    }
}
