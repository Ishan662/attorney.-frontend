import { useState, useEffect, useRef } from "react";
import { FaSearch, FaPaperclip, FaSmile, FaMicrophone, FaPaperPlane, FaBars, FaUsers } from "react-icons/fa";
import PageLayout from "../../components/layout/PageLayout";
import logo from '../../assets/images/icon.png';


import { db, auth } from "../../services/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const LawyerMessages = () => {
    // --- STATE MANAGEMENT ---
    // These states will now hold real data fetched from your services.
    const [chatList, setChatList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null); // Will hold the full chat object from backend
    const [currentUser, setCurrentUser] = useState(null); // Will hold the logged-in user's info
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [messageInput, setMessageInput] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const messagesEndRef = useRef(null); // For auto-scrolling

    // --- DATA FETCHING & REAL-TIME LISTENERS ---

    // Effect 1: Get the currently authenticated user from Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // IMPORTANT: We need both the Firebase UID and our application's own user profile.
                // After a user logs in with Firebase, you should have an endpoint to get their profile.
                // For this demo, we'll mock that profile fetch.
                // In a real app, you would call your backend here:
                // const profile = await fetch('/api/users/me').then(res => res.json());
                // setCurrentUser(profile);
                
                // Mocking the user profile based on your API response.
                // The user with this ID MUST be a member of the chat channel you are testing.
                setCurrentUser({
                    uid: user.uid, // Firebase Auth UID
                    userId: "8f06fe92-7db5-4646-8eca-666e90984c6d", // This is the UUID from your backend 'users' table
                    name: "Nishagi Test"
                });
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Effect 2: Fetch the list of chat channels from YOUR backend
    useEffect(() => {
        if (!currentUser) return; // Don't fetch until we know who the user is

        const fetchChatList = async () => {
            try {
                // Get the Firebase auth token to prove who we are to the backend
                const token = await auth.currentUser.getIdToken();

                const response = await fetch('http://localhost:8080/api/cases/my-chats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch chat channels');
                }

                const data = await response.json();
                setChatList(data);
            } catch (error) {
                console.error("Error fetching chat list:", error);
            } finally {
                setIsLoadingChats(false);
            }
        };

        fetchChatList();
    }, [currentUser]); // This runs once the currentUser is set

    // Effect 3: Listen for messages for the SELECTED chat channel in REAL-TIME
    useEffect(() => {
        if (!selectedChat?.chatChannelId) {
            setMessages([]); // Clear messages if no chat is selected
            return;
        }

        const messagesCollectionRef = collection(db, 'channels', selectedChat.chatChannelId, 'messages');
        const q = query(messagesCollectionRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const senderInfo = selectedChat.members.find(m => m.userId === data.senderId) || { name: 'Unknown User', role: 'Unknown' };
                return {
                    id: doc.id,
                    content: data.text,
                    time: data.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'sending...',
                    sender: senderInfo.name,
                    role: senderInfo.role,
                    isOwn: data.senderId === currentUser?.userId // Use our backend user ID for comparison
                };
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [selectedChat, currentUser]);

    // --- ACTIONS ---

    const handleSendMessage = async () => {
        if (messageInput.trim() === "" || !currentUser || !selectedChat) return;

        const messagesCollectionRef = collection(db, 'channels', selectedChat.chatChannelId, 'messages');
        
        try {
            await addDoc(messagesCollectionRef, {
                text: messageInput,
                createdAt: serverTimestamp(),
                senderId: currentUser.userId, // Send our backend UUID as the senderId
            });
            setMessageInput("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    // --- RENDER LOGIC ---
    
    return (
        <PageLayout>
            <div className="h-screen bg-gray-100 flex">
                <div className="flex-1 flex overflow-hidden">
                    {/* Chat List - Left Sidebar */}
                    <div className={`${sidebarCollapsed ? 'w-0' : 'w-80'} lg:w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
                        <div className="p-4 border-b border-gray-200">{/* Search Bar */}</div>
                        <div className="flex-1 overflow-y-auto">
                            {isLoadingChats ? (
                                <p className="p-4 text-gray-500">Loading chats...</p>
                            ) : (
                                chatList.map((chat) => (
                                    <div
                                        key={chat.caseId}
                                        onClick={() => {
                                            setSelectedChat(chat);
                                            if (window.innerWidth < 1024) setSidebarCollapsed(true);
                                        }}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?.caseId === chat.caseId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative">
                                                <img src={logo} alt={chat.caseTitle} className="w-12 h-12 rounded-full"/>
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center"><FaUsers size={10} className="text-white" /></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 truncate">{chat.caseTitle}</h3>
                                                <p className="text-xs text-gray-500">{chat.members.map(m => m.name.split(' ')[0]).join(', ')}</p>
                                                <p className="text-sm text-gray-600 truncate mt-1">{/* Last message preview could go here */}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area - Right Side */}
                    <div className="flex-1 flex flex-col bg-gray-50">
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="bg-white p-4 border-b border-gray-200 flex items-center space-x-4 shadow-sm">
                                    <button onClick={() => setSidebarCollapsed(false)} className="text-gray-600 hover:text-gray-800 transition-colors lg:hidden"><FaBars size={20} /></button>
                                    <img src={logo} alt={selectedChat.caseTitle} className="w-12 h-12 rounded-full"/>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-lg">{selectedChat.caseTitle}</h3>
                                        <p className="text-sm text-gray-500">{selectedChat.members.length} members: {selectedChat.members.map(member => member.name.split(' ')[0]).join(', ')}</p>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    {messages.map((message) => (
                                        <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-sm lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${message.isOwn ? 'bg-gray-400 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                                                {!message.isOwn && (
                                                    <p className={`text-xs font-medium mb-1 ${message.role === 'LAWYER' ? 'text-blue-600' : message.role === 'JUNIOR' ? 'text-green-600' : 'text-gray-600'}`}>
                                                        {message.sender} • {message.role}
                                                    </p>
                                                )}
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                                <p className={`text-xs mt-2 ${message.isOwn ? 'text-gray-200' : 'text-gray-500'}`}>{message.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="bg-white p-4 border-t border-gray-200">
                                    <div className="flex items-end space-x-3">
                                        <textarea value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows="1" style={{ minHeight: '48px' }}/>
                                        <button onClick={handleSendMessage} disabled={!messageInput.trim()} className={`p-3 rounded-full transition-colors ${messageInput.trim() ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}><FaPaperPlane size={16} /></button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <div className="text-center">
                                    <h3 className="text-xl font-medium">Select a conversation</h3>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export default LawyerMessages;