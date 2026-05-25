import { Filesystem, Directory } from '@capacitor/filesystem';
import { backupAllData } from './dataBackup';

const UPDATE_URL_KEY = 'fittrack_update_url';
const UPDATE_VERSION_KEY = 'fittrack_current_version';

const APP_VERSION = 'v26.5.4';
const DEFAULT_UPDATE_URL = 'https://cdn.jsdelivr.net/gh/Mao2000218/-@main/update/version.json';

export interface UpdateInfo {
  version: string;
  buildTime: string;
  url: string;
  size?: number;
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'downloaded'
  | 'error'
  | 'no-update';

class UpdateChecker {
  private status: UpdateStatus = 'idle';
  private progress = 0;
  private errorMessage = '';
  private listeners = new Set<() => void>();

  private notify() {
    for (const fn of this.listeners) fn();
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }

  getState() {
    return { status: this.status, progress: this.progress, error: this.errorMessage };
  }

  getUpdateUrl(): string {
    return localStorage.getItem(UPDATE_URL_KEY) || DEFAULT_UPDATE_URL;
  }

  setUpdateUrl(url: string) {
    localStorage.setItem(UPDATE_URL_KEY, url);
  }

  getCurrentVersion(): string {
    return localStorage.getItem(UPDATE_VERSION_KEY) || APP_VERSION;
  }

  setCurrentVersion(version: string) {
    localStorage.setItem(UPDATE_VERSION_KEY, version);
  }

  async checkForUpdate(): Promise<UpdateInfo | null> {
    const baseUrl = this.getUpdateUrl();
    if (!baseUrl) {
      this.status = 'error';
      this.errorMessage = '未配置更新地址';
      this.notify();
      return null;
    }

    this.status = 'checking';
    this.notify();

    try {
      const resp = await fetch(baseUrl, { cache: 'no-cache' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const info: UpdateInfo = await resp.json();
      const currentVersion = this.getCurrentVersion();

      if (info.version === currentVersion) {
        this.status = 'no-update';
        this.notify();
        return null;
      }

      this.status = 'available';
      this.notify();
      return info;
    } catch (e) {
      this.status = 'error';
      this.errorMessage = e instanceof Error ? e.message : '检查失败';
      this.notify();
      return null;
    }
  }

  async downloadUpdate(info: UpdateInfo): Promise<boolean> {
    this.status = 'downloading';
    this.progress = 0;
    this.notify();

    try {
      const baseUrl = this.getUpdateUrl();
      const zipUrl = new URL(info.url, baseUrl).href;

      const resp = await fetch(zipUrl);
      if (!resp.ok) throw new Error(`下载失败 HTTP ${resp.status}`);

      const total = info.size || parseInt(resp.headers.get('content-length') || '0', 10);
      const reader = resp.body?.getReader();
      if (!reader) throw new Error('不支持流式下载');

      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total > 0) {
          this.progress = Math.round((received / total) * 100);
          this.notify();
        }
      }

      // Combine chunks
      const blob = new Blob(chunks as BlobPart[], { type: 'application/zip' });

      // Save to Capacitor Filesystem
      try {
        await Filesystem.mkdir({ path: '.', directory: Directory.Data, recursive: true });
      } catch { /* directory exists */ }

      try {
        const base64 = await this.blobToBase64(blob);

        await Filesystem.writeFile({
          path: 'update.zip',
          data: base64,
          directory: Directory.Data,
        });

        await Filesystem.writeFile({
          path: 'update_version.json',
          data: JSON.stringify({ version: info.version, buildTime: info.buildTime }),
          directory: Directory.Data,
        });

        this.setCurrentVersion(info.version);
        this.status = 'downloaded';
        this.progress = 100;
        this.notify();

        await backupAllData();

        await Filesystem.writeFile({
          path: 'hot_update_ready',
          data: info.version,
          directory: Directory.Data,
        });

        return true;
      } catch (err) {
        console.error('OTA filesystem error:', err);
        // Fallback: trigger browser download for PWA
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lele-update.zip';
        a.click();
        URL.revokeObjectURL(url);
        this.status = 'error';
        this.errorMessage = '浏览器环境，请使用APK更新';
        this.notify();
        return false;
      }
    } catch (e) {
      this.status = 'error';
      this.errorMessage = e instanceof Error ? e.message : '下载失败';
      this.notify();
      return false;
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const updateChecker = new UpdateChecker();
