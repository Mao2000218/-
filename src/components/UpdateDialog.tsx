import { useState, useEffect } from 'react';
import { updateChecker, type UpdateInfo } from '../services/updateChecker';
import Icon from './Icon';

export default function UpdateDialog() {
  const [state, setState] = useState(updateChecker.getState());
  const [info, setInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    return updateChecker.subscribe(() => {
      setState(updateChecker.getState());
    });
  }, []);

  useEffect(() => {
    updateChecker.checkForUpdate().then(setInfo);
  }, []);

  const handleCheck = async () => {
    const result = await updateChecker.checkForUpdate();
    setInfo(result);
  };

  const handleDownload = async () => {
    if (!info) return;
    const ok = await updateChecker.downloadUpdate(info);
    if (ok) {
      setTimeout(() => {
        if (confirm('更新已下载！重启应用以应用更新？')) {
          try {
            import('@capacitor/app').then(({ App }) => App.exitApp());
          } catch {
            window.location.reload();
          }
        }
      }, 500);
    }
  };

  const { status, progress, error } = state;

  return (
    <div className="glass-card rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="import" size={16} className="text-gray-400" />
          <h3 className="font-semibold text-sm text-white">在线更新</h3>
        </div>
        <div className="flex items-center gap-2">
          {status === 'available' && (
            <span className="text-xs bg-brand-500/15 text-brand-400 px-2 py-0.5 rounded-full">有新版本</span>
          )}
          {status === 'downloaded' && (
            <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">已就绪</span>
          )}
          <span className="text-[10px] text-gray-600">v26.5.2</span>
        </div>
      </div>

      <div className="space-y-2">
        {status === 'checking' && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            检查更新中...
          </div>
        )}

        {status === 'no-update' && (
          <p className="text-xs text-gray-500">已是最新版本</p>
        )}

        {status === 'available' && info && (
          <div>
            <div className="text-xs text-gray-400 mb-2">
              新版本: {info.version} · {info.buildTime}
            </div>
          </div>
        )}

        {status === 'downloading' && (
          <div>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>下载中</span>
              <span>{progress}%</span>
            </div>
            <div className="bg-[#111] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-1.5 bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'downloaded' && (
          <p className="text-xs text-green-400">更新包已就绪，请重启应用</p>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-400">{error || '更新失败'}</p>
        )}

        <div className="flex gap-2 pt-1">
          {(status === 'idle' || status === 'no-update' || status === 'error') && (
            <button
              onClick={handleCheck}
              className="bg-[#222] border border-[#333] text-gray-300 rounded-xl px-4 py-1.5 text-xs font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              检查更新
            </button>
          )}
          {status === 'available' && (
            <button
              onClick={handleDownload}
              className="bg-brand-500 text-white rounded-xl px-4 py-1.5 text-xs font-medium hover:bg-brand-600 transition-colors"
            >
              下载更新 ({info?.size ? `${(info.size / 1024).toFixed(0)}KB` : '未知'})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
