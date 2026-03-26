import { fetchSongs, getBgDisabled } from './actions';
import { AuthGuard } from '@/components/AuthGuard';
import { SearchBox } from '@/components/SearchBox';
import { SongList } from '@/components/SongList';
import { LogoutButton } from '@/components/LogoutButton';
import { Radio } from 'lucide-react';

export default async function Home() {
  const songs = await fetchSongs();
  const bgDisabled = await getBgDisabled();

  return (
    <AuthGuard initialBgDisabled={bgDisabled}>
      <main className="max-w-xl mx-auto px-4 py-8 flex flex-col items-center min-h-screen relative">
        <LogoutButton initialBgDisabled={bgDisabled} />
        <div className="flex items-center justify-center gap-4 mb-10 text-[#FF007F] pt-4">
          <div className="relative">
            <Radio className="w-12 h-12 animate-pulse text-[#FF007F]" />
            <div className="absolute inset-0 bg-[#FF007F] blur-2xl opacity-60 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF007F] to-[#9D00FF] tracking-widest drop-shadow-[0_0_15px_rgba(255,0,127,0.8)] pr-2">
            点歌
          </h1>
        </div>
        
        <SearchBox existingSongs={songs} />
        
        <SongList songs={songs} />
      </main>
    </AuthGuard>
  );
}
