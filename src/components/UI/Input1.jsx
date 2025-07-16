import React from 'react';

/**
 * Reusable input component
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} name - Input name
 * @param {string} id - Input id
 * @param {string} value - Input value
 * @param {function} onChange - Change handler function
 * @param {string} placeholder - Input placeholder
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Input style variant: 'default' or 'outlined'
 * @param {boolean} required - Whether the input is required
 * @param {string} label - Label text (optional)
 * @param {string} error - Error message (optional)
 * @param {object} props - Additional props to pass to the input
 */
const Input1 = ({
    type = 'text',
    name,
    id,
    value,
    onChange,
    placeholder = 'Enter phone number or email',
    className = '',
    variant = 'default',
    required = false,
    label = '',
    error = '',
    ...props
}) => {
    // Base classes for all inputs
    const baseClasses = 'w-full text-md py-3 px-4 rounded-full transition-all duration-200 focus:outline-none';

    // Variant-specific classes
    let variantClasses = '';
    if (variant === 'default') {
        variantClasses = 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-gray-200';
    } else if (variant === 'outlined') {
        variantClasses = 'bg-white border-2 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-black';
    }

    // Combined classes
    const inputClasses = `${baseClasses} ${variantClasses} ${className} ${error ? 'border-red-500 focus:ring-red-200' : ''}`;

    return (
        <div className="w-full mb-4">
            {label && (
                <label
                    htmlFor={id || name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <input
                type={type}
                name={name}
                id={id || name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={inputClasses}
                required={required}
                {...props}
            />

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default Input1;