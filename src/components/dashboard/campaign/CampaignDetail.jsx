import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../../../utills/privateIntercept';
import DisputeModal from '../../disputes/DisputeModal';

const CampaignDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(location.state?.campaign || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isBrand, setIsBrand] = useState(false);
  const [isInfluencer, setIsInfluencer] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [disputesLoading, setDisputesLoading] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const hasOpenDispute = Array.isArray(disputes)
    ? disputes.some((d) => ['pending', 'needs_info', 'escalated'].includes(d?.status))
    : false;
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
        const role = u.role?.toLowerCase();
        setIsBrand(role === 'brand');
        setIsInfluencer(role === 'influencer');
      } catch (err) {
        console.error('Failed to determine user role:', err?.response || err);
      }
    };

    fetchRole();
  }, []);

  useEffect(() => {
    if (!campaign || !campaign._id) return;
    const fetchDisputes = async () => {
      try {
        setDisputesLoading(true);
        const res = await axios.get(`/api/disputes?campaignId=${campaign._id}`);
        setDisputes(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch disputes:', err?.response || err);
      } finally {
        setDisputesLoading(false);
      }
    };
    fetchDisputes();
  }, [campaign && campaign._id]);

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

  const statusValue = campaign.status ? String(campaign.status).toLowerCase() : '';
  const isClosed = ['completed', 'cancelled', 'disputed'].includes(statusValue);
  const isFull = !!campaign.isFull;
  const isEditLocked = isClosed || isFull;
  const editLockReason = isFull
    ? 'This campaign can no longer be edited because it has reached the maximum number of influencers'
    : 'This campaign can no longer be edited because it is closed';

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
              isEditLocked ? (
                <button
                  type="button"
                  disabled
                  title={editLockReason}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 font-semibold cursor-not-allowed"
                >
                  Edit Locked
                </button>
              ) : (
                <Link
                  to={`/campaigns/${campaign._id}/edit`}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-gray-800 font-semibold hover:border-indigo-200"
                >
                  Edit campaign
                </Link>
              )
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

        {!isBrand && campaign.brand_id && (
          <div className="bg-white rounded-2xl shadow p-6 border border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {campaign.brand_avatar_url ? (
                <img src={campaign.brand_avatar_url} alt="Brand" className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {(campaign.brand_id.name || 'B').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{campaign.brand_id.name || campaign.brand_id.company_name || 'Brand'}</h2>
                <p className="text-sm text-gray-500">Campaign Owner</p>
              </div>
            </div>
            <Link
              to={`/profile/brand/id/${campaign.brand_id._id || campaign.brand_id}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-colors"
            >
              View Brand Profile
            </Link>
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
                <dd className="font-semibold text-gray-900">{formatCurrency(campaign.budgetMin)} - {formatCurrency(campaign.budgetMax)}</dd>
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
              <dt className="text-sm">Number of Influencers</dt>
              <dd className="text-lg font-semibold text-gray-900">{campaign.requirements?.max_influencers || 'Not specified'}</dd>
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

        {(isBrand || isInfluencer) && (
          <div className="bg-white rounded-2xl shadow p-6 border border-rose-100 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Disputes</h2>
                <p className="text-sm text-gray-500">Raise or track any issues for this campaign.</p>
              </div>
              <button
                onClick={() => setDisputeModalOpen(true)}
                disabled={campaign.status === 'disputed' || hasOpenDispute}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 disabled:opacity-60"
              >
  {campaign.status === 'disputed' || hasOpenDispute ? 'Dispute Open' : 'Raise Dispute'}
</button>
            </div>

            {disputesLoading ? (
              <p className="text-sm text-gray-500">Loading disputes...</p>
            ) : disputes.length === 0 ? (
              <p className="text-sm text-gray-500">No disputes raised yet.</p>
            ) : (
              <div className="space-y-3">
                {disputes.map((d) => (
                  <Link
                    key={d._id}
                    to={`/disputes/${d._id}`}
                    className="block p-4 rounded-xl border border-slate-100 bg-slate-50/80 hover:border-rose-200 hover:bg-rose-50/60 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-900">
                          Status: <span className="capitalize">{d.status}</span>
                        </p>
                        <p className="text-sm text-gray-600">Reason: {d.reason}</p>
                        <p className="text-xs text-gray-500">
                          Raised by: {d.raisedBy?.name || 'User'} ({d.roleOfRaiser})
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}
                        <div className="mt-1 text-[11px] text-rose-500 font-medium">View conversation →</div>
                      </div>
                    </div>
                    {d.description && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">{d.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

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

      {campaign && (
        <DisputeModal
          open={disputeModalOpen}
          onClose={() => setDisputeModalOpen(false)}
          campaignId={campaign._id}
          onCreated={(newDispute) => {
            setDisputes((prev) => [newDispute, ...prev]);
            setCampaign((prev) => ({ ...prev, status: 'disputed' }));
          }}
        />
      )}
    </div>
  );
};

export default CampaignDetail;







