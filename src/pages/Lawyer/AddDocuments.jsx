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