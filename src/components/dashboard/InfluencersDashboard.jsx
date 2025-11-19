// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Users,
//   Clock,
//   TrendingUp,
//   Calendar,
//   Zap,
//   CheckCircle,
//   AlertCircle,
//   ArrowUpRight,
//   MessageSquare,
//   Star,
//   Award
// } from 'lucide-react';
// import axios from '../../utills/privateIntercept';

// const InfluencerDashboard = () => {
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('/api/dashboard/influencer');
//       setDashboardData(response.data.data);
//     } catch (err) {
//       setError('Failed to load dashboard data');
//       console.error('Dashboard error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
//         <div className="text-center">
//           <div className="flex items-center justify-center mb-6 animate-pulse">
//             <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
//               <LayoutDashboard className="h-8 w-8 text-indigo-600" />
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-900">Loading your dashboard</h2>
//           <p className="mt-2 text-gray-500">Gathering your influencer insights...</p>
//           <div className="mt-6 h-2 w-48 bg-gray-200 rounded-full overflow-hidden mx-auto">
//             <div className="h-full bg-indigo-600 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 flex items-center justify-center p-6">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
//           <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
//             <AlertCircle className="h-8 w-8 text-red-500" />
//           </div>
//           <h2 className="text-2xl font-semibold text-gray-900">Something went wrong</h2>
//           <p className="mt-3 text-gray-600">{error}</p>
//           <button
//             onClick={fetchDashboardData}
//             className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
//           >
//             Try again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { user, stats, activeCampaigns, recommendedCampaigns } = dashboardData;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
//           <div>
//             <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Influencer Dashboard</p>
//             <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               Welcome back, {user?.name || 'Influencer'}
//             </h1>
//             <p className="text-gray-600 mt-2 flex items-center gap-2">
//               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
//               Here's your latest performance overview
//             </p>
//           </div>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <Link
//               to="/campaigns/available"
//               className="inline-flex items-center justify-center px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-200 hover:opacity-90 transition"
//             >
//               <Zap className="h-4 w-4 mr-2" />
//               Browse Campaigns
//             </Link>
//             <Link
//               to="/messages"
//               className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-indigo-100 bg-white text-indigo-600 font-semibold hover:border-indigo-300 transition"
//             >
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Messages
//               <ArrowUpRight className="h-4 w-4 ml-2" />
//             </Link>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//           <StatCard
//             title="Total Followers"
//             value={stats?.followerCount?.toLocaleString() || '0'}
//             icon={<Users className="h-5 w-5" />}
//             color="bg-purple-100 text-purple-600"
//             trend="+12% vs last month"
//           />
//           <StatCard
//             title="Engagement Rate"
//             value={stats?.engagementRate ? `${stats.engagementRate}%` : 'N/A'}
//             icon={<TrendingUp className="h-5 w-5" />}
//             color="bg-emerald-100 text-emerald-600"
//             trend="High engagement"
//           />
//           <StatCard
//             title="Active Campaigns"
//             value={stats?.activeCampaigns || '0'}
//             icon={<Zap className="h-5 w-5" />}
//             color="bg-amber-100 text-amber-600"
//             trend="View all"
//             trendLink="/campaigns/active"
//           />
//           <StatCard
//             title="Earnings"
//             value={stats?.totalEarnings ? `$${stats.totalEarnings.toLocaleString()}` : '$0'}
//             icon={<Award className="h-5 w-5" />}
//             color="bg-sky-100 text-sky-600"
//             trend="Withdraw"
//             trendLink="/earnings"
//           />
//         </div>

//         {/* Active Campaigns & Recommendations */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//           {/* Active Campaigns */}
//           <div className="lg:col-span-2 bg-white/80 rounded-2xl shadow-sm backdrop-blur p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <p className="text-sm text-gray-500">Your campaigns</p>
//                 <h2 className="text-2xl font-semibold text-gray-900">Active Campaigns</h2>
//               </div>
//               <Link
//                 to="/campaigns/active"
//                 className="text-sm font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center"
//               >
//                 View all
//                 <ArrowUpRight className="h-4 w-4 ml-1" />
//               </Link>
//             </div>
           
