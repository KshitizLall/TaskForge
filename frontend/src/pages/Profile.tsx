import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  UserCheck,
  Save,
  Loader2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { authFetch, getCurrentUser } from '../utils/auth-utils';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Loading from './exceptions/Loading';
import ErrorPage from './exceptions/ErrorPage';

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

interface ProfileFormValues {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
}

const Profile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Yup validation schema
  const ProfileSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    gender: Yup.string().required('Please select a gender'),
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const currentUser = getCurrentUser();
        if (!currentUser || !currentUser._id) {
          throw new Error('User information not found');
        }

        const response = await authFetch(
          `http://localhost:3001/api/users/${currentUser._id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch user profile');
        }

        const data = await response.json();
        setUserProfile(data);
        setFetchError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setFetchError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Show loading state
  if (loading) {
    return (<Loading />);
  }

  // Show error state if profile fetch failed
  if (fetchError) {
    return <ErrorPage screenName="Unable to load Dashboard" errorMessage={fetchError} onRetry={() => window.location.reload()} />;
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

  // Handle form submission with Formik
  const handleFormSubmit = async (values: ProfileFormValues, { setSubmitting }: any) => {
    try {
      const response = await authFetch(`http://localhost:3001/api/users/${userProfile._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile');
      }

      // Update state and localStorage
      setUserProfile((prev) => (prev ? { ...prev, ...values } : prev));
      const currentUser = getCurrentUser();
      if (currentUser) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...currentUser,
            ...values,
          })
        );
      }
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

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
                <h2 className="text-xl font-bold text-white">
                  {userProfile.first_name} {userProfile.last_name}
                </h2>
                <p className="text-blue-100">@{userProfile.username}</p>
                <p className="text-blue-100">
                  Member since {formatDate(userProfile.createdAt)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Formik Form */}
          <div className="p-6">
            <Formik
              initialValues={{
                first_name: userProfile.first_name || '',
                last_name: userProfile.last_name || '',
                email: userProfile.email || '',
                gender: userProfile.gender || '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={handleFormSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </span>
                        <Field
                          id="first_name"
                          name="first_name"
                          placeholder="First Name"
                          className="input input-bordered pl-10 w-full"
                        />
                      </div>
                      <ErrorMessage name="first_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </span>
                        <Field
                          id="last_name"
                          name="last_name"
                          placeholder="Last Name"
                          className="input input-bordered pl-10 w-full"
                        />
                      </div>
                      <ErrorMessage name="last_name" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </span>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          placeholder="your.email@example.com"
                          className="input input-bordered pl-10 w-full"
                        />
                      </div>
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <UserCheck className="h-5 w-5 text-gray-400" />
                        </span>
                        <Field
                          as="select"
                          id="gender"
                          name="gender"
                          className="select select-bordered pl-10 pr-10 w-full"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer_not_to_say">Prefer not to say</option>
                        </Field>
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </span>
                      </div>
                      <ErrorMessage name="gender" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>

                  {/* Read-only Account Information */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Account Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <UserCheck className="h-5 w-5 text-gray-400" />
                          </span>
                          <input
                            type="text"
                            value={userProfile.username}
                            readOnly
                            className="input input-bordered pl-10 w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                          Account Role
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <UserCheck className="h-5 w-5 text-gray-400" />
                          </span>
                          <input
                            type="text"
                            value={userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
                            readOnly
                            className="input input-bordered pl-10 w-full bg-gray-50 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`btn btn-primary ${isSubmitting && 'loading'}`}
                    >
                      {isSubmitting ? (
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
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Additional sections (e.g., password change, account deletion) can be added here */}
      </div>
    </div>
  );
};

export default Profile;
