import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utills/privateIntercept';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, User, DollarSign, Calendar, ExternalLink, Star } from 'lucide-react';
import ReviewModal from "../../reviews/ReviewModal";

export default function BrandProposals() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [reviewTarget, setReviewTarget] = useState(null); // { proposal, campaignId, toUserId }

    const navigate = useNavigate();

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/proposals/brand');
            setProposals(res.data.data.proposals || []);
        } catch (error) {
            toast.error(`Failed to load proposals: ${error.response?.data?.msg || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const openReview = (proposal) => {
        const campaignId = proposal.campaignId?._id || proposal.campaignId;
        const toUserId = proposal.influencerId?._id || proposal.influencerId;
        if (!campaignId || !toUserId) return;
        setReviewTarget({
            proposal,
            campaignId,
            toUserId,
        });
    };

    const closeReview = (shouldRefresh) => {
        setReviewTarget(null);
        if (shouldRefresh) {
            fetchProposals();
        }
    };

    const handleStatusUpdate = async (proposal, status) => {
        try {
            if (status === 'accepted') {
                navigate(`/brand/proposals/${proposal._id}/pay`);
                return;
            }

            await axiosInstance.patch(`/api/proposals/${proposal._id}/status`, { status });
            toast.success(`Proposal ${status} successfully!`);
            fetchProposals();

            if (status === 'accepted') {
                const campaignId = proposal.campaignId?._id || proposal.campaignId;
                const influencerId = proposal.influencerId?._id || proposal.influencerId;
                if (campaignId && influencerId) {
                    try {
                        const res = await axiosInstance.post('/api/chat/open', {
                            campaignId,
                            influencerId,
                        });
                        if (res.data?.success && res.data.room?._id) {
                            navigate(`/chats/${res.data.room._id}`);
                        }
                    } catch (err) {
                        console.error('Failed to open chat after accepting proposal:', err?.response || err);
                    }
                }
            }
        } catch (error) {
            const errorMsg = error.response?.data?.msg || 'Failed to update proposal';
            toast.error(errorMsg);
        }
    };

    const filteredProposals = proposals.filter(p => {
        if (filter === 'all') return true;
        return p.status === filter;
    });

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            accepted: 'bg-green-100 text-green-800 border-green-200',
            rejected: 'bg-red-100 text-red-800 border-red-200',
        };
        return styles[status] || styles.pending;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted':
                return <CheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const buildInfluencerSlug = (name) => {
        if (!name) return '';
        return name.toString().trim().toLowerCase().replace(/\s+/g, '-');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Campaign Proposals</h1>
                    <p className="mt-2 text-gray-600">Review and manage proposals from influencers</p>
                </div>

                <div className="mb-6 flex gap-2 border-b border-gray-200">
                    {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${filter === status
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {status}
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100">
                                {status === 'all'
                                    ? proposals.length
                                    : proposals.filter(p => p.status === status).length}
                            </span>
                        </button>
                    ))}
                </div>

                {filteredProposals.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow">
                        <p className="text-gray-500">No proposals found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProposals.map((proposal) => (
                            <div
                                key={proposal._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {proposal.campaignId?.title || 'Campaign'}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {proposal.campaignId?.category || 'N/A'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 text-gray-700">
                                            <User className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                {proposal.influencerId?.name || 'Unknown Influencer'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                ({proposal.influencerId?.email})
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-700">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                <span className="font-semibold">${proposal.amount?.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-700">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                                <span>{proposal.deliveryTime}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <p className="text-sm text-gray-700 line-clamp-2">
                                                {proposal.message}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                                    proposal.status
                                                )}`}
                                            >
                                                {getStatusIcon(proposal.status)}
                                                {proposal.status}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(proposal.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 lg:w-40">
                                        {/* View Influencer Profile Button */}
                                        {proposal.influencerId?.name && (
                                            <a
                                                href={`/profile/i/${buildInfluencerSlug(proposal.influencerId.name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View Profile
                                            </a>
                                        )}

                                        {/* View Campaign Button */}
                                        <a
                                            href={`/campaigns/${proposal.campaignId?._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View Campaign
                                        </a>

                                        {/* Accept/Reject Buttons for Pending */}
                                        {proposal.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(proposal, 'accepted')}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(proposal, 'rejected')}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        {/* Review button - only when campaign is completed and reviews enabled */}
                                        {proposal.status === 'accepted' &&
                                          proposal.campaignId?.status === 'completed' &&
                                          proposal.campaignId?.reviewEnabled && (
                                            <button
                                              type="button"
                                              onClick={() => openReview(proposal)}
                                              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                                            >
                                              <Star className="w-4 h-4" />
                                              Leave Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {reviewTarget && (
                    <ReviewModal
                        isOpen={true}
                        onClose={closeReview}
                        campaignId={reviewTarget.campaignId}
                        toUserId={reviewTarget.toUserId}
                        campaignTitle={reviewTarget.proposal?.campaignId?.title}
                        targetName={reviewTarget.proposal?.influencerId?.name}
                    />
                )}
            </div>
        </div>
    );
}