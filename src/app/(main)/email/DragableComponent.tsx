// components/emailBuilder/DraggableComponent.jsx
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiEdit, FiTrash2, FiMove } from 'react-icons/fi';

// Component type for drag and drop
const COMPONENT_TYPE = 'EMAIL_COMPONENT';

const DraggableComponent = ({ id, index, component, moveComponent, removeComponent }) => {
    const ref = useRef(null);

    // Set up drag functionality
    const [{ isDragging }, drag] = useDrag({
        type: COMPONENT_TYPE,
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    });

    // Set up drop functionality
    const [, drop] = useDrop({
        accept: COMPONENT_TYPE,
        hover: (item, monitor) => {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;

            // Only perform the move when the mouse has crossed half of the item's height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            // Time to actually perform the action
            moveComponent(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        }
    });

    // Component label based on type
    const getComponentLabel = (type) => {
        switch (type) {
            case 'header': return 'Header';
            case 'text': return 'Text Block';
            case 'image': return 'Image';
            case 'button': return 'Button';
            case 'divider': return 'Divider';
            case 'columns2': return '2 Columns';
            case 'columns3': return '3 Columns';
            case 'footer': return 'Footer';
            default: return 'Component';
        }
    };

    // Initialize drag and drop refs
    drag(drop(ref));

    return (
        <div
            ref={ref}
            className={`mb-3 rounded-lg border-2 ${isDragging ? 'border-blue-400 opacity-50' : 'border-gray-200'
                } bg-white p-3`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <div className="cursor-move text-gray-500 mr-2">
                        <FiMove />
                    </div>
                    <span className="font-medium">
                        {getComponentLabel(component.type)}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <button className="p-1 text-blue-500 hover:text-blue-700">
                        <FiEdit size={16} />
                    </button>
                    <button
                        className="p-1 text-red-500 hover:text-red-700"
                        onClick={() => removeComponent(id)}
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Component preview - simplified version of what's in the email */}
            <div className="p-2 bg-gray-50 rounded">
                {component.type === 'header' && (
                    <div>
                        <div className="text-sm font-semibold text-indigo-600">{component.props.title}</div>
                        <div className="text-lg font-semibold">{component.props.subtitle}</div>
                        <div className="text-sm text-gray-500 truncate">{component.props.description}</div>
                    </div>
                )}

                {component.type === 'text' && (
                    <div className="text-sm truncate">{component.props.content}</div>
                )}

                {component.type === 'image' && (
                    <div className="text-center text-sm">Image: {component.props.alt}</div>
                )}

                {component.type === 'button' && (
                    <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs rounded">
                            {component.props.text}
                        </span>
                    </div>
                )}

                {component.type === 'divider' && (
                    <div className="border-t border-gray-300 my-1"></div>
                )}

                {component.type === 'columns2' && (
                    <div className="flex gap-2">
                        <div className="w-1/2 text-center text-xs">Left Image</div>
                        <div className="w-1/2 text-center text-xs">Right Image</div>
                    </div>
                )}

                {component.type === 'columns3' && (
                    <div className="flex gap-1">
                        <div className="w-1/3 text-center text-xs">Image 1</div>
                        <div className="w-1/3 text-center text-xs">Image 2</div>
                        <div className="w-1/3 text-center text-xs">Image 3</div>
                    </div>
                )}

                {component.type === 'footer' && (
                    <div className="text-center text-xs">
                        <div className="font-semibold">{component.props.companyName}</div>
                        <div>{component.props.tagline}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraggableComponent;