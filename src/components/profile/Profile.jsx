import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "../../utills/privateIntercept";
import { useNavigate } from "react-router-dom";
import { Camera, Mail, Shield, Loader2, Instagram } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchingInstagram, setFetchingInstagram] = useState(false);
  // const [instagramData, setInstagramData] = useState(null);
  const [data, setData] = useState({
    user: { name: "", email: "", role: "" },
    profile: {},
    stats: { profile_completion: 0 }
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log("Loading profile...");
      const res = await axios.get("/api/user/me");
      console.log("Profile data:", res.data);
      setData({
        ...res.data,
        profile: res.data?.profile || {},
        stats: res.data?.stats || {},
      });
    } catch (e) {
      console.error("Profile load error:", e);
      toast.error(e.response?.data?.message || "Failed to load profile");
      // Agar unauthorized hai toh login page par redirect karo
      if (e.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = async () => {
    if (!data.profile?.avatar_url) return;
    
    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }
    
    // Save the current avatar URL at the function scope
    const currentAvatar = data.profile?.avatar_url;
    
    try {
      setSaving(true);
      
      // Optimistic update
      setData(p => ({ 
        ...p, 
        profile: { 
          ...(p.profile || {}), 
          avatar_url: '' 
        } 
      }));
      
      // Update other components
      window.dispatchEvent(new CustomEvent('avatar-updated', { 
        detail: { url: '' } 
      }));
      
      // Save to the backend
      const payload = { ...(data.profile || {}), avatar_url: '' };
      await axios.put('/api/user/me', payload);
      
      toast.success('Profile picture removed');
      
    } catch (e) {
      console.error('Remove avatar error:', e);
      
      // Revert on error
      setData(p => ({ 
        ...p, 
        profile: { 
          ...(p.profile || {}), 
          avatar_url: currentAvatar 
        } 
      }));
      
      window.dispatchEvent(new CustomEvent('avatar-updated', { 
        detail: { url: currentAvatar } 
      }));
      
      toast.error(e.response?.data?.message || 'Failed to remove profile picture');
    } finally {
      setSaving(false);
    }
  };

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  // const phoneRegex = /^\+?[0-9]{10,15}$/;
  const phoneRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;
  const countWords = (t = '') => (t || '').trim().split(/\s+/).filter(Boolean).length;

  // Client-side live profile completion (mirrors backend calculation)
  const computeProfileCompletion = (profile = {}, role = '') => {
    let completed = 0;
    let total = 0;

    if (role === 'brand') {
      const fields = ['company_name', 'industry', 'website', 'bio', 'avatar_url'];
      total = fields.length;
      fields.forEach((f) => {
        if (profile[f] && String(profile[f]).trim() !== '') completed++;
      });
    } else {
      const fields = ['category', 'bio', 'avatar_url', 'social_links'];
      total = fields.length;
      fields.forEach((f) => {
        if (f === 'social_links') {
          const links = profile[f];
          const hasLinks = Array.isArray(links)
            ? links.length > 0
            : String(links || '').trim() !== '';
          if (hasLinks) completed++;
        } else if (profile[f] && String(profile[f]).trim() !== '') {
          completed++;
        }
      });
    }

    return Math.round((completed / Math.max(total, 1)) * 100);
  };

  const liveCompletion = useMemo(
    () => computeProfileCompletion(data.profile || {}, data.user.role || ''),
    [data.profile, data.user.role]
  );

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET;

  const uploadAvatar = async (file) => {
    if (!file) return;
    if (!cloudName || !unsignedPreset) {
      toast.error('Cloudinary is not configured');
      return;
    }
    try {
      setUploading(true);
      
      // Save the current avatar URL in case we need to revert
      const currentAvatar = data.profile?.avatar_url;
      
      // Optimistic update
      const tempUrl = URL.createObjectURL(file);
      setData(prev => ({
        ...prev,
        profile: { ...(prev.profile || {}), avatar_url: tempUrl }
      }));
      
      // Upload to Cloudinary
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', unsignedPreset);
      
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });
      
      const json = await res.json();
      if (!res.ok || !json.secure_url) {
        // Revert to previous avatar if upload fails
        setData(prev => ({
          ...prev,
          profile: { ...(prev.profile || {}), avatar_url: currentAvatar }
        }));
        throw new Error(json.error?.message || 'Upload failed');
      }
      
      // Update with the permanent URL
      setData(prev => ({
        ...prev,
        profile: { ...(prev.profile || {}), avatar_url: json.secure_url }
      }));
      
      // Update other components
      window.dispatchEvent(new CustomEvent('avatar-updated', { 
        detail: { url: json.secure_url } 
      }));
      
      // Save to the backend
      const payload = { ...(data.profile || {}), avatar_url: json.secure_url };
      await axios.put('/api/user/me', payload);
      
      toast.success('Profile picture updated');
      
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const fetchInstagramData = useCallback(async (username) => {
    if (!username) return;
    
    try {
      setFetchingInstagram(true);
      
      // Only fetch if the username has actually changed
      if (username === data.profile?.instagram_username) {
        return; // Skip if same username
      }
      
      const response = await axios.get(`/api/instagram/${encodeURIComponent(username)}`);
      
      // Only update the specific Instagram-related fields
      setData(prev => ({
        ...prev,
        profile: {
          ...prev.profile, // Keep all existing profile data
          instagram_username: username,
          followers_count: response.data.followers_count,
          engagement_rate: response.data.engagement_rate,
          social_links: `https://instagram.com/${username}`
        }
      }));
      
      // Update the local Instagram username state
      setInstagramUsername(username);
      
      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        'profile.followers_count': '',
        'profile.engagement_rate': ''
      }));
      
      return response.data; // Return the fetched data
      
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch Instagram data');
      
      // Clear the fields if there's an error
      setData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          followers_count: '',
          engagement_rate: ''
        }
      }));
      throw error; // Re-throw to handle in the calling function
    } finally {
      setFetchingInstagram(false);
    }
  }, []);

  // Track the Instagram username in component state
  const [instagramUsername, setInstagramUsername] = useState('');

  // Update local state when profile data loads
  useEffect(() => {
    if (data.profile?.instagram_username) {
      setInstagramUsername(data.profile.instagram_username);
    }
  }, [data.profile?.instagram_username]);

  const handleInstagramUsernameChange = (e) => {
    setInstagramUsername(e.target.value);
  };

  const handleInstagramUsernameBlur = async (e) => {
    const username = e.target.value.trim();
    if (username && username !== data.profile?.instagram_username) {
      try {
        const result = await fetchInstagramData(username);
        if (result) {
          // Update the input field with the new username
          setInstagramUsername(username);
        }
      } catch (err) {
        console.error(err.msg)
      }
    }
  };

  const hasEmptyRequired = () => {
    const p = data.profile || {};
    if (data.user.role === 'brand') {
      const req = [data.user.name, p.company_name, p.industry, p.website, p.phone, p.bio];
      return req.some(v => !String(v ?? '').trim());
    }
    const req = [data.user.name, p.category, p.phone, p.social_links, p.bio];
    return req.some(v => !String(v ?? '').trim());
  };

  const validateField = (fullName, rawValue) => {
    const name = fullName.replace('profile.', '').replace('user.', '');
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    let message = "";

    // Common
    if (fullName === 'user.name' && !value) message = 'Name is required';

    if (data.user.role === 'brand') {
      if (['company_name','industry','website','phone','bio'].includes(name) && !value) message = 'This field is required';
      if (name === 'company_name' && !value) message = 'Company name is required';
      if (name === 'website' && value && !urlRegex.test(value)) message = 'Enter a valid URL (http/https)';
      if (name === 'avatar_url' && value && !urlRegex.test(value)) message = 'Enter a valid URL (http/https)';
      // if (name === 'phone' && value && !phoneRegex.test(value.replace(/\s|-/g, ''))) message = 'Enter 10-15 digits (optional +)';
      if (name === 'phone' && value && !phoneRegex.test(value.replace(/\s|-/g, ''))) {
        message = 'Enter a valid Pakistani phone number (e.g. +923001234567 or 03001234567)';
      }
    } else {
      // Make followers_count and engagement_rate not required when entered via Instagram
      const requiredFields = ['category', 'phone', 'social_links', 'bio'];
      if (requiredFields.includes(name) && !value) message = 'This field is required';
      
      if (name === 'followers_count') {
        const n = Number(value);
        if (value !== '' && !Number.isNaN(n) && n < 0) {
          message = 'Followers must be 0 or more';
        }
      }
      if (name === 'engagement_rate') {
        const n = Number(value);
        if (value !== '' && !Number.isNaN(n) && (n < 0 || n > 100)) {
          message = 'Rate must be between 0 and 100';
        }
      }
      if (name === 'avatar_url' && value && !urlRegex.test(value)) message = 'Enter a valid URL (http/https)';
      // if (name === 'phone' && value && !phoneRegex.test(value.replace(/\s|-/g, ''))) message = 'Enter 10-15 digits (optional +)';
      if (name === 'phone' && value && !phoneRegex.test(value.replace(/\s|-/g, ''))) {
        message = 'Enter a valid Pakistani phone number (e.g. +923001234567 or 03001234567)';
      }
      if (name === 'social_links' && value) {
        const items = value.split(',').map(s => s.trim()).filter(Boolean);
        const invalid = items.find(u => !urlRegex.test(u));
        if (invalid) message = 'All social links must be valid URLs';
      }
    }

    if (name === 'bio') {
      if (!value) message = 'This field is required';
      else if (countWords(value) > 500) message = 'Bio must be at most 500 words';
    }

    setErrors(prev => ({ ...prev, [fullName]: message }));
    return !message;
  };

  const validateAll = () => {
    const fields = [];
    fields.push('user.name');
    if (data.user.role === 'brand') {
      fields.push('profile.company_name', 'profile.industry', 'profile.website', 'profile.phone', 'profile.bio');
    } else {
      fields.push('profile.category', 'profile.followers_count', 'profile.engagement_rate', 'profile.phone', 'profile.social_links', 'profile.bio');
    }
    let ok = true;
    for (const f of fields) {
      const path = f.startsWith('user.') ? 'user' : 'profile';
      const key = f.split('.')[1];
      const value = (data[path] || {})[key] ?? '';
      ok = validateField(f, String(value)) && ok;
    }
    return ok;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const field = name.replace('profile.', '');
      let nextValue = value;
      if (field === 'bio') {
        const words = value.trim().split(/\s+/).filter(Boolean);
        if (words.length > 500) {
          nextValue = words.slice(0, 500).join(' ');
        }
      }
      setData(prev => ({
        ...prev,
        profile: { ...(prev.profile || {}), [field]: nextValue }
      }));
      validateField(name, nextValue);
    } else if (name.startsWith('user.')) {
      const field = name.replace('user.', '');
      setData(prev => ({
        ...prev,
        user: { ...(prev.user || {}), [field]: value }
      }));
      validateField(name, value);
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setSaving(true);
      
      // If there's a new Instagram username, fetch its data first
      if (instagramUsername && instagramUsername !== data.profile?.instagram_username) {
        try {
          await fetchInstagramData(instagramUsername);
        } catch (error) {
          // If Instagram fetch fails, still proceed with saving other data
          console.error('Error fetching Instagram data:', error);
        }
      }
      
      // Prepare the payload with the latest data including Instagram username
      const payload = {
        ...(data.profile || {}),
        instagram_username: instagramUsername || data.profile?.instagram_username,
        name: data.user.name
      };
      
      // Save the profile
      const res = await axios.put("/api/user/me", payload);
      
      // Update local state with the saved data
      await loadProfile();
      
      // Show success message only after everything is done
      toast.success(res.data?.message || "Profile updated successfully");
      
    } catch (e) {
      console.error("Profile update error:", e);
      toast.error(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl" />
          <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center gap-4">
                <div className="relative group h-24 w-24 rounded-full ring-4 ring-white/20 bg-white/10 backdrop-blur flex-shrink-0 overflow-hidden border border-white/20 shadow-lg">
                  {data.profile.avatar_url ? (
                    <img src={data.profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="h-full w-full flex items-center justify-center text-3xl sm:text-4xl font-semibold bg-gradient-to-br from-indigo-100 to-purple-100">
                      {(data.user.name || data.user.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <label className="cursor-pointer p-2 bg-white/80 rounded-full text-indigo-700 hover:bg-white transition-colors">
                      <Camera className="h-5 w-5" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadAvatar(e.target.files[0]);
                            // Reset the input value to allow selecting the same file again
                            e.target.value = '';
                          }
                        }} 
                      />
                    </label>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                {(data.profile.followers_count !== undefined && data.profile.followers_count !== null && data.profile.followers_count !== '') && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-md border border-white/20">
                    <div className="flex items-center gap-2 text-indigo-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                      </svg>
                      <div>
                        <div className="text-xs font-medium text-gray-500">Followers</div>
                        <div className="text-lg font-bold">
                          {typeof data.profile.followers_count === 'number' 
                            ? data.profile.followers_count.toLocaleString() 
                            : data.profile.followers_count}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold leading-tight">{data.user.name || 'Your Name'}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                {!!data.user.email && (
                  <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
                    <Mail className="h-3.5 w-3.5" /> {data.user.email}
                  </span>
                )}
                {!!data.user.role && (
                  <span className="inline-flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full capitalize">
                    <Shield className="h-3.5 w-3.5" /> {data.user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="min-w-44">
            <div className="text-xs text-white/80 mb-1">Profile Completion</div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-300 rounded-full transition-all duration-300"
                style={{ width: `${liveCompletion}%` }}
              />
            </div>
            <div className="text-right text-sm font-semibold mt-1">{liveCompletion}%</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>
            <p className="text-sm text-gray-600">Manage your account details</p>
          </div>
          {data.profile.avatar_url && (
            <button
              type="button"
              onClick={removeAvatar}
              className="text-sm text-red-600 hover:text-red-700 hover:underline underline-offset-2 cursor-pointer transition-colors"
              title="Remove photo"
            >
              Remove photo
            </button>
          )}
        </div>

        <form onSubmit={onSubmit}>
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                name="user.name"
                value={data.user.name || ""}
                onChange={onChange}
                onBlur={(e) => validateField(e.target.name, e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                required
              />
              {errors['user.name'] && (<p className="text-red-600 text-xs mt-1">{errors['user.name']}</p>)}
            </div>
          </div>
          

          {/* Role Specific Fields */}
          {data.user.role === 'brand' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input
                  name="profile.company_name"
                  value={data.profile.company_name || ""}
                  onChange={onChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  required
                />
                {errors['profile.company_name'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.company_name']}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  name="profile.industry"
                  value={data.profile.industry || ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  name="profile.website"
                  value={data.profile.website || ""}
                  onChange={onChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                required
                />
                {errors['profile.website'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.website']}</p>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <input
                    name="profile.avatar_url"
                    value={data.profile.avatar_url || ""}
                    onChange={onChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  />
                  {errors['profile.avatar_url'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.avatar_url']}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    name="profile.phone"
                    value={data.profile.phone || ""}
                    onChange={onChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  />
                  {errors['profile.phone'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.phone']}</p>)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="profile.bio"
                  value={data.profile.bio || ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  required
                />
                <div className="flex items-center justify-between mt-1">
                  {errors['profile.bio'] && (<p className="text-red-600 text-xs">{errors['profile.bio']}</p>)}
                  <span className="text-xs text-gray-500">Words: {countWords(data.profile.bio || '')}/500</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  name="profile.category"
                  value={data.profile.category || ""}
                  onChange={onChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  required
                />
                {errors['profile.category'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.category']}</p>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Instagram className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="profile.instagram_username"
                      value={instagramUsername || ""}
                      onChange={handleInstagramUsernameChange}
                      onBlur={handleInstagramUsernameBlur}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                      placeholder="Enter your Instagram username"
                    />
                  </div>
                  {fetchingInstagram && (
                    <div className="mt-1 text-xs text-gray-500 flex items-center">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Fetching Instagram data...
                    </div>
                  )}
                </div>
                <input
                  type="hidden"
                  name="profile.followers_count"
                  value={data.profile.followers_count || ""}
                />
                <input
                  type="hidden"
                  name="profile.engagement_rate"
                  value={data.profile.engagement_rate || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="profile.phone"
                  value={data.profile.phone || ""}
                  onChange={onChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  required
                />
                {errors['profile.phone'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.phone']}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Links (comma separated)</label>
                <input
                  name="profile.social_links"
                  value={Array.isArray(data.profile.social_links) ? data.profile.social_links.join(', ') : (data.profile.social_links || "")}
                  onChange={onChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  required
                />
                {errors['profile.social_links'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.social_links']}</p>)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="profile.bio"
                  value={data.profile.bio || ""}
                  onChange={onChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 bg-gray-50"
                  required
                />
                <div className="flex items-center justify-between mt-1">
                  {errors['profile.bio'] && (<p className="text-red-600 text-xs">{errors['profile.bio']}</p>)}
                  <span className="text-xs text-gray-500">Words: {countWords(data.profile.bio || '')}/500</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200 mt-6 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving || Object.values(errors).some(Boolean) || hasEmptyRequired()}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (<><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>) : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}