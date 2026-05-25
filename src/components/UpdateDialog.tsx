import { useState, useEffect } from 'react';
import { updateChecker, type UpdateInfo } from '../services/updateChecker';
import Icon from './Icon';

export default function UpdateDialog() {
  const [state, setState] = useState(updateChecker.getState());
  const [info, setInfo] = useState<UpdateInfo | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(updateChecker.getUpdateUrl());

  useEffect(() => {
    return updateChecker.subscribe(() => {
      setState(updateChecker.getState());
    });
  }, []);

  // Auto-check on startup
  useEffect(() => {
    const url = updateChecker.getUpdateUrl();
    if (url) {
      updateChecker.checkForUpdate().then(setInfo);
    }
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

  const handleSaveUrl = () => {
    updateChecker.setUpdateUrl(urlInput.trim());
    setShowUrlInput(false);
    if (urlInput.trim()) {
      updateChecker.checkForUpdate().then(setInfo);
    }
  };

  const { status, progress, error } = state;

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-4 mb-4 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon name="import" size={16} className="text-gray-400" />
          <h3 className="font-semibold text-sm text-white">在线更新</h3>
        </div>
        {status === 'available' && (
          <span className="text-xs bg-brand-500/15 text-brand-400 px-2 py-0.5 rounded-full">有新版本</span>
        )}
        {status === 'downloaded' && (
          <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">已就绪</span>
        )}
      </div>

      {/* Update URL config */}
      {showUrlInput ? (
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="输入 version.json 完整地址"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-[#111] border border-[#333] rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
          />
          <button
            onClick={handleSaveUrl}
            className="bg-brand-500 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            确定
          </button>
          <button
            onClick={() => {
              setShowUrlInput(false);
              setUrlInput(updateChecker.getUpdateUrl());
            }}
            className="text-gray-500 text-sm px-2"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowUrlInput(true)}
          className="text-xs text-gray-500 hover:text-gray-400 transition-colors mb-3 block"
        >
          {updateChecker.getUpdateUrl() ? updateChecker.getUpdateUrl() : '点击设置更新服务地址'}
        </button>
      )}

      {/* Status & actions */}
      <div className="space-y-2">
        {status === 'idle' && !updateChecker.getUpdateUrl() && (
          <p className="text-xs text-gray-600">配置更新地址后即可检查更新</p>
        )}

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

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          {(status === 'idle' || status === 'no-update' || status === 'error') && updateChecker.getUpdateUrl() && (
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
