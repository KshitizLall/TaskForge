import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  UserCheck, 
  Save, 
  Loader2, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { authFetch, getCurrentUser } from '../utils/auth-utils';

interface UserProfile {
  _id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    first_name: '',
    last_name: '',
    email: '',
    gender: ''
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user from localStorage
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser._id) {
          throw new Error('User information not found');
        }
        
        const response = await authFetch(`http://localhost:3001/api/users/${currentUser._id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user profile');
        }
        
        const userData = await response.json();
        setUserProfile(userData);
        
        // Initialize form with user data
        setProfileForm({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          gender: userData.gender || ''
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) return;
    
    try {
      setUpdating(true);
      
      const response = await authFetch(`http://localhost:3001/api/users/${userProfile._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });
      
      console.log('Update profile response status:', response.status);
      const responseData = await response.json();
      console.log('Update profile response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile');
      }
      
      // Update the user profile state
      setUserProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...profileForm
        };
      });
      
      // Update the user data in localStorage
      const currentUser = getCurrentUser();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({
          ...currentUser,
          ...profileForm
        }));
      }
      
      toast.success('Profile updated successfully');
      
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">Error Loading Profile</h2>
        <p className="mt-2 text-gray-600 text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-4">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h2 className="mt-4 text-xl font-bold text-gray-800">Profile Not Found</h2>
        <p className="mt-2 text-gray-600 text-center">
          We couldn't find your profile information. Please try logging in again.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <div className="md:ml-6 text-center md:text-left">
                <h2 className="text-xl font-bold text-white">{userProfile.first_name} {userProfile.last_name}</h2>
                <p className="text-blue-100">@{userProfile.username}</p>
                <p className="text-blue-100">Member since {formatDate(userProfile.createdAt)}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={profileForm.first_name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="First Name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={profileForm.last_name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Last Name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCheck className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="gender"
                      name="gender"
                      value={profileForm.gender}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Read-only fields */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Account Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Username
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={userProfile.username}
                        readOnly
                        className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Account Role
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCheck className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                        readOnly
                        className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    updating ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {updating ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="-ml-1 mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Additional sections could be added here, such as:
         * - Password change form
         * - Account deletion
         * - Activity history
         */}
      </div>
    </div>
  );
};

export default Profile;