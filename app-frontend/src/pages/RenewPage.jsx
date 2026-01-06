import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiInfo, FiRefreshCw } from 'react-icons/fi';

const Renew = () => {
  const navigate = useNavigate();
  const { subscription } = useSelector((state) => state.bootstrap);

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

  const { downgradeInfo = {} } = subscription;
  
  const {
    activeproject,
    isactiveprojectmorethan1gb,
    isactiveprojectmorethan1gbsize,
    activeprojectfiledeleationdate,
    isfrozenprojecthave,
    frozenproject,
  } = downgradeInfo;

  const hasFrozenProjects = isfrozenprojecthave === 'yes' && frozenproject > 0;
  const hasFileDeletion = activeproject === 1 && isactiveprojectmorethan1gb === 'yes';
  const hasActiveProject = activeproject === 1;

  const handleRenewClick = () => {
  };

  const deletionDate = activeprojectfiledeleationdate 
    ? new Date(activeprojectfiledeleationdate).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '';

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

              {(hasFrozenProjects || hasFileDeletion || hasActiveProject) && (
                <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/30 border border-amber-600 rounded-xl p-5 mb-8 space-y-3">
                  <div className="flex flex-col items-center text-center">
                    <FiAlertTriangle className="text-yellow-300 text-2xl mb-2" />
                    <p className="font-semibold text-amber-100 text-lg">
                      {hasFrozenProjects && 'Renew to restore frozen projects'}
                      {hasFrozenProjects && hasFileDeletion && ' and '}
                      {hasFileDeletion && 'prevent file deletion'}
                      {!hasFrozenProjects && !hasFileDeletion && 'Renew to maintain full access'}
                    </p>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    {hasFrozenProjects && (
                      <div className="flex items-center gap-3 bg-amber-900/20 p-3 rounded-lg">
                        <div className="bg-amber-800/30 p-2 rounded-full">
                          <span>🧊</span>
                        </div>
                        <div className="text-left">
                          <p className="text-amber-200 font-medium">{frozenproject} frozen project(s)</p>
                          <p className="text-amber-100 text-sm">Will be deleted in 28 days</p>
                        </div>
                      </div>
                    )}

                    {hasFileDeletion && (
                      <div className="flex items-center gap-3 bg-amber-900/20 p-3 rounded-lg">
                        <div className="bg-amber-800/30 p-2 rounded-full">
                          <span>⚠️</span>
                        </div>
                        <div className="text-left">
                          <p className="text-amber-200 font-medium">{isactiveprojectmorethan1gbsize} MB scheduled for deletion</p>
                          <p className="text-amber-100 text-sm">On {deletionDate} (exceeds storage limit)</p>
                        </div>
                      </div>
                    )}

                    {hasActiveProject && !hasFileDeletion && (
                      <div className="flex items-center gap-3 bg-green-900/20 p-3 rounded-lg">
                        <div className="bg-green-800/30 p-2 rounded-full">
                          <span>✅</span>
                        </div>
                        <div className="text-left">
                          <p className="text-green-200 font-medium">Active project maintained</p>
                          <p className="text-green-100 text-sm">Renew to keep full functionality</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            
            <div className="lg:w-96 mx-auto">
              <div className="bg-gray-800/70 rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-5 text-center">Renewal Summary</h3>
                
                <div className="space-y-5 mb-6">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-700">
                    <span className="text-gray-400">Plan:</span>
                    <span className="font-medium text-white">Member Monthly</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Price:</span>
                    <div className="flex items-end">
                      <span className="text-2xl font-bold text-white">₹299</span>
                      <span className="text-gray-400 ml-1">/month</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleRenewClick}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Renew Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Renew;