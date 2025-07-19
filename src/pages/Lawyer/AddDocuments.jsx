import React, { useState } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';

const LawyerAddDocuments = ({ isOpen, onClose, caseNumber, onSave }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('legal');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [nameError, setNameError] = useState('');

  if (!isOpen) return null;

  const documentTypes = [
    { value: 'legal', label: 'Legal Document' },
    { value: 'evidence', label: 'Evidence' },
    { value: 'court', label: 'Court Filing' },
    { value: 'contract', label: 'Contract' },
    { value: 'correspondence', label: 'Correspondence' },
    { value: 'other', label: 'Other' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    
    if (file) {
      setFileError('');
      // Auto-fill document name with file name (without extension)
      if (!documentName) {
        const fileName = file.name.split('.').slice(0, -1).join('.');
        setDocumentName(fileName);
      }
    }
  };

  const handleNameChange = (e) => {
    setDocumentName(e.target.value);
    if (e.target.value) {
      setNameError('');
    }
  };

  const validateForm = () => {
    let valid = true;

    if (!documentName.trim()) {
      setNameError('Document name is required');
      valid = false;
    }

    if (!selectedFile) {
      setFileError('Please select a file to upload');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsUploading(true);
      
      // Simulate file upload with timeout
      setTimeout(() => {
        const newDocument = {
          name: documentName,
          type: documentType,
          url: URL.createObjectURL(selectedFile),
          uploadDate: new Date().toISOString(),
          fileSize: (selectedFile.size / 1024).toFixed(2) + ' KB',
          fileName: selectedFile.name,
        };
        
        onSave(newDocument);
        setIsUploading(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Add Document</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <p className="text-sm text-gray-600 mb-4">
            Uploading document for Case: <span className="font-medium">{caseNumber}</span>
          </p>

          <div className="mb-4">
            <Input1
              type="text"
              label="Document Name"
              value={documentName}
              onChange={handleNameChange}
              placeholder="Enter document name"
              error={nameError}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, XLSX, JPG, PNG up to 10MB
                </p>
              </div>
            </div>
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
            {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
          </div>

          <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <Button2
              text="Cancel"
              onClick={onClose}
              disabled={isUploading}
            />
            <Button1
              type="submit"
              text={isUploading ? "Uploading..." : "Upload Document"}
              disabled={isUploading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LawyerAddDocuments;