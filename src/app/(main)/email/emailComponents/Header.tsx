import React from "react";
import { Heading } from "@react-email/components";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted" | "double";
export type TextAlignment = "left" | "center" | "right";
export type ContentAlignment = "flex-start" | "center" | "flex-end";

export interface EmailHeadingProps {
  content?: string;
  backgroundColor?: string;
  borderStyle?: BorderStyle;
  borderWidth?: number;
  borderColor?: string;
  fontWeight? :string
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

const EmailHeader: React.FC<EmailHeadingProps> = ({
  content = 'Simple text',
  textSize = '24px',
  fontWeight = 'bold',
  borderStyle,
  borderWidth,
  containerBackgroundColor = "transparent",
  containerBorderRadius = 0,
  padding = { top: 0, bottom: 0, left: 0, right: 0 },
  margin = { top: 0, bottom: 0, left: 0, right: 0 },
  borderColor = "#000000",
  textColor = "#000000",
  textAlignment = "left",
}) => {
  const containerStyle = {
    
    height: "auto",
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
    textAlign: textAlignment,
  } as React.CSSProperties;

  const textStyles = {
    fontWeight: fontWeight,
    fontSize: textSize, 
    color: textColor,
    margin: 0,
    padding: 0,
  } as React.CSSProperties;

  const customStyles = `
    <style>
      .text-content p {
        margin: 0;
        padding: 0;
        display: block;
      }
      .text-content * {
        margin: 0;
        padding: 0;
      }
    </style>
  `;
  const wrappedContent = content
    ? `${customStyles}<div class="text-content">${content}</div>`
    : "";

  return (
    <div style={containerStyle}>
      <Heading
        style={textStyles}
        dangerouslySetInnerHTML={{ __html: wrappedContent }}
      />
    </div>
  );
};

export default EmailHeader;