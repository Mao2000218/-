package com.fittrack.app;

import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Bridge;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "FitTrackUpdate";
    private static final String UPDATE_WEB_DIR = "updated_web";
    private File hotUpdateDir;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        applyHotUpdate();
        hotUpdateDir = new File(getFilesDir(), UPDATE_WEB_DIR);
        super.onCreate(savedInstanceState);
    }

    private void applyHotUpdate() {
        try {
            File filesDir = getFilesDir();
            File readyFile = new File(filesDir, "hot_update_ready");
            File zipFile = new File(filesDir, "update.zip");
            File webDir = new File(filesDir, UPDATE_WEB_DIR);

            if (!readyFile.exists() || !zipFile.exists()) {
                return;
            }

            Log.i(TAG, "Applying hot update...");

            // Clear old web directory
            deleteRecursive(webDir);
            webDir.mkdirs();

            // Extract zip
            unzip(zipFile, webDir);

            // Clean up
            zipFile.delete();
            readyFile.delete();

            Log.i(TAG, "Hot update applied: " + webDir.getAbsolutePath());
        } catch (Exception e) {
            Log.e(TAG, "Failed to apply hot update", e);
        }
    }

    @Override
    protected void load() {
        // Let Capacitor init normally first
        super.load();

        // If hot update dir has index.html, redirect the WebView to load from there
        if (hotUpdateDir != null) {
            File indexPath = new File(hotUpdateDir, "index.html");
            if (indexPath.exists()) {
                Log.i(TAG, "Redirecting to hot update");
                WebView webView = getBridge().getWebView();
                String url = "file://" + indexPath.getAbsolutePath();
                webView.post(() -> webView.loadUrl(url));
            }
        }
    }

    private void unzip(File zipFile, File destDir) throws Exception {
        try (InputStream is = new java.io.FileInputStream(zipFile);
             ZipInputStream zis = new ZipInputStream(is)) {
            byte[] buffer = new byte[8192];
            ZipEntry entry;
            while ((entry = zis.getNextEntry()) != null) {
                String name = entry.getName();
                if (entry.isDirectory() || name.startsWith("__MACOSX") || name.startsWith(".")) {
                    zis.closeEntry();
                    continue;
                }
                File outFile = new File(destDir, name);
                outFile.getParentFile().mkdirs();
                try (FileOutputStream fos = new FileOutputStream(outFile)) {
                    int len;
                    while ((len = zis.read(buffer)) > 0) {
                        fos.write(buffer, 0, len);
                    }
                }
                zis.closeEntry();
            }
        }
    }

    private void deleteRecursive(File file) {
        if (file.isDirectory()) {
            File[] children = file.listFiles();
            if (children != null) {
                for (File child : children) {
                    deleteRecursive(child);
                }
            }
        }
        file.delete();
    }
}
