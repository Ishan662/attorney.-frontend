import { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from '../../context/AuthContext';

/**
 * Page Layout component that includes sidebar and main content area
 * @param {Object} user - User information to display in sidebar
 * @param {React.ReactNode} children - Content to display in the main area
 * @param {boolean} defaultExpanded - Whether the sidebar is expanded by default
 */
const PageLayout = ({ 
    children,
    defaultExpanded = true 
}) => {
    const [sidebarExpanded, setSidebarExpanded] = useState(defaultExpanded);
    
    // Handle sidebar toggle
    const handleSidebarToggle = (expanded) => {
        setSidebarExpanded(expanded);
    };

    const { currentUser, loading: authLoading } = useAuth();

    const user = {
        name: currentUser.fullName,
        email: currentUser.email,
        role:  currentUser.role.toLowerCase()
    };

    //     const user = {
    //     name: "nishagi jewantha",
    //     email: "jewanthadheerath@gmail.com",
    //     role:  "client"
    // }
    
    return (

        <div className="flex min-h-screen bg-white">
            <Sidebar 
                user={user}
                onToggle={handleSidebarToggle}
            />
            <div 
                className="flex-grow overflow-y-auto transition-all duration-300"
                style={{ 
                    marginLeft: sidebarExpanded ? '16rem' : '5rem' // 16rem = 256px (w-64), 5rem = 80px (w-20)
                }}
            >
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PageLayout;