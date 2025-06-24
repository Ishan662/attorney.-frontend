import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Secondary button component with gray background
 * @param {string} text - Button text
 * @param {string} to - Link destination (for internal routing)
 * @param {string} href - External URL (takes precedence over 'to')
 * @param {function} onClick - Click handler function
 * @param {string} className - Additional CSS classes
 * @param {any} children - Button content (overrides text if provided)
 * @param {object} props - Additional props to pass to the button
 */
const Button2 = ({
    text = "Button",
    to,
    href,
    onClick,
    className = "",
    children,
    ...props
}) => {
    const buttonClasses = `
    font-medium text-lg py-3 px-6 rounded-full transition-all duration-200
    bg-gray-100 text-black hover:bg-gray-200 active:bg-gray-300
    ${className}
  `;

    // Render as external link
    if (href) {
        return (
            <a
                href={href}
                className={buttonClasses}
                onClick={onClick}
                {...props}
            >
                {children || text}
            </a>
        );
    }

    // Render as internal router link
    if (to) {
        return (
            <Link
                to={to}
                className={buttonClasses}
                onClick={onClick}
                {...props}
            >
                {children || text}
            </Link>
        );
    }

    // Render as button
    return (
        <button
            className={buttonClasses}
            onClick={onClick}
            {...props}
        >
            {children || text}
        </button>
    );
};

export default Button2;