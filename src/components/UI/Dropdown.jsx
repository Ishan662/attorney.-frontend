import React, { useState, useRef, useEffect } from 'react';

/**
 * Reusable dropdown component
 * @param {string} label - Label text for the dropdown
 * @param {string} placeholder - Placeholder text when no option is selected
 * @param {Array} options - Array of option objects: [{ value: 'option1', label: 'Option 1', disabled: false }]
 * @param {string|number} value - Currently selected value
 * @param {function} onChange - Change handler function (receives selected option object)
 * @param {string} className - Additional CSS classes for the container
 * @param {string} variant - Dropdown style variant: 'default' or 'outlined'
 * @param {boolean} required - Whether the dropdown is required
 * @param {boolean} disabled - Whether the dropdown is disabled
 * @param {string} error - Error message (optional)
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} searchable - Whether the dropdown is searchable
 * @param {object} props - Additional props
 */
const Dropdown = ({
    label = '',
    placeholder = 'Select an option',
    options = [],
    value = '',
    onChange,
    className = '',
    variant = 'default',
    required = false,
    disabled = false,
    error = '',
    size = 'md',
    searchable = false,
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Find selected option
    const selectedOption = options.find(option => option.value === value) || null;

    // Filter options based on search term
    const filteredOptions = searchable 
        ? options.filter(option => 
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : options;

    // Size classes
    const sizeClasses = {
        sm: 'text-sm py-2 px-4',
        md: 'text-lg py-3 px-6',
        lg: 'text-xl py-4 px-8'
    };

    // Base classes for the dropdown button
    const baseClasses = `w-full rounded-full transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-between ${sizeClasses[size]}`;

    // Variant-specific classes
    let variantClasses = '';
    if (variant === 'default') {
        variantClasses = 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-200';
    } else if (variant === 'outlined') {
        variantClasses = 'bg-white border-2 border-gray-300 text-gray-800 hover:border-gray-400 focus:border-black';
    }

    // Combined classes for the dropdown button
    const dropdownClasses = `${baseClasses} ${variantClasses} ${className} ${
        error ? 'border-red-500 focus:ring-red-200' : ''
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle option selection
    const handleOptionSelect = (option) => {
        if (option.disabled) return;
        
        onChange && onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    };

    // Handle dropdown toggle
    const toggleDropdown = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
        if (searchable && !isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        }
    };

    return (
        <div className={`relative w-full mb-4 ${className}`} ref={dropdownRef}>
            {/* Label */}
            {label && (
                <label className="block text-gray-700 text-sm font-medium mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Dropdown Button */}
            <div
                className={dropdownClasses}
                onClick={toggleDropdown}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                {...props}
            >
                <span className={selectedOption ? 'text-gray-800' : 'text-gray-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                
                {/* Dropdown Arrow */}
                <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {/* Search Input */}
                    {searchable && (
                        <div className="p-2 border-b border-gray-200">
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                placeholder="Search options..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                        </div>
                    )}

                    {/* Options List */}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option.value || index}
                                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                                    option.disabled
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-gray-800 hover:bg-gray-100'
                                } ${
                                    selectedOption?.value === option.value
                                        ? 'bg-gray-50 font-medium'
                                        : ''
                                }`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                            {searchable && searchTerm ? 'No options found' : 'No options available'}
                        </div>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Dropdown;

/* Usage Examples:

// Basic dropdown
<Dropdown
    options={[
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' }
    ]}
    value={selectedValue}
    onChange={(option) => setSelectedValue(option.value)}
/>

// With label and placeholder
<Dropdown
    label="Select a Category"
    placeholder="Choose category..."
    options={categories}
    value={selectedCategory}
    onChange={(option) => setSelectedCategory(option.value)}
    required
/>

// Outlined variant with error
<Dropdown
    variant="outlined"
    label="Legal Practice Area"
    options={practiceAreas}
    value={selectedArea}
    onChange={(option) => setSelectedArea(option.value)}
    error="Please select a practice area"
/>

// Searchable dropdown
<Dropdown
    label="Select Country"
    options={countries}
    value={selectedCountry}
    onChange={(option) => setSelectedCountry(option.value)}
    searchable
    placeholder="Search and select country..."
/>

// Small size with disabled options
<Dropdown
    size="sm"
    options={[
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending', disabled: true }
    ]}
    value={status}
    onChange={(option) => setStatus(option.value)}
/>

// Disabled dropdown
<Dropdown
    options={options}
    value={value}
    onChange={onChange}
    disabled
    placeholder="Not available"
/>

*/
