import React from "react";
import { Text } from "@react-email/components";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted" | "double";
export type TextAlignment = "left" | "center" | "right";
export type ContentAlignment = "flex-start" | "center" | "flex-end";

export interface EmailText {
  text?: string;
  backgroundColor?: string;
  borderStyle?: BorderStyle;
  borderWidth?: number;
  borderColor?: string;
  margin?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  textAlignment?: TextAlignment;
  textColor?: string;
  containerBackgroundColor?: string;
  containerBorderRadius?: number;
  contentAlignment?: ContentAlignment;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  textSize?: string;
  customFontSize?: string;
}

const EmailText: React.FC<EmailText> = ({
  text = "This is heading",
  borderStyle,
  borderWidth,
  containerBackgroundColor = "transparent",
  containerBorderRadius = 0,
  contentAlignment = "flex-start",
  padding = { top: 5, bottom: 5, left: 0, right: 0 },
  margin = { top: 0, bottom: 0, left: 0, right: 0 },
  textSize = "12px",
  borderColor = "#000000",
}) => {
  const containerStyle = {
    display: "flex",
    alignContent: "center",
    fontSize: textSize,
    height: "auto",
    justifyContent: contentAlignment,
    backgroundColor: containerBackgroundColor,
    borderStyle,
    borderColor: borderColor,
    borderWidth: borderWidth ? `${borderWidth}px` : undefined,
    borderRadius: containerBorderRadius
      ? `${containerBorderRadius}px`
      : undefined,
    paddingTop: padding.top !== undefined ? `${padding.top}px` : "0",
    paddingBottom: padding.bottom !== undefined ? `${padding.bottom}px` : "0",
    paddingLeft: padding.left !== undefined ? `${padding.left}px` : "0",
    paddingRight: padding.right !== undefined ? `${padding.right}px` : "0",
    marginTop: margin.top !== undefined ? `${margin.top}px` : "0",
    marginBottom: margin.bottom !== undefined ? `${margin.bottom}px` : "0",
    marginLeft: margin.left !== undefined ? `${margin.left}px` : "0",
    marginRight: margin.right !== undefined ? `${margin.right}px` : "0",
    width: "100%",
  } as React.CSSProperties;

  const textStyles = {
    fontSize: textSize,
    margin: 0,
    padding: 0,
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      <Text style={textStyles}>{text}</Text>
    </div>
  );
};

export default EmailText;
