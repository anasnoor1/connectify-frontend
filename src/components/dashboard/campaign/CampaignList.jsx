import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../../utills/privateIntercept';
import { Plus, Filter, RefreshCcw, Calendar, DollarSign, Tag, Trash2, Edit2, Eye } from 'lucide-react';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [roleChecked, setRoleChecked] = useState(false);

  const [filters, setFilters] = useState({
    status: 'all',
    page: 1,
    limit: 10
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await axios.get('/api/user/me');
        const u = res.data?.user || res.data || {};
        const isBrand = u.role?.toLowerCase() === 'brand';

        if (!isBrand) {
          navigate('/influencer/dashboard', { replace: true });
          return;
        }
      } catch (err) {
        console.error('Failed to check user role for campaigns page:', err?.response || err);
        navigate('/', { replace: true });
        return;
      } finally {
        setRoleChecked(true);
      }
    };

    checkRole();
  }, [navigate]);

  useEffect(() => {
    if (!roleChecked) return;
    fetchCampaigns();
  }, [filters.status, filters.page, roleChecked]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      params.append('page', filters.page);
      params.append('limit', filters.limit);

      const response = await axios.get(`/api/campaigns?${params}`);
      setCampaigns(response.data.data);
    } catch (err) {
      setError('Failed to load campaigns');
      console.error('Campaigns error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (campaignId) => {
    try {
      setDeletingId(campaignId);
      await axios.delete(`/api/campaigns/${campaignId}`);
      setConfirmingId(null);
      fetchCampaigns(); // Refresh list
    } catch (err) {
      console.error('Failed to delete campaign:', err);
      setError('Failed to delete campaign');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!roleChecked || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg px-10 py-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
            <RefreshCcw className="h-7 w-7 text-indigo-600 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Fetching campaigns</h2>
          <p className="mt-2 text-gray-500">Hang tight, we're preparing your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Campaign center</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Manage your campaigns</h1>
            <p className="text-gray-500 mt-2">Monitor, edit and create campaigns with a modern workflow.</p>
          </div>
          <Link
            to="/campaigns/create"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <span className="text-sm text-gray-400">Showing {campaigns.campaigns?.length || 0} campaigns</span>
          </div>
        </div>

        {/* Campaigns Grid */}
        {error ? (
          <div className="bg-white rounded-2xl border border-red-100 shadow p-10 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button
              onClick={fetchCampaigns}
              className="mt-4 inline-flex items-center px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        ) : campaigns.campaigns && campaigns.campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.campaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                getStatusColor={getStatusColor}
                isConfirming={confirmingId === campaign._id}
                isDeleting={deletingId === campaign._id}
                onRequestDelete={() => setConfirmingId(campaign._id)}
                onCancelDelete={() => setConfirmingId(null)}
                onConfirmDelete={() => deleteCampaign(campaign._id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Plus className="h-6 w-6 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-500 mb-6">Kick things off by creating your first campaign.</p>
            <Link
              to="/campaigns/create"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Create campaign
            </Link>
          </div>
        )}

        {/* Pagination */}
        {campaigns.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: campaigns.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilters({ ...filters, page })}
                  className={`px-4 py-2 rounded-xl ${filters.page === page
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CampaignCard = ({
  campaign,
  getStatusColor,
  isConfirming,
  isDeleting,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}) => {
  // Brand info (using campaign.brand_id if populated, or defaults)
  const brandName = campaign.brand_id?.name || campaign.brand_id?.company_name || "My Brand";
  const brandAvatar = campaign.brand_id?.avatar_url || campaign.brand_avatar_url;
  const brandInitial = brandName?.charAt(0)?.toUpperCase() || "B";

  // Budget display
  const budgetDisplay = campaign.budgetMin && campaign.budgetMax
    ? `$${campaign.budgetMin.toLocaleString()} - $${campaign.budgetMax.toLocaleString()}`
    : campaign.budget ? `$${campaign.budget.toLocaleString()}` : "-";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header with Status Badge */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
          <span className="text-sm font-medium text-indigo-900">{campaign.category || 'Campaign'}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
          {campaign.status}
        </span>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Campaign Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2">
          {campaign.title}
        </h3>

        {/* Brand Info (Self) */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
          <div className="flex-shrink-0">
            {brandAvatar ? (
              <img
                src={brandAvatar}
                alt={brandName}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-md ${brandAvatar ? 'hidden' : 'flex'}`}
            >
              {brandInitial}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Brand</p>
            <p className="text-sm font-semibold text-slate-900 truncate">{brandName}</p>
          </div>
        </div>

        {/* Campaign Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {campaign.description}
        </p>

        {/* Important Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Budget */}
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Budget</span>
            </div>
            <p className="text-sm font-bold text-emerald-900 truncate">{budgetDisplay}</p>
          </div>

          {/* Created Date (Duration placeholder) */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Created</span>
            </div>
            <p className="text-sm font-bold text-blue-900">
              {new Date(campaign.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/campaigns/${campaign._id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-semibold hover:bg-indigo-100 text-sm transition-colors"
          >
            <Eye className="h-4 w-4" /> View
          </Link>
          <Link
            to={`/campaigns/${campaign._id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-gray-700 font-semibold hover:border-indigo-200 text-sm transition-colors"
          >
            <Edit2 className="h-4 w-4" /> Edit
          </Link>
          {!isConfirming ? (
            <button
              type="button"
              onClick={onRequestDelete}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 text-sm transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          ) : (
            <div className="flex-1 flex gap-2">
              <button
                type="button"
                onClick={onCancelDelete}
                className="flex-1 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-3 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-70 text-xs"
              >
                {isDeleting ? '...' : 'Confirm'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignList;