
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from '../../../utills/privateIntercept';

// const defaultFormState = {
//   title: '',
//   description: '',
//   budget: '',
//   category: '',
//   target_audience: {
//     age_range: { min: '', max: '' },
//     gender: 'all',
//     location: '',
//     interests: ''
//   },
//   requirements: {
//     min_followers: '',
//     min_engagement: '',
//     content_type: '',
//     deadline: ''
//   },
//   social_media: [{ platform: '', requirements: '' }]
// };

// const EditCampaign = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [formData, setFormData] = useState(defaultFormState);
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);

//   useEffect(() => {
//     const fetchCampaign = async () => {
//       try {
//         const response = await axios.get(`/api/campaigns/${id}`);
//         const campaign = response.data?.data;
//         if (!campaign) {
//           throw new Error('Campaign not found');
//         }

//         setFormData({
//           title: campaign.title || '',
//           description: campaign.description || '',
//           budget: campaign.budget?.toString() || '',
//           category: campaign.category || '',
//           target_audience: {
//             age_range: {
//               min: campaign.target_audience?.age_range?.min?.toString() || '',
//               max: campaign.target_audience?.age_range?.max?.toString() || ''
//             },
//             gender: campaign.target_audience?.gender || 'all',
//             location: campaign.target_audience?.location || '',
//             interests: Array.isArray(campaign.target_audience?.interests)
//               ? campaign.target_audience.interests.join(', ')
//               : campaign.target_audience?.interests || ''
//           },
//           requirements: {
//             min_followers: campaign.requirements?.min_followers?.toString() || '',
//             min_engagement: campaign.requirements?.min_engagement?.toString() || '',
//             content_type: Array.isArray(campaign.requirements?.content_type)
//               ? campaign.requirements.content_type.join(', ')
//               : campaign.requirements?.content_type || '',
//             deadline: campaign.requirements?.deadline
//               ? campaign.requirements.deadline.substring(0, 10)
//               : ''
//           },
//           social_media: campaign.social_media?.length
//             ? campaign.social_media.map((sm) => ({
//                 platform: sm.platform || '',
//                 requirements: sm.requirements || ''
//               }))
//             : [{ platform: '', requirements: '' }]
//         });
//       } catch (error) {
//         console.error('Failed to fetch campaign', error);
//         alert('Failed to load campaign details.');
//         navigate('/campaigns');
//       } finally {
//         setFetching(false);
//       }
//     };

