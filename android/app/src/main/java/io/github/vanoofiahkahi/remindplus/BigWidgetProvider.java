package io.github.vanoofiahkahi.remindplus;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/** Big widget (home screen & lock screen). Drawing lives in WidgetProvider/Big so both widgets share data and ticks. */
public class BigWidgetProvider extends AppWidgetProvider {
    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        WidgetProvider.updateAll(c);
        if (Weather.stale(c)) Weather.refreshIfStale(c, goAsync());
    }

    /** Resized: show as many rows as fit. */
    @Override
    public void onAppWidgetOptionsChanged(Context c, AppWidgetManager m, int id, android.os.Bundle o) { WidgetProvider.updateAll(c); }

    @Override
    public void onDisabled(Context c) { WidgetProvider.cancelTickIfUnused(c); }
}
