import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utills/privateIntercept';
import CreateCampaign from './CreateCampaign';

const defaultFormState = {
  title: '',
  description: '',
  budget: '',
  category: '',
  target_audience: {
    age_range: { min: '', max: '' },
    gender: 'all',
    location: '',
    interests: ''
  },
  requirements: {
    min_followers: '',
    min_engagement: '',
    content_type: '',
    deadline: ''
  },
  social_media: [{ platform: '', requirements: '' }]
};

const EditCampaign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialData, setInitialData] = useState(defaultFormState);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`/api/campaigns/${id}`);
        const campaign = response.data?.data;
        if (!campaign) {
          throw new Error('Campaign not found');
        }

        const mapped = {
          title: campaign.title || '',
          description: campaign.description || '',
          budget: campaign.budget?.toString() || '',
          category: campaign.category || '',
          target_audience: {
            age_range: {
              min: campaign.target_audience?.age_range?.min?.toString() || '',
              max: campaign.target_audience?.age_range?.max?.toString() || ''
            },
            gender: campaign.target_audience?.gender || 'all',
            location: campaign.target_audience?.location || '',
            interests: Array.isArray(campaign.target_audience?.interests)
              ? campaign.target_audience.interests.join(', ')
              : campaign.target_audience?.interests || ''
          },
          requirements: {
            min_followers: campaign.requirements?.min_followers?.toString() || '',
            min_engagement: campaign.requirements?.min_engagement?.toString() || '',
            content_type: Array.isArray(campaign.requirements?.content_type)
              ? campaign.requirements.content_type.join(', ')
              : campaign.requirements?.content_type || '',
            deadline: campaign.requirements?.deadline
              ? campaign.requirements.deadline.substring(0, 10)
              : ''
          },
          social_media: campaign.social_media?.length
            ? campaign.social_media.map((sm) => ({
                platform: sm.platform || '',
                requirements: sm.requirements || ''
              }))
            : [{ platform: '', requirements: '' }]
        };

        setInitialData(mapped);
      } catch (error) {
        console.error('Failed to fetch campaign', error);
        alert('Failed to load campaign details.');
        navigate('/campaigns');
      } finally {
        setFetching(false);
      }
    };

    fetchCampaign();
  }, [id, navigate]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-gray-600 font-medium">Loading campaign...</p>
        </div>
      </div>
    );
  }

  return (
    <CreateCampaign
      mode="edit"
      initialData={initialData}
      campaignId={id}
    />
  );
};

export default EditCampaign;