# 🚀 DevLoad - Developer-First File Storage Platform

![DevLoad Banner](https://via.placeholder.com/1200x300/1a2332/3b82f6?text=DevLoad+-+Simple+File+Storage+for+Developers)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> A modern, scalable file storage solution built with Node.js, MinIO, and React. Designed for developers who need simple, reliable file hosting without the complexity of traditional cloud storage.

**🌐 Live Demo:** [https://devload.cloudcoderhub.in](https://devload.cloudcoderhub.in)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

DevLoad is a **full-stack file storage platform** that provides developers with a simple REST API to upload, manage, and serve files. Built as a learning project to explore modern cloud storage architecture, it demonstrates scalable design patterns and industry-standard technologies.

### 🎓 Learning Goals

This project was built to gain hands-on experience with:
- ✅ Object storage with MinIO (S3-compatible)
- ✅ Asynchronous task processing with BullMQ
- ✅ RESTful API design and authentication
- ✅ React + Vite for modern frontend development
- ✅ State management with Redux Toolkit
- ✅ Media processing with FFmpeg
- ✅ Production deployment and DevOps

---

## ✨ Features

### Core Functionality
- 📤 **File Upload & Management** - Upload files via REST API with drag-and-drop support
- 🗂️ **Project-Based Organization** - Organize files by projects with separate API keys
- 🔐 **Secure Authentication** - JWT-based auth with API key management
- 🌐 **Public URL Access** - Direct HTTP access to uploaded files
- 🎨 **Media Processing** - Automatic thumbnail generation and video processing
- ⚡ **Async Processing** - Background job queue for heavy operations

### Developer Features
- 📚 **SDKs Available** - NPM packages for Node.js, React, and vanilla JS
- 🔑 **Multiple API Keys** - Up to 2 API keys per project
- 📊 **Usage Analytics** - Track storage, bandwidth, and request counts
- 🎛️ **Dashboard** - User-friendly interface for file management
- 🔒 **Domain Restrictions** - Optional CORS-like domain whitelisting

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v16+) with Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Storage:** MinIO (S3-compatible object storage)
- **Queue:** BullMQ with Redis
- **Media Processing:** FFmpeg
- **Authentication:** JWT + bcrypt

### Frontend
- **Framework:** React 18 with Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **UI Components:** Framer Motion, React Icons, Lucide React
- **Code Display:** React Syntax Highlighter

### DevOps & Deployment
- **Reverse Proxy:** Nginx
- **Process Manager:** PM2
- **Containerization:** Docker (for MinIO)
- **VPS Hosting:** Self-hosted on Linux VPS

---

## 🏗️ Architecture

```
┌─────────────────┐
│   React App     │  (Frontend - Vite)
│   (Port 5173)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Nginx         │  (Reverse Proxy)
│   (Port 80/443) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐       ┌─────────────────┐
│   Express API   │◄─────►│   MongoDB       │
│   (Port 3000)   │       │   (Database)    │
└────────┬────────┘       └─────────────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│   BullMQ        │  │   MinIO         │
│   (Redis Queue) │  │   (S3 Storage)  │
└─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│   FFmpeg        │  (Media Processing)
└─────────────────┘
```

### Data Flow

1. **Upload Request** → Express API validates auth
2. **File Storage** → Uploaded to MinIO bucket
3. **Job Queue** → Heavy operations (thumbnails, video processing) queued in BullMQ
4. **Processing** → Background workers process jobs with FFmpeg
5. **Database** → Metadata stored in MongoDB
6. **Public Access** → Files served via public MinIO URLs

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Redis (for BullMQ)
- MinIO (Docker or standalone)
- FFmpeg (for media processing)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/devload.git
cd devload
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Set up MinIO with Docker**
```bash
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin123" \
  -v ./data:/data \
  minio/minio server /data --console-address ":9001"
```

5. **Configure environment variables**
```bash
# Backend .env
cp .env.example .env
# Edit .env with your configuration
```

6. **Start Redis**
```bash
redis-server
```

7. **Run the application**
```bash
# Backend (Port 3000)
cd backend
npm run dev

# Frontend (Port 5173)
cd frontend
npm run dev
```

---

## 📡 API Documentation

### Authentication

All API requests require an API key in the header:
```
Authorization: Bearer YOUR_API_KEY
```

### Endpoints

#### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

{
  "projectId": "your-project-id",
  "file": <binary>
}
```

#### Delete File
```http
DELETE /api/files/:filename
Authorization: Bearer YOUR_API_KEY
```

#### List Files
```http
GET /api/files?projectId=your-project-id
Authorization: Bearer YOUR_API_KEY
```

### SDKs

**Node.js**
```bash
npm install devload
```

**React**
```bash
npm install devload-sdk
```

**Vanilla JS**
```html
<script src="https://api-devload.cloudcoderhub.in/devload.js"></script>
```

---

## 📁 Project Structure

```
devload/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Auth & validation
│   │   ├── services/        # Business logic
│   │   │   ├── minio.js     # MinIO integration
│   │   │   ├── queue.js     # BullMQ setup
│   │   │   └── ffmpeg.js    # Media processing
│   │   ├── workers/         # Background jobs
│   │   └── config/          # Configuration
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store
│   │   ├── services/        # API services
│   │   └── App.jsx
│   ├── public/
│   └── package.json
│
├── nginx/
│   └── devload.conf         # Nginx configuration
│
├── docker-compose.yml       # MinIO + Redis setup
└── README.md
```

---

## 🔐 Environment Variables

### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/devload

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=devload-files
MINIO_USE_SSL=false

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# App
PUBLIC_URL=https://devload.cloudcoderhub.in
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=DevLoad
```

---

## 🎨 Key Features Implementation

### MinIO Integration
```javascript
const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

// Upload to MinIO
await minioClient.putObject(
  bucketName,
  objectName,
  fileStream,
  fileSize,
  metadata
);
```

### BullMQ Job Queue
```javascript
const { Queue, Worker } = require('bullmq');

// Create queue
const imageQueue = new Queue('image-processing', {
  connection: redisConnection
});

// Add job
await imageQueue.add('thumbnail', {
  fileId,
  filePath,
  options
});

// Process jobs
const worker = new Worker('image-processing', async job => {
  // Process with FFmpeg
  await generateThumbnail(job.data);
});
```

---

## 🤝 Contributing

This is a learning project, but contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Learning Outcomes

Building DevLoad helped me learn:

- ✅ **Cloud Storage Patterns** - Understanding S3-compatible storage architecture
- ✅ **Async Processing** - Implementing background jobs with Redis queues
- ✅ **API Design** - RESTful principles and authentication strategies
- ✅ **State Management** - Redux Toolkit for complex frontend state
- ✅ **Media Processing** - FFmpeg integration for thumbnails and video processing
- ✅ **Deployment** - VPS setup, Nginx configuration, and process management
- ✅ **Security** - JWT authentication, input validation, and CORS handling

---

## ⚠️ Disclaimer

**This is a learning/portfolio project, not a production-ready service.**

- ❌ No SLA or uptime guarantees
- ❌ No data backup or recovery
- ❌ Not intended for commercial use
- ✅ Built for learning and demonstration purposes
- ✅ Use at your own risk

For production applications, consider enterprise solutions like AWS S3, Google Cloud Storage, or Cloudinary.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**Rahul Kumar** - Backend, DevOps & Architecture
- GitHub: [@Rahulkumar6777](https://github.com/Rahulkumar6777)
- LinkedIn: [Rahul Kumar](https://www.linkedin.com/in/rahul-kumar-003aa2316)

**Junaid Quamar** - Frontend & UI/UX
- GitHub: [@junaidqamar](https://github.com/junaidqamar)
- LinkedIn: [Junaid Quamar](https://www.linkedin.com/in/junaidqamar12)

---

## 🙏 Acknowledgments

- MinIO for S3-compatible object storage
- BullMQ for reliable job queues
- The open-source community for amazing tools

---

## 📧 Contact

For questions or feedback, reach out at:
- Email: support@devload.cloudcoderhub.in
- Website: [devload.cloudcoderhub.in](https://devload.cloudcoderhub.in)

---

<div align="center">

**⭐ If this project helped you learn something, consider giving it a star!**

Made with ❤️ by developers, for developers

</div>