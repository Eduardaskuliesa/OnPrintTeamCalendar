/* eslint-disable import/no-anonymous-default-export */
import { emailComponents, defaultProps } from "../emailComponents";
import Button from "../emailComponents/Button";
import Image from "../emailComponents/Image";

export type EmailComponentType = keyof typeof defaultProps;

export const componentEditors = {
  button: Button,
  image: Image,
};
export const getDefaultProps = (componentType: EmailComponentType) => {
  return defaultProps[componentType] || {};
};


export const getEditorForComponent = (componentType: EmailComponentType) => {
  return componentEditors[componentType as keyof typeof componentEditors] || null;
};


export const getComponent = (componentType: EmailComponentType) => {
  return emailComponents[componentType as keyof typeof emailComponents] || null;
};

export default {
  getDefaultProps,
  getEditorForComponent,
  getComponent,
};