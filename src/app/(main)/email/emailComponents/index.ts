import Button from "./Button";
import Image from "./Image";
import {
  BorderStyle,
  TextAlignment,
  ContentAlignment,
} from "../emailComponents/Button";

type ButtonDefaultProps = {
  text: string;
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
    text: "Click me",
    url: "https://example.com",
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF",
    fontWeight: "medium" as const,
    fontSize: 16,
    paddingX: 24,
    paddingY: 12,
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
    containerBackgroundColor: "transparent"
  },
};

export function getDefaultProps(type: string) {
  return defaultProps[type as keyof typeof defaultProps] || {};
}
