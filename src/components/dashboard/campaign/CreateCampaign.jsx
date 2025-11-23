import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from '../../../utills/privateIntercept';

const lettersOnlyRegex = /^[A-Za-z\s]+$/; // letters and spaces
const interestsRegex = /^[A-Za-z\s,]+$/; // letters, spaces and commas
const digitsRegex = /^\d+$/; // whole digits only
const decimalNumberRegex = /^\d+(\.\d+)?$/; // integer or decimal
const contentTypeRegex = /^[A-Za-z\s,]+$/; // letters, spaces, commas

const hasLeadingOrTrailingSpace = (v) => {
  if (typeof v !== 'string') return false;
  return v.startsWith(' ') || v.endsWith(' ');
};

const safeTrim = (v) => (typeof v === 'string' ? v.trim() : String(v ?? '').trim());

const validateTitle = (v) => {
  const raw = String(v ?? '');
  if (!safeTrim(raw)) return 'Title is required.';
  if (hasLeadingOrTrailingSpace(raw)) return 'No leading or trailing spaces allowed.';
  const value = raw.trim();
  if (value.length < 2) return 'Title must be at least 2 letters.';
  if (!lettersOnlyRegex.test(value)) return 'Title can only contain letters and spaces.';
  return '';
};

const validateDescription = (v) => {
  const raw = String(v ?? '');
  if (!safeTrim(raw)) return 'Description is required.';
  if (hasLeadingOrTrailingSpace(raw)) return 'No leading or trailing spaces allowed.';
  const value = raw.trim();
  if (value.length < 2) return 'Description must be at least 2 letters.';
  const descriptionRegex = /^[A-Za-z\s]+$/;
  if (!descriptionRegex.test(value)) {
    return 'Description can only contain letters and spaces (no symbols like . , ! etc).';
  }
  return '';
};

const validateBudget = (v) => {
  const value = safeTrim(v ?? '');
  if (value === '') return 'Budget is required.';
  if (!digitsRegex.test(value)) return 'Budget must contain only integer numbers.';
  if (Number(value) < 0) return 'Budget cannot be negative.';
  return '';
};

const validateAgeMin = (v) => {
  const raw = safeTrim(v ?? '');
  if (raw === '') return 'Minimum age is required.';
  if (!digitsRegex.test(raw)) return 'Minimum age must be a whole number.';
  if (Number(raw) < 18) return 'Minimum age must be 18 or older.';
  return '';
};

const validateAgeMax = (v) => {
  const raw = safeTrim(v ?? '');
  if (raw === '') return 'Maximum age is required.';
  if (!digitsRegex.test(raw)) return 'Maximum age must be a whole number.';
  return '';
};

const validateLocation = (v) => {
  const raw = String(v ?? '');
  if (!safeTrim(raw)) return 'Location is required.';
  if (hasLeadingOrTrailingSpace(raw)) return 'No leading or trailing spaces allowed.';
  const value = raw.trim();
  if (!lettersOnlyRegex.test(value)) return 'Location can only contain letters and spaces.';
  return '';
};

const validateInterests = (v) => {
  const raw = String(v ?? '');
  if (!safeTrim(raw)) return 'Interests are required.';
  if (hasLeadingOrTrailingSpace(raw)) return 'No leading or trailing spaces allowed.';
  const value = raw.trim();
  if (!interestsRegex.test(value)) return 'Interests can only contain letters, spaces and commas.';
  return '';
};

const validateMinFollowers = (v) => {
  const value = safeTrim(v ?? '');
  if (value === '') return 'Minimum followers is required.';
  if (!digitsRegex.test(value)) return 'Minimum followers must contain only whole numbers.';
  if (Number(value) < 1000) return 'Minimum followers must be at least 1000.';
  return '';
};

const validateMinEngagement = (v) => {
  const value = safeTrim(v ?? '');
  if (value === '') return 'Minimum engagement rate is required.';
  if (!decimalNumberRegex.test(value)) return 'Engagement rate must be a valid number (e.g., 2.5).';
  if (Number(value) < 0) return 'Engagement rate cannot be negative.';
  return '';
};

const validateContentType = (v) => {
  const raw = String(v ?? '');
  if (!safeTrim(raw)) return 'Content type is required.';
  if (hasLeadingOrTrailingSpace(raw)) return 'No leading or trailing spaces allowed.';
  const value = raw.trim();
  if (!contentTypeRegex.test(value)) return 'Content type can only contain letters, spaces and commas.';
  return '';
};

