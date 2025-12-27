import React, { useState, useEffect } from 'react';
import { Upload, Folder, Code, Lock, Zap, Package, Check, ArrowRight, Play, FileCode, Image, Film, Music, ChevronRight, Star } from 'lucide-react';
import { privateAppDomain } from '../components/PrivateAppDomain';

export const Home = () => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({ files: 0, projects: 0, users: 0 });

    useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        files: prev.files < 15420 ? prev.files + 147 : 15420,
        projects: prev.projects < 342 ? prev.projects + 3 : 342,
        users: prev.users < 128 ? prev.users + 1 : 128
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
