// components/emailBuilder/DraggableEmailCanvas.jsx
import React from 'react';
import DraggableComponent from './DragableComponent';


const DraggableEmailCanvas = ({ components, setComponents, moveComponent }) => {
    // Function to remove a component
    const removeComponent = (id) => {
        setComponents(components.filter(component => component.id !== id));
    };

    return (
        <div className="min-h-[200px] border-2 border-dashed border-gray-300 p-4 rounded bg-gray-50">
            {components.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    Drag components here or select from the palette
                </div>
            ) : (
                <div>
                    {components.map((component, index) => (
                        <DraggableComponent
                            key={component.id}
                            id={component.id}
                            index={index}
                            component={component}
                            moveComponent={moveComponent}
                            removeComponent={removeComponent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DraggableEmailCanvas;