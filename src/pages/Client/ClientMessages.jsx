import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPaperclip, FaSmile, FaMicrophone, FaPaperPlane, FaArrowLeft, FaBars } from "react-icons/fa";
import Sidebar from "../../components/layout/Sidebar";

const ClientMessages = () => {
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState(1);
    const [messageInput, setMessageInput] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mainSidebarExpanded, setMainSidebarExpanded] = useState(true);

    const user = {
        name: 'Nethsilu Marasinghe',
        email: 'kasuntharamarasinghe.com',
        role: 'client',
    };

    // Mock chat data
    const chatList = [
        {
            id: 1,
            name: "Nadun",
            lastMessage: "I'll review your case documents and get back to you by tomorrow.",
            time: "2:45 PM",
            unread: 2,
            avatar: "https://via.placeholder.com/40/4F46E5/white?text=N",
            online: true
        },
        {
            id: 2,
            name: "Priya Silva",
            lastMessage: "The hearing has been scheduled for next week.",
            time: "1:30 PM",
            unread: 0,
            avatar: "https://via.placeholder.com/40/059669/white?text=P",
            online: false
        },
        {
            id: 3,
            name: "Kamal Perera",
            lastMessage: "Please send the additional evidence we discussed.",
            time: "11:15 AM",
            unread: 1,
            avatar: "https://via.placeholder.com/40/DC2626/white?text=K",
            online: true
        },
        {
            id: 4,
            name: "Saman Fernando",
            lastMessage: "Thank you for the payment confirmation.",
            time: "Yesterday",
            unread: 0,
            avatar: "https://via.placeholder.com/40/7C3AED/white?text=S",
            online: false
        },
        {
            id: 5,
            name: "Nimal Rajapaksa ",
            lastMessage: "The case has been postponed to next month.",
            time: "Yesterday",
            unread: 0,
            avatar: "https://via.placeholder.com/40/EA580C/white?text=NR",
            online: false
        },
        {
            id: 6,
            name: "Kapila Gamage ",
            lastMessage: "I wiil check this",
            time: "Yesterday",
            unread: 0,
            avatar: "https://via.placeholder.com/40/EA580C/white?text=NR",
            online: false
        },
        {
            id: 7,
            name: "Dappula De Livera ",
            lastMessage: "Good",
            time: "Yesterday",
            unread: 0,
            avatar: "https://via.placeholder.com/40/EA580C/white?text=NR",
            online: false
        },
        {
            id: 8,
            name: "Manju Wickramasinghe ",
            lastMessage: "Done",
            time: "Yesterday",
            unread: 0,
            avatar: "https://via.placeholder.com/40/EA580C/white?text=NR",
            online: false
        },
    ];

    // Mock messages for selected chat
    const messages = [
        {
            id: 1,
            sender: "Nadun",
            content: "Hello Nethsilu, I've received your case documents. Let me review them and I'll get back to you shortly.",
            time: "2:30 PM",
            isOwn: false
        },
        {
            id: 2,
            sender: "You",
            content: "Thank you for the quick response. I'm particularly concerned about the property dispute clause.",
            time: "2:32 PM",
            isOwn: true
        },
        {
            id: 3,
            sender: "Nadun",
            content: "I understand your concern. The property dispute clause is indeed complex. Based on my initial review, we have a strong case.",
            time: "2:35 PM",
            isOwn: false
        },
        {
            id: 4,
            sender: "You",
            content: "That's reassuring to hear. What are the next steps we should take?",
            time: "2:36 PM",
            isOwn: true
        },
        {
            id: 5,
            sender: "Nadun",
            content: "I'll prepare a detailed analysis and strategy document. We'll also need to gather some additional evidence to strengthen our position.",
            time: "2:40 PM",
            isOwn: false
        },
        {
            id: 6,
            sender: "Nadun",
            content: "I'll review your case documents and get back to you by tomorrow.",
            time: "2:45 PM",
            isOwn: false
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
                        <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {user.name.charAt(0)}
                        </div>
                    </div>
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
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <img
                                                src={chat.avatar}
                                                alt={chat.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            {chat.online && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.time}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                                        </div>
                                        {chat.unread > 0 && (
                                            <div className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
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
                                        {selectedChatData.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{selectedChatData.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedChatData.online ? 'Online' : 'Last seen recently'}
                                        </p>
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
                                                className={`max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                                                    message.isOwn
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-900 border border-gray-200'
                                                }`}
                                            >
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                <p
                                                    className={`text-xs mt-2 ${
                                                        message.isOwn ? 'text-blue-100' : 'text-gray-500'
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
                                            className={`p-3 rounded-full transition-colors ${
                                                messageInput.trim()
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

export default ClientMessages;
