import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FileUploadComponent = () => {
  const { projectId } = useParams();
  const { makeAuthenticatedRequest } = useAuth();
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; 

  const handleFiles = useCallback((selectedFiles) => {
    setError('');
    const validFiles = Array.from(selectedFiles).filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" exceeds 10MB limit.`);
        return false;
      }
      return true;
    });

    setFiles((prevFiles) => [
      ...prevFiles,
      ...validFiles.map((file) => ({
        file,
        status: 'Pending',
        progress: 0,
      })),
    ]);
  }, []);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!projectId) {
      setError('Project ID is missing.');
      return;
    }

    if (files.length === 0) {
      setError('No files selected.');
      return;
    }

    setIsUploading(true);
    setError('');

    const uploadPromises = files.map(async (fileObj, index) => {
      if (fileObj.status !== 'Pending') return;

      const formData = new FormData();
      formData.append('file', fileObj.file);

      try {
        setFiles((prevFiles) =>
          prevFiles.map((f, i) =>
            i === index ? { ...f, status: 'Uploading', progress: 50 } : f
          )
        );

        const response = await makeAuthenticatedRequest(
          `http://localhost:8000/api/upload/${projectId}`,
          {
            method: 'POST',
            data: formData,
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setFiles((prevFiles) =>
                prevFiles.map((f, i) =>
                  i === index ? { ...f, progress } : f
                )
              );
            },
          }
        );

        setFiles((prevFiles) =>
          prevFiles.map((f, i) =>
            i === index ? { ...f, status: 'Success', progress: 100 } : f
          )
        );
        return response.data;
      } catch (error) {
        setFiles((prevFiles) =>
          prevFiles.map((f, i) =>
            i === index ? { ...f, status: 'Failed', progress: 0 } : f
          )
        );
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      setError('Some files failed to upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-800/70 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-4">Upload Files</h2>
      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center transition-all duration-200 ${
          dragActive ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-input"
          className="cursor-pointer text-gray-400 hover:text-indigo-400 transition-all duration-200"
        >
          <span className="text-lg">Drag & drop files here, or click to select</span>
        </label>
      </div>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      {files.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Selected Files:</h3>
          <ul className="space-y-3">
            {files.map((fileObj, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg shadow-sm"
              >
                <div className="flex-1">
                  <span className="text-gray-300">{fileObj.file.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({(fileObj.file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-sm ${
                      fileObj.status === 'Success'
                        ? 'text-green-500'
                        : fileObj.status === 'Failed'
                        ? 'text-red-500'
                        : fileObj.status === 'Uploading'
                        ? 'text-yellow-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {fileObj.status}
                    {fileObj.status === 'Uploading' && ` (${fileObj.progress}%)`}
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-400 hover:text-red-600 transition-all duration-200"
                    disabled={isUploading}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={isUploading || files.length === 0}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload Files'}
      </button>
    </div>
  );
};

export default FileUploadComponent;