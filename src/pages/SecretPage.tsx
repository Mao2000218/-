import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';

export default function SecretPage() {
  const navigate = useNavigate();

  return (
    <div className="pb-24 px-4 max-w-lg mx-auto">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-6 opacity-30">
          <Icon name="construction" size={64} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">下次再来看看</h2>
        <p className="text-gray-500 text-sm mb-8">这个功能还在开发中，敬请期待</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#222] border border-[#333] text-gray-300 rounded-xl px-6 py-2.5 text-sm hover:bg-[#2a2a2a] transition-colors"
        >
          返回
        </button>
      </div>
    </div>
  );
}
