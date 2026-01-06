import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiInfo, FiRefreshCw, FiCalendar, FiCheckCircle, FiCreditCard } from 'react-icons/fi';
import RenewPaymentGateway from '../components/RenewPaymentGateway';
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import { BaseUrl } from '../api/ApiUrl';

const Renew = () => {
  const navigate = useNavigate();
  const { subscription } = useSelector((state) => state.bootstrap);
  const [renewMonths, setRenewMonths] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { makeAuthenticatedRequest } = useAuth();

  // Monthly price in rupees (₹299)
  const MONTHLY_PRICE = 299;

  // Fetch renew months from backend
  useEffect(() => {
    const fetchRenewMonths = async () => {
      if (!subscription?.isUnderRenew) return;

      try {
        setLoading(true);

        const response = await makeAuthenticatedRequest(`${BaseUrl}/payment/renew/info`, {
          method: 'GET',
        });


        if (response.data.month) {
          setRenewMonths(response.data.month)
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching renew info:', err);
        setError(err.response?.data?.message || 'Failed to fetch renew information');
      } finally {
        setLoading(false);
      }
    };

    fetchRenewMonths();
  }, [subscription?.isUnderRenew]);

  if (!subscription) {
    return navigate('/subscription');
  }

  if (!subscription?.isUnderRenew) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-xl w-full bg-gray-800/60 rounded-2xl p-8 border border-gray-700 text-center">
          <div className="bg-blue-900/30 p-4 rounded-xl mb-6 flex flex-col items-center">
            <FiInfo className="text-blue-400 text-3xl mb-3" />
            <h2 className="text-white text-2xl font-semibold">Nothing to renew</h2>
            <p className="text-gray-300 mt-2">
              Your subscription is currently active or not eligible for renewal
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg w-full max-w-xs mx-auto"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Calculate total price
  const totalPrice = MONTHLY_PRICE * renewMonths;

  const formatSubscriptionEnd = () => {
    if (!subscription?.subscriptionEnd) return 'N/A';

    try {
      return new Date(subscription.subscriptionEnd).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Loading skeleton for main content */}
              <div className="flex-1">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="bg-gray-700 p-3 rounded-full mb-4 animate-pulse h-12 w-12"></div>
                  <div className="h-8 w-64 bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-96 bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Loading skeleton for payment card */}
              <div className="lg:w-96 mx-auto">
                <div className="bg-gray-800/70 rounded-xl border border-gray-700 p-6">
                  <div className="h-6 w-32 bg-gray-700 rounded mb-5 animate-pulse mx-auto"></div>
                  <div className="space-y-5 mb-6">
                    <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-12 w-full bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-8 rounded-2xl border border-red-700 text-center">
            <div className="bg-red-900/30 p-4 rounded-xl mb-6 flex flex-col items-center">
              <FiAlertTriangle className="text-red-400 text-3xl mb-3" />
              <h2 className="text-white text-2xl font-semibold">Error Loading Renew Info</h2>
              <p className="text-gray-300 mt-2">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-indigo-900/20 p-3 rounded-full mb-4">
                  <FiRefreshCw className="text-indigo-400 text-3xl" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Renew Your Subscription
                </h1>
                <p className="text-gray-300 mt-2 max-w-lg">
                  Continue enjoying full platform access by renewing your subscription
                </p>
              </div>

              {/* Expiration Warning */}
              <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/30 border border-amber-600 rounded-xl p-5 mb-8 space-y-3">
                <div className="flex flex-col items-center text-center">
                  <FiAlertTriangle className="text-yellow-300 text-2xl mb-2" />
                  <p className="font-semibold text-amber-100 text-lg mb-3">
                    Your Subscription is About to Expire!
                  </p>
                  <div className="flex items-center gap-2 text-amber-200 mb-4">
                    <FiCalendar />
                    <span>Expires on: {formatSubscriptionEnd()}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3 bg-amber-900/20 p-3 rounded-lg">
                    <div className="bg-amber-800/30 p-2 rounded-full">
                      <span>⏰</span>
                    </div>
                    <div className="text-left">
                      <p className="text-amber-200 font-medium">Renew to maintain access</p>
                      <p className="text-amber-100 text-sm">Continue using all premium features</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-green-900/20 p-3 rounded-lg">
                    <div className="bg-green-800/30 p-2 rounded-full">
                      <FiCheckCircle className="text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-green-200 font-medium">No interruption in service</p>
                      <p className="text-green-100 text-sm">Seamless renewal process</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-blue-900/20 p-3 rounded-lg">
                    <div className="bg-blue-800/30 p-2 rounded-full">
                      <FiCreditCard className="text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-blue-200 font-medium">Secure payment</p>
                      <p className="text-blue-100 text-sm">100% secure payment process</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="lg:w-96 mx-auto">
              <div className="bg-gray-800/70 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-5 text-center">Renewal Summary</h3>

                <div className="space-y-5 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-400">Plan:</span>
                    <span className="font-medium text-white">Member</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-medium text-white">
                      {renewMonths} month{renewMonths > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-400">Monthly Price:</span>
                    <div className="text-right">
                      <span className="font-medium text-white">₹{MONTHLY_PRICE}/month</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Amount:</span>
                    <div className="flex items-end">
                      <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Use your RenewPaymentGateway component */}
                <RenewPaymentGateway
                  amount={totalPrice * 100} // Convert to paise
                  months={renewMonths}
                  description={`Subscription renewal for ${renewMonths} month${renewMonths > 1 ? 's' : ''}`}
                  buttonText={`Pay ₹${totalPrice} Now`}
                />

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Renew;