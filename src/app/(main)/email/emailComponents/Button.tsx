import React from "react";
import { Link } from "@react-email/components";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted" | "double";
export type TextAlignment = "left" | "center" | "right";
export type ButtonWidth = "25%" | "50%" | "90%" | "auto";
export type ContentAlignment = "flex-start" | "center" | "flex-end";

export interface EmailButtonProps {
  text: string;
  url: string;

  backgroundColor: string;
  textColor: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  fontSize?: number;
  target: "_blank" | "_self";
  paddingX?: number;
  paddingY?: number;
  borderRadius?: number;
  borderStyle?: BorderStyle;
  borderWidth?: number;
  borderColor?: string;
  width?: ButtonWidth;

  textAlignment?: TextAlignment;

  containerBackgroundColor?: string;
  containerBorderRadius?: number;
  contentAlignment?: ContentAlignment;
  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
}

const Button: React.FC<EmailButtonProps> = ({
  text,
  url,
  target = "_blank",
  backgroundColor = "#3B82F6",
  textColor = "#FFFFFF",
  fontWeight = "medium",
  fontSize = 16,
  paddingX = 24,
  paddingY = 12,
  borderRadius = 0,
  borderStyle = "none",
  borderWidth = 1,
  borderColor = "#000000",
  width = "25%",
  textAlignment = "center",
  containerBackgroundColor = "transparent",
  containerBorderRadius = 0,
  contentAlignment = "center",
  padding = { top: 5, bottom: 5, left: 0, right: 0 }, // Changed default to 0
}) => {
  const fontWeightMap = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  };

  const buttonStyle = {
    display: "inline-block",
    backgroundColor,
    color: textColor,
    fontWeight: fontWeightMap[fontWeight],
    fontSize: `${fontSize}px`,
    padding: `${paddingY}px ${paddingX}px`,
    borderRadius: `${borderRadius}px`,
    borderStyle: borderStyle !== "none" ? borderStyle : "none",
    borderWidth: borderStyle !== "none" ? `${borderWidth}px` : 0,
    borderColor: borderStyle !== "none" ? borderColor : "transparent",
    textDecoration: "none",
    textAlign: textAlignment,
    width: width,
    msoLineHeightRule: "exactly",
    lineHeight: "100%",
  } as React.CSSProperties;

  const containerStyle = {
    display: "flex",
    justifyContent: contentAlignment,
    backgroundColor: containerBackgroundColor,
    borderRadius: containerBorderRadius
      ? `${containerBorderRadius}px`
      : undefined,
    paddingTop: padding.top !== undefined ? `${padding.top}px` : "0",
    paddingBottom: padding.bottom !== undefined ? `${padding.bottom}px` : "0",
    paddingLeft: padding.left !== undefined ? `${padding.left}px` : "0",
    paddingRight: padding.right !== undefined ? `${padding.right}px` : "0",
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      <Link href={url} style={buttonStyle} target={target}>
        {text}
      </Link>
    </div>
  );
};

export default Button;
