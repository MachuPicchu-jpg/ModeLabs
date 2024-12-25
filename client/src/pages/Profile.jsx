import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../config/firebase';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Home, LogOut } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  console.log('User.pic:', user.photoURL);
  const navigate = useNavigate();
  const [userModels, setUserModels] = useState([]);
  const [userInfo, setUserInfo] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    photoURL: user?.photoURL || '../logo.svg', // 设置默认头像
    bio: '',
    organization: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPhoto, setNewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch user's models and data (implement this based on your database structure)
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        // 从 Firestore 获取用户数据
        const userDoc = doc(db, `users/${user.uid}`);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserInfo((prevState) => ({
            ...prevState,
            bio: userData.bio || '',
            organization: userData.organization || '',
            role: userData.role || '',
            photoURL: userData.photoURL || '../logo.svg' // 从 Firestore 中获取 photoURL
          }));
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('UserInfo before update:', userInfo); // Add this line to log userInfo before update
    try {
      await updateProfile(auth.currentUser, {
        displayName: userInfo.displayName
      });

      // Update additional user info in Firestore
      const userDoc = doc(db, `users/${user.uid}`);
      await setDoc(userDoc, {
        bio: userInfo.bio,
        organization: userInfo.organization,
        role: userInfo.role,
        photoURL: userInfo.photoURL
      }, { merge: true });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user.uid);

      const response = await fetch('http://localhost:3001/api/users/uploadphoto', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      const photoURL = data.url;

      // Update photoURL in Firestore
      const userDoc = doc(db, `users/${user.uid}`);
      await setDoc(userDoc, { photoURL }, { merge: true });

      setUserInfo((prevState) => ({
        ...prevState,
        photoURL
      }));
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
      handlePhotoUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="mb-6 flex justify-between items-center">
        <button
  onClick={() => navigate('/')}
  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
>
  <Home className="w-5 h-5" />
  <span>Back to Home</span>
</button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
            </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold leading-6 text-gray-900">User Profile</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and models</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Content */}
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Section */}
                <div className="col-span-1">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={userInfo.photoURL || '../logo.svg'}
                        alt="Profile"
                        className="h-32 w-32 rounded-full cursor-pointer"
                        onClick={handlePhotoClick}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                    {isEditing ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <input
                          type="text"
                          placeholder="Display Name"
                          value={userInfo.displayName}
                          onChange={(e) => setUserInfo({...userInfo, displayName: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Organization"
                          value={userInfo.organization}
                          onChange={(e) => setUserInfo({...userInfo, organization: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <textarea
                          placeholder="Bio"
                          value={userInfo.bio}
                          onChange={(e) => setUserInfo({...userInfo, bio: e.target.value})}
                          className="w-full px-3 py-2 border rounded-md"
                          rows="3"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </form>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-lg font-medium">{userInfo.displayName}</p>
                        <p className="text-gray-600">{userInfo.email}</p>
                        <p className="text-gray-600">{userInfo.organization}</p>
                        <p className="text-gray-600">{userInfo.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Models Section */}
                <div className="col-span-2">
                  <h4 className="text-lg font-medium mb-4">Your Models</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userModels.length > 0 ? (
                      userModels.map((model) => (
                        <div key={model.id} className="border rounded-lg p-4">
                          <h5 className="font-medium">{model.name}</h5>
                          <p className="text-sm text-gray-600">{model.description}</p>
                          {/* Add more model details as needed */}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No models found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;