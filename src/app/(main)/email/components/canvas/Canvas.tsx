import React from 'react';
import { X, Edit } from 'lucide-react';

interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface EmailCanvasProps {
  components: EmailComponent[];
  selectedComponentId: string | undefined;
  onSelectComponent: (id: string) => void;
  onRemoveComponent: (id: string) => void;
}

const EmailCanvas: React.FC<EmailCanvasProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent
}) => {
  if (components.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-gray-500">Add components from the panel on the right</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {components.map((component) => (
        <div 
          key={component.id}
          className={`relative p-4 border ${
            selectedComponentId === component.id 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
          } rounded-lg cursor-pointer transition-colors`}
          onClick={() => onSelectComponent(component.id)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700 capitalize">
              {component.type}
            </span>
            <div className="flex space-x-1">
              <button 
                className="p-1 hover:bg-gray-200 rounded" 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectComponent(component.id);
                }}
              >
                <Edit size={16} />
              </button>
              <button 
                className="p-1 hover:bg-red-100 text-red-500 rounded" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveComponent(component.id);
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          {/* Component preview */}
          <div className="text-sm text-gray-600">
            {component.type === 'button' && (
              <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded">
                {component.props.text || 'Button'}
              </div>
            )}
            {component.type === 'image' && (
              <div className="text-center py-4 bg-gray-100 border border-gray-300 rounded">
                Image: {component.props.alt || 'Image Preview'}
              </div>
            )}
            {/* Add more component type previews as needed */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailCanvas;