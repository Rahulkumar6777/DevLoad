import React, { useState, useEffect } from 'react';
import { Upload, Folder, Code, Lock, Zap, Package, Check, ArrowRight, Play, FileCode, Image, Film, Music, ChevronRight, Star } from 'lucide-react';
import { privateAppDomain } from '../components/PrivateAppDomain';

export const Home = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({ files: 0, projects: 0, users: 0 });
