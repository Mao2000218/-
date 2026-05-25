// Backup all localStorage data to Capacitor Filesystem before hot update redirect
// Restore on startup to prevent data loss across origin switches (http://localhost → file://)

const BACKUP_FILE = 'localstorage_backup.json';

// All localStorage keys the app uses
const APP_KEYS = [
  'checkins',
  'fitness_profile',
  'custom_templates',
  'fittrack_update_url',
  'fittrack_current_version',
];

export async function backupAllData(): Promise<boolean> {
  try {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const snapshot: Record<string, string | null> = {};
    for (const key of APP_KEYS) {
      snapshot[key] = localStorage.getItem(key);
    }
    await Filesystem.writeFile({
      path: BACKUP_FILE,
      data: JSON.stringify(snapshot),
      directory: Directory.Data,
    });
    return true;
  } catch {
    return false;
  }
}

export async function restoreAllData(): Promise<boolean> {
  try {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const result = await Filesystem.readFile({
      path: BACKUP_FILE,
      directory: Directory.Data,
    });
    const snapshot: Record<string, string | null> = JSON.parse(result.data as string);
    for (const [key, value] of Object.entries(snapshot)) {
      if (value !== null) {
        localStorage.setItem(key, value);
      } else {
        localStorage.removeItem(key);
      }
    }
    // Delete backup after successful restore
    await Filesystem.deleteFile({
      path: BACKUP_FILE,
      directory: Directory.Data,
    });
    return true;
  } catch {
    return false;
  }
}
