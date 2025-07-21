import React, { useState, useEffect } from 'react';
import Button1 from '../../components/UI/Button1';
import Button2 from '../../components/UI/Button2';
import Input1 from '../../components/UI/Input1';
import { FaTimes } from 'react-icons/fa';

const CourtColorSettings = ({ isOpen, onClose, courtColors, onSaveCourtColors }) => {
    const [courts, setCourts] = useState([]);
    const [newCourtName, setNewCourtName] = useState('');
    const [newCourtColor, setNewCourtColor] = useState('#3B82F6'); // Default blue color
    
    // Predefined color options
    const colorOptions = [
        { name: 'Red', value: '#EF4444', class: 'bg-red-500' },
        { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
        { name: 'Green', value: '#10B981', class: 'bg-green-500' },
        { name: 'Yellow', value: '#F59E0B', class: 'bg-yellow-500' },
        { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
        { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
        { name: 'Indigo', value: '#6366F1', class: 'bg-indigo-500' },
        { name: 'Teal', value: '#14B8A6', class: 'bg-teal-500' }
    ];
    
    // Initialize courts from props when component mounts or courtColors changes
    useEffect(() => {
        if (courtColors) {
            setCourts(Object.entries(courtColors).map(([name, color]) => ({ name, color })));
        }
    }, [courtColors]);

    // Add a new court with selected color
    const handleAddCourt = () => {
        if (newCourtName.trim() === '') return;
        
        setCourts([
            ...courts,
            { name: newCourtName.trim(), color: newCourtColor }
        ]);
        
        setNewCourtName('');
    };

    // Remove a court
    const handleRemoveCourt = (courtName) => {
        setCourts(courts.filter(court => court.name !== courtName));
    };

    // Handle save button click
    const handleSave = () => {
        const courtColorsObj = courts.reduce((acc, court) => {
            acc[court.name] = court.color;
            return acc;
        }, {});
        
        onSaveCourtColors(courtColorsObj);
        onClose();
    };

    // If not open, don't render
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-medium">Court Color Settings</h3>
                    <button 
                        className="text-gray-400 hover:text-gray-500" 
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Customize colors for different courts to easily identify them on your calendar.
                    </p>
                    
                    {/* Add new court form */}
                    <div className="mb-6 border-b pb-4">
                        <h4 className="font-medium mb-2">Add New Court</h4>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                            <div className="col-span-2">
                                <Input1
                                    type="text"
                                    placeholder="Court Name"
                                    value={newCourtName}
                                    onChange={(e) => setNewCourtName(e.target.value)}
                                />
                            </div>
                            <div>
                                <select 
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newCourtColor}
                                    onChange={(e) => setNewCourtColor(e.target.value)}
                                >
                                    {colorOptions.map(color => (
                                        <option key={color.value} value={color.value}>
                                            {color.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <Button1 
                            text="Add Court" 
                            onClick={handleAddCourt}
                            disabled={!newCourtName.trim()}
                            className="w-full"
                        />
                    </div>
                    
                    {/* List of courts with their colors */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-2">Current Court Colors</h4>
                        {courts.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No courts added yet.</p>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {courts.map((court, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <div className="flex items-center">
                                            <div 
                                                className="w-4 h-4 rounded-full mr-2" 
                                                style={{ backgroundColor: court.color }}
                                            ></div>
                                            <span>{court.name}</span>
                                        </div>
                                        <button 
                                            className="text-gray-400 hover:text-red-500"
                                            onClick={() => handleRemoveCourt(court.name)}
                                            aria-label="Remove court"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Preview */}
                    <div className="mb-6">
                        <h4 className="font-medium mb-2">Preview</h4>
                        <div className="bg-gray-100 p-4 rounded">
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {Array.from({ length: 7 }).map((_, idx) => (
                                    <div key={idx} className="text-xs text-gray-500">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}
                                    </div>
                                ))}
                                {Array.from({ length: 7 }).map((_, idx) => (
                                    <div key={idx + 7} className="bg-white rounded p-1 text-xs relative">
                                        {idx + 1}
                                        {idx === 1 && courts[0] && (
                                            <div className="absolute bottom-0 left-0 right-0 text-xxs p-1 text-white truncate" style={{backgroundColor: courts[0].color}}>
                                                {courts[0].name}
                                            </div>
                                        )}
                                        {idx === 3 && courts[1] && (
                                            <div className="absolute bottom-0 left-0 right-0 text-xxs p-1 text-white truncate" style={{backgroundColor: courts[1].color}}>
                                                {courts[1].name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-end space-x-3">
                        <Button2
                            text="Cancel"
                            onClick={onClose}
                        />
                        <Button1
                            text="Save Settings"
                            onClick={handleSave}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourtColorSettings;