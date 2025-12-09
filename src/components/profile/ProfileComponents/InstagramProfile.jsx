import React, { useState } from 'react';
import axios from '../../../utills/privateIntercept';

export default function InstagramProfile() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const onFetch = async (e) => {
    e.preventDefault();
    setError('');
    setData(null);
    const u = username.trim();
    if (!u) { setError('Enter Instagram username'); return; }
    try {
      setLoading(true);
      const res = await axios.get(`/api/instagram/${encodeURIComponent(u)}`);
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch Instagram data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Instagram Insights</h1>
      <form onSubmit={onFetch} className="flex gap-2 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter Instagram username (without @)"
          value={username}
          onChange={(e)=> setUsername(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Fetching...' : 'Fetch'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {data && (
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            {data.profile_pic_url && (
              <img 
                src={data.profile_pic_url} 
                alt={data.username}
                className="w-16 h-16 rounded-full border-2 border-gray-300"
              />
            )}
            <div>
              <div className="text-sm text-gray-500">Username</div>
              <div className="text-lg font-semibold text-gray-900">{data.username}</div>
              {data.full_name && data.full_name !== data.username && (
                <div className="text-sm text-gray-600">{data.full_name}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.followers_count.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Followers</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.following_count.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Following</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.post_count.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Posts</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">{data.engagement_rate}%</div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>

          {data.bio && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">Bio</div>
              <div className="text-sm text-gray-600">{data.bio}</div>
            </div>
          )}

          <div className="flex gap-2 mt-4 text-xs">
            {data.is_verified && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Verified</span>
            )}
            {data.is_private && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Private</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}