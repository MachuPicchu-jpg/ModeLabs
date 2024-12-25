import React, { useState } from 'react';
import Layout from '../components/Layout';


export default function RecommendationPage() {
  const [selectedTab, setSelectedTab] = useState('performance');

  return (
    <Layout>
<nav class="w-full py-4 px-8 flex items-center justify-between backdrop-blur-lg bg-white/40 fixed top-0 z-50 border-b border-gray-300"><div class="flex items-center space-x-4"><a class="font-serif text-4xl flex items-center space-x-3 cursor-pointer group" href="/"><span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">ModeLabs</span><div class="w-3 h-3 rounded-full bg-blue-500 group-hover:animate-ping"></div></a></div><div class="hidden lg:flex items-center space-x-6"><button class="
        px-6 py-3 border transition-all duration-300 ease-in-out
        rounded-full flex items-center space-x-3 group
        hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] 
        border-black/20 text-black bg-white/90 hover:border-blue-400
      "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-brain w-6 h-6 transition-transform duration-300 group-hover:scale-125 text-black/70"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path><path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path><path d="M19.938 10.5a4 4 0 0 1 .585.396"></path><path d="M6 18a4 4 0 0 1-1.967-.516"></path><path d="M19.967 17.484A4 4 0 0 1 18 18"></path></svg><span class="text-lg font-semibold tracking-wide">Model</span></button><button class="
        px-6 py-3 border transition-all duration-300 ease-in-out
        rounded-full flex items-center space-x-3 group
        hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] 
        border-black/20 text-black bg-white/90 hover:border-blue-400
      "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database w-6 h-6 transition-transform duration-300 group-hover:scale-125 text-black/70"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5V19A9 3 0 0 0 21 19V5"></path><path d="M3 12A9 3 0 0 0 21 12"></path></svg><span class="text-lg font-semibold tracking-wide">Dataset</span></button><button class="
        px-6 py-3 border transition-all duration-300 ease-in-out
        rounded-full flex items-center space-x-3 group
        hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] 
        border-black/20 text-black bg-white/90 hover:border-blue-400
      "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-test-tube w-6 h-6 transition-transform duration-300 group-hover:scale-125 text-black/70"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"></path><path d="M8.5 2h7"></path><path d="M14.5 16h-5"></path></svg><span class="text-lg font-semibold tracking-wide">Test</span></button><button class="
        px-6 py-3 border transition-all duration-300 ease-in-out
        rounded-full flex items-center space-x-3 group
        hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] 
        border-black/20 text-black bg-white/90 hover:border-blue-400
      "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles w-6 h-6 transition-transform duration-300 group-hover:scale-125 text-black/70"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg><span class="text-lg font-semibold tracking-wide">AI Recommend</span></button><div class="relative group"><div class="flex items-center space-x-3 px-6 py-3 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round w-6 h-6"><path d="M18 20a6 6 0 0 0-12 0"></path><circle cx="12" cy="10" r="4"></circle><circle cx="12" cy="12" r="10"></circle></svg><span>liu-mq22@mails.tsinghua.edu.cn</span></div><div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block"><button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Profile</button><button class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">Log Out</button></div></div></div><div class="lg:hidden flex items-center"><button><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu w-7 h-7 text-gray-800"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg></button></div></nav>
    </Layout>
  );
}