//             {activeCampaigns?.length > 0 ? (
//               <div className="space-y-4">
//                 {activeCampaigns.slice(0, 3).map((campaign) => (
//                   <div key={campaign.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <h3 className="font-medium text-gray-900">{campaign.title}</h3>
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${
//                             campaign.status === 'active'
//                               ? 'bg-green-100 text-green-800'
//                               : 'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {campaign.status}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-500 mt-1">{campaign.brandName}</p>
//                         <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
//                           <span className="flex items-center">
//                             <Calendar className="h-4 w-4 mr-1.5" />
//                             {campaign.dueDate}
//                           </span>
//                           <span className="flex items-center">
//                             <Award className="h-4 w-4 mr-1.5" />
//                             ${campaign.reward}
//                           </span>
//                         </div>
//                       </div>
//                       <Link
//                         to={`/campaigns/${campaign.id}`}
//                         className="text-indigo-600 hover:text-indigo-800"
//                       >
//                         <ArrowUpRight className="h-5 w-5" />
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <div className="mx-auto h-12 w-12 text-gray-400">
//                   <Zap className="h-full w-full" />
//                 </div>
//                 <h3 className="mt-3 text-sm font-medium text-gray-900">No active campaigns</h3>
//                 <p className="mt-1 text-sm text-gray-500">Browse available campaigns to get started.</p>
//                 <div className="mt-4">
//                   <Link
//                     to="/campaigns/available"
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
//                   >
//                     <Zap className="-ml-1 mr-2 h-4 w-4" />
//                     Browse Campaigns
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Recommendations */}
//           <div className="bg-white/80 rounded-2xl shadow-sm backdrop-blur p-6">
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <p className="text-sm text-gray-500">Recommended for you</p>
//                 <h2 className="text-2xl font-semibold text-gray-900">Campaign Matches</h2>
//               </div>
//               <Link
//                 to="/campaigns/recommended"
//                 className="text-sm font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center"
//               >
//                 View all
//                 <ArrowUpRight className="h-4 w-4 ml-1" />
//               </Link>
//             </div>

//             {recommendedCampaigns?.length > 0 ? (
//               <div className="space-y-4">
//                 {recommendedCampaigns.slice(0, 3).map((campaign) => (
//                   <div key={campaign.id} className="group relative p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h3 className="font-medium text-gray-900">{campaign.title}</h3>
//                         <p className="text-sm text-gray-500 mt-1">{campaign.brandName}</p>
//                         <div className="mt-2">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                             Match: {campaign.matchScore}%
//                           </span>
//                         </div>
//                         <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
//                           <span className="flex items-center">
//                             <Calendar className="h-4 w-4 mr-1.5" />
//                             {campaign.duration}
//                           </span>
//                           <span className="flex items-center">
//                             <Award className="h-4 w-4 mr-1.5" />
//                             ${campaign.reward}
//                           </span>
//                         </div>
//                       </div>
//                       <Link
//                         to={`/campaigns/${campaign.id}`}
//                         className="text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <ArrowUpRight className="h-5 w-5" />
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <div className="mx-auto h-12 w-12 text-gray-400">
//                   <Star className="h-full w-full" />
//                 </div>
//                 <h3 className="mt-3 text-sm font-medium text-gray-900">No recommendations yet</h3>
//                 <p className="mt-1 text-sm text-gray-500">Complete your profile to get better matches.</p>
//                 <div className="mt-4">
//                   <Link
//                     to="/profile"
//                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
//                   >
//                     <span>Complete Profile</span>
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Recent Activities */}
//         <div className="bg-white/80 rounded-2xl shadow-sm backdrop-blur p-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <p className="text-sm text-gray-500">Latest updates</p>
//               <h2 className="text-2xl font-semibold text-gray-900">Recent Activities</h2>
//             </div>
//             <Link
//               to="/activity"
//               className="text-sm font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center"
//             >
//               View all
//               <ArrowUpRight className="h-4 w-4 ml-1" />
//             </Link>
//           </div>
         
//           {dashboardData?.recentActivities?.length > 0 ? (
//             <div className="space-y-4">
//               {dashboardData.recentActivities.slice(0, 5).map((activity, index) => (
//                 <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
//                   <div className={`p-2 rounded-lg ${
//                     activity.type === 'campaign' ? 'bg-indigo-50 text-indigo-600' :
//                     activity.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
//                   } mr-4`}>
//                     {activity.type === 'campaign' ? (
//                       <Calendar className="h-5 w-5" />
//                     ) : activity.type === 'payment' ? (
//                       <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     ) : (
//                       <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                     )}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-900">{activity.title}</p>
//                     <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
//                     <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
//                   </div>
//                   <span className={`text-xs px-2 py-1 rounded-full ${
//                     activity.status === 'completed' ? 'bg-green-100 text-green-800' :
//                     activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {activity.status}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activities</h3>
//               <p className="mt-1 text-sm text-gray-500">Your recent activities will appear here.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable StatCard component
// const StatCard = ({ title, value, icon, color, trend, trendLink }) => {
//   return (
//     <div className="bg-white/80 rounded-2xl shadow-sm backdrop-blur p-5 space-y-4 border border-slate-100 hover:shadow-md transition-shadow">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-gray-500">{title}</p>
//           <p className="text-3xl font-bold text-gray-900">{value}</p>
//         </div>
//         <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
//           {icon}
//         </div>
//       </div>
//       {trend && (
//         <p className="text-sm text-gray-500">
//           {trendLink ? (
//             <Link to={trendLink} className="text-indigo-600 font-medium hover:text-indigo-800">
//               {trend}
//             </Link>
//           ) : (
//             <span className="text-emerald-600 font-medium">{trend}</span>
//           )}
//         </p>
//       )}
//     </div>
//   );
// };

