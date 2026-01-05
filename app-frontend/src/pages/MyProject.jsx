import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjectData } from '../store/slices/projectdataSlice'; 
import { useAuth } from '../context/AuthContext';

const MyProjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {makeAuthenticatedRequest} = useAuth();

  const { projects, loading, error } = useSelector((state) => state.bootstrap);
  const projectdata = useSelector((state) => state.projectdata);

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  const handleProjectClick = (projectId, projectName) => {
    const alreadyFetched = !!projectdata[projectId]?.fetchedOnce;

    if (!alreadyFetched) {
      dispatch(fetchProjectData({projectId , makeAuthenticatedRequest}));
    }

    navigate(`/project/${projectId}`, { state: { projectName } });
  };

  const SkeletonCard = () => (
    <div className="bg-gray-800/70 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-3xl min-h-40 flex items-center overflow-hidden relative mx-auto">
      <div className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 animate-shimmer" />
      <div className="p-3 sm:p-4 md:p-6 relative z-10 flex items-center gap-3 sm:gap-4 w-full">
        <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-700 rounded-full flex-shrink-0" />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="h-5 sm:h-6 bg-gray-700 rounded mb-2 sm:mb-3 w-1/2" />
          <div className="h-3 sm:h-4 bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    </div>
  );

  const isCreateDisabled = projects?.length >= 5;

  return (
    <div className="text-white p-3 sm:p-4 md:p-6">
      <div className="max-w-xs sm:max-w-sm md:max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 md:mb-8 text-center">
          My Projects
        </h2>

        {error && (
          <div className="mb-4 sm:mb-6 text-red-500 text-center text-sm sm:text-base md:text-lg font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
              No projects found. Create one to get started!
            </p>
            <div
              onClick={() => {
                if (!isCreateDisabled) handleCreateProject();
              }}
              className={`bg-gray-800/70 rounded-2xl border-2 ${
                isCreateDisabled
                  ? 'border-gray-700 opacity-50 cursor-not-allowed'
                  : 'border-dashed border-gray-600 hover:bg-gray-700 hover:border-indigo-500 cursor-pointer'
              } flex items-center justify-center transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-3xl min-h-40 mx-auto`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-2xl sm:text-3xl md:text-4xl text-gray-400">+</div>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl font-medium">
                  {isCreateDisabled ? 'Limit Reached (5 Projects)' : 'Create Project'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project.id, project.name)}
                className="bg-gray-800/70 p-3 sm:p-4 md:p-6 rounded-2xl border border-gray-700 w-full max-w-xs sm:max-w-sm md:max-w-3xl min-h-40 flex items-center gap-3 sm:gap-4 cursor-pointer hover:bg-gray-700 hover:border-indigo-500 transition-all duration-300 mx-auto"
                aria-label={`Open project ${project.name}: ${project.description || 'No description'}`}
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-500 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold text-white flex-shrink-0">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 flex flex-col justify-center min-h-0 w-full overflow-hidden">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 truncate">
                    {project.name}
                  </h3>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-sm break-words">
                    {project?.description || 'No description provided'}
                  </p>
                </div>
              </div>
            ))}

            <div
              onClick={() => {
                if (!isCreateDisabled) handleCreateProject();
              }}
              className={`bg-gray-800/70 rounded-2xl border-2 ${
                isCreateDisabled
                  ? 'border-gray-700 opacity-50 cursor-not-allowed'
                  : 'border-dashed border-gray-600 hover:bg-gray-700 hover:border-indigo-500 cursor-pointer'
              } flex items-center justify-center transition-all duration-300 w-full max-w-xs sm:max-w-sm md:max-w-3xl min-h-40 mx-auto`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-2xl sm:text-3xl md:text-4xl text-gray-400">+</div>
                <p className="text-gray-300 text-base sm:text-lg md:text-xl font-medium">
                  {isCreateDisabled ? 'Limit Reached (5 Projects)' : 'Create Project'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default MyProjects;
