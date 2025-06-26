import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable button component
 * @param {string} text - Button text
 * @param {string} to - Link destination (for internal routing)
 * @param {string} href - External URL (takes precedence over 'to')
 * @param {function} onClick - Click handler function
 * @param {string} className - Additional CSS classes
 * @param {boolean} inverted - Whether to use inverted style (white text on black background)
 * @param {any} children - Button content (overrides text if provided)
 * @param {object} props - Additional props to pass to the button
 */

//switch to black text on white background using the inverted = { false} prop.

const Button1 = ({
    text = "Button",
    to,
    href,
    onClick,
    className = "",
    inverted = true,
    children,
    ...props
}) => {
    const buttonClasses = `
    font-bold text-md py-2 px-4 rounded-md transition-all duration-200
    ${inverted
            ? 'bg-black text-white hover:bg-gray-800 active:bg-gray-900'
            : 'bg-white text-black hover:bg-gray-100 active:bg-gray-200'} 
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

export default Button1;


// // Basic usage with text
// <Button1 text="See Prices" />

// // As a link to internal route
// <Button1 text="See Prices" to="/pricing" />

// // As a link to external URL
// <Button1 text="See Prices" href="https://example.com/pricing" />

// // With onClick handler
// <Button1 text="See Prices" onClick={() => console.log('Button clicked')} />

// // With inverted colors (white on black is the default)
// <Button1 text="See Prices" inverted={false} />

// // With additional classes
// <Button1 text="See Prices" className="w-full mt-4" />

// // With children instead of text
// <Button1>
//   See Prices <span className="ml-2">→</span>
// </Button1>