// export default InfluencerDashboard;






import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Calendar,
  Zap,
  MessageSquare,
  Star,
  Award,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

const InfluencerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // --------- STATIC DUMMY DATA -----------
    const fakeData = {
      user: { name: "John Doe" },

      stats: {
        followerCount: 45230,
        engagementRate: 7.5,
        activeCampaigns: 3,
        totalEarnings: 1250
      },

      activeCampaigns: [
        {
          id: 1,
          title: "Summer Wear Campaign",
          brandName: "FashionHub",
          reward: 200,
          dueDate: "2025-11-25",
          status: "active"
        },
        {
          id: 2,
          title: "Tech Gadget Launch",
          brandName: "GadgetPro",
          reward: 350,
          dueDate: "2025-12-02",
          status: "active"
        }
      ],

      recommendedCampaigns: [
        {
          id: 10,
          title: "Organic Skin Product",
          brandName: "GlowCare",
          reward: 180,
          matchScore: 92,
          duration: "3 Weeks"
        },
        {
          id: 11,
          title: "Headphones Promotion",
          brandName: "SoundMax",
          reward: 250,
          matchScore: 85,
          duration: "2 Weeks"
        }
      ],

      recentActivities: [
        {
          title: "Campaign Submitted",
          description: "You submitted the deliverables for FashionHub",
          date: "2 hours ago",
          type: "campaign",
          status: "completed"
        },
        {
          title: "Payment Received",
          description: "$200 payment processed from FashionHub",
          date: "Yesterday",
          type: "payment",
          status: "completed"
        },
        {
          title: "New Message",
          description: "You received a message from SoundMax",
          date: "2 days ago",
          type: "message",
          status: "pending"
        }
      ]
    };

    setDashboardData(fakeData);
  }, []);

  // If data still loading
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  const { user, stats, activeCampaigns, recommendedCampaigns } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Influencer Dashboard</p>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Welcome back, {user?.name}
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Here's your latest performance overview
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Total Followers"
            value={stats.followerCount.toLocaleString()}
            icon={<Users className="h-5 w-5" />}
            color="bg-purple-100 text-purple-600"
            trend="+12% vs last month"
          />
          <StatCard
            title="Engagement Rate"
            value={`${stats.engagementRate}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            color="bg-emerald-100 text-emerald-600"
            trend="High engagement"
          />
          <StatCard
            title="Active Campaigns"
            value={stats.activeCampaigns}
            icon={<Zap className="h-5 w-5" />}
            color="bg-amber-100 text-amber-600"
            trend="View all"
            trendLink="/campaigns/active"
          />
          <StatCard
            title="Earnings"
            value={`$${stats.totalEarnings.toLocaleString()}`}
            icon={<Award className="h-5 w-5" />}
            color="bg-sky-100 text-sky-600"
            trend="Withdraw"
            trendLink="/earnings"
          />
        </div>

        {/* Active & Recommended Campaigns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Active Campaigns */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Campaigns</h2>

            {activeCampaigns.map((c) => (
              <div key={c.id} className="p-4 border rounded-xl mb-3">
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-gray-500">{c.brandName}</p>
                <p className="text-sm mt-1">Reward: ${c.reward}</p>
              </div>
            ))}
          </div>

          {/* Recommended Campaigns */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recommended</h2>

            {recommendedCampaigns.map((c) => (
              <div key={c.id} className="p-4 border rounded-xl mb-3">
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-gray-500">{c.brandName}</p>
                <p className="text-sm mt-1">Match Score: {c.matchScore}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
          {dashboardData.recentActivities.map((a, i) => (
            <div key={i} className="border-b py-3">
              <p className="font-medium">{a.title}</p>
              <p className="text-sm text-gray-500">{a.description}</p>
              <p className="text-xs text-gray-400">{a.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, trend, trendLink }) => (
  <div className="bg-white rounded-2xl shadow p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
    {trend && (
      <p className="text-sm mt-2">
        {trendLink ? (
          <Link to={trendLink} className="text-indigo-600 font-medium">
            {trend}
          </Link>
        ) : (
          <span className="text-emerald-600 font-medium">{trend}</span>
        )}
      </p>
    )}
  </div>
);

export default InfluencerDashboard;
