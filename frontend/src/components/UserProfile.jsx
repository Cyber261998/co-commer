import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date()
      });
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleProfilePictureUpload = async (file) => {
    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await handleProfileUpdate({ profilePicture: url });
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={profile?.profilePicture || '/default-avatar.png'} 
          alt="Profile" 
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleProfilePictureUpload(e.target.files[0])} 
        />
      </div>

      {editing ? (
        <ProfileEditForm 
          profile={profile} 
          onSubmit={handleProfileUpdate} 
          onCancel={() => setEditing(false)} 
        />
      ) : (
        <ProfileDisplay 
          profile={profile} 
          onEdit={() => setEditing(true)} 
        />
      )}
    </div>
  );
};

export default UserProfile; 