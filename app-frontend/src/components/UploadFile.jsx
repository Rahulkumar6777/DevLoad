import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, UploadCloud } from 'lucide-react';
import api from '../api';

const UploadFile = ({ onClose, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState({
    userSubscribe: '',
    maxfilesize: 150 
  });

 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get('/user/home');
        setUserData({
          userSubscribe: res.data.userSubscribe || '',
          maxfilesize: res.data.maxfilesize || 150
        });
      } catch (error) {
        console.error('Error fetching user data:');
        setError('Failed to fetch file size limit');
      }
    };
    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

  

    
    const allowedTypes = [
  
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/tiff',
  'image/svg+xml',
 
  'video/mp4',
  'video/mpeg',
  'video/quicktime', 
  'video/x-msvideo', 
  'video/webm',
  'video/x-matroska', 
  'video/ogg',
  // Audio formats
  'audio/mp3', 
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/flac',
  'audio/x-ms-wma' 
];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Only PNG, JPEG, MP4, MP3, WAV, and GIF files are allowed.');
      return;
    }

   
    const fileSizeMB = selectedFile.size / (1024 * 1024);

    
    if (userData.userSubscribe !== 'member' && fileSizeMB > 150) {
      setError('File size exceeds 150MB limit for free users');
      return;
    }

    setError('');
    setSuccess('');
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://api.devload.cloudcoderhub.in/api/v1/user/upload', formData, {
        withCredentials: true,
      });

      setSuccess(response.data.message || 'File uploaded successfully');
      onUploadSuccess(); 
      setFile(null); 
      setTimeout(() => onClose(), 1500); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload file. Please try again.';
      setError(errorMessage);
      console.error('Error uploading file:');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-60 z-50">
      <div className="bg-gray-900/50 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 hover:scale-105">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-700 transition-colors duration-200"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-red-700">
          Upload Your File
        </h2>

        
        <p className="text-sm text-gray-300 mb-4 text-center">
          Your file size limit: {userData.userSubscribe === 'member' ? 'Unlimited' : `${userData.maxfilesize}MB`}
        </p>

        
        <div
          className={`border-2 border-dashed p-8 rounded-lg text-center transition-all duration-300 ${
            dragActive
              ? 'border-red-500 bg-red-50'
              : 'border-gray-400 hover:border-red-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadCloud className="mx-auto text-red-500 mb-3" size={48} />
          <p className="text-sm font-medium text-white">
            Drag & Drop your file here
          </p>
          <p className="text-xs text-gray-300 mt-1">or click to select a file</p>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="fileInput"
            accept="image/png,image/jpeg,video/mp4,audio/mp3,audio/wav,image/gif"
          />
          <label
            htmlFor="fileInput"
            className="block mt-4 cursor-pointer text-sm font-semibold text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            Browse Files
          </label>
        </div>

        
        {file && (
          <div className="mt-5 p-4 border border-gray-300 rounded-lg bg-white text-gray-800 flex justify-between items-center">
            <span className="truncate w-3/4 font-medium">{file.name}</span>
            <span className="text-xs text-gray-600">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
        )}

        
        {success && (
          <p className="text-green-500 text-sm mt-3 font-medium">{success}</p>
        )}

        
        {error && (
          <p className="text-red-700 text-sm mt-3 font-medium">{error}</p>
        )}

        
        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white px-5 py-2.5 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className={`flex-1 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
              uploading || !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
            }`}
            disabled={uploading || !file}
          >
            {uploading ? 'Uploading...' : 'Upload Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;