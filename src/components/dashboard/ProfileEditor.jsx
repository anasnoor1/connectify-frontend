import React, { useState, useEffect } from 'react';
import axios from '../../utills/privateIntercept';
import { toast } from 'react-toastify';
import { Loader2, Save, X, ArrowLeft, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileEditor = ({ userRole, onCancel, onSave, brandInfo: initialBrandInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    // Brand specific fields
    company_name: '',
    industry: '',
    website: '',
    // Influencer specific fields
    category: '',
    instagram_username: '',
    followers_count: '',
    engagement_rate: '',
    social_links: '',
    // Common fields
    bio: '',
    avatar_url: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [errors, setErrors] = useState({});
  const [instaStats, setInstaStats] = useState(null);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  const validateField = (name, value) => {
    const trimmed = typeof value === 'string' ? value.trim() : value;
    const emailRegex = /\S+@\S+\.\S+/;
    const urlRegex = /^https?:\/\/[^\s]+$/i;
    const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    switch (name) {
      case 'name': {
        if (!trimmed) return 'Name is required';
        if (trimmed.length < 2) return 'Name must be at least 2 characters';
        return null;
      }
      case 'email': {
        if (!trimmed) return 'Email is required';
        if (!emailRegex.test(trimmed)) return 'Email is invalid';
        return null;
      }
      case 'phone': {
        if (!trimmed) return null;
        const phoneRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;
        const normalized = trimmed.replace(/\s|-/g, '');
        if (!phoneRegex.test(normalized)) {
          return 'Enter a valid Pakistani phone number (e.g. +923001234567 or 03001234567)';
        }
        return null;
      }
      case 'company_name': {
        if (userRole === 'brand') {
          if (!trimmed) return 'Company name is required';
          if (trimmed.length < 2) return 'Company name must be at least 2 characters';
          const nameRegex = /^[A-Za-z\s]+$/;
          if (!nameRegex.test(trimmed)) {
            return 'Company name can only contain letters and spaces';
          }
        }
        return null;
      }
      case 'industry': {
        if (userRole === 'brand') {
          if (!trimmed) return 'Industry is required';
        }
        return null;
      }
      case 'website': {
        if (!trimmed) return null;
        if (!domainRegex.test(trimmed)) return 'Enter a valid website (e.g., example.com)';
        return null;
      }
      case 'category': {
        if (userRole === 'influencer') {
          if (!trimmed) return 'Category is required';
        }
        return null;
      }
      case 'instagram_username': {
        if (userRole === 'influencer') {
          if (!trimmed) return 'Instagram username is required';
          if (!/^[A-Za-z0-9._]{2,30}$/.test(trimmed)) return 'Enter a valid Instagram username';
        }
        return null;
      }
      case 'followers_count': {
        if (!trimmed) return null;
        const followers = Number(trimmed);
        if (!Number.isFinite(followers) || followers < 0) return 'Followers must be 0 or more';
        return null;
      }
      case 'engagement_rate': {
        if (!trimmed) return null;
        const rate = Number(trimmed);
        if (!Number.isFinite(rate) || rate < 0 || rate > 100) return 'Engagement must be between 0 and 100';
        return null;
      }
      case 'social_links': {
        if (!trimmed) return null;
        const links = trimmed
          .split(',')
          .map(link => link.trim())
          .filter(link => link);
        const invalid = links.find(link => !urlRegex.test(link));
        if (invalid) return 'Enter valid URLs starting with http:// or https://';
        return null;
      }
      case 'avatar_url': {
        if (!trimmed) return null;
        if (!urlRegex.test(trimmed)) return 'Enter a valid image URL';
        return null;
      }
      case 'bio': {
        if (!trimmed) return null;
        if (trimmed.length > 500) return 'Bio must be 500 characters or less';
        return null;
      }
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // If we have initial brand info (from dashboard), use that, merging with defaults
        if (userRole === 'brand' && initialBrandInfo) {
          setFormData(prev => ({
            ...prev,
            name: initialBrandInfo.name || prev.name || '',
            email: initialBrandInfo.email || prev.email || '',
            phone: initialBrandInfo.phone || prev.phone || '',
            company_name: initialBrandInfo.company_name || prev.company_name || '',
            industry: initialBrandInfo.industry || prev.industry || '',
            website: initialBrandInfo.website || prev.website || '',
            bio: initialBrandInfo.bio || prev.bio || '',
            avatar_url: initialBrandInfo.avatar_url || prev.avatar_url || '',
            social_links: Array.isArray(initialBrandInfo.social_links)
              ? initialBrandInfo.social_links.join(', ')
              : initialBrandInfo.social_links || prev.social_links || ''
          }));
          setIsLoading(false);
          return;
        }
        
        // Otherwise, fetch the profile data from profile routes
        const endpoint = userRole === 'brand' ? '/api/profile/brand' : '/api/profile/influencer';
        const response = await axios.get(endpoint);
        const profile = response.data.profile || response.data.data || {};

        // Also load basic user info (name, email) so they always match login
        let userName = '';
        let userEmail = '';
        try {
          const userRes = await axios.get('/api/user/me');
          const user = userRes.data?.user || userRes.data || {};
          userName = user.name || '';
          userEmail = user.email || '';
        } catch (userErr) {
          console.error('Error fetching user info for profile editor:', userErr);
        }
        
        // Format social links if it's an array
        const formattedSocialLinks = Array.isArray(profile.social_links) 
          ? profile.social_links.join(', ') 
          : profile.social_links || '';

        setFormData({
          name: profile.name || userName || '',
          email: profile.email || userEmail || '',
          phone: profile.phone || '',
          company_name: profile.company_name || '',
          industry: profile.industry || '',
          website: profile.website || '',
          category: profile.category || '',
          instagram_username: profile.instagram_username || '',
          followers_count: profile.followers_count || '',
          engagement_rate: profile.engagement_rate || '',
          social_links: formattedSocialLinks,
          bio: profile.bio || '',
          avatar_url: profile.avatar_url || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userRole, initialBrandInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchInstagramStats = async () => {
    if (userRole !== 'influencer') return;
    const username = formData.instagram_username?.trim();
    if (!username) return;

    try {
      const res = await axios.get(`/api/instagram/${encodeURIComponent(username)}`);
      const insta = res.data || {};
      setInstaStats(insta);
      setFormData(prev => ({
        ...prev,
        followers_count: insta.followers_count ?? prev.followers_count,
        // Always sync main Instagram profile link with current username
        social_links: `https://instagram.com/${username}`,
      }));
      if (insta.followers_count != null) {
        toast.success('Instagram followers fetched');
      }
    } catch (err) {
      console.error('Instagram fetch error:', err);
      toast.error(err?.response?.data?.message || 'Failed to fetch Instagram data');
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    if (!cloudName || !unsignedPreset) {
      toast.error('Image upload is not configured');
      return;
    }

    try {
      setUploadingAvatar(true);

      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', unsignedPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });

      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        throw new Error(json.error?.message || 'Upload failed');
      }

      setFormData(prev => ({
        ...prev,
        avatar_url: json.secure_url,
      }));

      // Optimistically update navbar avatar preview (DB is updated only on Save)
      try {
        window.dispatchEvent(new CustomEvent('avatar-updated', {
          detail: { url: json.secure_url }
        }));
      } catch (e) {
        console.error('Failed to dispatch avatar preview event:', e);
      }

      toast.success('Image uploaded. Remember to save your profile.');
    } catch (err) {
      console.error('Avatar upload error:', err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Format data before sending
      const baseData = { ...formData };

      // Normalize brand website to full URL if user only typed domain
      if (userRole === 'brand' && baseData.website) {
        const rawWebsite = String(baseData.website).trim();
        if (rawWebsite && !/^https?:\/\//i.test(rawWebsite)) {
          baseData.website = `https://${rawWebsite}`;
        }
      }

      // Format social_links as an array if it's a string (influencer only)
      if (userRole === 'influencer') {
        baseData.social_links = formData.social_links 
          ? formData.social_links.split(',').map(link => link.trim()).filter(link => link)
          : [];
      }

      const endpoint = userRole === 'brand' ? '/api/profile/brand' : '/api/profile/influencer';
      await axios.put(endpoint, baseData);

      // After save, reload user profile to get the final avatar URL from backend
      try {
        const meRes = await axios.get('/api/user/me');
        const meUser = meRes.data?.user || meRes.data || {};
        const meProfile = meRes.data?.profile || {};
        const updatedAvatar = meProfile.avatar_url || meUser.avatar || baseData.avatar_url;

        if (updatedAvatar) {
          window.dispatchEvent(new CustomEvent('avatar-updated', {
            detail: { url: updatedAvatar }
          }));
        }
      } catch (meErr) {
        console.error('Failed to refresh user avatar after profile save:', meErr);
      }
      
      toast.success('Profile updated successfully');
      if (onSave) {
        onSave(baseData);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-gray-600">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header with back button */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {userRole === 'brand' ? 'Edit Brand Profile' : 'Edit Influencer Profile'}
          </h2>
          <div className="ml-auto flex space-x-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Common Fields */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              readOnly
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly
              className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="+1234567890"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile picture
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                    }}
                  />
                ) : (
                  <span className="text-xs text-gray-400 text-center px-2">No image</span>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <Camera className="h-4 w-4 mr-2" />
                  Change photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleAvatarUpload(file);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
                <input
                  type="url"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.avatar_url ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs`}
                  placeholder="or paste image URL"
                />
                {errors.avatar_url && <p className="mt-1 text-sm text-red-600">{errors.avatar_url}</p>}
                <p className="text-[11px] text-gray-400">Image uploads are saved only after you click “Save Changes”.</p>
              </div>
            </div>
          </div>

          {/* Brand Specific Fields */}
          {userRole === 'brand' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.company_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Your company name"
                />
                {errors.company_name && <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="e.g., Technology, Fashion, Food"
                />
                {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    https://
                  </span>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border ${errors.website ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="yourwebsite.com"
                  />
                </div>
                {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
              </div>
            </>
          )}

          {/* Influencer Specific Fields */}
          {userRole === 'influencer' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="">Select a category</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Technology">Technology</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Other">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instagram Username <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    name="instagram_username"
                    value={formData.instagram_username}
                    onChange={handleChange}
                    onBlur={fetchInstagramStats}
                    className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border ${errors.instagram_username ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="username"
                  />
                </div>
                {errors.instagram_username && <p className="mt-1 text-sm text-red-600">{errors.instagram_username}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Follower Count
                </label>
                <input
                  type="number"
                  name="followers_count"
                  value={formData.followers_count}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-3 py-2 border ${errors.followers_count ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="e.g., 50000"
                />
                {errors.followers_count && <p className="mt-1 text-sm text-red-600">{errors.followers_count}</p>}
                {instaStats && (
                  <p className="mt-1 text-xs text-gray-500">
                    Instagram stats: <span className="font-semibold">{instaStats.followers_count ?? '-'} followers</span>,{" "}
                    <span className="font-semibold">{instaStats.following_count ?? '-'} following</span>,{" "}
                    <span className="font-semibold">{instaStats.post_count ?? '-'} posts</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Engagement (%)
                </label>
                <input
                  type="number"
                  name="engagement_rate"
                  value={formData.engagement_rate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.01"
                  className={`w-full px-3 py-2 border ${errors.engagement_rate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="e.g., 4.5"
                />
                {errors.engagement_rate && <p className="mt-1 text-sm text-red-600">{errors.engagement_rate}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Social Links (comma separated)
                </label>
                <input
                  type="text"
                  name="social_links"
                  value={formData.social_links}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.social_links ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="https://twitter.com/username, https://youtube.com/username"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple links with commas
                </p>
                {errors.social_links && <p className="mt-1 text-sm text-red-600">{errors.social_links}</p>}
              </div>
            </>
          )}

          {/* Bio (Common Field) */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border ${errors.bio ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder={`Tell us about your ${userRole === 'influencer' ? 'influencer profile' : 'brand'}...`}
            />
            {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
            <p className="mt-1 text-xs text-gray-500">
              {formData.bio ? formData.bio.length : 0} characters
            </p>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditor;
