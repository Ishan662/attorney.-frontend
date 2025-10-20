import React from "react";
import PageLayout from "../../components/layout/PageLayout";

const JuniorHearings = () => {
    const user = {
        name: 'Sujan Darshana',
        email: 'sujan@example.com',
        role: 'junior_lawyer'
    };

    return (
        <PageLayout user={user}>
            {/* Page Title */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upcoming Hearings</h1>
                    <p className="text-gray-600 mt-1">Hearing management section</p>
                </div>
            </div>

            {/* Empty State */}
            <div className="bg-white rounded-lg shadow-md p-8">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
                    <p className="text-gray-600">This section has been removed.</p>
                </div>
            </div>
        </PageLayout>
    );
};

export default JuniorHearings;
