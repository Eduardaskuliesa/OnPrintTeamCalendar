// app/email-builder/page.jsx
"use client"

import { useState, useEffect } from 'react';
import { render } from '@react-email/render';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentPalette from './ComponentPalette';
import EmailPreview from './EmailPreview';
import EmailTemplate from './EmailTemplate';
import { getDefaultProps } from './utils/emailComponentUtils';
import ViewModeToggle from './ViewModeToggle';
import DraggableEmailCanvas from './DragableEmailCanvas';


const EmailBuilderPage = () => {
    // Your existing state
    const [viewMode, setViewMode] = useState('desktop');
    const [emailHtml, setEmailHtml] = useState('');
    const [emailComponents, setEmailComponents] = useState([]);

    // Function to add a component to the template
    const handleAddComponent = (componentType) => {
        const newComponent = {
            id: `${componentType}-${Date.now()}`,
            type: componentType,
            props: getDefaultProps(componentType)
        };

        setEmailComponents([...emailComponents, newComponent]);
    };

    // Function to move a component
    const moveComponent = (dragIndex, hoverIndex) => {
        const newComponents = [...emailComponents];
        const draggedItem = newComponents[dragIndex];

        // Remove the dragged item
        newComponents.splice(dragIndex, 1);
        // Insert it at the new position
        newComponents.splice(hoverIndex, 0, draggedItem);

        setEmailComponents(newComponents);
    };

    // Update the email HTML whenever components change
    useEffect(() => {
        const updateEmailHtml = async () => {
            const template = <EmailTemplate emailComponents={emailComponents} />;
            const html = await render(template);
            setEmailHtml(html);
        };

        updateEmailHtml();
    }, [emailComponents]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Builder</h1>

                <div className="flex gap-6">
                    {/* Component Palette - Left Side */}
                    <div className="w-64">
                        <ComponentPalette onAddComponent={handleAddComponent} />
                    </div>

                    {/* Email Canvas and Preview - Right Side */}
                    <div className="flex-1">
                        {/* Draggable Component Canvas */}
                        <div className="mb-6 border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg font-semibold text-gray-700">Email Canvas</h2>
                                <button
                                    onClick={() => setEmailComponents([])}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    Clear Template
                                </button>
                            </div>
                            <DraggableEmailCanvas
                                components={emailComponents}
                                setComponents={setEmailComponents}
                                moveComponent={moveComponent}
                            />
                        </div>

                        {/* View mode toggle buttons */}
                        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

                        {/* Email Preview */}
                        <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-[#E4E4E7]">
                            <h2 className="text-lg font-semibold text-gray-700 mb-3">Email Preview</h2>
                            <EmailPreview emailHtml={emailHtml} viewMode={viewMode} />
                        </div>
                    </div>
                </div>
            </div>
        </DndProvider>
    );
};

export default EmailBuilderPage;