import React from "react";
import { Link } from "@react-email/components";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted" | "double";
export type TextAlignment = "left" | "center" | "right";
export type ButtonWidth = "25%" | "50%" | "75%";
export type ContentAlignment = "flex-start" | "center" | "flex-end";

export interface EmailButtonProps {
  content?: string;
  url?: string;
  
  backgroundColor?: string;
  textColor?: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  fontSize?: number;
  target?: "_blank" | "_self";
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
  content,
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
  padding = { top: 5, bottom: 5, left: 0, right: 0 },
}) => {
  const fontWeightMap = {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  };

  // Map our custom contentAlignment to conventional HTML alignment values.
  const htmlAlignment =
    contentAlignment === "flex-end"
      ? "right"
      : contentAlignment === "flex-start"
      ? "left"
      : "center";

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

  return (
    <table
      cellPadding="0"
      cellSpacing="0"
      width="100%"
      style={{
        backgroundColor: containerBackgroundColor,
        borderRadius: containerBorderRadius ? `${containerBorderRadius}px` : undefined,
      }}
    >
      <tr>
        <td
          align={htmlAlignment}
          style={{
            paddingTop: padding.top !== undefined ? `${padding.top}px` : "0",
            paddingBottom: padding.bottom !== undefined ? `${padding.bottom}px` : "0",
            paddingLeft: padding.left !== undefined ? `${padding.left}px` : "0",
            paddingRight: padding.right !== undefined ? `${padding.right}px` : "0",
            textAlign: htmlAlignment, // ensures compatibility with email clients
          }}
        >
          <Link
            href={url}
            style={buttonStyle}
            target={target}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </td>
      </tr>
    </table>
  );
};

export default Button;