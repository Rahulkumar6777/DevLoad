import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Copy, Trash2, Check, File, FileImage, FileVideo, Plus, X, FileAudio, Loader2, AlertCircle } from 'lucide-react';
import { fetchProjectData, addFile, removeFile } from '../store/slices/projectdataSlice';
import { useAuth } from '../context/AuthContext';
import { BaseUrl } from '../api/ApiUrl';


const SkeletonFileItem = () => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 animate-pulse">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="shrink-0 p-2 rounded-lg bg-gray-700/50 w-10 h-10"></div>
      <div className="min-w-0 flex-1">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="flex gap-2 shrink-0">
      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
    </div>
  </div>
);

const SkeletonPreview = () => (
  <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 sticky top-5 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-6 bg-gray-700 rounded w-1/4"></div>
      <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
    </div>
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gray-700/50 p-2 rounded-lg w-10 h-10"></div>
        <div className="min-w-0">
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mb-6">
        <div className="h-4 bg-gray-700 rounded w-1/5 mb-2"></div>
        <div className="bg-gray-900/30 rounded-lg p-3 h-16"></div>
      </div>
    </div>
    <div className="mb-6">
      <div className="h-48 bg-gray-900/30 rounded-xl border border-gray-700"></div>
      <div className="grid grid-cols-3 gap-2 my-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3 h-16"></div>
        ))}
      </div>
    </div>
    <div>
      <div className="h-4 bg-gray-700 rounded w-1/5 mb-2"></div>
      <div className="flex items-center gap-2">
        <div className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 h-10 flex-grow"></div>
        <div className="bg-gray-700 rounded-lg px-3 py-2 h-10 w-20"></div>
      </div>
    </div>
  </div>
);