const validateDeadline = (v) => {
  if (!v) return 'Deadline is required.';
  const selected = new Date(v);
  const today = new Date();
  selected.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(selected.getTime())) return 'Invalid date.';
  if (selected <= today) return 'Deadline must be a future date (after today).';
  return '';
};

const validateAll = (fields) => {
  const aMin = fields?.target_audience?.age_range?.min;
  const aMax = fields?.target_audience?.age_range?.max;

  const errors = {
    title: validateTitle(fields?.title),
    description: validateDescription(fields?.description),
    budget: validateBudget(fields?.budget),
    age_min: validateAgeMin(aMin),
    age_max: validateAgeMax(aMax),
    location: validateLocation(fields?.target_audience?.location),
    interests: validateInterests(fields?.target_audience?.interests),
    req_min_followers: validateMinFollowers(fields?.requirements?.min_followers),
    req_min_engagement: validateMinEngagement(fields?.requirements?.min_engagement),
    req_content_type: validateContentType(fields?.requirements?.content_type),
    req_deadline: validateDeadline(fields?.requirements?.deadline)
  };

  if (!errors.age_min && !errors.age_max) {
    if (Number(aMax) < Number(aMin)) {
      errors.age_max = 'Maximum age must be greater than or equal to minimum age.';
    }
  }

  return errors;
};

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

