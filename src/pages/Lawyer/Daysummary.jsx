import { useState, useEffect } from "react";
import PageLayout from "../../components/layout/PageLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button1 from "../../components/UI/Button1";
import Button2 from "../../components/UI/Button2";

const DaySummary = () => {
    const user = {
        name: 'Thusitha',
        email: 'jeewanthadeherath@gmail.com',
    };

    const [notificationCount, setNotificationCount] = useState(1);
    const [currentDate, setCurrentDate] = useState('');
    
    useEffect(() => {
        // Format date like YYYY/MM/DD
        const today = new Date();
        const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;
        setCurrentDate(formattedDate);
    }, []);
    
    // Handle notification click
    const handleNotificationClick = () => {
        console.log('Notifications clicked from Day Summary page');
    };

    // Sample summary data
    const summaryCards = [
        {
            title: "Clients reached",
            value: "05",
            additionalInfo: "Total Clients - 456"
        },
        {
            title: "On going cases",
            value: "05",
            additionalInfo: ""
        },
        {
            title: "Closed cases",
            value: "05",
            additionalInfo: "Remaining - 6"
        },
        {
            title: "Income",
            value: "65655",
            additionalInfo: "Total for month - 678066"
        }
    ];

    // Sample clients data
    const clientsData = {
        reached: [
            { name: "Kamal", phone: "0713424333" },
            { name: "Sunil", phone: "0784453661" },
            { name: "Nimal", phone: "0784453545" }
        ],
        newCases: [
            { name: "Kamal", phone: "0713424333" },
            { name: "Sunil", phone: "0784453661" },
            { name: "Nimal", phone: "0784453545" }
        ],
        closedCases: [
            { name: "Kamal", phone: "0713424333" },
            { name: "Sunil", phone: "0784453661" },
            { name: "Nimal", phone: "0784453545" }
        ]
    };

    // Sample unread messages
    const unreadMessages = [
        {
            location: "Galle",
            client: "Kumara",
            description: "i want to request a meeting with you to discuss my case"
        },
        {
            location: "Galle",
            client: "Kumara",
            description: "how the progress of my case is going?"
        }
    ];

    return (
        <PageLayout user={user}>
            {/* PageHeader component */}
            <div className="mb-8">
                <PageHeader 
                    user={user} 
                    notificationCount={notificationCount}
                    onNotificationClick={handleNotificationClick}
                />
            </div>
            
            {/* Day Summary specific header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Day Summary</h1>
                    <p className="text-gray-600">Today is - {currentDate}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" >
                {summaryCards.map((card, index) => (
                    <div 
                        key={index} 
                        className="bg-white rounded-lg shadow-sm p-4 hover:shadow-lg transition-shadow duration-300 border border-gray-300"
                    >
                        <div className="text-center">
                            <div className="font-black text-xl mb-2">{card.title}</div>
                            <div className="text-2xl font-bold">{card.value}</div>
                            {card.additionalInfo && (
                                <div className="text-xs text-gray-600 mt-2">{card.additionalInfo}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Client Categories */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Clients Reached */}
                    <div>
                        <h3 className="font-black text-lg mb-3">Clients reached</h3>
                        <div className="space-y-2">
                            {clientsData.reached.map((client, index) => (
                                <div key={`reached-${index}`} className="pl-2">
                                    <div className="font-medium">Galle</div>
                                    <div className="text-sm">Kamal - {client.phone}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* New Cases */}
                    <div>
                        <h3 className="font-black text-lg mb-3">New Cases</h3>
                        <div className="space-y-2">
                            {clientsData.newCases.map((client, index) => (
                                <div key={`new-${index}`} className="pl-2">
                                    <div className="font-medium">Galle</div>
                                    <div className="text-sm">Kamal - {client.phone}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Closed Cases */}
                    <div>
                        <h3 className="font-black text-lg mb-3">Closed Cases</h3>
                        <div className="space-y-2">
                            {clientsData.closedCases.map((client, index) => (
                                <div key={`closed-${index}`} className="pl-2">
                                    <div className="font-medium">Galle</div>
                                    <div className="text-sm">Kamal - {client.phone}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Unread Messages */}
            <div className="mb-8">
                <h2 className="text-xl font-black mb-4">Unread Message</h2>
                <div className="space-y-4">
                    {unreadMessages.map((message, index) => (
                        <div key={index} className="bg-white rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div>
                                    <div className="text-sm text-gray-500">Location</div>
                                    <div className="font-medium">- {message.location}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Client</div>
                                    <div className="font-medium">- {message.client}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Description</div>
                                    <div className="font-medium">- {message.description}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex justify-between mt-8">
                <Button1
                    text="View All Messages" 
                    className="text-sm py-2 px-4"
                    to = "/lawyer/messages"
                />
            </div>
        </PageLayout>
    );
};

export default DaySummary;