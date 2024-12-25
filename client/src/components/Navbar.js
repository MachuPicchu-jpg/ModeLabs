import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../config/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Brain, Database, TestTube, UserCircle2, Sparkles, Menu } from 'lucide-react';

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    displayName: '',  // 用户显示名称
    email: '',        // 用户邮箱
    bio: '',          // 用户个人简介
    organization: '', // 用户所在组织
    photoURL: null,     // 用户头像URL
  });
  const [newPhoto, setNewPhoto] = useState(null); // 存储上传的新头像
  const [isEditing, setIsEditing] = useState(false); // 控制是否显示编辑模式

  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);  // 用来控制文件输入框的引用

  // 处理头像点击
  const handlePhotoClick = () => {
    fileInputRef.current.click(); // 点击头像时触发文件输入框
  };
  const handleNavigation = (path) => {
    setActiveTab(path);
    setMenuOpen(false);

    if (!user) {
      navigate('/login');
      return;
    }
    
    switch(path) {
      case 'model':
        navigate('/ranking');
        break;
      case 'dataset':
        navigate('/dataset');
        break;
      case 'test':
        navigate('/test');
        break;
      case 'ai-recommend':
        navigate('/welcome');
        break;
      case 'home':
      default:
        navigate('/');
    }
  };
  // 处理头像上传
  const handlePhotoChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.uid);  // 假设 user.uid 是当前登录用户的 ID
  
      try {
        // 上传头像并获取 URL
        const response = await fetch('http://localhost:3001/api/users/uploadphoto', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          const data = await response.json();
          const uploadedPhotoURL = data.url;
          setNewPhoto(uploadedPhotoURL); // 更新头像 URL
          
          // 更新 Firestore 中的 photoURL
          const userDoc = doc(db, `users/${user.uid}`);
          await setDoc(userDoc, { photoURL: uploadedPhotoURL }, { merge: true });
        } else {
          console.error('Error uploading photo:', response);
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    }
  };

  // 处理登出
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // 处理保存个人信息
  const handleSaveProfile = async () => {
    try {
      // 更新 Firebase 中的显示名称和头像
      await updateProfile(auth.currentUser, {
        displayName: userInfo.displayName,
<<<<<<< HEAD
        photoURL: newPhoto || userInfo.photoURL||'https://localhost:3001/uploads/default.jpg',
=======
        photoURL: newPhoto || userInfo.photoURL,
>>>>>>> 0eff355281aeef43e742d9eb453d032df412e6a6
      });
      
      // 更新 Firestore 中的个人信息
      const userDoc = doc(db, `users/${user.uid}`);
      await setDoc(userDoc, {
        displayName: userInfo.displayName,
        email: userInfo.email,
        bio: userInfo.bio,
        organization: userInfo.organization,
        photoURL: newPhoto || userInfo.photoURL,
      }, { merge: true });
      
      // 更新本地状态
      setIsEditing(false); // 退出编辑模式
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // 更新下拉菜单中的个人信息（包括更新后的 bio 和组织）
  useEffect(() => {
    if (user) {
      setUserInfo({
        displayName: user.displayName,
        email: user.email,
        bio: user.bio || '',  // 默认给空字符串，防止 undefined
        organization: user.organization || '', // 加入组织字段
<<<<<<< HEAD
        photoURL: user.photoURL||null,
=======
        photoURL: user.photoURL,
>>>>>>> 0eff355281aeef43e742d9eb453d032df412e6a6
      });
    }
  }, [user]);

  // 用户信息显示区域
  const signInButton = user ? (
    <div className="relative group">
      <div 
        onClick={() => setDropdownVisible(!dropdownVisible)} 
        className="flex items-center space-x-3 px-6 py-3 text-gray-700 cursor-pointer hover:bg-gray-100 rounded-full"
      >
        {user.photoURL ? (
          <img 
            src={newPhoto ||user.photoURL} 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <UserCircle2 className="w-6 h-6" />
        )}
        <span>{user.email}</span>
      </div>
      
      {/* 下拉菜单 */}
      {dropdownVisible && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          {/* 用户头像和基本信息 */}
          <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
<<<<<<< HEAD
            {user.photoURL ? (
            <img
              src={newPhoto || user.photoURL || 'https://localhost:3001/uploads/default.jpg'}
=======
            <img
              src={newPhoto || user.photoURL || '../logo.svg'}
>>>>>>> 0eff355281aeef43e742d9eb453d032df412e6a6
              alt="Profile"
              className="h-16 w-16 rounded-full mx-auto cursor-pointer"
              onClick={handlePhotoClick}
            />
<<<<<<< HEAD
            ):(
            <UserCircle2 className="w-16 h-16 mx-auto cursor-pointer" onClick={handlePhotoClick} />
            )}
=======
>>>>>>> 0eff355281aeef43e742d9eb453d032df412e6a6
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <p className="font-semibold text-xl">{userInfo.displayName}</p>
            <p className="text-xs">{userInfo.email}</p>
          </div>

          {/* 用户详情 */}
          <div className="px-6 py-4 text-sm text-gray-700 space-y-4">
            <div className="flex justify-between">
              <p className="font-medium text-gray-900">Organization:</p>
              <p className="text-gray-600">{userInfo.organization || "No organization"}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-medium text-gray-900">Bio:</p>
              <p className="text-gray-600">{userInfo.bio || "No bio available"}</p>
            </div>
          </div>

          {/* 编辑个人信息表单 */}
          {isEditing && (
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                <input
                  type="text"
                  value={userInfo.displayName}
                  onChange={(e) => setUserInfo({ ...userInfo, displayName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo({ ...userInfo, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <input
                  type="text"
                  value={userInfo.organization}
                  onChange={(e) => setUserInfo({ ...userInfo, organization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="block w-full text-center px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
              >
                Save Changes
              </button>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="py-2 px-4 space-y-2">
            {/* 编辑个人信息按钮 */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)} // 进入编辑模式
                className="block w-full text-center px-6 py-3 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-all"
              >
                Edit Profile
              </button>
            )}
            {/* 登出按钮 */}
            <button
              onClick={handleLogout}
              className="block w-full text-center px-6 py-3 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Link
      to="/login"
      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full flex items-center space-x-3
                hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 transition-all duration-300 ease-in-out transform hover:scale-110"
    >
      <UserCircle2 className="w-6 h-6" />
      <span>Sign In</span>
    </Link>
  );

  return (
    <nav className="w-full py-4 px-8 flex items-center justify-between backdrop-blur-lg bg-white/40 fixed top-0 z-50 border-b border-gray-300">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-serif text-4xl flex items-center space-x-3 cursor-pointer group">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
            ModeLabs
          </span>
          <div className="w-3 h-3 rounded-full bg-blue-500 group-hover:animate-ping"/>
        </Link>
      </div>
      
      <div className="hidden lg:flex items-center space-x-6">
        <NavButton 
          icon={Brain} 
          label="Model" 
          isActive={activeTab === 'model'}
          onClick={() => handleNavigation('model')}
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
        <NavButton 
          icon={Sparkles} 
          label="AI Recommend" 
          isActive={activeTab === 'ai-recommend'}
          onClick={() => handleNavigation('ai-recommend')}
        />
        {signInButton}
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
          {signInButton}
        </div>
      )}
    </nav>
  );
};

export default Navbar;