import React, { useState } from 'react';
import Input1 from '../UI/Input1'; // Adjust path to your UI components
import Button1 from '../UI/Button1';
// import { AppRole } from '../../constants/roles'; // We will create this constants file

const InviteUserForm = ({ roleToInvite, caseId, onInvite, isSubmitting }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.fullName.trim()) tempErrors.fullName = 'Full name is required.';
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            tempErrors.email = 'Email address is invalid.';
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // The component calls the onInvite function passed down from its parent,
            // sending the form data and the pre-determined role/caseId.
            onInvite({
                email: formData.email,
                fullName: formData.fullName,
                role: roleToInvite,
                caseId: caseId || null, // Pass caseId if it exists
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Invite New {roleToInvite === "JUNIOR" ? 'Junior' : 'Client'}</h3>
            <Input1
                name="fullName"
                label="Full Name"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                required
            />
            <Input1
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
            />
            <Button1
                type="submit"
                text={isSubmitting ? "Sending..." : `Send Invitation`}
                className="w-full"
                disabled={isSubmitting}
            />
        </form>
    );
};

export default InviteUserForm;