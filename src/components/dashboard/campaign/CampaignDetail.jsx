import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../../../utills/privateIntercept';

const CampaignDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(location.state?.campaign || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBrand, setIsBrand] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/campaigns');
    }
  };

  useEffect(() => {
    // If campaign already provided via navigation state (e.g. from influencer dashboard),
    // use it directly and skip extra API call.
    if (location.state?.campaign) {
      setCampaign(location.state.campaign);
      setLoading(false);
      setError('');
      return;
    }

    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`/api/campaigns/${id}`);

        // Log full response once for debugging across brand/influencer roles
        console.log('Campaign detail response:', response.data);

        // Support multiple possible response shapes safely
        const raw = response.data;
        const candidate =
          raw?.data ||
          raw?.campaign ||
          raw?.campaigns ||
          null;

        setCampaign(candidate);
        setError('');
      } catch (err) {
        console.error('Failed to fetch campaign detail:', err?.response || err);
        setError('Failed to load campaign. It may have been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id, location.state]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get('/api/user/me');
        const u = res.data?.user || res.data || {};
        setIsBrand(u.role?.toLowerCase() === 'brand');
      } catch (err) {
        console.error('Failed to determine user role:', err?.response || err);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md bg-white rounded-2xl shadow p-8 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Campaign not available</h2>
          <p className="text-gray-500">{error || 'We could not find the campaign you were looking for.'}</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (typeof value !== 'number') return value;
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const formatList = (value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return 'Not specified';
    return Array.isArray(value) ? value.join(', ') : value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Campaign detail</p>
            <h1 className="text-3xl font-bold text-gray-900 mt-1">{campaign.title}</h1>
            <p className="text-gray-500 mt-2 max-w-2xl">{campaign.description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {isBrand && (
              <Link
                to={`/campaigns/${campaign._id}/edit`}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-gray-800 font-semibold hover:border-indigo-200"
              >
                Edit campaign
              </Link>
            )}
            <button
              onClick={handleBack}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Back
            </button>
          </div>
        </div>

        {isBrand && campaign.status === 'pending' && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            This campaign is currently pending admin approval after your recent changes. Influencers will see it again once it is approved.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
            <dl className="space-y-4 text-gray-600">
              <div className="flex items-center justify-between">
                <dt>Status</dt>
                <dd className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : campaign.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                  {campaign.status || 'N/A'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Budget</dt>
                <dd className="font-semibold text-gray-900">{formatCurrency(campaign.budget)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Category</dt>
                <dd className="font-semibold text-gray-900 capitalize">{campaign.category || 'N/A'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Created on</dt>
                <dd className="font-semibold text-gray-900">{formatDate(campaign.created_at)}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Target audience</h2>
            <dl className="space-y-3 text-gray-600">
              <div className="flex items-center justify-between">
                <dt>Age range</dt>
                <dd className="font-semibold text-gray-900">
                  {campaign.target_audience?.age_range?.min || 'N/A'} - {campaign.target_audience?.age_range?.max || 'N/A'}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Gender</dt>
                <dd className="font-semibold text-gray-900 capitalize">{campaign.target_audience?.gender || 'All'}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Location</dt>
                <dd className="font-semibold text-gray-900">{campaign.target_audience?.location || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm">Interests</dt>
                <dd className="font-semibold text-gray-900">{formatList(campaign.target_audience?.interests)}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Influencer requirements</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
            <div>
              <dt className="text-sm">Minimum followers</dt>
              <dd className="text-lg font-semibold text-gray-900">{campaign.requirements?.min_followers || 'Not specified'}</dd>
            </div>
            <div>
              <dt className="text-sm">Minimum engagement</dt>
              <dd className="text-lg font-semibold text-gray-900">{campaign.requirements?.min_engagement || 'Not specified'}%</dd>
            </div>
            <div>
              <dt className="text-sm">Content types</dt>
              <dd className="font-semibold text-gray-900">{formatList(campaign.requirements?.content_type)}</dd>
            </div>
            <div>
              <dt className="text-sm">Deadline</dt>
              <dd className="font-semibold text-gray-900">{campaign.requirements?.deadline ? formatDate(campaign.requirements.deadline) : 'Not specified'}</dd>
            </div>
          </dl>
        </div>

        {campaign.social_media?.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Social media deliverables</h2>
            <div className="flex flex-wrap gap-3">
              {campaign.social_media.map((platform, idx) => (
                <div key={`${platform.platform}-${idx}`} className="px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/60">
                  <p className="text-sm uppercase tracking-wide text-gray-500">{platform.platform || 'Platform'}</p>
                  <p className="text-base font-semibold text-gray-900">{platform.requirements || 'Requirements not specified'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail;
