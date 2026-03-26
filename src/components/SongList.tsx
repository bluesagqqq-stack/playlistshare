'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, User, Music, Trash2 } from 'lucide-react';
import { likeSong, deleteSong } from '@/app/actions';
import { useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SongList({ songs }: { songs: any[] }) {
  const [likingId, setLikingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      setIsAdmin(localStorage.getItem('playlistshare_admin') === 'true');
    };
    checkAdmin();
    window.addEventListener('admin_changed', checkAdmin);
    return () => window.removeEventListener('admin_changed', checkAdmin);
  }, []);

  const handleLike = async (id: string) => {
    // Check rate limit logic
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const limitLogStr = localStorage.getItem('playlistshare_likes_log') || '{}';
    let limitLog: Record<string, number[]> = {};
    try {
      limitLog = JSON.parse(limitLogStr);
    } catch(e) {}
    
    // Clean up older timestamps for this song
    let timestamps = limitLog[id] || [];
    timestamps = timestamps.filter(t => now - t < oneHour);
    
    if (timestamps.length >= 3) {
      alert('太热情啦！为了防刷榜，每首歌每小时最多只能点赞 3 次哦，休息一下吧~');
      return;
    }

    setLikingId(id);
    
    // Update and save log locally immediately
    timestamps.push(now);
    limitLog[id] = timestamps;
    localStorage.setItem('playlistshare_likes_log', JSON.stringify(limitLog));

    await likeSong(id);
    setLikingId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('确定要从歌单中删除这首歌吗？')) {
      setDeletingId(id);
      await deleteSong(id);
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black flex items-center gap-3 text-glow-purple tracking-widest">
          <Music className="text-[#9D00FF] w-6 h-6" /> 直播热歌榜
        </h2>
        <span className="text-xs text-[#00FFFF] border border-[#00FFFF]/50 px-2 py-1 rounded-full shadow-neon-cyan animate-pulse">
          REAL-TIME
        </span>
      </div>
      
      <AnimatePresence>
        {songs.map((song, index) => (
          <motion.div
            key={song.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-4 rounded-2xl flex items-center justify-between border-l-4 relative min-w-0"
            style={{ borderLeftColor: index === 0 ? '#FF007F' : index === 1 ? '#9D00FF' : index === 2 ? '#00FFFF' : 'rgba(255,255,255,0.2)' }}
          >
            {/* Background highlight for top 3 */}
            {index < 3 && (
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-2xl"
                style={{ background: `linear-gradient(90deg, ${index === 0 ? '#FF007F' : index === 1 ? '#9D00FF' : '#00FFFF'} 0%, transparent 100%)` }}
              />
            )}
            
            <div className="flex items-center gap-4 min-w-0 flex-1 z-10 px-2">
              <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full shrink-0 ${index === 0 ? 'bg-[#FF007F] text-white shadow-neon-pink' : index === 1 ? 'bg-[#9D00FF] text-white shadow-neon-purple' : index === 2 ? 'bg-[#00FFFF] text-[#0f0c29] shadow-neon-cyan' : 'bg-white/10 text-gray-400'}`}>
                {index + 1}
              </div>
              <div className="truncate flex flex-col items-start gap-1 flex-1">
                <p className="font-bold text-lg leading-tight truncate text-white w-full pr-4">{song.song_name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 truncate w-full">
                  <span className="truncate max-w-[80px] sm:max-w-none shrink-0">{song.artist}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30 shrink-0"></span>
                  <span className="flex items-center gap-1 text-[#00FFFF] truncate shrink">
                    <User className="w-3 h-3 shrink-0" /> <span className="truncate">{song.requested_by}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 z-10 shrink-0">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => handleLike(song.id)}
                disabled={likingId === song.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors shadow-sm ${likingId === song.id ? 'bg-[#FF007F] text-white border-[#FF007F] opacity-70' : 'bg-black/20 border-white/10 text-[#FF007F] hover:bg-[#FF007F]/20 hover:border-[#FF007F]/50'}`}
              >
                <ThumbsUp className={`w-5 h-5 ${likingId === song.id ? 'animate-bounce' : ''}`} />
                <span className="font-bold text-lg">{song.likes}</span>
              </motion.button>

              {isAdmin && (
                <button
                  onClick={() => handleDelete(song.id)}
                  disabled={deletingId === song.id}
                  title="管理员：删除此歌"
                  className="p-2.5 rounded-full bg-black/20 text-gray-400 hover:text-red-500 hover:bg-red-500/20 transition-colors border border-transparent hover:border-red-500/50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {songs.length === 0 && (
          <div className="text-center py-16 text-gray-400 glass-panel rounded-2xl border border-dashed border-white/20">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#00FFFF]" />
            <p className="text-glow-cyan">暂无歌曲，快来点播第一首歌吧！</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
