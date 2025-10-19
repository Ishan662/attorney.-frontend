/**
 * Case Details Service - Handles specialized case type details
 * Manages divorce case specific data and other future specialized case types
 */

import { authenticatedFetch } from './authService';

// ==============================================================================
// DIVORCE CASE SPECIFIC FUNCTIONALITY
// ==============================================================================

/**
 * Divorce grounds options - matches backend enum
 */
export const DIVORCE_GROUNDS = {
    ADULTERY: 'Adultery',
    MALICIOUS_DESERTION: 'Malicious Desertion',
    INCURABLE_IMPOTENCY: 'Incurable Impotency',
    CRUELTY: 'Cruelty',
    LUNACY: 'Lunacy',
    VOLUNTARY_SEPARATION: 'Voluntary Separation (7+ years)',
    JUDICIAL_SEPARATION: 'Judicial Separation (2+ years)'
};

/**
 * Default document checklist for divorce cases
 */
export const DIVORCE_DOCUMENT_CHECKLIST = {
    'Marriage Certificate': 'PENDING',
    'Birth Certificates of Children': 'PENDING',
    'Proxy': 'PENDING',
    'Evidence of Grounds': 'PENDING',
    'Financial Statements': 'PENDING',
    'Property Deeds': 'PENDING'
};

/**
 * Document status options
 */
export const DOCUMENT_STATUS = {
    PENDING: 'Pending',
    SUBMITTED: 'Submitted'
};

// ==============================================================================
// DATA VALIDATION & TRANSFORMATION
// ==============================================================================

/**
 * Validates divorce case additional details before submission
 */
export const validateDivorceDetails = (divorceData) => {
    const errors = [];
    
    if (!divorceData.grounds) {
        errors.push('Grounds for divorce is required');
    }
    
    if (!divorceData.marriageDate) {
        errors.push('Marriage date is required');
    }
    
    // Validate marriage date is not in the future
    if (divorceData.marriageDate && new Date(divorceData.marriageDate) > new Date()) {
        errors.push('Marriage date cannot be in the future');
    }
    
    // Validate children data if provided
    if (divorceData.children && divorceData.children.length > 0) {
        divorceData.children.forEach((child, index) => {
            if (!child.fullName || !child.fullName.trim()) {
                errors.push(`Child ${index + 1}: Full name is required`);
            }
            if (!child.dateOfBirth) {
                errors.push(`Child ${index + 1}: Date of birth is required`);
            }
            if (child.dateOfBirth && new Date(child.dateOfBirth) > new Date()) {
                errors.push(`Child ${index + 1}: Date of birth cannot be in the future`);
            }
        });
    }
    
    return errors;
};

/**
 * Transforms frontend divorce form data to backend format
 */
export const transformDivorceDataForAPI = (formData) => {
    const divorceDetails = {
        grounds: formData.grounds,
        marriageDate: formData.marriageDate,
        children: formData.children || [],
        documentChecklist: formData.documentChecklist || DIVORCE_DOCUMENT_CHECKLIST
    };
    
    // Add co-respondent name if grounds is adultery
    if (formData.grounds === 'ADULTERY' && formData.coRespondentName) {
        divorceDetails.coRespondentName = formData.coRespondentName;
    }
    
    return divorceDetails;
};

/**
 * Transforms backend divorce data to frontend display format
 */
export const transformDivorceDataFromAPI = (additionalDetails) => {
    if (!additionalDetails) return null;
    
    return {
        grounds: additionalDetails.grounds,
        groundsLabel: DIVORCE_GROUNDS[additionalDetails.grounds] || additionalDetails.grounds,
        marriageDate: additionalDetails.marriageDate,
        coRespondentName: additionalDetails.coRespondentName || null,
        children: additionalDetails.children || [],
        documentChecklist: additionalDetails.documentChecklist || DIVORCE_DOCUMENT_CHECKLIST
    };
};

// ==============================================================================
// CASE TYPE DETECTION & UTILITIES
// ==============================================================================

/**
 * Checks if a case type is a divorce case
 */
export const isDivorceCase = (caseType) => {
    return caseType && caseType.includes('D/DDV');
};

/**
 * Checks if a case has specialized additional details
 */
export const hasAdditionalDetails = (caseData) => {
    return caseData && caseData.additionalDetails && Object.keys(caseData.additionalDetails).length > 0;
};

/**
 * Gets the specialized case type from the case data
 */
export const getSpecializedCaseType = (caseData) => {
    if (!caseData || !caseData.caseType) return null;
    
    if (isDivorceCase(caseData.caseType)) {
        return 'DIVORCE';
    }
    
    // Future case types can be added here
    // if (isPropertyCase(caseData.caseType)) return 'PROPERTY';
    // if (isCriminalCase(caseData.caseType)) return 'CRIMINAL';
    
    return null;
};

// ==============================================================================
// FORM DATA HELPERS
// ==============================================================================

/**
 * Creates an empty divorce form data structure
 */
export const createEmptyDivorceForm = () => ({
    grounds: '',
    marriageDate: '',
    coRespondentName: '',
    children: []
});

/**
 * Creates an empty child data structure
 */
export const createEmptyChild = () => ({
    fullName: '',
    dateOfBirth: ''
});

/**
 * Formats date for display (YYYY-MM-DD to readable format)
 */
export const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Not specified';
    
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        return dateString;
    }
};

/**
 * Calculates age from date of birth
 */
export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    try {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    } catch (error) {
        return null;
    }
};

// ==============================================================================
// DOCUMENT CHECKLIST HELPERS
// ==============================================================================

/**
 * Gets the CSS class for document status display
 */
export const getDocumentStatusClass = (status) => {
    switch (status) {
        case 'SUBMITTED':
            return 'text-blue-600 bg-blue-100';
        case 'PENDING':
        default:
            return 'text-yellow-600 bg-yellow-100';
    }
};

/**
 * Counts document checklist status summary
 */
export const getDocumentStatusSummary = (documentChecklist) => {
    if (!documentChecklist) return { total: 0, pending: 0, submitted: 0 };
    
    const entries = Object.entries(documentChecklist);
    const summary = {
        total: entries.length,
        pending: 0,
        submitted: 0
    };
    
    entries.forEach(([_, status]) => {
        switch (status) {
            case 'PENDING':
                summary.pending++;
                break;
            case 'SUBMITTED':
                summary.submitted++;
                break;
        }
    });
    
    return summary;
};

// ==============================================================================
// EXPORTS
// ==============================================================================

const caseDetailsService = {
    // Divorce specific
    DIVORCE_GROUNDS,
    DIVORCE_DOCUMENT_CHECKLIST,
    DOCUMENT_STATUS,
    validateDivorceDetails,
    transformDivorceDataForAPI,
    transformDivorceDataFromAPI,
    
    // Case type utilities
    isDivorceCase,
    hasAdditionalDetails,
    getSpecializedCaseType,
    
    // Form helpers
    createEmptyDivorceForm,
    createEmptyChild,
    formatDateForDisplay,
    calculateAge,
    
    // Document helpers
    getDocumentStatusClass,
    getDocumentStatusSummary
};

export default caseDetailsService;
