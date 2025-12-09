import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function InfluencerPublicProfile() {
  const { handle } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/public/influencers/${encodeURIComponent(handle)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json.data);
      } catch (e) {
        if (!cancelled) setError('Influencer profile not found or private');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 p-8 bg-white rounded-2xl shadow w-full max-w-2xl">
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow text-center space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Influencer profile unavailable</h2>
          <p className="text-gray-600">{error || 'This profile could not be loaded.'}</p>
          <Link to="/" className="inline-flex px-4 py-2 rounded-lg bg-indigo-600 text-white">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow border border-slate-100 overflow-hidden">
          <div className="h-32 bg-violet-100" />
          <div className="p-6 flex items-center gap-4">
            <img src={data.avatar_url || 'https://via.placeholder.com/96'} alt={data.name} className="w-20 h-20 rounded-full object-cover border" onError={(e)=>{e.currentTarget.src='https://via.placeholder.com/96'}} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
              {data.category && <p className="text-sm text-gray-500">{data.category}</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{data.bio || 'No bio provided.'}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border">
                <div className="text-xs text-slate-500">Followers</div>
                <div className="text-xl font-semibold">{(data.stats?.followers_count || 0).toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border">
                <div className="text-xs text-slate-500">Engagement</div>
                <div className="text-xl font-semibold">{(data.stats?.engagement_rate || 0)}%</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100 space-y-3">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">Links</h3>
            {Array.isArray(data.social_links) && data.social_links.length > 0 ? (
              <div className="space-y-2">
                {data.social_links.map((l, i) => (
                  <a key={i} href={l} target="_blank" rel="noreferrer" className="block text-indigo-600 break-all">{l}</a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No social links</p>
            )}
            <Link to="/contact" className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white w-full">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
