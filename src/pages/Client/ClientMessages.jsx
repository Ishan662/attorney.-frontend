import { useState, useEffect, useRef } from "react";
import { FaSearch, FaPaperclip, FaSmile, FaMicrophone, FaPaperPlane, FaBars, FaUsers } from "react-icons/fa";
import PageLayout from "../../components/layout/PageLayout";
import logo from '../../assets/images/icon.png';

import { db, auth } from "../../services/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ClientMessages = () => {
    // --- STATE ---
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [messageInput, setMessageInput] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const messagesEndRef = useRef(null);

    // --- GET CURRENT USER ---
        // --- GET CURRENT USER ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    const response = await fetch('http://localhost:8080/api/auth/session', {
                        headers: { 
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const profile = await response.json();
                        console.log('API Response:', profile); 
                        setCurrentUser({
                            uid: user.uid,
                            userId: profile.id,
                            name: profile.fullname
                        });
                    } else {
                        console.error('Failed to fetch user profile:', response.status);
                        setCurrentUser(null);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setCurrentUser(null);
                }
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // --- FETCH CHAT LIST FROM BACKEND ---
    useEffect(() => {
        if (!currentUser) return;

        const fetchChatList = async () => {
            try {
                const token = await auth.currentUser.getIdToken();
                const response = await fetch('http://localhost:8080/api/cases/my-chats', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!response.ok) throw new Error("Failed to fetch chats");

                const data = await response.json();
                setChatList(data);
            } catch (err) {
                console.error("Error fetching chat list:", err);
            } finally {
                setIsLoadingChats(false);
            }
        };

        fetchChatList();
    }, [currentUser]);

    // --- REAL-TIME MESSAGES ---
    useEffect(() => {
        if (!selectedChat?.chatChannelId) {
            setMessages([]);
            return;
        }

        const messagesCollectionRef = collection(db, 'channels', selectedChat.chatChannelId, 'messages');
        const q = query(messagesCollectionRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const senderInfo = selectedChat.members.find(m => m.userId === data.senderId) || { name: 'Unknown', role: 'Unknown' };
                return {
                    id: doc.id,
                    content: data.text,
                    time: data.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'sending...',
                    sender: senderInfo.name,
                    role: senderInfo.role,
                    isOwn: data.senderId === currentUser?.userId
                };
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [selectedChat, currentUser]);

    // --- SEND MESSAGE ---
    const handleSendMessage = async () => {
        if (!messageInput.trim() || !currentUser || !selectedChat) return;

        const messagesCollectionRef = collection(db, 'channels', selectedChat.chatChannelId, 'messages');

        try {
            await addDoc(messagesCollectionRef, {
                text: messageInput,
                createdAt: serverTimestamp(),
                senderId: currentUser.userId,
            });
            setMessageInput("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // --- RENDER ---
    return (
        <PageLayout>
            <div className="h-screen bg-gray-100 flex">
                <div className="flex-1 flex overflow-hidden">
                    {/* Chat List Sidebar */}
                    <div className={`${sidebarCollapsed ? 'w-0' : 'w-80'} lg:w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {isLoadingChats ? (
                                <p className="p-4 text-gray-500">Loading chats...</p>
                            ) : (
                                chatList.map(chat => (
                                    <div
                                        key={chat.caseId}
                                        onClick={() => { setSelectedChat(chat); if(window.innerWidth < 1024) setSidebarCollapsed(true); }}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.caseId === chat.caseId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img src={logo} alt={chat.caseTitle} className="w-12 h-12 rounded-full" />
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                                                    <FaUsers size={10} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">{chat.caseTitle}</h3>
                                                <p className="text-xs text-gray-500">{chat.members.map(m => m.name.split(' ')[0]).join(', ')}</p>
                                                <p className="text-sm text-gray-600 truncate mt-1">{/* Last message preview */}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        {selectedChat ? (
                            <>
                                {/* Header */}
                                <div className="bg-white p-4 border-b border-gray-200 flex items-center space-x-4 shadow-sm">
                                    <button onClick={() => setSidebarCollapsed(false)} className="text-gray-600 hover:text-gray-800 transition-colors lg:hidden"><FaBars size={20} /></button>
                                    <img src={logo} alt={selectedChat.caseTitle} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{selectedChat.caseTitle}</h3>
                                        <p className="text-sm text-gray-500">{selectedChat.members.length} members: {selectedChat.members.map(member => member.name.split(' ')[0]).join(', ')}</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${msg.isOwn ? 'bg-gray-400 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                                                {!msg.isOwn && (
                                                    <p className={`text-xs font-medium mb-1 ${msg.role === 'LAWYER' ? 'text-blue-600' : msg.role === 'JUNIOR' ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {msg.sender} • {msg.role}
                                                    </p>
                                                )}
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                                <p className={`text-xs mt-2 ${msg.isOwn ? 'text-gray-200' : 'text-gray-500'}`}>{msg.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="bg-white p-4 border-t border-gray-200">
                                    <div className="flex items-end space-x-3">
                                        <textarea
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type a message..."
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="1"
                                            style={{ minHeight: '48px' }}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className={`p-3 rounded-full transition-colors ${messageInput.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
                                        >
                                            <FaPaperPlane size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <h3 className="text-xl font-medium">Select a conversation</h3>
                                    <p className="text-sm">Choose a lawyer from the list to start messaging</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default ClientMessages;
