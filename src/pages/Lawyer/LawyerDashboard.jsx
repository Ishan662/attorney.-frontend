// >> In your existing file, e.g., pages/Lawyer/Dashboard.jsx
import React, { useState } from 'react';
import InviteUserForm from '../../components/forms/InviteUserForm';
// import { AppRole } from '../../constants/roles'; // It's good practice to use the constants file

// --- ▼▼▼ THIS IS CHANGE #1: Import the real service function ▼▼▼ ---
import { sendInvitation } from '../../services/invitationService';
// --- ▲▲▲ THIS IS CHANGE #1: Import the real service function ▲▲▲ ---

const LawyerDashboard = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inviteError, setInviteError] = useState('');

    const handleInviteSubmit = async (invitationData) => {
        setIsSubmitting(true);
        setInviteError('');
        try {
            console.log("Sending invitation data to backend:", invitationData);
            
            // --- ▼▼▼ THIS IS CHANGE #2: Call the real function ▼▼▼ ---
            // This now makes the actual POST request to your /api/invitations endpoint.
            await sendInvitation(invitationData);
            // --- ▲▲▲ THIS IS CHANGE #2: Call the real function ▲▲▲ ---
            
            alert(`Invitation sent successfully to ${invitationData.email}!`);
            
        } catch (error) {
            console.error("Failed to send invitation:", error);
            // Set the error state so it can be displayed to the user
            setInviteError(error.message || 'An error occurred while sending the invitation.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Lawyer Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Your other dashboard components would go here */}
                <div>
                    <p>Your main dashboard content...</p>
                </div>

                {/* The invitation forms section */}
                <div className="space-y-8">
                    {/* Form to invite a Junior */}
                    <InviteUserForm
                        roleToInvite="JUNIOR" // Using the constant is cleaner
                        onInvite={handleInviteSubmit}
                        isSubmitting={isSubmitting}
                    />
                    
                    {/* Form to invite a Client */}
                    {/* As noted, this would typically be on a Case Details page */}
                    <div className="p-4 border border-dashed rounded-lg mt-4">
                        <p className="text-sm text-gray-600 mb-2">Example: Invite a Client to a specific case (this form would normally be on a case page).</p>
                        <InviteUserForm
                            roleToInvite="CLIENT"
                            // This caseId MUST be a real UUID from one of your cases in the database
                            // for the backend validation to pass.
                            caseId="your-actual-case-uuid-from-db" 
                            onInvite={handleInviteSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>

                    {/* Display any error message from the API call */}
                    {inviteError && <p className="text-red-500 mt-4 font-semibold">{inviteError}</p>}
                </div>
            </div>
        </div>
    );
};

export default LawyerDashboard;