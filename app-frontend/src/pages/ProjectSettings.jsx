import { useEffect, useState } from "react";
import {
  FaCog,
  FaTrash,
  FaImage,
  FaVideo,
  FaMusic,
  FaUpload,
  FaProjectDiagram,
  FaExclamationTriangle,
  FaPlus,
  FaTimes,
  FaCogs,
  FaCheck,
  FaEnvelope
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  fetchProjectData,
  updateFileType,
  updateProjectStorage,
  addDomain,
  deleteDomain,
  updateProcessingSettings
} from "../store/slices/projectdataSlice";
import { updateProjectName, updateProjectDescription } from "../store/slices/bootstrapSlice";
import { deleteProject } from "../store/slices/projectsSlice";

const ProjectSettings = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { makeAuthenticatedRequest } = useAuth();
  const projectData = useSelector((state) => state.projectdata[projectId]);
  const { projects, loading: bootstrapLoading } = useSelector((state) => state.bootstrap);
  const { subscription } = useSelector((state) => state.bootstrap);
  const isMember = subscription?.plan === "member";
  const loading = projectData?.loading || bootstrapLoading || false;
  const error = projectData?.error || null;

  
  const project = projects.find((p) => p.id === projectId);

 
  const [editMode, setEditMode] = useState({
    projectname: false,
    projectdescription: false,
    maxstorage: false,
  });
  const [formValues, setFormValues] = useState({
    projectname: project?.name || "",
    projectdescription: project?.description || "",
    maxstorage: projectData?.settings?.project.maxstorage || "",
    alloweddomain: projectData?.settings?.project.alloweddomain || []
  });
  const [togglingType, setTogglingType] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('uploading');
  const [newDomain, setNewDomain] = useState("");
  const [addingDomain, setAddingDomain] = useState(false);
  const [maxStorageMB, setMaxStorageMB] = useState("");
  const [updatingProcessing, setUpdatingProcessing] = useState(null);
  const [processingValues, setProcessingValues] = useState({
    areYouWantToOptimise: false,
    wantToSendEmailNotificationOnAfterOptimisation: false
  });

  useEffect(() => {
    if (!projectData?.fetchedOnce) {
      dispatch(fetchProjectData({ projectId, makeAuthenticatedRequest }));
    }
  }, [projectId, dispatch, makeAuthenticatedRequest]);

  useEffect(() => {
    setFormValues({
      projectname: project?.name || "",
      projectdescription: project?.description || "",
      maxstorage: projectData?.settings?.project.maxstorage || 0,
      alloweddomain: projectData?.settings?.project.alloweddomain || []
    });

    if (projectData?.settings?.project.maxstorage) {
      setMaxStorageMB(
        (projectData.settings.project.maxstorage / (1024 * 1024)).toFixed(2)
      );
    }

    
    if (projectData?.settings?.processing) {
      setProcessingValues({
        areYouWantToOptimise: projectData.settings.processing.areYouWantToOptimise || false,
        wantToSendEmailNotificationOnAfterOptimisation: projectData.settings.processing.wantToSendEmailNotificationOnAfterOptimisation || false
      });
    }
  }, [project, projectData]);

  const toggleFileType = async (type) => {
    setTogglingType(type);
    try {
      const currentFileTypes = projectData?.settings?.uploading.filetype || [];
      const newState = currentFileTypes.includes(type) ? "off" : "on";
      await dispatch(
        updateFileType({ projectId, type, state: newState, makeAuthenticatedRequest })
      ).unwrap();
    } catch (err) {
      alert(`Failed to toggle ${type}. Please try again.`);
    } finally {
      setTogglingType(null);
    }
  };

  const handleUpdateProcessingSettings = async (field) => {
    setUpdatingProcessing(field);
    try {
      const updatedValue = !processingValues[field];
      const updatedSettings = {
        ...processingValues,
        [field]: updatedValue
      };

      await dispatch(
        updateProcessingSettings({
          projectId,
          settings: updatedSettings,
          makeAuthenticatedRequest
        })
      ).unwrap();

      
      setProcessingValues(updatedSettings);
    } catch (err) {
      alert(err?.error || "Failed to update processing settings");
    } finally {
      setUpdatingProcessing(null);
    }
  };

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    try {
      if (field === "projectname") {
        await dispatch(
          updateProjectName({
            projectId,
            projectname: formValues.projectname,
            makeAuthenticatedRequest,
          })
        ).unwrap();
      }

      if (field === "projectdescription") {
        await dispatch(
          updateProjectDescription({
            projectId,
            description: formValues.projectdescription,
            makeAuthenticatedRequest,
          })
        ).unwrap();
      }

      if (field === "maxstorage") {
        const mb = parseFloat(maxStorageMB);

        if (isNaN(mb) || mb <= 0) {
          alert("Please enter a valid storage value in MB");
          return;
        }

        const bytes = Math.round(mb * 1024 * 1024);

        await dispatch(
          updateProjectStorage({
            projectId,
            storage: bytes, 
            makeAuthenticatedRequest,
          })
        ).unwrap();

        
        setFormValues((prev) => ({
          ...prev,
          maxstorage: bytes
        }));
      }

      setEditMode((prev) => ({ ...prev, [field]: false }));
    } catch (err) {
      alert(err?.error || "Update failed");
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      alert("Please enter a domain");
      return;
    }

    try {
      await dispatch(
        addDomain({
          projectId,
          domain: newDomain.trim(),
          makeAuthenticatedRequest
        })
      ).unwrap();
      setNewDomain("");
      setAddingDomain(false);
    } catch (err) {
      alert(`${err.error}`);
    }
  };

  const handleDeleteDomain = async (domain) => {
    if (!window.confirm(`Are you sure you want to remove ${domain}?`)) return;

    try {
      await dispatch(
        deleteDomain({
          projectId,
          domain,
          makeAuthenticatedRequest
        })
      ).unwrap();
    } catch (err) {
      alert(`${err.error}`);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteProject({ makeAuthenticatedRequest, projectId })).unwrap();
      navigate("/");
    } catch (err) {
      alert("Failed to delete project. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!project || !projectData?.settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-10 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center">
                  <FaCog className="text-blue-400 text-lg" />
                </div>
                <div className="h-10 w-48 bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
              <div className="h-4 w-48 sm:w-64 bg-gray-700 rounded mt-3 animate-pulse"></div>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-full md:w-auto">
              <div className="h-4 w-full md:w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

         
          <div className="flex flex-wrap mb-6 md:mb-8 border-b border-gray-700">
            <div className="px-4 py-2 sm:px-6 sm:py-3 font-medium border-b-2 border-blue-500 text-white flex items-center gap-2">
              <FaUpload className="text-lg" />
              <div className="h-4 w-24 sm:w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="px-4 py-2 sm:px-6 sm:py-3 font-medium text-gray-400 flex items-center gap-2">
              <FaProjectDiagram className="text-lg" />
              <div className="h-4 w-24 sm:w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="px-4 py-2 sm:px-6 sm:py-3 font-medium text-gray-400 flex items-center gap-2">
              <FaCogs className="text-lg" />
              <div className="h-4 w-24 sm:w-32 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>

          
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="bg-blue-900/20 p-3 rounded-lg w-16 h-16 sm:w-auto sm:h-auto">
                  <div className="bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <FaUpload className="text-blue-400 text-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-5 sm:h-6 w-40 sm:w-48 bg-gray-700 rounded mb-3 sm:mb-4 animate-pulse"></div>
                  <div className="h-4 w-full bg-gray-700 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 w-3/4 sm:w-4/5 bg-gray-700 rounded mb-4 sm:mb-6 animate-pulse"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="bg-gray-700 px-4 py-2 rounded-lg w-16 h-8 animate-pulse"></div>
                    <div className="bg-gray-700 px-4 py-2 rounded-lg w-40 h-10 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="bg-purple-900/20 p-3 rounded-lg w-16 h-16 sm:w-auto sm:h-auto">
                  <div className="bg-purple-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <FaImage className="text-purple-400 text-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-5 sm:h-6 w-40 sm:w-48 bg-gray-700 rounded mb-3 sm:mb-4 animate-pulse"></div>
                  <div className="h-4 w-48 sm:w-64 bg-gray-700 rounded mb-4 sm:mb-6 animate-pulse"></div>
                  <div className="space-y-3 sm:space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-700/50 p-3 sm:p-4 rounded-lg gap-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-600/30 p-2 rounded-lg">
                            <div className="h-6 w-6 bg-gray-500 rounded-full"></div>
                          </div>
                          <div>
                            <div className="h-4 w-24 bg-gray-600 rounded mb-2 animate-pulse"></div>
                            <div className="h-3 w-32 bg-gray-600 rounded animate-pulse"></div>
                          </div>
                        </div>
                        <div className="relative sm:self-center">
                          <div className="w-14 h-7 bg-gray-600 rounded-full flex items-center justify-center">
                            <div className="h-4 w-4 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-6 sm:py-10 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
              <FaCog className="text-blue-400" />
              Project Settings
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">
              Configure your project and upload settings
            </p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 w-full md:w-auto">
            <p className="text-xs sm:text-sm text-gray-300">
              Project ID: <span className="font-mono text-blue-400">{projectId}</span>
            </p>
          </div>
        </div>

  
        <div className="flex flex-wrap mb-6 md:mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("uploading")}
            className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 font-medium transition-all text-sm sm:text-base ${activeTab === "uploading"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
              }`}
          >
            <FaUpload className="text-sm sm:text-lg" />
            Upload Settings
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 font-medium transition-all text-sm sm:text-base ${activeTab === "project"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
              }`}
          >
            <FaProjectDiagram className="text-sm sm:text-lg" />
            Project Details
          </button>
          <button
            onClick={() => setActiveTab("processing")}
            className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 font-medium transition-all text-sm sm:text-base ${activeTab === "processing"
              ? "border-b-2 border-blue-500 text-white"
              : "text-gray-400 hover:text-white"
              }`}
          >
            <FaCogs className="text-sm sm:text-lg" />
            Processing
          </button>
        </div>

       
        {activeTab === "uploading" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 transition-all hover:border-blue-500/50">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="bg-blue-900/20 p-3 rounded-lg w-16 h-16 sm:w-auto sm:h-auto">
                  <div className="bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <FaUpload className="text-blue-400 text-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">Maximum File Size</h2>
                  <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
                    Control if an uploaded file is within a specified size limit. If the file exceeds the limit, an error
                    message is returned to the user.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="bg-gray-700 px-4 py-2 rounded-lg text-center">
                      <span className="text-white text-sm sm:text-base">{(projectData?.settings?.uploading.maxfilesize / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                    {!isMember && (
                      <button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 justify-center transition-all text-sm sm:text-base"
                      >
                        <FaCog className="text-xs sm:text-sm" />
                        Upgrade Limit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 transition-all hover:border-blue-500/50">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="bg-purple-900/20 p-3 rounded-lg w-16 h-16 sm:w-auto sm:h-auto">
                  <div className="bg-purple-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <FaImage className="text-purple-400 text-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">MIME Type Filtering</h2>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                    Enable/disable MIME type access below:
                  </p>
                  {!isMember && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4 text-yellow-300 text-sm sm:text-base flex items-center gap-2">
                      <FaExclamationTriangle className="text-yellow-400" />
                      You are not a member! Only members can upload videos.
                    </div>
                  )}
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { type: "image", icon: <FaImage className="text-sm sm:text-lg text-blue-400" /> },
                      { type: "video", icon: <FaVideo className="text-sm sm:text-lg text-purple-400" /> },
                      { type: "audio", icon: <FaMusic className="text-sm sm:text-lg text-pink-400" /> },
                    ].map((item) => (
                      <div
                        key={item.type}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-700/50 p-3 sm:p-4 rounded-lg gap-3"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="bg-gray-600/30 p-2 rounded-lg">{item.icon}</div>
                          <div>
                            <h3 className="font-medium text-white text-sm sm:text-base capitalize">{item.type}</h3>
                            <p className="text-gray-400 text-xs sm:text-sm">
                              {item.type === "image" }
                              {item.type === "video" }
                              {item.type === "audio" }
                            </p>
                          </div>
                        </div>
                        <label
                          className={`relative inline-flex items-center ${item.type === "video" && !isMember ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                            } self-center sm:self-auto`}
                        >
                          <input
                            type="checkbox"
                            checked={projectData?.settings?.uploading.filetype.includes(item.type)}
                            onChange={() => {
                              if (item.type === "video" && !isMember) {
                                return; 
                              }
                              toggleFileType(item.type);
                            }}
                            className="sr-only peer"
                            disabled={togglingType === item.type || loading || (item.type === "video" && !isMember)}
                          />
                          
                          <div className={`relative w-14 h-7 rounded-full transition duration-200 ${item.type === "video" && !isMember
                            ? "bg-gray-600"
                            : projectData?.settings?.uploading.filetype.includes(item.type)
                              ? "bg-blue-600"
                              : "bg-gray-600"
                            }`}
                          >
                            {togglingType === item.type ? (
                              
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                              </div>
                            ) : (
                             
                              <div
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transform transition duration-200 ${projectData?.settings?.uploading.filetype.includes(item.type) ? "translate-x-7" : ""
                                  }`}
                              ></div>
                            )}
                          </div>
                          <span className="ml-3 text-xs sm:text-sm text-gray-300">
                            {projectData?.settings?.uploading.filetype.includes(item.type) ? "Enabled" : "Disabled"}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === "project" && (
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                title: "Project Name",
                field: "projectname",
                value: formValues.projectname,
                description: "The name of your project as it appears in the dashboard",
                inputType: "text",
              },
              {
                title: "Project Description",
                field: "projectdescription",
                value: formValues.projectdescription,
                description: "Brief description of your project's purpose",
                inputType: "text",
              },
              {
                title: "Maximum Storage",
                field: "maxstorage",
                value: maxStorageMB,
                description: "Total storage allocated to this project (in MB)",
                inputType: "number",
              },
              {
                title: "Allowed Domains",
                field: "alloweddomain",
                value: formValues.alloweddomain,
                description: 'Fill in the domain names from which you want to fetch files. This can include your own website or any other domain that hosts your files. The Proxy will recognize and allow delivery from these domains, while blocking any other.',
                inputType: 'array'
              }
            ].map((item) => (
              <div
                key={item.field}
                className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 transition-all hover:border-blue-500/50"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">{item.title}</h2>
                <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">{item.description}</p>

                {item.field === "alloweddomain" ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {item.value && item.value.map((domain) => (
                        <div
                          key={domain}
                          className="bg-gray-700 rounded-full px-3 py-1.5 flex items-center text-sm"
                        >
                          <span className="mr-2">{domain}</span>
                          <button
                            onClick={() => handleDeleteDomain(domain)}
                            disabled={projectData.domainLoading}
                            className="text-gray-300 hover:text-white transition-colors"
                          >
                            {projectData.domainLoading ? (
                              <div className="w-3 h-3 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                            ) : (
                              <FaTimes className="text-xs" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>

                    {addingDomain ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newDomain}
                          onChange={(e) => setNewDomain(e.target.value)}
                          placeholder="example.com"
                          className="flex-1 p-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddDomain}
                          disabled={projectData.domainLoading}
                          className="bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-lg text-white font-medium transition-all flex items-center gap-1"
                        >
                          {projectData.domainLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                          ) : (
                            "Add"
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setAddingDomain(false);
                            setNewDomain("");
                          }}
                          className="bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded-lg text-white font-medium transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingDomain(true)}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 text-sm"
                      >
                        <FaPlus className="text-xs" /> Add domain
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-700/50 px-4 py-3 rounded-lg">
                    {editMode[item.field] ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="number"
                          value={item.field === "maxstorage" ? maxStorageMB : item.value}
                          onChange={(e) => {
                            if (item.field === "maxstorage") {
                              setMaxStorageMB(e.target.value);
                            } else {
                              handleInputChange(item.field, e.target.value);
                            }
                          }}
                          className="w-full sm:w-3/4 p-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(item.field)}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-70"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditMode((prev) => ({ ...prev, [item.field]: false }))}
                            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-white font-medium transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <p className="text-white text-sm sm:text-base">
                          {item.field === "maxstorage" ? `${item.value} MB` : item.value}
                        </p>
                        <button
                          onClick={() => setEditMode((prev) => ({ ...prev, [item.field]: true }))}
                          className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded-lg text-white font-medium transition-all text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 sm:pt-6 text-right">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center gap-2 justify-center sm:justify-start transition-all w-full sm:w-auto"
              >
                <FaTrash className="text-xs sm:text-sm" />
                Delete Project
              </button>
            </div>
          </div>
        )}

        
        {activeTab === "processing" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 sm:p-6 transition-all hover:border-blue-500/50">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="bg-green-900/20 p-3 rounded-lg w-16 h-16 sm:w-auto sm:h-auto">
                  <div className="bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto sm:mx-0">
                    <FaCogs className="text-green-400 text-lg" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-semibold text-white mb-1">File Processing Settings</h2>
                  <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                    Configure how files are processed after upload. These settings apply to videos only.
                  </p>
                  <div className="space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-700/50 p-4 rounded-lg gap-3">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-600/30 p-3 rounded-lg">
                          <FaCheck className="text-green-400 text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm sm:text-base">Auto-optimize files</h3>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1">
                            Automatically optimize files after upload for better performance and smaller file sizes.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer self-center sm:self-auto">
                        <input
                          type="checkbox"
                          checked={processingValues.areYouWantToOptimise}
                          onChange={() => handleUpdateProcessingSettings('areYouWantToOptimise')}
                          className="sr-only peer"
                          disabled={updatingProcessing === 'areYouWantToOptimise'}
                        />
                        <div className={`relative w-14 h-7 rounded-full transition duration-200 ${
                          processingValues.areYouWantToOptimise ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          {updatingProcessing === 'areYouWantToOptimise' ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <div
                              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transform transition duration-200 ${
                                processingValues.areYouWantToOptimise ? 'translate-x-7' : ''
                              }`}
                            ></div>
                          )}
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-300">
                          {processingValues.areYouWantToOptimise ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>

                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-700/50 p-4 rounded-lg gap-3">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-600/30 p-3 rounded-lg">
                          <FaEnvelope className="text-blue-400 text-lg" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm sm:text-base">Email notification after optimization</h3>
                          <p className="text-gray-400 text-xs sm:text-sm mt-1">
                            Receive email notifications when file optimization is complete.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer self-center sm:self-auto">
                        <input
                          type="checkbox"
                          checked={processingValues.wantToSendEmailNotificationOnAfterOptimisation}
                          onChange={() => handleUpdateProcessingSettings('wantToSendEmailNotificationOnAfterOptimisation')}
                          className="sr-only peer"
                          disabled={updatingProcessing === 'wantToSendEmailNotificationOnAfterOptimisation'}
                        />
                        <div className={`relative w-14 h-7 rounded-full transition duration-200 ${
                          processingValues.wantToSendEmailNotificationOnAfterOptimisation ? 'bg-blue-600' : 'bg-gray-600'
                        }`}>
                          {updatingProcessing === 'wantToSendEmailNotificationOnAfterOptimisation' ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            <div
                              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transform transition duration-200 ${
                                processingValues.wantToSendEmailNotificationOnAfterOptimisation ? 'translate-x-7' : ''
                              }`}
                            ></div>
                          )}
                        </div>
                        <span className="ml-3 text-xs sm:text-sm text-gray-300">
                          {processingValues.wantToSendEmailNotificationOnAfterOptimisation ? 'Enabled' : 'Disabled'}
                        </span>
                      </label>
                    </div>

                    
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                      <h4 className="text-blue-300 font-medium text-sm sm:text-base mb-2">How file processing works:</h4>
                      <ul className="text-gray-300 text-xs sm:text-sm space-y-1">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Files are automatically optimized in the background after upload</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Optimization reduces file size while maintaining quality</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Users can play files while they're being processed (unoptimized version)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400 mt-1">•</span>
                          <span>Once optimized, files load faster and use less bandwidth</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-gray-800 rounded-xl border border-red-500/30 w-full max-w-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4 sm:mb-6">
                <div className="bg-red-500/20 p-3 rounded-full w-12 h-12 sm:w-auto sm:h-auto">
                  <FaExclamationTriangle className="text-red-400 text-xl sm:text-2xl" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Delete Project</h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Are you sure you want to delete this project? This action cannot be undone and all associated files will
                    be permanently removed.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end mt-6 sm:mt-8">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium bg-gray-700 hover:bg-gray-600 transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium flex items-center gap-2 justify-center transition-all disabled:opacity-70 text-sm sm:text-base"
                >
                  {isDeleting ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </span>
                  ) : (
                    <>
                      <FaTrash className="text-xs sm:text-sm" />
                      Delete Project
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProjectSettings;