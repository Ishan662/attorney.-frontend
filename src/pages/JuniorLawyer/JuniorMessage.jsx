import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPaperclip, FaSmile, FaMicrophone, FaPaperPlane, FaArrowLeft, FaBars, FaUsers } from "react-icons/fa";
import Sidebar from "../../components/layout/Sidebar";
import logo from '../../assets/images/icon.png';

const JuniorMessages = () => {
    const [selectedChat, setSelectedChat] = useState(1);
    const [messageInput, setMessageInput] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mainSidebarExpanded, setMainSidebarExpanded] = useState(true);

    const user = {
        name: 'nishagi jewantha',
        email: 'jewan...@gmail.com',
        role: 'junior',
    };

    // Mock chat data - First 3 are group chats
    const chatList = [
        {
            id: 1,
            name: "Case 0104",
            lastMessage: "Sujan: I'll review your case documents and get back to you by tomorrow.",
            time: "2:45 PM",
            unread: 3,
            avatar: logo,
            online: true,
            isGroup: true,
            members: [
                { name: "Sujan Darshana", role: "Senior Lawyer" },
                { name: "Priya Silva", role: "Junior Lawyer" },
                { name: "Nethsilu Marasinghe", role: "Client" }
            ]
        },
        {
            id: 2,
            name: "Property Case Group",
            lastMessage: "Priya Silva: The hearing has been scheduled for next week.",
            time: "1:30 PM",
            unread: 1,
            avatar: logo,
            online: false,
            isGroup: true,
            members: [
                { name: "Dappula De Livera", role: "Senior Lawyer" },
                { name: "Kamal Perera", role: "Junior Lawyer" },
                { name: "Nethsilu Marasinghe", role: "Client" }
            ]
        },
        {
            id: 3,
            name: "Contract Team",
            lastMessage: "Kamal: Please send the additional evidence we discussed.",
            time: "11:15 AM",
            unread: 2,
            avatar: logo,
            online: true,
            isGroup: true,
            members: [
                { name: "Saman Fernando", role: "Senior Lawyer" },
                { name: "Manju Wickramasinghe", role: "Junior Lawyer" },
                { name: "Nethsilu Marasinghe", role: "Client" }
            ]
        },
        {
            id: 4,
            name: "Saman Fernando",
            lastMessage: "Thank you for the payment confirmation.",
            time: "Yesterday",
            unread: 0,
            avatar:  logo,
            online: false,
            isGroup: false
        },
        {
            id: 5,
            name: "Nimal Rajapaksa",
            lastMessage: "The case has been postponed to next month.",
            time: "Yesterday",
            unread: 0,
            avatar: logo ,
            online: false,
            isGroup: false
        },
        {
            id: 6,
            name: "Kapila Gamage",
            lastMessage: "I will check this",
            time: "Yesterday",
            unread: 0,
            avatar: logo ,
            online: false,
            isGroup: false
        },
        {
            id: 7,
            name: "Dappula De Livera",
            lastMessage: "Good",
            time: "Yesterday",
            unread: 0,
            avatar:  logo ,
            online: false,
            isGroup: false
        },
        {
            id: 8,
            name: "Manju Wickramasinghe",
            lastMessage: "Done",
            time: "Yesterday",
            unread: 0,
            avatar: logo ,
            online: false,
            isGroup: false
        },
    ];

    // Mock messages for selected chat - Case 0104 group messages
    const messages = [
        {
            id: 1,
            sender: "Sujan Darshana",
            content: "Hello everyone, I've received Nethsilu's case documents. Let me review them and I'll get back to you shortly.",
            time: "2:30 PM",
            isOwn: false,
            role: "Senior Lawyer"
        },
        {
            id: 2,
            sender: "You",
            content: "Thank you for the quick response. I'm particularly concerned about the property dispute clause.",
            time: "2:32 PM",
            isOwn: true,
            role: "Client"
        },
        {
            id: 3,
            sender: "Priya Silva",
            content: "I can assist with the research on similar property dispute cases. Let me compile some precedents.",
            time: "2:33 PM",
            isOwn: false,
            role: "Client"
        },
        {
            id: 4,
            sender: "Sujan Darshana",
            content: "Excellent, Priya. That would be very helpful. Nethsilu, based on my initial review, we have a strong case.",
            time: "2:35 PM",
            isOwn: false,
            role: "Senior Lawyer"
        },
        {
            id: 5,
            sender: "You",
            content: "That's reassuring to hear. What are the next steps we should take?",
            time: "2:36 PM",
            isOwn: true,
            role: "Client"
        },
        {
            id: 6,
            sender: "Priya Silva",
            content: "I've found 3 similar cases with favorable outcomes. Sharing the documents now.",
            time: "2:38 PM",
            isOwn: false,
            role: "Client"
        },
        {
            id: 7,
            sender: "Sujan Darshana",
            content: "Perfect timing, Priya. I'll prepare a detailed analysis and strategy document. We'll also need to gather some additional evidence to strengthen our position.",
            time: "2:40 PM",
            isOwn: false,
            role: "Senior Lawyer"
        },
        {
            id: 8,
            sender: "Sujan Darshana",
            content: "I'll review your case documents and get back to you by tomorrow with a comprehensive plan.",
            time: "2:45 PM",
            isOwn: false,
            role: "Senior Lawyer"
        }
    ];

    const selectedChatData = chatList.find(chat => chat.id === selectedChat);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            // Here you would typically send the message to your backend
            console.log("Sending message:", messageInput);
            setMessageInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex">
            {/* Main Navigation Sidebar */}
            <Sidebar
                user={user}
                defaultExpanded={mainSidebarExpanded}
                onToggle={setMainSidebarExpanded}
            />

            {/* Chat Application */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${mainSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header Bar */}
                <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="text-gray-600 hover:text-gray-800 transition-colors lg:hidden"
                        >
                            <FaBars size={20} />
                        </button>
                        {/* <h1 className="text-2xl font-bold text-gray-800">Messages</h1> */}
                    </div>
                    {/* <div className="flex items-center space-x-3">
                        //<span className="text-sm text-gray-600">Welcome, {user.name}</span>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                        </div>
                    </div> */}
                </div>

                {/* Chat Container */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Chat List - Left Sidebar */}
                    <div className={`${sidebarCollapsed ? 'w-0' : 'w-80'} lg:w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
                        {/* Search Bar */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto">
                            {chatList.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => {
                                        setSelectedChat(chat.id);
                                        setSidebarCollapsed(true); // Auto-collapse on mobile
                                    }}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <img
                                                src={chat.avatar}
                                                alt={chat.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            {chat.isGroup && (
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black-500 rounded-full flex items-center justify-center">
                                                    <FaUsers size={10} className="text-white" />
                                                </div>
                                            )}
                                            {!chat.isGroup && chat.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                                                    {chat.isGroup && (
                                                        <p className="text-xs text-gray-500">
                                                            {chat.members.map(member => member.name.split(' ')[0]).join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <div className="bg-black-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area - Right Side */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        {selectedChatData ? (
                            <>
                                {/* Chat Header */}
                                <div className="bg-white p-4 border-b border-gray-200 flex items-center space-x-4 shadow-sm">
                                    <button
                                        onClick={() => setSidebarCollapsed(false)}
                                        className="text-gray-600 hover:text-gray-800 transition-colors lg:hidden"
                                    >
                                        <FaBars size={20} />
                                    </button>
                                    <div className="relative">
                                        <img
                                            src={selectedChatData.avatar}
                                            alt={selectedChatData.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        {selectedChatData.isGroup && (
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-black-500 rounded-full flex items-center justify-center">
                                                <FaUsers size={10} className="text-white" />
                                            </div>
                                        )}
                                        {!selectedChatData.isGroup && selectedChatData.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{selectedChatData.name}</h3>
                                        {selectedChatData.isGroup ? (
                                            <p className="text-sm text-gray-500">
                                                {selectedChatData.members.length} members: {selectedChatData.members.map(member => member.name.split(' ')[0]).join(', ')}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-500">
                                                {selectedChatData.online ? 'Online' : 'Last seen recently'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${message.isOwn
                                                        ? 'bg-gray-400 text-white'
                                                        : 'bg-white text-gray-900 border border-gray-200'
                                                    }`}
                                            >
                                                {!message.isOwn && selectedChatData.isGroup && (
                                                    <p className={`text-xs font-medium mb-1 ${message.role === 'Senior Lawyer' ? 'text-blue-600' :
                                                            message.role === 'Client' ? 'text-green-600' :
                                                                'text-gray-600'
                                                        }`}>
                                                        {message.sender} • {message.role}
                                                    </p>
                                                )}
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                <p
                                                    className={`text-xs mt-2 ${message.isOwn ? 'text-blue-100' : 'text-gray-500'
                                                        }`}
                                                >
                                                    {message.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <div className="bg-white p-4 border-t border-gray-200">
                                    <div className="flex items-end space-x-3">
                                        <button className="text-gray-500 hover:text-gray-700 transition-colors p-2">
                                            <FaPaperclip size={20} />
                                        </button>
                                        <div className="flex-1 relative">
                                            <textarea
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder="Type a message..."
                                                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="1"
                                                style={{ minHeight: '48px', maxHeight: '120px' }}
                                            />
                                        </div>
                                        <button className="text-gray-500 hover:text-gray-700 transition-colors p-2">
                                            <FaSmile size={20} />
                                        </button>
                                        <button className="text-gray-500 hover:text-gray-700 transition-colors p-2">
                                            <FaMicrophone size={20} />
                                        </button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className={`p-3 rounded-full transition-colors ${messageInput.trim()
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                        >
                                            <FaPaperPlane size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaSearch size={32} className="text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                                    <p className="text-sm">Choose a lawyer from the list to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JuniorMessages;
