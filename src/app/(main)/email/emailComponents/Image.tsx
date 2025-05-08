import React from "react";
import { Section, Row, Column, Img, Link } from "@react-email/components";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted" | "double";
export type ImageWidth = string;
export type ContentAlignment = "flex-start" | "center" | "flex-end";

export interface EmailImageProps {
  src: string;
  alt: string;
  href?: string;
  target?: "_blank" | "_self";

  width?: ImageWidth;
  height?: number | string;
  maxWidth?: string;
  maxHeight?: string;
  borderRadius?: number;
  borderStyle?: BorderStyle;
  borderWidth?: number;
  borderColor?: string;

  containerBackgroundColor?: string;
  containerBorderRadius?: number;
  contentAlignment?: ContentAlignment;

  padding?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };

  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

const EmailImage: React.FC<EmailImageProps> = ({
  src,
  alt,
  href,
  target = "_blank",
  width = "100%",
  height = "auto",
  maxWidth,
  maxHeight,
  borderRadius = 0,
  borderStyle = "none",
  borderWidth = 1,
  borderColor = "#000",
  containerBackgroundColor = "transparent",
  containerBorderRadius = 0,
  contentAlignment = "center",
  padding = { top: 0, bottom: 0, left: 0, right: 0 },
  objectFit = "cover",
}) => {
  const alignMap: Record<ContentAlignment, "left" | "center" | "right"> = {
    "flex-start": "left",
    center: "center",
    "flex-end": "right",
  };
  const htmlAlign = alignMap[contentAlignment];

  const imgStyle: React.CSSProperties = {
    display: "block",
    width,
    height,
    maxWidth,
    maxHeight,
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    borderStyle: borderStyle !== "none" ? borderStyle : undefined,
    borderWidth: borderStyle !== "none" ? `${borderWidth}px` : undefined,
    borderColor: borderStyle !== "none" ? borderColor : undefined,
    objectFit,
    objectPosition: "center",
  };

  const cellPadding = [padding.top, padding.right, padding.bottom, padding.left]
    .map((v) => (v ? `${v}px` : "0"))
    .join(" ");

  return (
    <Section
      style={{
        backgroundColor: containerBackgroundColor,
        borderRadius: containerBorderRadius ? `${containerBorderRadius}px` : undefined,
      }}
    >
      <Row>
        <Column width="100%" align={htmlAlign} style={{ padding: cellPadding }}>
          {href ? (
            <Link href={href} target={target} style={{ textDecoration: "none" }}>
              <Img src={src} alt={alt} style={imgStyle} />
            </Link>
          ) : (
            <Img src={src} alt={alt} style={imgStyle} />
          )}
        </Column>
      </Row>
    </Section>
  );
};

export default EmailImage;
