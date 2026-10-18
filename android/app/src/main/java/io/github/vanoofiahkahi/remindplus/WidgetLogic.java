package io.github.vanoofiahkahi.remindplus;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Pure logic for the "next up" widget. No Android imports, so it can be tested on any JVM.
 * Mirrors ttWidget() in the web app: show the current lesson; once it is past halfway,
 * also show the next lesson. During a break show the break and the next lesson.
 */
public final class WidgetLogic {
    private WidgetLogic() {}

    public static final class Slot {
        public int a, b;            // minutes from midnight
        public boolean brk;
        public String name = "", teacher = "", note = "", color = "#7B5CFF";
        public boolean exam;
    }

    public static final class Day {
        public String date = "";    // yyyy-MM-dd
        public String label = "";   // e.g. "Rabu, 21 Oktober"
        public List<Slot> slots = new ArrayList<>();
    }

    public static final class Block {
        public String kind = "";    // label text: NOW / NEXT / ...
        public String time = "";
        public String title = "";
        public String meta = "";
        public String color = "#7B5CFF";
        public int progress = -1;   // 0..100, -1 = hidden
        public String extra = "";
        public boolean live, exam;
    }

    public static final class Result {
        public String sub = "";
        public Block main, next;
        public String empty = "";
        public int nextUpdateMin = 1440; // minute of day when the widget should refresh
    }

    static String fill(String t, Object... v) {
        String s = t == null ? "" : t;
        for (int i = 0; i < v.length; i++) s = s.replace("{" + i + "}", String.valueOf(v[i]));
        return s;
    }

    static String hm(int m, String sep) {
        return String.format(java.util.Locale.US, "%02d%s%02d", (m / 60) % 24, sep, m % 60);
    }

    static String dur(int m, Map<String, String> L) {
        return m >= 60 ? fill(L.get("hm"), m / 60, m % 60) : fill(L.get("min"), m);
    }

    static String L(Map<String, String> L, String k) { String v = L.get(k); return v == null ? "" : v; }

    static Block lesson(Slot s, String kind, String sep, Map<String, String> L) {
        Block b = new Block();
        b.kind = kind;
        b.time = hm(s.a, sep) + "–" + hm(s.b, sep);
        b.title = s.name + (s.exam ? "  ·  " + L(L, "exam") : "");
        String meta = s.teacher == null ? "" : s.teacher;
        if (s.note != null && !s.note.isEmpty()) meta = meta.isEmpty() ? "✎ " + s.note : meta + "  ·  ✎ " + s.note;
        b.meta = meta;
        b.color = s.color;
        b.exam = s.exam;
        return b;
    }

    public static Result compute(List<Day> days, String today, String tomorrow, int nm, String sep, Map<String, String> L) {
        Result r = new Result();
        Day td = null;
        for (Day d : days) if (d.date.equals(today)) { td = d; break; }
        List<Slot> slots = td == null ? new ArrayList<>() : td.slots;
        List<Slot> les = new ArrayList<>();
        for (Slot s : slots) if (!s.brk) les.add(s);

        // refresh at every boundary and halfway point today
        int nu = 1440;
        for (Slot s : slots) {
            int[] marks = { s.a, s.a + (s.b - s.a + 1) / 2, s.b };
            for (int m : marks) if (m > nm && m < nu) nu = m;
        }

        if (!les.isEmpty() && nm < les.get(les.size() - 1).b) {
            Slot cur = null;
            for (Slot s : slots) if (nm >= s.a && nm < s.b) { cur = s; break; }
            int from = cur != null ? cur.b : nm;
            Slot nextL = null;
            for (Slot s : les) if (s.a >= from) { nextL = s; break; }
            int left = 0;
            for (Slot s : les) if (s.b > nm) left++;
            r.sub = left == 1 ? L(L, "leftOne") : fill(L(L, "leftMany"), left);

            if (cur == null && nm < slots.get(0).a) {
                r.main = lesson(les.get(0), L(L, "first"), sep, L);
                r.main.extra = fill(L(L, "startsIn"), dur(les.get(0).a - nm, L));
                nu = Math.min(nu, nm + 5);
            } else if (cur != null && cur.brk) {
                Block b = new Block();
                b.kind = L(L, "now");
                b.title = (cur.name == null || cur.name.isEmpty()) ? L(L, "brk") : cur.name;
                b.time = hm(cur.a, sep) + "–" + hm(cur.b, sep);
                b.meta = fill(L(L, "until"), hm(cur.b, sep));
                b.color = "#8A8FA3";
                b.live = true;
                r.main = b;
                if (nextL != null) r.next = lesson(nextL, L(L, "next"), sep, L);
            } else if (cur != null) {
                r.main = lesson(cur, L(L, "now"), sep, L);
                r.main.live = true;
                int p = (int) Math.round(100.0 * (nm - cur.a) / Math.max(1, cur.b - cur.a));
                r.main.progress = Math.max(0, Math.min(100, p));
                r.main.extra = fill(L(L, "leftMin"), cur.b - nm);
                if ((nm - cur.a) * 2 >= (cur.b - cur.a) && nextL != null) r.next = lesson(nextL, L(L, "next"), sep, L);
                nu = Math.min(nu, nm + 5);
            } else if (nextL != null) {
                r.main = lesson(nextL, L(L, "next"), sep, L);
            }
            r.nextUpdateMin = nu;
            return r;
        }

        // after school (or no lessons today): next school day within a week
        for (Day d : days) {
            if (d.date.compareTo(today) <= 0) continue;
            Slot first = null;
            int n = 0;
            for (Slot s : d.slots) if (!s.brk) { if (first == null) first = s; n++; }
            if (first == null) continue;
            r.main = lesson(first, d.date.equals(tomorrow) ? L(L, "tomorrow") : d.label, sep, L);
            r.sub = n == 1 ? L(L, "lessonsOne") : fill(L(L, "lessonsMany"), n);
            r.nextUpdateMin = nu;
            return r;
        }
        r.empty = L(L, "empty");
        r.nextUpdateMin = nu;
        return r;
    }
}
