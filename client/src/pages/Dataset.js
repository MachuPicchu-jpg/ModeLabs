import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  Upload, 
  Database, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Download,
  ExternalLink,
  Trash2
} from 'lucide-react';

const ALLOWED_EXTENSIONS = ['.json', '.jsonl', '.csv', '.xlsx', '.yaml', '.yml', '.tsv'];
const MAX_FILE_SIZE = 2048 * 1024 * 1024; // 100MB
const API_BASE_URL = 'http://localhost:3001'; // 添加后端API基础URL

// Helper function to get file extension
const getFileExtension = (filename) => {
  if (!filename) return '';
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex > -1 ? filename.slice(lastDotIndex + 1).toUpperCase() : '';
};

// Format file size for display
const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const CATEGORIES = {
  'Large Language Models': ['Language Understanding', 'Mathematics', 'Coding', 'Reasoning'],
  'Multimodal Models': ['Image Recognition', 'Audio Processing', 'Text Understanding', 'Integration']
};

const Dataset = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDescription, setFileDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('All');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('Large Language Models');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Language Understanding');
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch datasets from Firebase
  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/datasets`);
      if (!response.ok) {
        throw new Error('Failed to fetch datasets');
      }
      const datasetsData = await response.json();

      setDatasets(datasetsData);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDatasets();
  }, []);
  
  useEffect(() => {
    setSelectedSubCategoryFilter('All');
  }, [selectedMainCategory]);

  // Filter datasets based on search and category
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           dataset.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMainCategory = selectedMainCategory === 'All' || dataset.category === selectedMainCategory;
    const matchesSubCategory = selectedSubCategoryFilter === 'All' || dataset.subCategory === selectedSubCategoryFilter;
    console.log('Dataset:', dataset.name);
    console.log('matchesSearch:', matchesSearch);
    console.log('matchesMainCategory:', matchesMainCategory);
    console.log('matchesSubCategory:', matchesSubCategory);
    return matchesSearch && matchesMainCategory && matchesSubCategory;
  });

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      // Validate file extension
      if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
        setUploadStatus({
          type: 'error',
          message: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadStatus({
          type: 'error',
          message: 'File size must be less than 1MB due to Firestore limitations'
        });
        return;
      }

      setSelectedFile(file);
      setShowDescriptionInput(true); // Show the description input
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
  
    setIsUploading(true);
    setUploadStatus(null);
    setUploadProgress(0);
  
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', selectedFile.name);
      formData.append('description', fileDescription);
      formData.append('userId', user.uid);
      formData.append('userEmail', user.email);
      formData.append('category', selectedCategory);
      formData.append('subCategory', selectedSubCategory);
      formData.append('type', 'text');
      formData.append('visibility', 'public');
      formData.append('status', 'pending');
      formData.append('size', selectedFile.size.toString());

      console.log('Uploading to:', `${API_BASE_URL}/api/datasets/upload`);
      console.log('Form data:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        category: selectedCategory,
        subCategory: selectedSubCategory
      });

      const response = await fetch(`${API_BASE_URL}/api/datasets/upload`, {
        method: 'POST',
        body: formData,
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.error || 'Upload failed');
        } catch (parseError) {
          console.error('Response parsing error:', parseError);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      try {
        const result = JSON.parse(responseText);
        setUploadStatus({
          type: 'success',
          message: 'Dataset uploaded successfully!'
        });
        setSelectedFile(null);
        setFileDescription('');
        setShowDescriptionInput(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        await fetchDatasets(); // 重新获取数据集列表
      } catch (parseError) {
        console.error('Success response parsing error:', parseError);
        throw new Error('Invalid server response format');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: error.message || 'Failed to upload dataset'
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (datasetId) => {
    console.log('Deleting dataset:', datasetId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/datasets/${datasetId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete dataset');
      }
      
      setDatasets(datasets.filter(dataset => dataset.id !== datasetId));
    } catch (error) {
      console.error('Error deleting dataset:', error);
    }
  };

  const handleDownload = async (dataset) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/datasets/download/${dataset.id}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = dataset.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      // 刷新数据集列表以获取更新的下载计数
      await fetchDatasets();
    } catch (error) {
      console.error('Error downloading dataset:', error);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Model Evaluation Datasets
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive datasets for evaluating language models
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Upload New Dataset</h3>
              <p className="text-gray-600 text-sm">
                Share your dataset with the community. Maximum file size: 1GB
              </p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept=".json,.jsonl,.csv,.yaml,.yml,.tsv,.jsv"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
              >
                Select File
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  !selectedFile || isUploading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description Input */}
          {showDescriptionInput && (
            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter a description for the dataset"
              />
            </div>
          )}

          {/* Category and Sub-Category Selection */}
          {showDescriptionInput && (
            <>
              <div className="mt-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {Object.keys(CATEGORIES).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
                  Sub-Category
                </label>
                <select
                  id="subCategory"
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {CATEGORIES[selectedCategory].map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Selected File Info */}
          {selectedFile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round(selectedFile.size / 1024)} KB)
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setShowDescriptionInput(false); // Hide the description input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Status */}
          {uploadStatus && (
            <div className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
              uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {uploadStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search datasets..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.keys(CATEGORIES).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border rounded-lg bg-white"
            value={selectedSubCategoryFilter}
            onChange={(e) => setSelectedSubCategoryFilter(e.target.value)}
          >
            <option value="All">All Sub-Categories</option>
            {selectedMainCategory !== 'All' && CATEGORIES[selectedMainCategory].map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading datasets...</p>
          </div>
        ) : (
          /* Datasets Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDatasets.map((dataset) => (
              <div
                key={dataset.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {dataset.name}
                    </h3>
                  </div>
                  <Database className="text-blue-500" />
                </div>
                
                <p className="text-gray-600 mb-4">
                  {dataset.description || 'No description provided'}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                  <div>Size: {formatFileSize(dataset.size)}</div>
                  <div>Format: {getFileExtension(dataset.name)}</div>
                  <div>Updated: {dataset.updatedAt ? new Date(dataset.updatedAt).toLocaleDateString() : 'N/A'}</div>
                  <div>Downloads: {dataset.downloads || 0}</div>
                  <div className="col-span-2 flex flex-wrap gap-2 mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      {dataset.category}
                    </span>
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                      {dataset.subCategory}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 truncate" title={dataset.userEmail}>
                    Uploaded by: {dataset.userEmail}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDownload(dataset)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Download dataset"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    {dataset.userId === user?.uid && (
                      <button 
                        onClick={() => handleDelete(dataset.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete dataset"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && filteredDatasets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No datasets found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dataset;