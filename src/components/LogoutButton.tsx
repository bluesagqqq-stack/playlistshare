'use client';
import { LogOut, Image as ImageIcon, ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toggleBgDisabled } from '@/app/actions';

export function LogoutButton({ initialBgDisabled = false }: { initialBgDisabled?: boolean }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bgDisabled, setBgDisabled] = useState(initialBgDisabled);

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('playlistshare_admin') === 'true');
    };
    checkAdmin();
    window.addEventListener('admin_changed', checkAdmin);

    setBgDisabled(initialBgDisabled);
    
    return () => window.removeEventListener('admin_changed', checkAdmin);
  }, [initialBgDisabled]);

  const handleLogout = () => {
    localStorage.removeItem('playlistshare_nickname');
    localStorage.removeItem('playlistshare_admin');
    window.location.reload();
  };

  const toggleBg = async () => {
    await toggleBgDisabled();
  };
  
  return (
    <div className="absolute top-6 right-4 flex items-center gap-3 z-50">
      {isAdmin && (
        <button 
          onClick={toggleBg}
          className="p-2.5 rounded-full bg-white/5 border border-[#00FFFF]/30 hover:border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/20 transition-all shadow-neon-cyan"
          title={bgDisabled ? "恢复背景图显示" : "关闭背景图"}
        >
          {bgDisabled ? <ImageOff className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
        </button>
      )}
      <button 
        onClick={handleLogout}
        className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-[#FF007F]/50 hover:border-[#FF007F] transition-all shadow-sm"
        title="修改昵称并重置身份"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