//     fetchCampaign();
//   }, [id, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes('.')) {
//       const [parent, child, subchild] = name.split('.');
//       setFormData((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: subchild
//             ? {
//                 ...prev[parent][child],
//                 [subchild]: value
//               }
//             : value
//         }
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSocialMediaChange = (index, field, value) => {
//     const updatedSocialMedia = [...formData.social_media];
//     updatedSocialMedia[index][field] = value;
//     setFormData((prev) => ({ ...prev, social_media: updatedSocialMedia }));
//   };

//   const addSocialMediaField = () => {
//     setFormData((prev) => ({
//       ...prev,
//       social_media: [...prev.social_media, { platform: '', requirements: '' }]
//     }));
//   };

//   const removeSocialMediaField = (index) => {
//     setFormData((prev) => ({
//       ...prev,
//       social_media: prev.social_media.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const submitData = {
//         ...formData,
//         budget: Number(formData.budget),
//         target_audience: {
//           ...formData.target_audience,
//           age_range: {
//             min: Number(formData.target_audience.age_range.min) || 0,
//             max: Number(formData.target_audience.age_range.max) || 100
//           },
//           interests: formData.target_audience.interests
//             .split(',')
//             .map((i) => i.trim())
//             .filter(Boolean)
//         },
//         requirements: {
//           ...formData.requirements,
//           min_followers: Number(formData.requirements.min_followers) || 0,
//           min_engagement: Number(formData.requirements.min_engagement) || 0,
//           content_type: formData.requirements.content_type
//             .split(',')
//             .map((i) => i.trim())
//             .filter(Boolean),
//           deadline: formData.requirements.deadline || null
//         },
//         social_media: formData.social_media.filter(
//           (sm) => sm.platform && sm.requirements
//         )
//       };

//       await axios.put(`/api/campaigns/${id}`, submitData);
//       navigate('/campaigns');
//     } catch (err) {
//       console.error('Update campaign error:', err);
//       alert('Failed to update campaign');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
//           <p className="text-gray-600 font-medium">Loading campaign...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Campaign</h1>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Basic Information */}
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Campaign Title *
//                 </label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={formData.title}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Enter campaign title"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description *
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   required
//                   rows={4}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="Describe your campaign..."
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Budget ($) *
//                   </label>
//                   <input
//                     type="number"
//                     name="budget"
//                     value={formData.budget}
//                     onChange={handleChange}
//                     required
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Enter budget"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Category *
//                   </label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     required
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">Select category</option>
//                     <option value="fashion">Fashion</option>
//                     <option value="beauty">Beauty</option>
//                     <option value="lifestyle">Lifestyle</option>
//                     <option value="fitness">Fitness</option>
//                     <option value="food">Food</option>
//                     <option value="travel">Travel</option>
//                     <option value="technology">Technology</option>
//                     <option value="gaming">Gaming</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Target Audience */}
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold text-gray-900">Target Audience</h2>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Age Min
//                   </label>
//                   <input
//                     type="number"
//                     name="target_audience.age_range.min"
//                     value={formData.target_audience.age_range.min}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="18"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Age Max
//                   </label>
//                   <input
//                     type="number"
//                     name="target_audience.age_range.max"
//                     value={formData.target_audience.age_range.max}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="35"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Gender
//                   </label>
//                   <select
//                     name="target_audience.gender"
//                     value={formData.target_audience.gender}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="all">All</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </select>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   name="target_audience.location"
//                   value={formData.target_audience.location}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="e.g., United States, Global"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Interests (comma separated)
//                 </label>
//                 <input
//                   type="text"
//                   name="target_audience.interests"
//                   value={formData.target_audience.interests}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="e.g., fashion, beauty, travel"
//                 />
//               </div>
//             </div>

//             {/* Requirements */}
//             <div className="space-y-4">
//               <h2 className="text-xl font-semibold text-gray-900">Influencer Requirements</h2>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Minimum Followers
//                   </label>
//                   <input
//                     type="number"
//                     name="requirements.min_followers"
//                     value={formData.requirements.min_followers}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="1000"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Minimum Engagement Rate (%)
//                   </label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     name="requirements.min_engagement"
//                     value={formData.requirements.min_engagement}
//                     onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     placeholder="2.5"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Content Type (comma separated)
//                 </label>
//                 <input
//                   type="text"
//                   name="requirements.content_type"
//                   value={formData.requirements.content_type}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                   placeholder="e.g., posts, stories, reels"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Deadline
//                 </label>
//                 <input
//                   type="date"
//                   name="requirements.deadline"
//                   value={formData.requirements.deadline}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//             </div>

//             {/* Social Media Platforms */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-semibold text-gray-900">Social Media Platforms</h2>
//                 <button
//                   type="button"
//                   onClick={addSocialMediaField}
//                   className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-300"
//                 >
//                   + Add Platform
//                 </button>
//               </div>

//               {formData.social_media.map((platform, index) => (
//                 <div key={index} className="flex space-x-4 items-start">
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Platform
//                     </label>
//                     <select
//                       value={platform.platform}
//                       onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                     >
//                       <option value="">Select platform</option>
//                       <option value="instagram">Instagram</option>
//                       <option value="tiktok">TikTok</option>
//                       <option value="youtube">YouTube</option>
//                       <option value="twitter">Twitter</option>
//                       <option value="facebook">Facebook</option>
//                     </select>
//                   </div>

//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Requirements
//                     </label>
//                     <input
//                       type="text"
//                       value={platform.requirements}
//                       onChange={(e) => handleSocialMediaChange(index, 'requirements', e.target.value)}
//                       className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                       placeholder="e.g., 3 posts, 5 stories"
//                     />
//                   </div>

//                   {formData.social_media.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeSocialMediaField(index)}
//                       className="mt-6 text-red-600 hover:text-red-800"
//                     >
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {/* Submit Buttons */}
//             <div className="flex space-x-4 pt-6">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
//               >
//                 {loading ? 'Saving...' : 'Save Changes'}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => navigate('/campaigns')}
//                 className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditCampaign;


// src/components/dashboard/campaign/EditCampaign.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import CreateCampaign from './CreateCampaign';

const EditCampaign = () => {
  const { id } = useParams();
  return <CreateCampaign campaignId={id} isEdit={true} />;
};

export default EditCampaign;
