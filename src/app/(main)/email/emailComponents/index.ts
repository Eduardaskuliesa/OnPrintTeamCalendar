import Button from "./Button";
import Image from "./Image";
import {
  BorderStyle,
  TextAlignment,
  ContentAlignment,
} from "../emailComponents/Button";
import { EmailHeadingProps } from "./Header";


type ButtonDefaultProps = {
  content: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  fontSize: number;
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  borderStyle: BorderStyle;
  borderWidth: number;
  borderColor: string;
  width: string;
  textAlignment: TextAlignment;
  containerBackgroundColor: string;
  containerBorderRadius: number;
  contentAlignment: ContentAlignment;
  target: "_blank" | "_self";
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

export const emailComponents = {
  button: Button,
  image: Image,
};

export const defaultProps = {
  button: {
    content: "Click me",
    url: "",
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF",
    fontWeight: "medium" as const,
    fontSize: 16,
    borderRadius: 0,
    borderStyle: "none" as const,
    borderWidth: 1,
    borderColor: "#000000",
    width: "25%",
    textAlignment: "center" as const,
    containerBackgroundColor: "transparent",
    containerBorderRadius: 0,
    contentAlignment: "center" as const,
    target: "_blank" as const,
    padding: {
      top: 5,
      bottom: 5,
      left: 0,
      right: 0,
    },
  } as ButtonDefaultProps,
  image: {
    src: "https://placehold.co/600x400",
    width: "100%",
    target: "_blank",
    containerBackgroundColor: "transparent",
  },
  header: {
    headingSize: "h2",
    customFontSize: '24px',
    containerBackgroundColor: "transparent",
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    content: 'This is heading',
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    fontWeight: 'bold'
  } as EmailHeadingProps,
  spacer: {
    height: 20,
    containerBackgroundColor: "transparent",
  },
  text: {
    content: 'Simple texsxxt'
  }
};

export function getDefaultProps(type: string) {
  return defaultProps[type as keyof typeof defaultProps] || {};
}
