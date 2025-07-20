import React, { useState } from "react";
import { Pencil } from "lucide-react";
import Button1 from "../../components/UI/Button1";

const clientSettings = () => {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);

    const [name, setName] = useState("Sujan Darshana");
    const [email, setEmail] = useState("sd@example.com");
    const [phone, setPhone] = useState("0771234567");

    const [notifications, setNotifications] = useState({
        caseUpdates: true,
        deadlines: false,
        messages: true,
    });

    const [darkMode, setDarkMode] = useState(false);
    const [fontLarge, setFontLarge] = useState(false);
    const [languages, setLanguages] = useState({
        english: true,
        sinhala: false,
        tamil: false,
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePhoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleNotificationChange = (type) => {
        setNotifications({ ...notifications, [type]: !notifications[type] });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 text-gray-800">
            {/* Header */}
            <div className="mb-6 flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-black mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.983 4.58a1 1 0 012.034 0l.194 1.358a1 1 0 00.946.837l1.428.097a1 1 0 01.564 1.744l-1.074.98a1 1 0 000 1.489l1.074.98a1 1 0 01-.564 1.744l-1.428.097a1 1 0 00-.946.837l-.194 1.358a1 1 0 01-2.034 0l-.194-1.358a1 1 0 00-.946-.837l-1.428-.097a1 1 0 01-.564-1.744l1.074-.98a1 1 0 000-1.489l-1.074-.98a1 1 0 01.564-1.744l1.428-.097a1 1 0 00.946-.837l.194-1.358zM12 15a3 3 0 100-6 3 3 0 000 6z"
                    />
                </svg>

                <h1 className="text-2xl font-semibold">Settings</h1>
            </div>

            {/* Profile Settings */}
            <div className="bg-white border shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4 text-black">Profile Settings</h2>

                {/* Profile Photo Upload */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-black">Profile Photo</label>
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 rounded-full overflow-hidden border">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                    No Photo
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="text-sm"
                        />
                    </div>
                </div>

                {/* Full Name */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium mb-1 text-black">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        readOnly={!isEditingName}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full border rounded px-3 py-2 pr-10 ${isEditingName ? "bg-white" : "bg-gray-100 text-gray-700"
                            }`}
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-black"
                        onClick={() => setIsEditingName(!isEditingName)}
                    >
                        <Pencil size={16} />
                    </div>
                </div>

                {/* Email */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium mb-1 text-black">Email</label>
                    <input
                        type="email"
                        value={email}
                        readOnly={!isEditingEmail}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border rounded px-3 py-2 pr-10 ${isEditingEmail ? "bg-white" : "bg-gray-100 text-gray-700"
                            }`}
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-black"
                        onClick={() => setIsEditingEmail(!isEditingEmail)}
                    >
                        <Pencil size={16} />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="mb-4 relative">
                    <label className="block text-sm font-medium mb-1 text-black">Phone Number</label>
                    <input
                        type="text"
                        value={phone}
                        readOnly={!isEditingPhone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full border rounded px-3 py-2 pr-10 ${isEditingPhone ? "bg-white" : "bg-gray-100 text-gray-700"
                            }`}
                    />
                    <div
                        className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-black"
                        onClick={() => setIsEditingPhone(!isEditingPhone)}
                    >
                        <Pencil size={16} />
                    </div>
                </div>

                {/* Notification Preferences */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-black">
                        Notification Preferences
                    </label>
                    <div className="space-y-2 pl-2 text-sm text-gray-800">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={notifications.caseUpdates}
                                onChange={() => handleNotificationChange("caseUpdates")}
                            />
                            <span>Case Updates</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={notifications.deadlines}
                                onChange={() => handleNotificationChange("deadlines")}
                            />
                            <span>Deadlines</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={notifications.messages}
                                onChange={() => handleNotificationChange("messages")}
                            />
                            <span>Messages</span>
                        </label>
                    </div>
                </div>

                {/* Display Settings */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-black">Display Settings</h3>
                    <label className="flex items-center space-x-2 text-sm text-gray-800">
                        <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        <span>Dark Mode</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm text-gray-800 mt-2">
                        <input type="checkbox" checked={fontLarge} onChange={() => setFontLarge(!fontLarge)} />
                        <span>Large Font</span>
                    </label>
                </div>

                {/* Language Selection */}
                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2 text-black">Language Preferences</h3>
                    <div className="space-y-2 pl-2 text-sm text-gray-800">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={languages.english} onChange={() => handleLanguageChange("english")} />
                            <span>English</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={languages.sinhala} onChange={() => handleLanguageChange("sinhala")} />
                            <span>Sinhala</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" checked={languages.tamil} onChange={() => handleLanguageChange("tamil")} />
                            <span>Tamil</span>
                        </label>
                    </div>
                </div>

                {/* Save Button */}
                <Button1 className="mt-4">Save Changes</Button1>
            </div>
        </div>
    );
};

export default clientSettings;
