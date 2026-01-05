import React, { useState } from 'react';
import { FaNodeJs, FaReact, FaJs } from 'react-icons/fa';
import { SiNextdotjs } from 'react-icons/si';
import { FiCopy, FiCheck } from 'react-icons/fi';

const SDKSelector = ({ selectedSDK, setSelectedSDK }) => {
  const sdks = [
    { id: 'node', name: 'Node.js', icon: <FaNodeJs className="text-green-500 text-3xl" /> },
    { id: 'react', name: 'React', icon: <FaReact className="text-blue-400 text-3xl" /> },
    { id: 'javascript', name: 'javascript', icon: <FaJs className="text-yellow-400 text-3xl" /> },
    { id: 'next', name: 'Next.js', icon: <SiNextdotjs className="text-red-400 text-3xl" /> }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Choose Your SDK:</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {sdks.map((sdk) => (
          <button
            key={sdk.id}
            onClick={() => setSelectedSDK(sdk.id)}
            className={`p-3 sm:p-4 rounded-lg flex flex-col items-center transition-all shadow-lg border border-gray-700 hover:shadow-xl ${
              selectedSDK === sdk.id ? 'bg-gray-200 text-black' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {sdk.icon}
            <span className="text-xs sm:text-sm font-medium mt-2">{sdk.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-800 p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm text-gray-100">
      <pre className="whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 sm:p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
      >
        {copied ? <FiCheck className="text-green-400" /> : <FiCopy className="text-white" />}
      </button>
    </div>
  );
};

const ProjectDetails = () => {
  const [selectedSDK, setSelectedSDK] = useState('node');

  const sdkExamples = {
    node: {
      install: 'npm i devload',
      upload: `const DevLoad = require('devload');

(async () => {
  const devload = new DevLoad('your-api-key-here');
  const projectid = 'your-projectid'; 
  const filePath = './path/to/your/file.jpg'; 

  try {
    const uploadResult = await devload.uploadFile(projectid, filePath);
    console.log('File uploaded:', uploadResult);
  } catch (error) {
    console.error('Something went wrong:', error);
  }
})();`,
      delete: `const DevLoad = require('devload');

(async () => {
  const devload = new DevLoad('your-api-key-here');
  const fileid = 'your-fileid';

  try {
    const deleteResult = await devload.deleteFile(fileid);
    console.log('File deleted:', deleteResult);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
})();`
    },

    react: {
      install: 'npm install devload-sdk',
      upload: `import { useState } from 'react';
import DevLoad from 'devload-sdk';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const devload = new DevLoad('your-api-key-here');
  const projectid = 'your-projectid';

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const response = await devload.uploadFile(projectid, file);
      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}`,
      delete: `async function handleDeleteFile(fileid) {
  const devload = new DevLoad('your-api-key-here');

  try {
    const response = await devload.deleteFile(fileid);
    console.log('File deleted:', response);
  } catch (error) {
    console.error('Delete failed:', error);
  }
}`
    },

    javascript: {
      install: '<script src="https://api-devload.cloudcoderhub.in/devload.js"></script>',
      upload: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DevLoad Upload</title>
  <script src="https://api-devload.cloudcoderhub.in/devload.js"></script>
</head>
<body>
  <h2>Upload File</h2>
  <input type="file" id="fileInput" />
  <button onclick="uploadFile()">Upload</button>
  <p id="status"></p>

  <script>
    const devload = new DevLoad('your-api-key-here');
    const projectid = 'your-projectid';

    async function uploadFile() {
      const file = document.getElementById('fileInput').files[0];
      const status = document.getElementById('status');
      if (!file) {
        status.textContent = 'No file selected!';
        return;
      }

      try {
        status.textContent = 'Uploading...';
        const response = await devload.uploadFile(projectid, file);
        console.log(response);
        status.textContent = 'Upload successful!';
      } catch (error) {
        console.error(error);
        status.textContent = 'Error during upload!';
      }
    }
  </script>
</body>
</html>`,
      delete: `<script>
  const devload = new DevLoad('your-api-key-here');
  async function deleteExampleFile() {
    try {
      const result = await devload.deleteFile('your-fileid');
      console.log('Delete successful:', result);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }
</script>`
    },

    next: {
      install: 'npm install devload-sdk',
      upload: `import { useState } from 'react';
import DevLoad from 'devload-sdk';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const devload = new DevLoad('your-api-key-here');
  const projectid = 'your-projectid';

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    try {
      const response = await devload.uploadFile(projectid, file);
      console.log('Upload successful:', response);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}`,
      delete: `async function handleDeleteFile(fileid) {
  const devload = new DevLoad('your-api-key-here');

  try {
    const response = await devload.deleteFile(fileid);
    console.log('File deleted:', response);
  } catch (error) {
    console.error('Delete failed:', error);
  }
}`
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-4rem)] w-full">
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 sm:px-6 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">🚀 DevLoad Integration Guide</h1>
        <SDKSelector selectedSDK={selectedSDK} setSelectedSDK={setSelectedSDK} />
        <div className="space-y-4 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Installation</h3>
            <CodeBlock code={sdkExamples[selectedSDK].install} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">File Upload</h3>
            {sdkExamples[selectedSDK].upload && <CodeBlock code={sdkExamples[selectedSDK].upload} />}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">File Deletion</h3>
            {sdkExamples[selectedSDK].delete && <CodeBlock code={sdkExamples[selectedSDK].delete} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;