const ProjectFiles = () => {
  const { id: projectId } = useParams();
  const { makeAuthenticatedRequest } = useAuth();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.projectdata[projectId]);
  const loading = project?.loading;
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mediaPlaying, setMediaPlaying] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deletingFileId, setDeletingFileId] = useState(null);

  
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!project?.fetchedOnce) {
      dispatch(fetchProjectData({ projectId, makeAuthenticatedRequest }));
    }
  }, [projectId, dispatch, makeAuthenticatedRequest]);

  useEffect(() => {
    if (project?.files?.length > 0 && isLargeScreen && !selectedFile) {
      setSelectedFile(project.files[0]);
    }
  }, [project?.files, selectedFile, isLargeScreen]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification('No file selected', 'error');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await makeAuthenticatedRequest(`${BaseUrl}/project/${projectId}/upload`, {
        method: 'POST',
        data: formData,
      });
      const uploadedFile = {
        filename: response.data.filename || file.name,
        publicurl: response.data.publicurl || response.data.publicUrl,
        downloadeurl: response.data.downloadeurl || response.data.downloadUrl,
        deleteurl: response.data.deleteurl || response.data.deleteUrl,
        filetype: response.data.filetype || response.data.fileType || getFileType(file.type),
        filesize: (response.data.filesize ),
        fileid: response.data.fileid || response.data.fileId,
        underProcessing: response.data.underProcessing || false,
      };
      dispatch(addFile({ projectId, file: uploadedFile }));
      setFile(null);
      setShowUpload(false);
      showNotification('File uploaded successfully!', 'success');
    } catch (err) {
      console.error('Upload failed:');
      console.error('Error response:');
      let errorMessage = 'Failed to upload file';
      if (err.response?.data) {
        errorMessage =
          err.response.data.error ||
          err.response.data.message ||
          err.message ||
          'Failed to upload file';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Unable to connect to server';
      } else {
        errorMessage = err.message || 'An unexpected error occurred';
      }
      showNotification(errorMessage, 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      setDeletingFileId(fileToDelete.fileid);
      await makeAuthenticatedRequest(fileToDelete.deleteurl, { method: 'DELETE' });
      dispatch(removeFile({ projectId, fileId: fileToDelete.fileid }));

      if (selectedFile?.fileid === fileToDelete.fileid) {
        setSelectedFile(null);
      }

      showNotification('File deleted successfully!', 'success');
    } catch (err) {
      console.error('Failed to delete:');
      showNotification(err.response?.data?.error || err.response?.data?.message || 'Failed to delete file', 'error');
    } finally {
      setDeletingFileId(null);
      setShowDeleteConfirm(false);
      setFileToDelete(null);
    }
  };

  const confirmDelete = (file) => {
    setFileToDelete(file);
    setShowDeleteConfirm(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    return 'other';
  };

  const getFileIcon = (filetype) => {
    switch (filetype) {
      case 'image':
        return <FileImage size={18} className="text-blue-400" />;
      case 'video':
        return <FileVideo size={18} className="text-purple-400" />;
      case 'audio':
        return <FileAudio size={18} className="text-pink-400" />;
      default:
        return <File size={18} className="text-gray-400" />;
    }
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showNotification('URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedUrl(null), 1500);
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="h-8 bg-gray-800 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded w-64"></div>
            </div>
            <div className="h-10 bg-gray-800 rounded-lg w-36"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-6 bg-gray-800 rounded w-24"></div>
                      <div className="flex-1 h-px bg-gray-700"></div>
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <SkeletonFileItem key={j} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {isLargeScreen && <SkeletonPreview />}
          </div>
        </div>
      </div>
    );
  }

  const files = project.files || [];
  const grouped = {
    images: files.filter((f) => f.filetype === 'image'),
    videos: files.filter((f) => f.filetype === 'video'),
    audios: files.filter((f) => f.filetype === 'audio'),
    others: files.filter((f) => !['image', 'video', 'audio'].includes(f.filetype)),
  };
  const totalFiles = files.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 relative">
      {notification.visible && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[1000] px-4 py-3 rounded-lg shadow-lg max-w-sm w-[90vw] sm:w-auto ${
            notification.type === 'success' 
              ? 'bg-green-500/90' 
              : notification.type === 'error' 
              ? 'bg-red-500/90' 
              : notification.type === 'warning'
              ? 'bg-yellow-500/90'
              : 'bg-blue-500/90'
          } text-white flex items-center justify-center text-center transition-all duration-300`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Project Files</h1>
            <p className="text-gray-400 mt-1">
              {totalFiles} file{totalFiles !== 1 ? 's' : ''} · Project ID:{' '}
              <span className="font-mono text-blue-400">{projectId}</span>
            </p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Plus size={18} />
            Upload File
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {totalFiles > 0 ? (
              <div className="space-y-4">
                {Object.entries(grouped).map(([type, files]) =>
                  files.length > 0 && (
                    <div key={type} className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-semibold text-white capitalize">
                          {type} <span className="text-gray-400">({files.length})</span>
                        </h2>
                        <div className="flex-1 h-px bg-gray-700"></div>
                      </div>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer ${
                              selectedFile?.fileid === file.fileid
                                ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-l-4 border-blue-500 shadow-lg'
                                : 'bg-gray-800/30 hover:bg-gray-700/40'
                            }`}
                            onClick={() => {
                              if (isLargeScreen) {
                                setSelectedFile(file);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className={`shrink-0 p-2 rounded-lg ${
                                  selectedFile?.fileid === file.fileid ? 'bg-white/10' : 'bg-gray-700/50'
                                }`}
                              >
                                {getFileIcon(file.filetype)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`font-medium truncate ${
                                      selectedFile?.fileid === file.fileid ? 'text-white' : 'text-gray-300'
                                    }`}
                                  >
                                    {file.filename}
                                  </div>
                                  {file.underProcessing && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                                      <Loader2 size={10} className="animate-spin" />
                                      Processing
                                    </span>
                                  )}
                                </div>
                                <div
                                  className={`text-xs flex gap-2 mt-1 ${
                                    selectedFile?.fileid === file.fileid ? 'text-blue-200' : 'text-gray-400'
                                  }`}
                                >
                                  <span>{file.filetype.toUpperCase()}</span>
                                  <span>·</span>
                                  <span>{(file.filesize / (1024 * 1024)).toFixed(2)} MB</span>
                                  {file.underProcessing && (
                                    <>
                                      <span>·</span>
                                      <span className="text-yellow-300">Optimizing...</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(file.publicurl);
                                }}
                                className={`p-1 ${
                                  selectedFile?.fileid === file.fileid
                                    ? 'text-blue-300 hover:text-white'
                                    : 'text-gray-400 hover:text-blue-400'
                                }`}
                                title="Copy URL"
                              >
                                {copiedUrl === file.publicurl ? (
                                  <Check size={18} className="text-green-400" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </button>
                              <a
                                href={file.downloadeurl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  if (file.underProcessing) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    showNotification('File is still processing. Download will be available soon!', 'warning');
                                  }
                                }}
                                className={`p-1 ${
                                  selectedFile?.fileid === file.fileid
                                    ? 'text-blue-300 hover:text-white'
                                    : 'text-gray-400 hover:text-green-400'
                                } ${file.underProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={file.underProcessing ? 'Download available after processing' : 'Download'}
                              >
                                <Download size={18} />
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDelete(file);
                                }}
                                disabled={deletingFileId === file.fileid}
                                className={`p-1 ${
                                  selectedFile?.fileid === file.fileid
                                    ? 'text-red-300 hover:text-white'
                                    : 'text-gray-400 hover:text-red-400'
                                } ${deletingFileId === file.fileid ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Delete"
                              >
                                {deletingFileId === file.fileid ? (
                                  <Loader2 size={18} className="animate-spin" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileImage size={28} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No files uploaded yet</h3>
                  <p className="text-gray-400 mb-6">Upload your first file to get started</p>
                  <button
                    onClick={() => setShowUpload(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all mx-auto"
                  >
                    <Plus size={18} />
                    Upload Files
                  </button>
                </div>
              </div>
            )}
          </div>

          
          {isLargeScreen && selectedFile && (
            <div>
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-5 sticky top-5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white">Preview</h2>
                  <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gray-700/50 p-2 rounded-lg">{getFileIcon(selectedFile.filetype)}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white truncate">{selectedFile.filename}</h3>
                        {selectedFile.underProcessing && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                            <Loader2 size={10} className="animate-spin" />
                            Processing
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <span>{selectedFile.filetype.toUpperCase()}</span>
                        <span>·</span>
                        <span>{(selectedFile.filesize / (1024 * 1024)).toFixed(2)} MB</span>
                        {selectedFile.underProcessing && (
                          <>
                            <span>·</span>
                            <span className="text-yellow-300">Optimizing...</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-2">File ID</div>
                    <div className="bg-gray-900/30 rounded-lg p-3 text-gray-300 text-sm font-mono break-all">
                      {selectedFile.fileid}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-center mb-4">
                    {selectedFile.filetype === 'image' ? (
                      <img
                        src={selectedFile.publicurl}
                        alt={selectedFile.filename}
                        className="max-w-full max-h-64 rounded-lg border border-white/20"
                      />
                    ) : selectedFile.filetype === 'video' ? (
                      <div>
                        {selectedFile.underProcessing ? (
                          <div className="flex flex-col items-center justify-center p-8 bg-gray-900/30 rounded-xl border border-yellow-500/50 w-full">
                            <Loader2 size={48} className="text-yellow-400 animate-spin mb-4" />
                            <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                              Video Processing
                            </h3>
                            <p className="text-gray-300 text-center mb-4">
                              This video is currently being optimized. But You can play via videoUrl.
                            </p>
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 w-full">
                              <p className="text-sm text-yellow-300 flex items-center gap-1 mb-2">
                                <AlertCircle size={16} />
                                <span className="font-semibold">Note:</span> After processing, video will have:
                              </p>
                              <ul className="text-sm text-gray-300 mt-2 space-y-1 pl-5">
                                <li className="list-disc">Better compression and faster loading</li>
                                <li className="list-disc">Improved playback performance</li>
                                <li className="list-disc">Refresh for see latest update</li>
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <video
                            key={selectedFile.publicurl}
                            src={selectedFile.publicurl}
                            controls
                            autoPlay={false}
                            className="max-w-full max-h-64 rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                            onPlay={() => setMediaPlaying(selectedFile.fileid)}
                            onPause={() => setMediaPlaying(null)}
                            onEnded={() => setMediaPlaying(null)}
                          />
                        )}
                      </div>
                    ) : selectedFile.filetype === 'audio' ? (
                      <div className="w-full">
                        <audio
                          src={selectedFile.publicurl}
                          controls
                          className="w-full"
                          onPlay={() => setMediaPlaying(selectedFile.fileid)}
                          onPause={() => setMediaPlaying(null)}
                          onEnded={() => setMediaPlaying(null)}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-900/30 rounded-xl border border-gray-700 flex items-center justify-center p-10">
                        <File size={48} className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <a
                      href={selectedFile.downloadeurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (selectedFile.underProcessing) {
                          e.preventDefault();
                          showNotification('Video is still processing. Download will be available soon!', 'warning');
                        }
                      }}
                      className={`bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 flex flex-col items-center justify-center transition-all ${
                        selectedFile.underProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Download size={20} className={`${selectedFile.underProcessing ? 'text-gray-500' : 'text-blue-400'} mb-1`} />
                      <span className="text-xs text-gray-300">
                        {selectedFile.underProcessing ? 'Processing...' : 'Download'}
                      </span>
                    </a>
                    <button
                      onClick={() => handleCopy(selectedFile.publicurl)}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg p-3 flex flex-col items-center justify-center transition-all"
                    >
                      {copiedUrl === selectedFile.publicurl ? (
                        <Check size={20} className="text-green-400 mb-1" />
                      ) : (
                        <Copy size={20} className="text-blue-400 mb-1" />
                      )}
                      <span className="text-xs text-gray-300">
                        {copiedUrl === selectedFile.publicurl ? 'Copied!' : 'Copy URL'}
                      </span>
                    </button>
                    <button
                      onClick={() => confirmDelete(selectedFile)}
                      disabled={deletingFileId === selectedFile.fileid}
                      className={`bg-gray-800 hover:bg-red-900/30 border border-gray-700 hover:border-red-500/50 rounded-lg p-3 flex flex-col items-center justify-center transition-all ${
                        deletingFileId === selectedFile.fileid ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {deletingFileId === selectedFile.fileid ? (
                        <div className="flex flex-col items-center">
                          <Loader2 size={20} className="text-red-400 mb-1 animate-spin" />
                          <span className="text-xs text-gray-300">Deleting...</span>
                        </div>
                      ) : (
                        <>
                          <Trash2 size={20} className="text-red-400 mb-1" />
                          <span className="text-xs text-gray-300">Delete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-2">Direct URL</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedFile.publicurl}
                      readOnly
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 w-full truncate"
                    />
                    <button
                      onClick={() => handleCopy(selectedFile.publicurl)}
                      className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-2 text-sm"
                    >
                      {copiedUrl === selectedFile.publicurl ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
      {showUpload && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Upload File</h3>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setFile(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <div
              className={`border-2 ${dragActive ? 'border-blue-500 border-dashed' : 'border-gray-700 border-dashed'} rounded-xl p-6 mb-6 transition-all cursor-pointer`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="text-center">
                <div className="bg-gray-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {file ? (
                    <FileImage size={28} className="text-blue-400" />
                  ) : (
                    <div className="bg-gray-700 border-2 border-dashed border-gray-600 rounded-full w-12 h-12 flex items-center justify-center">
                      <Plus size={24} className="text-gray-500" />
                    </div>
                  )}
                </div>
                {file ? (
                  <>
                    <p className="text-white font-medium truncate px-2">{file.name}</p>
                    <p className="text-gray-400 text-sm mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </>
                ) : (
                  <>
                    <p className="text-white font-medium mb-1">Drop files here</p>
                    <p className="text-gray-400 text-sm">or click to browse</p>
                    <p className="text-gray-500 text-xs mt-3">Supports JPG, PNG, GIF, MP4, PDF, and more</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowUpload(false);
                  setFile(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all ${
                  uploading || !file
                    ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-200 rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  'Upload File'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      
      {showDeleteConfirm && fileToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Confirm Delete</h3>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setFileToDelete(null);
                }}
                className="text-gray-400 hover:text-white"
                disabled={deletingFileId === fileToDelete.fileid}
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete <span className="font-semibold text-white">{fileToDelete.filename}</span>?
              </p>
              <p className="text-sm text-gray-400">
                This action cannot be undone. The file will be permanently removed.
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setFileToDelete(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                disabled={deletingFileId === fileToDelete.fileid}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deletingFileId === fileToDelete.fileid}
                className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 transition-all ${
                  deletingFileId === fileToDelete.fileid
                    ? 'bg-red-600 opacity-70 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deletingFileId === fileToDelete.fileid ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Permanently'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFiles;