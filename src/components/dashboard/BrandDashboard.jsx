import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utills/privateIntercept';
import { LayoutDashboard, Zap, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Calendar, ArrowUpRight, Edit2, FileText } from 'lucide-react';
import ProfileEditor from './ProfileEditor';

const BrandDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/dashboard/brand');
      setDashboardData(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = () => {
    navigate('/chats');
  };

  const handleProfileUpdate = (updatedProfile) => {
    setDashboardData(prev => ({
      ...prev,
      brandInfo: {
        ...prev.brandInfo,
        ...updatedProfile
      }
    }));
    setEditingProfile(false);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} retry={fetchDashboardData} />;
  if (!dashboardData) return null;

  const { counts, recentCampaigns, performanceData, brandInfo } = dashboardData;
  const formattedCreatedDate = brandInfo?.createdAt ? new Date(brandInfo.createdAt).toLocaleDateString() : null;
  const snapshotFields = [
    { label: 'Industry', value: brandInfo?.industry },
    { label: 'Email', value: brandInfo?.email },
    { label: 'Phone', value: brandInfo?.phone },
    { label: 'Website', value: brandInfo?.website, isLink: true },
    { label: 'Created', value: formattedCreatedDate }
  ];

  if (editingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => setEditingProfile(false)} className="mb-6 flex items-center text-gray-600 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </button>
          <ProfileEditor userRole="brand" onCancel={() => setEditingProfile(false)} onSave={handleProfileUpdate} brandInfo={brandInfo} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Brand dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {brandInfo?.name || 'Brand'}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Here's your latest campaign snapshot
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
            <Link to="/campaigns/create" className="inline-flex items-center px-5 py-3 rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:opacity-90">
              <Zap className="h-4 w-4 mr-2" /> Launch Campaign
            </Link>
            <Link to="/campaigns" className="inline-flex items-center px-5 py-3 rounded-xl border border-indigo-100 bg-white text-indigo-600 hover:border-indigo-300">
              Manage Campaigns <ArrowUpRight className="h-4 w-4 ml-2" />
            </Link>
            <Link to="/brand/proposals" className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
              <FileText className="h-4 w-4" /> Proposals
            </Link>
            <button onClick={handleChatClick} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-100">
              <Users className="h-4 w-4" /> Chat
            </button>
            <button onClick={() => setEditingProfile(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50">
              <Edit2 className="h-4 w-4" /> Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard title="Total Campaigns" value={counts.total} icon={<LayoutDashboard className="h-5 w-5" />} color="bg-indigo-100 text-indigo-600" trend="+12% vs last month" />
          <StatCard title="Active Campaigns" value={counts.active} icon={<Zap className="h-5 w-5" />} color="bg-emerald-100 text-emerald-600" trend="High engagement" />
          <StatCard title="Pending approvals" value={counts.pending} icon={<Clock className="h-5 w-5" />} color="bg-amber-100 text-amber-600" trend="Awaiting review" />
          <StatCard title="Completed" value={counts.completed} icon={<CheckCircle className="h-5 w-5" />} color="bg-sky-100 text-sky-600" trend="See summary" trendLink="/campaigns?status=completed" />
        </div>

        {/* Performance + Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white/80 rounded-2xl shadow-sm backdrop-blur p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Monthly Campaign Trend</h2>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                <TrendingUp className="h-4 w-4" /> +18% growth
              </div>
            </div>
            <PerformanceChart data={performanceData} />
          </div>

          <div className="bg-white/80 rounded-2xl shadow-sm backdrop-blur p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-gray-900">{brandInfo?.name || 'Brand'}</h3>
            {snapshotFields.map(f => (
              <div key={f.label} className="flex flex-col gap-1">
                <span className="font-semibold text-gray-900">{f.label}</span>
                {f.value ? (
                  f.isLink ? <a href={f.value} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 break-all">{f.value}</a>
                    : <span className="text-gray-700 break-all">{f.value}</span>
                ) : <span className="text-gray-400">Not provided</span>}
              </div>
            ))}
            {brandInfo?.bio && <div className="p-4 rounded-xl bg-slate-50 text-sm text-gray-600">{brandInfo.bio}</div>}
            <Link to="/profile" className="inline-flex items-center justify-between w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100">
              Edit brand profile <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Recent campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white/80 rounded-2xl shadow-sm backdrop-blur p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Campaigns</h2>
            <RecentCampaigns campaigns={recentCampaigns} />
          </div>
          <div className="bg-white/80 rounded-2xl shadow-sm backdrop-blur p-6 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <Link to="/campaigns/create" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:opacity-90">
              <Zap className="h-5 w-5" /> Launch a campaign
            </Link>
            <Link to="/brand/proposals" className="flex items-center gap-3 p-4 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700">
              <FileText className="h-5 w-5 text-purple-600" /> Review proposals
            </Link>
            <Link to="/campaigns" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-indigo-200">
              <Calendar className="h-5 w-5 text-indigo-500" /> Review timelines
            </Link>
            <Link to="/campaigns?status=pending" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-200">
              <Clock className="h-5 w-5 text-amber-500" /> Approve pending requests
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

/* --- Subcomponents --- */

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-gray-500 text-lg">Loading dashboard...</p>
  </div>
);

const ErrorScreen = ({ message, retry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <p className="text-red-500 text-lg">{message}</p>
    <button onClick={retry} className="px-4 py-2 bg-red-500 text-white rounded-lg">Retry</button>
  </div>
);

const StatCard = ({ title, value, icon, color, trend, trendLink }) => (
  <div className="bg-white/80 rounded-2xl shadow-sm backdrop-blur p-5 space-y-4 border border-slate-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
    </div>
    {trend && <p className="text-sm text-gray-500">{trendLink ? <Link to={trendLink} className="text-indigo-600 font-medium hover:text-indigo-800">{trend}</Link> : trend}</p>}
  </div>
);

const PerformanceChart = ({ data }) => {
  if (!data || data.length === 0) return <p className="text-gray-500 text-center py-6">No performance data</p>;
  const max = Math.max(...data.map(d => d.campaigns));
  return (
    <div className="h-64 flex items-end space-x-3">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1">
          <div className="w-full bg-slate-100 rounded-2xl p-1">
            <div className="w-full rounded-xl bg-gradient-to-t from-indigo-600 to-purple-500 transition-all" style={{ height: `${(item.campaigns / max) * 100}%`, minHeight: '14px' }}></div>
          </div>
          <span className="text-xs text-gray-500 mt-3 uppercase">{new Date(item.month).toLocaleString('default', { month: 'short' })}</span>
        </div>
      ))}
    </div>
  );
};

const RecentCampaigns = ({ campaigns }) => {
  if (!campaigns || campaigns.length === 0) return <p className="text-gray-500 text-center py-4">No campaigns yet</p>;

  const getStatusColor = status => ({
    active: 'bg-emerald-100 text-emerald-600',
    pending: 'bg-amber-100 text-amber-600',
    completed: 'bg-sky-100 text-sky-600',
    cancelled: 'bg-red-100 text-red-800'
  }[status] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-4">
      {campaigns.map(c => (
        <div key={c._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{c.title}</h3>
              <p className="text-sm text-gray-500">Budget ${c.budget}</p>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusColor(c.status)}`}>{c.status}</span>
        </div>
      ))}
    </div>
  );
};

export default BrandDashboard;
