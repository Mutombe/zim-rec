import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TextField,
  Button,
  Switch,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { Lock, Bell, User, Mail, Shield } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile, clearProfileError } from '../../redux/slices/profileSlice';
import { SettingsSkeleton } from '../skeletons/Skeletons';

const Settings = () => {
  const dispatch = useDispatch();
  const { profileData, loading, error } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    profile_picture: null,
    previewImage: null
  });

  // Initialize form with profile data
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profileData) {
      setFormData({
        first_name: profileData.first_name || '',
        last_name: profileData.last_name || '',
        username: profileData.username || '',
        profile_picture: null,
        previewImage: profileData.profile_picture || null
      });
    }
  }, [profileData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_picture: file,
        previewImage: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const profileUpdate = new FormData();
    
    if (formData.first_name !== profileData.first_name) {
      profileUpdate.append('first_name', formData.first_name);
    }
    if (formData.last_name !== profileData.last_name) {
      profileUpdate.append('last_name', formData.last_name);
    }
    if (formData.username !== profileData.username) {
      profileUpdate.append('username', formData.username);
    }
    if (formData.profile_picture) {
      profileUpdate.append('profile_picture', formData.profile_picture);
    }

    dispatch(updateProfile(profileUpdate));
  };

  if (loading && !profileData) return <SettingsSkeleton />;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-emerald-50 w-fit p-3 rounded-xl mb-5 border border-emerald-100">
            <Shield className="text-emerald-600 w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </motion.div>

        {error && (
          <Alert severity="error" className="mb-4" onClose={() => dispatch(clearProfileError())}>
            {error.detail || "Error updating profile"}
          </Alert>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex items-center space-x-5 mb-8 pb-6 border-b border-gray-100">
              <label htmlFor="profile-picture" className="cursor-pointer group">
                <Avatar
                  src={formData.previewImage}
                  className="!w-20 !h-20 !bg-emerald-50 !border-2 !border-gray-100 group-hover:!border-emerald-200 !transition-colors"
                >
                  {profileData?.username?.[0]?.toUpperCase()}
                </Avatar>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <div>
                <Typography variant="h6">Profile Photo</Typography>
                <Typography variant="body2" color="textSecondary">
                  Recommended size: 500x500px
                </Typography>
              </div>
            </div>

            {/* Profile Information */}
            <div>
              <Typography variant="h6" className="!mb-4 !flex !items-center">
                <User className="mr-2 text-green-600" /> Profile Information
              </Typography>
              <TextField
                fullWidth
                label="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="!mb-4"
              />
              <TextField
                fullWidth
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="!mt-4"
              />
            </div>

            {/* Security Settings */}
            <Divider />
            <div>
              <Typography variant="h6" className="!mb-4 !flex !items-center">
                <Lock className="mr-2 text-green-600" /> Security
              </Typography>
              <TextField
                fullWidth
                label="Email"
                value={profileData?.email || ''}
                disabled
                className="!mb-4"
              />
              <Button
                variant="outlined"
                className="!border-gray-200 !text-gray-700 hover:!border-emerald-500 hover:!text-emerald-700 !rounded-lg !normal-case !font-medium"
                component={Link}
                to="/change-password"
              >
                Change Password
              </Button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <Button
                type="submit"
                variant="contained"
                size="large"
                className="!bg-emerald-600 hover:!bg-emerald-700 !rounded-xl !shadow-sm !normal-case !font-medium !px-8"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} className="!text-white" />
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </div>

        <motion.div 
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Alert severity="info" icon={<Mail className="!text-blue-500" />}>
            Need to update critical account information? Contact our 
            <a href="mailto:support@zimrec.co.zw" className="ml-1 text-blue-600">
              support team
            </a>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;