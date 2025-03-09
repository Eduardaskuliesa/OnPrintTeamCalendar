import React from "react";
import { Link } from "@react-email/components";

export interface EmailButtonProps {
  text: string;
  url: string;

  backgroundColor: string;
  textColor: string;
  fontWeight?: "normal" | "medium" | "semibold" | "bold";
  fontSize?: number;

  paddingX?: number;
  paddingY?: number;
  borderRadius?: number;
  width?: "auto" | "full";

  centerAlign?: boolean;
  margin?: {
    top?: number;
    bottom?: number;
  };
}

const Button: React.FC<EmailButtonProps> = ({
  text,
  url,
  backgroundColor = "#3B82F6",
  textColor = "#FFFFFF",
  fontWeight = "medium",
  fontSize = 16,
  paddingX = 24,
  paddingY = 12,
  borderRadius = 6,
  width = "auto",
  centerAlign = true,
  margin = { top: 16, bottom: 16 },
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
    textDecoration: "none",
    textAlign: width === "full" ? "center" : "left",
    width: width === "full" ? "100%" : "auto",
    marginTop: margin.top ? `${margin.top}px` : "0",
    marginBottom: margin.bottom ? `${margin.bottom}px` : "0",
    msoLineHeightRule: "exactly",
    lineHeight: "100%",
  } as React.CSSProperties;

  const containerStyle = {
    textAlign: centerAlign ? "center" : "left",
    marginTop: margin.top ? `${margin.top}px` : "0",
    marginBottom: margin.bottom ? `${margin.bottom}px` : "0",
  } as React.CSSProperties;

  return (
    <div style={containerStyle}>
      <Link href={url} style={buttonStyle} target="_blank">
        {text}
      </Link>
    </div>
  );
};

export default Button;
