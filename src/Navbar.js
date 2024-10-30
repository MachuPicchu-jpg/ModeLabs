import React, { useState } from 'react';
import { 
    ChevronRight, 
    Brain, 
    Database, 
    TestTube, 
    UserCircle2, 
    Sparkles,
    Mail, 
    Github, 
    Twitter, 
    Linkedin, 
    Youtube, 
    Instagram, 
    Globe,
    Heart,
    MessagesSquare as Discord,
    Menu
  } from 'lucide-react';
  
const NavButton = ({ icon: Icon, label, isActive, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        px-6 py-3 border transition-all duration-300 ease-in-out
        rounded-full flex items-center space-x-3 group
        hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] 
        ${isActive 
          ? 'border-blue-500 text-blue-500 bg-blue-50 shadow-[0_0_25px_rgba(59,130,246,0.3)]' 
          : 'border-black/20 text-black bg-white/90 hover:border-blue-400'}
      `}
    >
      <Icon className={`w-6 h-6 transition-transform duration-300 group-hover:scale-125 ${isActive ? 'text-blue-500' : 'text-black/70'}`} />
      <span className="text-lg font-semibold tracking-wide">{label}</span>
    </button>
  );
};

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);
  
    const handleNavigation = (path) => {
      setActiveTab(path);
      // 在实际应用中这里可以使用 router 进行导航
      console.log('Navigating to:', path);
    };
  
    return (
      <nav className="w-full py-4 px-8 flex items-center justify-between backdrop-blur-lg bg-white/40 fixed top-0 z-50 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <h1 className="font-serif text-4xl flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigation('home')}>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              ModeLabs
            </span>
            <div className="w-3 h-3 rounded-full bg-blue-500 group-hover:animate-ping"/>
          </h1>
        </div>
        
        <div className="hidden lg:flex items-center space-x-6">
          <NavButton 
            icon={Brain} 
            label="Model" 
            isActive={activeTab === 'model'}
            onClick={() => handleNavigation('model')}
          />
          <NavButton 
            icon={Sparkles} 
            label="AI Recommend" 
            isActive={activeTab === 'ai-recommend'}
            onClick={() => handleNavigation('ai-recommend')}
          />
          <NavButton 
            icon={Database} 
            label="Dataset" 
            isActive={activeTab === 'dataset'}
            onClick={() => handleNavigation('dataset')}
          />
          <NavButton 
            icon={TestTube} 
            label="Test" 
            isActive={activeTab === 'test'}
            onClick={() => handleNavigation('test')}
          />
          <button
            onClick={() => handleNavigation('signin')} 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full flex items-center space-x-3
                       hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300 ease-in-out transform hover:scale-110"
          >
            <UserCircle2 className="w-6 h-6" />
            <span>Sign In</span>
          </button>
        </div>
        <div className="lg:hidden flex items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-7 h-7 text-gray-800" />
          </button>
        </div>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg py-6 flex flex-col items-center space-y-4 lg:hidden">
            <NavButton 
              icon={Brain} 
              label="Model" 
              isActive={activeTab === 'model'}
              onClick={() => handleNavigation('model')}
            />
            <NavButton 
              icon={Sparkles} 
              label="AI Recommend" 
              isActive={activeTab === 'ai-recommend'}
              onClick={() => handleNavigation('ai-recommend')}
            />
            <NavButton 
              icon={Database} 
              label="Dataset" 
              isActive={activeTab === 'dataset'}
              onClick={() => handleNavigation('dataset')}
            />
            <NavButton 
              icon={TestTube} 
              label="Test" 
              isActive={activeTab === 'test'}
              onClick={() => handleNavigation('test')}
            />
            <button
              onClick={() => handleNavigation('signin')} 
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full flex items-center space-x-3
                        hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300 ease-in-out transform hover:scale-110"
            >
              <UserCircle2 className="w-6 h-6" />
              <span>Sign In</span>
            </button>
          </div>
        )}
      </nav>
    );
  };
  

  export default Navbar;