'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Loader2, Check, X } from 'lucide-react';
import { addSong } from '@/app/actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SearchBox({ existingSongs = [] }: { existingSongs?: any[] }) {
  const [query, setQuery] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        fetchResults(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchResults = async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=20`);
      const data = await res.json() as { results: any[] };
      setResults(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAdd = async (song: any) => {
    setAddingId(song.trackId);
    const nickname = localStorage.getItem('playlistshare_nickname') || '匿名粉丝';
    await addSong(song.trackName, song.artistName, nickname);
    setAddingId(null);
    setAddedIds(prev => new Set(prev).add(song.trackId));
  };

  return (
    <div className="relative w-full z-40" ref={dropdownRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#FF007F] transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索你想听的歌曲..."
          className="w-full glass-panel text-white placeholder-gray-400 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#FF007F] focus:bg-white/10 transition-all shadow-neon-pink text-lg"
        />
        
        {query && !loading && (
          <button
            onClick={() => { setQuery(''); setResults([]); setAddedIds(new Set()); }}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {loading && (
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <Loader2 className="h-5 w-5 text-[#FF007F] animate-spin" />
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute mt-3 w-full max-h-[60vh] overflow-y-auto glass-panel rounded-2xl backdrop-blur-xl border border-[#FF007F]/20 shadow-[0_10px_40px_rgba(255,0,127,0.3)] custom-scrollbar">
          {results.map((item) => (
            <div key={item.trackId} className="flex items-center justify-between p-3 border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden">
                <img src={item.artworkUrl60} alt={item.trackName} className="w-12 h-12 rounded-lg shadow-sm" />
                <div className="truncate">
                  <p className="text-white font-bold truncate text-base">{item.trackName}</p>
                  <p className="text-gray-400 text-xs truncate">{item.artistName}</p>
                </div>
              </div>
              <button
                onClick={() => handleAdd(item)}
                disabled={addingId === item.trackId || addedIds.has(item.trackId) || existingSongs.some(s => s.song_name === item.trackName && s.artist === item.artistName)}
                className={`shrink-0 ml-3 p-3 rounded-full transition-all disabled:opacity-50 ${
                  (addedIds.has(item.trackId) || existingSongs.some(s => s.song_name === item.trackName && s.artist === item.artistName))
                    ? 'bg-[#00FFFF]/20 text-[#00FFFF] shadow-neon-cyan cursor-not-allowed'
                    : 'bg-gradient-to-br from-[#FF007F]/20 to-[#9D00FF]/20 text-[#FF007F] hover:from-[#FF007F] hover:to-[#9D00FF] hover:text-white shadow-sm'
                }`}
              >
                {addingId === item.trackId ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (addedIds.has(item.trackId) || existingSongs.some(s => s.song_name === item.trackName && s.artist === item.artistName)) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
