import React from 'react';
import { IoDocumentText, IoImageOutline, IoLinkOutline, IoGridOutline } from 'react-icons/io5';
import { BsTypeH1, BsLayoutSplit } from 'react-icons/bs';
import { FiDivide } from 'react-icons/fi';
import { HiOutlineTemplate } from 'react-icons/hi';

const ComponentPalette = ({ onAddComponent }) => {
    const components = [
        { id: 'header', name: 'Header', icon: <BsTypeH1 size={24} /> },
        { id: 'text', name: 'Text Block', icon: <IoDocumentText size={24} /> },
        { id: 'image', name: 'Image', icon: <IoImageOutline size={24} /> },
        { id: 'button', name: 'Button', icon: <IoLinkOutline size={24} /> },
        { id: 'divider', name: 'Divider', icon: <FiDivide size={24} /> },
        { id: 'columns2', name: '2 Columns', icon: <BsLayoutSplit size={24} /> },
        { id: 'columns3', name: '3 Columns', icon: <IoGridOutline size={24} /> },
        { id: 'footer', name: 'Footer', icon: <HiOutlineTemplate size={24} /> },
    ];

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Email Components</h2>
            <div className="grid grid-cols-2 gap-3">
                {components.map(component => (
                    <button
                        key={component.id}
                        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:bg-blue-50 transition-colors aspect-square"
                        onClick={() => onAddComponent(component.id)}
                    >
                        <div className="text-indigo-600 mb-2">
                            {component.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {component.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ComponentPalette;