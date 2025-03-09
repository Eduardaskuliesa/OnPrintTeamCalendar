// src/features/emailBuilder/utils/componentRegistry.js
import { emailComponents, defaultProps } from "../emailComponents";
import Button from "../emailComponents/Button";
import Image from "../emailComponents/Image";

export const componentEditors = {
  button: Button,
  image: Image,
};

// Function to get default props for a new component
export const getDefaultProps = (componentType) => {
  return defaultProps[componentType] || {};
};

// Function to get the appropriate editor for a component
export const getEditorForComponent = (componentType) => {
  return componentEditors[componentType] || null;
};

// Function to get the actual component from type
export const getComponent = (componentType) => {
  return emailComponents[componentType] || null;
};

export default {
  getDefaultProps,
  getEditorForComponent,
  getComponent,
};
