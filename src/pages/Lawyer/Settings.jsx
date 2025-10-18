import React, { useState } from "react";
import { Pencil } from "lucide-react";
import Button1 from "../../components/UI/Button1";
import PageLayout from "../../components/layout/PageLayout";

const user = {
    name: "Nishagi Jeewantha",
    email: "nj@gmail.com",
    role: "Lawyer",
};

const Settings = () => {
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingEmail, setIsEditingEmail] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [isEditingFirmName, setIsEditingFirmName] = useState(false);

    const [name, setName] = useState("Sujan Darshana");
    const [email, setEmail] = useState("sd@example.com");
    const [phone, setPhone] = useState("0771234567");
    const [firmName, setFirmName] = useState("Darshana & Associates Law Firm");

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

    const [twoFA, setTwoFA] = useState(false);

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

    const handleLanguageChange = (lang) => {
        setLanguages({ ...languages, [lang]: !languages[lang] });
    };

    return (
        <PageLayout user={user}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="mb-6 flex items-center">
                    <h1 className="text-2xl font-semibold">Settings</h1>
                </div>

                {/* Settings Card */}
                <div className="bg-white border shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold mb-4 text-black">
                        Profile Settings
                    </h2>

                    {/* Profile Photo */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-black">
                            Profile Photo
                        </label>
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

                    {/* Name */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-1 text-black">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            readOnly={!isEditingName}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full border rounded px-3 py-2 pr-10 ${isEditingName
                                    ? "bg-white"
                                    : "bg-gray-100 text-gray-700 cursor-not-allowed"
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
                        <label className="block text-sm font-medium mb-1 text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            readOnly={!isEditingEmail}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full border rounded px-3 py-2 pr-10 ${isEditingEmail
                                    ? "bg-white"
                                    : "bg-gray-100 text-gray-700 cursor-not-allowed"
                                }`}
                        />
                        <div
                            className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-black"
                            onClick={() => setIsEditingEmail(!isEditingEmail)}
                        >
                            <Pencil size={16} />
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-1 text-black">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            value={phone}
                            readOnly={!isEditingPhone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full border rounded px-3 py-2 pr-10 ${isEditingPhone
                                    ? "bg-white"
                                    : "bg-gray-100 text-gray-700 cursor-not-allowed"
                                }`}
                        />
                        <div
                            className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-black"
                            onClick={() => setIsEditingPhone(!isEditingPhone)}
                        >
                            <Pencil size={16} />
                        </div>
                    </div>

                    {/* Firm Name */}
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium mb-1 text-black">
                            Firm Name
                        </label>
                        <input
                            type="text"
                            value={firmName}
                            readOnly={!isEditingFirmName}
                            onChange={(e) => setFirmName(e.target.value)}
                            className={`w-full border rounded px-3 py-2 pr-10 ${isEditingFirmName
                                    ? "bg-white"
                                    : "bg-gray-100 text-gray-700 cursor-not-allowed"
                                }`}
                        />
                        <div
                            className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-black"
                            onClick={() => setIsEditingFirmName(!isEditingFirmName)}
                        >
                            <Pencil size={16} />
                        </div>
                    </div>

                    {/* Notification Preferences
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-black">
                            Notification Preferences
                        </label>
                        <div className="space-y-2 pl-2 text-sm text-gray-800">
                            {Object.entries(notifications).map(([key, value]) => (
                                <label key={key} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={() => handleNotificationChange(key)}
                                    />
                                    <span>{key.replace(/([A-Z])/g, " $1")}</span>
                                </label>
                            ))}
                        </div>
                    </div> */}

                    {/* Display Settings */}
                    {/* <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2 text-black">Display Settings</h3>
                        <label className="flex items-center space-x-2 text-sm text-gray-800">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            />
                            <span>Dark Mode</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm text-gray-800 mt-2">
                            <input
                                type="checkbox"
                                checked={fontLarge}
                                onChange={() => setFontLarge(!fontLarge)}
                            />
                            <span>Large Font</span>
                        </label>
                    </div> */}

                    {/* Language Preferences */}
                    {/* <div className="mb-6">
                        <h3 className="text-sm font-medium mb-2 text-black">Language Preferences</h3>
                        <div className="space-y-2 pl-2 text-sm text-gray-800">
                            {Object.entries(languages).map(([lang, checked]) => (
                                <label key={lang} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleLanguageChange(lang)}
                                    />
                                    <span>{lang.charAt(0).toUpperCase() + lang.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    </div> */}


                    {/* Save Button */}
                    <Button1 className="mt-4">Save Changes</Button1>
                </div>
            </div>
        </PageLayout>
    );
};

export default Settings;