const CreateCampaign = ({ mode = 'create', initialData, campaignId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(() => initialData || defaultFormState);

  // When used in edit mode, sync incoming initialData into local form state
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData(initialData);
      // Re-run validation so existing data shows errors state correctly
      setErrors(validateAll(initialData));
    }
  }, [mode, initialData]);

  const runValidation = (data) => {
    const baseErrors = validateAll(data);
    const filteredErrors = Object.fromEntries(
      Object.entries(baseErrors).filter(([, message]) => Boolean(message))
    );

    if (!safeTrim(data.category ?? '')) {
      filteredErrors.category = 'Please select a category.';
    }

    const hasValidSocial = data.social_media.some(
      (platform) =>
        platform.platform && platform.requirements && platform.requirements.trim().length >= 10
    );
    if (!hasValidSocial) {
      filteredErrors.social_media = 'Add at least one platform with clear deliverable requirements (10+ characters).';
    }

    return filteredErrors;
  };

  const validateAndSetErrors = (data) => {
    const nextErrors = runValidation(data || formData);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const fieldKeyFromName = (name) => {
    if (!name) return '';
    if (name === 'target_audience.age_range.min') return 'age_min';
    if (name === 'target_audience.age_range.max') return 'age_max';
    if (name === 'target_audience.location') return 'location';
    if (name === 'target_audience.interests') return 'interests';
    if (name === 'requirements.min_followers') return 'req_min_followers';
    if (name === 'requirements.min_engagement') return 'req_min_engagement';
    if (name === 'requirements.content_type') return 'req_content_type';
    if (name === 'requirements.deadline') return 'req_deadline';
    return name;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const errorKey = fieldKeyFromName(name);
    if (errorKey) {
      setTouched(prev => ({ ...prev, [errorKey]: true }));
    }

    setFormData(prev => {
      let updated;
      if (name.includes('.')) {
        const [parent, child, subchild] = name.split('.');
        updated = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: subchild ? {
              ...prev[parent][child],
              [subchild]: value
            } : value
          }
        };
      } else {
        updated = { ...prev, [name]: value };
      }
      setErrors(runValidation(updated));
      return updated;
    });
  };

  const handleSocialMediaChange = (index, field, value) => {
    const updatedSocialMedia = [...formData.social_media];
    updatedSocialMedia[index][field] = value;
    setTouched(prev => ({ ...prev, social_media: true }));
    setFormData(prev => {
      const updated = { ...prev, social_media: updatedSocialMedia };
      setErrors(runValidation(updated));
      return updated;
    });
  };

  const addSocialMediaField = () => {
    setFormData(prev => {
      const updated = {
        ...prev,
        social_media: [...prev.social_media, { platform: '', requirements: '' }]
      };
      setErrors(runValidation(updated));
      return updated;
    });
  };

  const removeSocialMediaField = (index) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        social_media: prev.social_media.filter((_, i) => i !== index)
      };
      setErrors(runValidation(updated));
      return updated;
    });
  };

  const shouldShowError = (key) => (formSubmitted || touched[key]) && errors[key];

  const renderError = (key) => (
    shouldShowError(key) ? <p className="text-sm text-red-500 mt-1">{errors[key]}</p> : null
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!validateAndSetErrors()) {
      return;
    }
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        budget: Number(formData.budget),
        target_audience: {
          ...formData.target_audience,
          age_range: {
            min: Number(formData.target_audience.age_range.min) || 0,
            max: Number(formData.target_audience.age_range.max) || 100
          },
          interests: formData.target_audience.interests.split(',').map(i => i.trim()).filter(Boolean)
        },
        requirements: {
          ...formData.requirements,
          min_followers: Number(formData.requirements.min_followers) || 0,
          min_engagement: Number(formData.requirements.min_engagement) || 0,
          content_type: formData.requirements.content_type.split(',').map(i => i.trim()).filter(Boolean),
          deadline: formData.requirements.deadline || null
        },
        social_media: formData.social_media.filter(sm => sm.platform && sm.requirements)
      };

      if (mode === 'edit' && campaignId) {
        await axios.put(`/api/campaigns/${campaignId}`, submitData);
      } else {
        await axios.post('/api/campaigns', submitData);
      }
      navigate('/campaigns');
    } catch (err) {
      alert('Failed to create campaign');
      console.error('Create campaign error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {mode === 'edit' ? 'Edit Campaign' : 'Create New Campaign'}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter campaign title"
                />
                {renderError('title')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your campaign..."
                />
                {renderError('description')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget ($) *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter budget"
                  />
                  {renderError('budget')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select category</option>
                    <option value="fashion">Fashion</option>
                    <option value="beauty">Beauty</option>
                    <option value="lifestyle">Lifestyle</option>
                    <option value="fitness">Fitness</option>
                    <option value="food">Food</option>
                    <option value="travel">Travel</option>
                    <option value="technology">Technology</option>
                    <option value="gaming">Gaming</option>
                    <option value="other">Other</option>
                  </select>
                  {renderError('category')}
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Target Audience</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Min
                  </label>
                  <input
                    type="number"
                    name="target_audience.age_range.min"
                    value={formData.target_audience.age_range.min}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="18"
                  />
                  {renderError('age_min')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Max
                  </label>
                  <input
                    type="number"
                    name="target_audience.age_range.max"
                    value={formData.target_audience.age_range.max}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="35"
                  />
                  {renderError('age_max')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="target_audience.gender"
                    value={formData.target_audience.gender}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="target_audience.location"
                  value={formData.target_audience.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., United States, Global"
                />
                {renderError('location')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  name="target_audience.interests"
                  value={formData.target_audience.interests}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., fashion, beauty, travel"
                />
                {renderError('interests')}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Influencer Requirements</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Followers
                  </label>
                  <input
                    type="number"
                    name="requirements.min_followers"
                    value={formData.requirements.min_followers}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="1000"
                  />
                  {renderError('req_min_followers')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Engagement Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="requirements.min_engagement"
                    value={formData.requirements.min_engagement}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="2.5"
                  />
                  {renderError('req_min_engagement')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type (comma separated)
                </label>
                <input
                  type="text"
                  name="requirements.content_type"
                  value={formData.requirements.content_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., posts, stories, reels"
                />
                {renderError('req_content_type')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  name="requirements.deadline"
                  value={formData.requirements.deadline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {renderError('req_deadline')}
              </div>
            </div>

            {/* Social Media Platforms */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Social Media Platforms</h2>
                <button
                  type="button"
                  onClick={addSocialMediaField}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
                >
                  + Add Platform
                </button>
              </div>

              {formData.social_media.map((platform, index) => (
                <div key={index} className="flex space-x-4 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={platform.platform}
                      onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select platform</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <input
                      type="text"
                      value={platform.requirements}
                      onChange={(e) => handleSocialMediaChange(index, 'requirements', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 3 posts, 5 stories"
                    />
                  </div>

                  {formData.social_media.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSocialMediaField(index)}
                      className="mt-6 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {renderError('social_media')}
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {loading
                  ? mode === 'edit'
                    ? 'Saving...'
                    : 'Creating...'
                  : mode === 'edit'
                    ? 'Save Changes'
                    : 'Create Campaign'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/campaigns')}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;