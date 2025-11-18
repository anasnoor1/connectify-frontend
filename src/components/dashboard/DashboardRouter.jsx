import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utills/privateIntercept';
import BrandDashboard from './BrandDashboard';
import InfluencerDashboard from './InfluencerDashboard';
import { toast } from 'react-toastify';

const DashboardRouter = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('/api/user/me');
        setUserRole(response.data.user?.role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        toast.error('Failed to load user data');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6 animate-pulse">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <div className="h-8 w-8 text-indigo-600">
                <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Loading your dashboard</h2>
          <p className="mt-2 text-gray-500">Preparing your personalized view...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  if (userRole === 'influencer') {
    return <InfluencerDashboard />;
  } else if (userRole === 'brand') {
    return <BrandDashboard />;
  } else {
    // If user role is not recognized, redirect to home or login
    navigate('/');
    return null;
  }
};

export default DashboardRouter;