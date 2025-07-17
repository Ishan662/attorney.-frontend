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