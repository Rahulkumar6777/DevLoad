import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  FiMail, FiCalendar, FiZap, FiPackage, FiDatabase, 
  FiKey, FiHeadphones, FiInfo, FiRefreshCw, FiArrowUpRight,
  FiCreditCard, FiAlertCircle, FiCheckCircle, FiClock
} from 'react-icons/fi';

const Subscription = () => {
  const navigate = useNavigate();
  const { subscription, loading, error } = useSelector((state) => state.bootstrap);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-gray-700 rounded-xl animate-pulse"></div>
              <div>
                <div className="h-8 w-48 bg-gray-700 rounded mb-2 animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-2 sm:px-4 py-8 sm:py-12">
        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-6 rounded-2xl border border-red-700 text-center">
          <div className="bg-red-900/30 p-4 rounded-xl mb-6 flex flex-col items-center">
            <FiAlertCircle className="text-red-400 text-3xl mb-2" />
            <h2 className="text-white text-2xl font-semibold">Subscription Error</h2>
            <p className="text-gray-300 mt-2 text-sm">Failed to load subscription details</p>
            <p className="text-red-300 mt-1 text-sm">Error: {error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!subscription) return null;

  const { plan, email, features, renewsOn, isUnderRenew, subscriptionEnd } = subscription;
  const isFree = plan === 'free';

  const handleRenew = () => {
    navigate('/renew');
  };

  const handleUpgrade = () => {
    navigate('/upgrade');
  };

  // Format subscription end date with time
  const formatSubscriptionEndWithTime = () => {
    if (!subscriptionEnd) return null;
    
    try {
      const endDate = new Date(subscriptionEnd);
      
      // Get date in format: DD Month YYYY
      const dateStr = endDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      // Get time in format: HH:MM AM/PM
      const timeStr = endDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      return {
        date: dateStr,
        time: timeStr,
        fullDate: `${dateStr} at ${timeStr}`
      };
    } catch (error) {
      return null;
    }
  };

  // Calculate time remaining
  const calculateTimeRemaining = () => {
    if (!subscriptionEnd || isFree) return null;
    
    try {
      const now = new Date();
      const endDate = new Date(subscriptionEnd);
      const diffMs = endDate - now;
      
      if (diffMs <= 0) return { days: 0, hours: 0, minutes: 0 };
      
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      return { days, hours, minutes };
    } catch (error) {
      return null;
    }
  };

  const subscriptionEndInfo = formatSubscriptionEndWithTime();
  const timeRemaining = calculateTimeRemaining();

  const renderRenewBanner = () => {
    if (!isUnderRenew) return null;

    return (
      <div className="bg-gradient-to-br from-amber-900/40 to-yellow-900/30 border-2 border-amber-600 rounded-xl p-4 sm:p-5 mb-6 space-y-3">
        <div className="flex items-start gap-3">
          <div className="bg-amber-500/20 p-2 rounded-lg">
            <FiAlertCircle className="text-amber-300 text-xl flex-shrink-0" />
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-bold text-amber-100 text-lg mb-2">
                  Your Subscription is About to Expire!
                </p>
                <p className="text-amber-200 text-sm mb-3">
                  Your subscription will end on <span className="font-bold">{subscriptionEndInfo?.fullDate}</span>
                  {timeRemaining && (
                    <span className="ml-2">
                      ({timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m remaining)
                    </span>
                  )}
                </p>
              </div>
              
              <button
                onClick={handleRenew}
                className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="text-lg" />
                Renew Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FeatureCard = ({ label, value, icon: Icon, highlight }) => (
    <div className={`group bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-5 rounded-xl border transition-all hover:scale-105 ${
      highlight ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-gray-700 hover:border-indigo-500'
    }`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-indigo-900/30 p-2.5 rounded-lg group-hover:bg-indigo-900/50 transition-colors">
          <Icon className="text-indigo-400 text-xl" />
        </div>
        <p className="text-gray-400 text-sm font-medium">{label}</p>
      </div>
      <p className="text-white font-bold text-xl">{value}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-gray-700 bg-gradient-to-r from-indigo-900/20 to-purple-900/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl">
                <FiCreditCard className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Subscription Plan</h1>
                <p className="text-gray-400 mt-1 text-xs sm:text-sm">Manage your billing and plan settings</p>
              </div>
            </div>
            
            {/* Plan badge and subscription end info */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                {!isFree && subscriptionEndInfo && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-indigo-900/30 border border-indigo-700/50 rounded-lg">
                    <FiClock className="text-indigo-400 text-sm" />
                    <div className="text-right">
                      <p className="text-indigo-300 text-xs font-medium">Expires</p>
                      <p className="text-white text-xs">
                        {subscriptionEndInfo.date}
                        <span className="text-gray-400 ml-1">at</span>
                        <span className="ml-1 font-medium">{subscriptionEndInfo.time}</span>
                      </p>
                    </div>
                  </div>
                )}
                
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide text-center ${
                    isFree 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50'
                  }`}
                >
                  {plan}
                </span>
              </div>
              
              {/* Mobile view for subscription end */}
              {!isFree && subscriptionEndInfo && (
                <div className="sm:hidden flex items-center gap-2 px-3 py-1.5 bg-indigo-900/30 border border-indigo-700/50 rounded-lg w-full justify-center">
                  <FiClock className="text-indigo-400 text-sm" />
                  <div className="text-center">
                    <p className="text-indigo-300 text-xs font-medium">Expires</p>
                    <p className="text-white text-xs">
                      {subscriptionEndInfo.date} at {subscriptionEndInfo.time}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <FiPackage className="text-indigo-400 text-sm" />
                <p className="text-gray-400 text-xs">Projects</p>
              </div>
              <p className="text-white font-bold text-lg">{features.maxProjects}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <FiZap className="text-indigo-400 text-sm" />
                <p className="text-gray-400 text-xs">Operations</p>
              </div>
              <p className="text-white font-bold text-lg">{features.maxOperations.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-1">
                <FiDatabase className="text-indigo-400 text-sm" />
                <p className="text-gray-400 text-xs">Storage</p>
              </div>
              <p className="text-white font-bold text-lg">{(features.storageMB / (1024 * 1024))} MB</p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          {renderRenewBanner()}

          
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 sm:p-6 rounded-xl border border-gray-700 mb-6 sm:mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiCreditCard className="text-indigo-400" />
              Billing Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-indigo-900/30 p-2.5 rounded-lg">
                  <FiMail className="text-indigo-400 text-xl" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Billing Email</p>
                  <p className="text-white font-semibold text-base break-all">{email}</p>
                </div>
              </div>

              {!isFree && subscriptionEndInfo && (
                <div className="flex items-start gap-4">
                  <div className="bg-indigo-900/30 p-2.5 rounded-lg">
                    <FiCalendar className="text-indigo-400 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Subscription Ends</p>
                    <p className="text-white font-semibold text-base">
                      {subscriptionEndInfo.fullDate}
                    </p>
                    {timeRemaining && !isUnderRenew && (
                      <p className="text-green-400 text-sm mt-1">
                        {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m remaining
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

           
            <div className="mt-6 flex flex-wrap gap-3">
              {isFree && !isUnderRenew && (
                <button
                  onClick={handleUpgrade}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50"
                >
                  <FiArrowUpRight className="text-lg" />
                  Upgrade to Member
                </button>
              )}

              {!isFree && !isUnderRenew && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-700/50 rounded-lg text-green-400">
                  <FiCheckCircle />
                  <span className="text-sm font-medium">Active Subscription</span>
                </div>
              )}
              
              {!isFree && (
                <button
                  onClick={handleRenew}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-indigo-500/50"
                >
                  <FiRefreshCw className="text-lg" />
                  Renew Early
                </button>
              )}
            </div>
          </div>

          
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FiZap className="text-indigo-400" />
              Plan Features
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FeatureCard 
                label="Max Projects" 
                value={features.maxProjects} 
                icon={FiPackage}
                highlight={!isFree}
              />
              <FeatureCard 
                label="Monthly Operations" 
                value={features.maxOperations.toLocaleString()} 
                icon={FiZap}
                highlight={!isFree}
              />
              <FeatureCard 
                label="Storage Limit" 
                value={`${(features.storageMB / (1024 * 1024)).toFixed(2)} MB`} 
                icon={FiDatabase}
                highlight={!isFree}
              />
              <FeatureCard 
                label="API Key Support" 
                value={features.apiKeySupport} 
                icon={FiKey}
              />
              <FeatureCard 
                label="Support Level" 
                value={features.support} 
                icon={FiHeadphones}
              />
            </div>
          </div>

          
          {isFree && (
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-700/50">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <FiInfo className="text-indigo-400" />
                Why Upgrade?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/20 p-1.5 rounded-full mt-0.5">
                    <FiCheckCircle className="text-indigo-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">More Projects</p>
                    <p className="text-gray-400 text-xs">5 active projects</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/20 p-1.5 rounded-full mt-0.5">
                    <FiCheckCircle className="text-indigo-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Higher Limits</p>
                    <p className="text-gray-400 text-xs">10x more operations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/20 p-1.5 rounded-full mt-0.5">
                    <FiCheckCircle className="text-indigo-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">More Storage</p>
                    <p className="text-gray-400 text-xs">5GB per project</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-indigo-500/20 p-1.5 rounded-full mt-0.5">
                    <FiCheckCircle className="text-indigo-400 text-sm" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Priority Support</p>
                    <p className="text-gray-400 text-xs">Email & chat support</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscription;