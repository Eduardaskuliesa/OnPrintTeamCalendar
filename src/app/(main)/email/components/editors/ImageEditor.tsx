// src/features/emailBuilder/components/editors/ImageEditor.jsx
import React from "react";

const ImageEditor = ({ component, updateComponent }) => {
  const { props } = component;

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateComponent(component.id, {
      props: {
        ...props,
        [name]: value,
      },
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h3 className="text-lg font-medium mb-4">Image Settings</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="src"
            value={props.src}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alt Text
          </label>
          <input
            type="text"
            name="alt"
            value={props.alt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link URL (optional)
          </label>
          <input
            type="text"
            name="href"
            value={props.href || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Border Radius
          </label>
          <input
            type="range"
            name="borderRadius"
            min="0"
            max="20"
            value={props.borderRadius || 0}
            onChange={handleChange}
            className="w-full"
          />
          <div className="text-sm text-gray-500 mt-1">
            {props.borderRadius || 0}px
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
