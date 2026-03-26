'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AuthGuard({ children, initialBgDisabled = false }: { children: React.ReactNode, initialBgDisabled?: boolean }) {
  const [nickname, setNickname] = useState<string | null>(null);
  const [inputName, setInputName] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgHidden, setBgHidden] = useState(initialBgDisabled);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('playlistshare_nickname');
    if (stored) setNickname(stored);

    // Load random background safely on client
    import('@/backgrounds.json').then((module) => {
      const bgs = module.default;
      if (bgs && bgs.length > 0) {
        const randomBg = bgs[Math.floor(Math.random() * bgs.length)];
        setBgImage(`/backgrounds/${randomBg}`);
      }
    });
  }, []);

  useEffect(() => {
    setBgHidden(initialBgDisabled);
  }, [initialBgDisabled]);

  const handleSave = () => {
    if (inputName.trim()) {
      localStorage.setItem('playlistshare_nickname', inputName.trim());
      if (adminCode.trim() === 'yww321') {
        localStorage.setItem('playlistshare_admin', 'true');
      } else {
        localStorage.removeItem('playlistshare_admin');
      }
      window.dispatchEvent(new Event('admin_changed'));
      setNickname(inputName.trim());
    }
  };

  if (!isClient) return null;

  return (
    <>
      {!bgHidden && (
        <div 
          className="fixed inset-0 z-[-1] transition-colors duration-1000"
          style={
            bgImage 
              ? { background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url("${bgImage}") center/cover no-repeat` } 
              : { backgroundColor: 'rgba(0,0,0,0.85)' }
          }
        />
      )}
      {bgHidden && (
        <div className="fixed inset-0 z-[-1] bg-[#0A0014] transition-colors duration-1000" />
      )}

      <AnimatePresence>
        {!nickname && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md`}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-panel p-8 rounded-3xl w-full max-w-sm flex flex-col items-center gap-5 text-center shadow-2xl"
            >
              <div className="flex items-center justify-center mb-0 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]">
                <span className="text-6xl">🎧</span>
              </div>
              <h2 className="text-3xl font-black text-glow-cyan tracking-wide">碗碗的歌单</h2>
              <p className="text-sm text-gray-300 font-medium tracking-wide">欢迎来到碗碗的歌单，请填写昵称</p>
              
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="例如: 32334"
                className="w-full mt-4 px-5 py-4 rounded-xl bg-black/40 border border-[#00FFFF]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#00FFFF] focus:ring-2 focus:ring-[#00FFFF]/50 transition-all font-semibold"
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              />
              
              <button
                onClick={handleSave}
                disabled={!inputName.trim()}
                className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-[#00FFFF] to-[#9D00FF] font-black text-white text-lg tracking-widest shadow-neon-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110 active:scale-95"
              >
                进入歌单
              </button>

              <input
                type="password"
                placeholder="管理口令 (选填)"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                className="max-w-[120px] mt-4 px-2 py-1 bg-transparent text-white/20 text-[10px] text-center border-b border-white/10 focus:outline-none focus:border-white/30 focus:text-white/60 transition-colors"
                title="管理员口令"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={nickname ? 'contents' : 'pointer-events-none opacity-20 blur-xl overflow-hidden h-screen select-none'}>
        {children}
      </div>
    </>
  );
}
