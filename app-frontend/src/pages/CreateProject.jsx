import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';
import { useDispatch  , useSelector} from 'react-redux';
import { fetchProjectData } from '../store/slices/projectdataSlice'; 
import { addProjectToBootstrap } from '../store/slices/bootstrapSlice';

const CreateProject = () => {
  const { makeAuthenticatedRequest } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [projectname, setProjectname] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const projectdata = useSelector((state) => state.projectdata);

  const handleProjectClick = (projectId, projectName) => {

    const alreadyFetched = !!projectdata[projectId]?.fetchedOnce;
    
        if (!alreadyFetched) {
          dispatch(fetchProjectData({projectId , makeAuthenticatedRequest}));
        }
    navigate(`/project/${projectId}`, { state: { projectName } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');
    try {
      const response = await makeAuthenticatedRequest(`${BaseUrl}/project`, {
        method: 'POST',
        data: { projectname, description },
      });

      
      dispatch(addProjectToBootstrap(response.data));

      
      handleProjectClick(response.data.id, response.data.name);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to create project'
      );
      console.error('');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          Create New Project
        </h2>
        {error && (
          <div className="mb-6 text-red-500 text-center text-lg font-medium">{error}</div>
        )}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 p-6 rounded-xl shadow-lg border border-gray-700"
        >
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="name">Project Name</label>
            <input
              type="text"
              id="name"
              value={projectname}
              onChange={(e) => setProjectname(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white border border-gray-600 focus:outline-none focus:border-indigo-500"
              rows="4"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 ${
              isCreating ? 'bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-medium`}
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;