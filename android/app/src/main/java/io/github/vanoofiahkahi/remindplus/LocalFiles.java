package io.github.vanoofiahkahi.remindplus;

import android.content.Context;
import android.content.res.AssetManager;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Serves the remind+ web app from files bundled inside the APK (assets/web), at the SAME address as the
 * website (https://vanoofiahkahi.github.io/poin-mandiri/). Same address = same storage, so local data and the
 * login stay exactly as they were, and links/QR codes keep working. Nothing of the app is downloaded.
 *
 * The font (Plus Jakarta Sans) is bundled too (assets/fonts, saved at build time), so the app looks the same offline.
 * Everything else (sync, weather, city search) still uses the internet as before.
 */
final class LocalFiles {
    private final AssetManager am;
    final boolean bundled;

    LocalFiles(Context c) {
        am = c.getAssets();
        bundled = exists("web/index.html");
    }

    private boolean exists(String path) {
        try (InputStream in = am.open(path)) { return true; } catch (IOException e) { return false; }
    }

    WebResourceResponse handle(WebResourceRequest r) {
        if (!bundled || !"GET".equalsIgnoreCase(r.getMethod())) return null;
        return handle(r.getUrl());
    }

    WebResourceResponse handle(Uri u) {
        if (!bundled || u == null) return null;
        String host = u.getHost(), path = u.getPath() == null ? "/" : u.getPath();
        if (MainActivity.HOST.equals(host)) {
            if (!path.startsWith("/poin-mandiri")) return null;
            String rel = path.substring("/poin-mandiri".length());
            if (rel.isEmpty() || rel.equals("/")) rel = "/index.html";
            return serve("web" + rel, true);
        }
        if ("fonts.googleapis.com".equals(host) && path.startsWith("/css")) return serve("fonts/fonts.css", false);
        if ("fonts.gstatic.com".equals(host)) return serve("fonts/gstatic" + path, false);
        return null;
    }

    private WebResourceResponse serve(String asset, boolean strict) {
        if (asset.contains("..")) return notFound();
        try {
            InputStream in = am.open(asset);
            String mime = mime(asset);
            Map<String, String> h = new HashMap<>();
            h.put("Cache-Control", "no-cache");
            h.put("Access-Control-Allow-Origin", "*");
            boolean text = mime.startsWith("text/") || mime.endsWith("javascript") || mime.endsWith("json") || mime.endsWith("+xml") || mime.endsWith("manifest+json");
            return new WebResourceResponse(mime, text ? "utf-8" : null, 200, "OK", h, in);
        } catch (IOException e) {
            return strict ? notFound() : null; // a font not saved at build time → fall back to the internet
        }
    }

    private static WebResourceResponse notFound() {
        return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", new HashMap<>(), new ByteArrayInputStream(new byte[0]));
    }

    static String mime(String p) {
        String e = p.substring(p.lastIndexOf('.') + 1).toLowerCase();
        switch (e) {
            case "html": return "text/html";
            case "js": return "application/javascript";
            case "css": return "text/css";
            case "json": return "application/json";
            case "webmanifest": return "application/manifest+json";
            case "svg": return "image/svg+xml";
            case "png": return "image/png";
            case "jpg": case "jpeg": return "image/jpeg";
            case "webp": return "image/webp";
            case "ico": return "image/x-icon";
            case "woff2": return "font/woff2";
            case "woff": return "font/woff";
            case "ttf": return "font/ttf";
            case "md": return "text/markdown";
            case "mp3": return "audio/mpeg";
            case "wav": return "audio/wav";
            default: return "application/octet-stream";
        }
    }
}
