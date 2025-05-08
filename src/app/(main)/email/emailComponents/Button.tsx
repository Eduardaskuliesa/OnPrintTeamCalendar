import React from "react";
import { Section, Row, Column, Link } from "@react-email/components";

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
  content = "",
  url = "#",
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

  // Map custom alignment to HTML
  const htmlAlignment =
    contentAlignment === "flex-end" ? "right" :
      contentAlignment === "flex-start" ? "left" : "center";

  const buttonStyle: React.CSSProperties = {
    display: "inline-block",
    whiteSpace: "pre-wrap",
    backgroundColor: backgroundColor,
    color: textColor,
    fontWeight: fontWeightMap[fontWeight],
    fontSize: `${fontSize}px`,
    padding: `${paddingY}px ${paddingX}px`,
    borderRadius: `${borderRadius}px`,
    borderStyle: borderStyle !== "none" ? borderStyle : undefined,
    borderWidth: borderStyle !== "none" ? `${borderWidth}px` : undefined,
    borderColor: borderStyle !== "none" ? borderColor : undefined,
    textDecoration: "none",
    textAlign: textAlignment,
    width,
    lineHeight: "100%",
  };

  return (
    <Section
      style={{
        backgroundColor: containerBackgroundColor,
        borderRadius: containerBorderRadius,
      }}
    >
      <Row>
        <Column style={{
          paddingTop: padding.top,
          paddingBottom: padding.bottom,
          paddingLeft: padding.left,
          paddingRight: padding.right,
        }} width={width} align={htmlAlignment}>
          <Link
            href={url}
            target={target}
            style={buttonStyle}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Column>
      </Row>
    </Section>
  );
};

export default Button;