import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../utills/privateIntercept";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  const countWords = (t = '') => (t || '').trim().split(/\s+/).filter(Boolean).length;

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
      const form = new FormData();
      form.append('file', file);
      form.append('upload_preset', unsignedPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: form,
      });
      const json = await res.json();
      if (!res.ok || !json.secure_url) throw new Error(json.error?.message || 'Upload failed');
      setData(prev => ({
        ...prev,
        profile: { ...(prev.profile || {}), avatar_url: json.secure_url }
      }));
      validateField('profile.avatar_url', json.secure_url);
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { url: json.secure_url } }));
      toast.success('Profile picture uploaded');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const hasEmptyRequired = () => {
    const p = data.profile || {};
    if (data.user.role === 'brand') {
      const req = [data.user.name, p.company_name, p.industry, p.website, p.avatar_url, p.phone, p.bio];
      return req.some(v => !String(v ?? '').trim());
    }
    const req = [data.user.name, p.category, p.followers_count, p.engagement_rate, p.avatar_url, p.phone, p.social_links, p.bio];
    return req.some(v => !String(v ?? '').trim());
  };

  const validateField = (fullName, rawValue) => {
    const name = fullName.replace('profile.', '').replace('user.', '');
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    let message = "";

    // Common
    if (fullName === 'user.name' && !value) message = 'Name is required';

    if (data.user.role === 'brand') {
      if (['company_name','industry','website','avatar_url','phone','bio'].includes(name) && !value) message = 'This field is required';
      if (name === 'company_name' && !value) message = 'Company name is required';
      if (name === 'website' && value && !urlRegex.test(value)) message = 'Enter a valid URL (http/https)';
      if (name === 'avatar_url' && value && !urlRegex.test(value)) message = 'Enter a valid URL (http/https)';
      if (name === 'phone' && value && !phoneRegex.test(value.replace(/\s|-/g, ''))) message = 'Enter 10-15 digits (optional +)';
    } else {
      if (['category','followers_count','engagement_rate','avatar_url','phone','social_links','bio'].includes(name) && !value) message = 'This field is required';
      if (name === 'followers_count') {
        const n = Number(value);
        if (value === '' || Number.isNaN(n)) message = 'This field is required';
        else if (n < 0) message = 'Followers must be 0 or more';
      }
      if (name === 'engagement_rate') {
        const n = Number(value);
        if (value === '' || Number.isNaN(n)) message = 'This field is required';
        else if (n < 0 || n > 100) message = 'Rate must be between 0 and 100';
      }
      if (name === 'avatar_url' && value && !urlRegex.test(value)) message = 'Enter a valid URL (http/https)';
      if (name === 'phone' && value && !phoneRegex.test(value.replace(/\s|-/g, ''))) message = 'Enter 10-15 digits (optional +)';
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
      fields.push('profile.company_name', 'profile.industry', 'profile.website', 'profile.avatar_url', 'profile.phone', 'profile.bio');
    } else {
      fields.push('profile.category', 'profile.followers_count', 'profile.engagement_rate', 'profile.avatar_url', 'profile.phone', 'profile.social_links', 'profile.bio');
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
    try {
      if (!validateAll()) return;
      setSaving(true);
      const payload = {
        ...(data.profile || {}),
        name: data.user.name
      };
      
      const res = await axios.put("/api/user/me", payload);
      toast.success(res.data?.message || "Profile updated successfully");
      await loadProfile();
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
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Profile Picture (header-style at top) */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center h-28 w-28 rounded-full ring-2 ring-gray-200 bg-gray-50 overflow-hidden shadow-sm">
            {data.profile.avatar_url ? (
              <img src={data.profile.avatar_url} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-gray-500">
                {(data.user.name || data.user.email || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4">
            <input id="avatar-input" type="file" accept="image/*" className="hidden" onChange={(e)=> uploadAvatar(e.target.files?.[0])} />
            <button type="button" onClick={()=> document.getElementById('avatar-input').click()} className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Change Photo</button>
            {data.profile.avatar_url && (
              <button type="button" onClick={() => setData(p=>({ ...p, profile:{ ...(p.profile||{}), avatar_url: '' }}))} className="text-sm text-red-600 underline">Remove</button>
            )}
          </div>
          {uploading && (<p className="text-xs text-gray-500 mt-2">Uploading...</p>)}
          {errors['profile.avatar_url'] && (<p className="text-red-600 text-xs mt-2">{errors['profile.avatar_url']}</p>)}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile Settings</h1>
        <p className="text-gray-600 mb-4">Manage Profile</p>
        
        {/* Profile Completion */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold">{data.stats?.profile_completion || 0}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${data.stats?.profile_completion || 0}%` }}
            ></div>
          </div>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  name="profile.website"
                  value={data.profile.website || ""}
                  onChange={onChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {errors['profile.category'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.category']}</p>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Followers</label>
                  <input
                    type="number"
                    name="profile.followers_count"
                    value={data.profile.followers_count || ""}
                    onChange={onChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  {errors['profile.followers_count'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.followers_count']}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="profile.engagement_rate"
                    value={data.profile.engagement_rate || ""}
                    onChange={onChange}
                    onBlur={(e) => validateField(e.target.name, e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  {errors['profile.engagement_rate'] && (<p className="text-red-600 text-xs mt-1">{errors['profile.engagement_rate']}</p>)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="profile.phone"
                  value={data.profile.phone || ""}
                  onChange={onChange}
                  onBlur={(e) => validateField(e.target.name, e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-gray-300 rounded-md px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div className="flex items-center justify-between mt-1">
                  {errors['profile.bio'] && (<p className="text-red-600 text-xs">{errors['profile.bio']}</p>)}
                  <span className="text-xs text-gray-500">Words: {countWords(data.profile.bio || '')}/500</span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-200 mt-6">
            <button
              type="submit"
              disabled={saving || Object.values(errors).some(Boolean) || hasEmptyRequired()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}