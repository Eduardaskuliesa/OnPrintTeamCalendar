import React from "react";
import { Img, Link } from "@react-email/components";

export type BorderStyle = "none" | "solid" | "dashed" | "dotted" | "double";
export type ImageWidth = string;
export type ContentAlignment = "flex-start" | "center" | "flex-end";

export interface EmailImageProps {
  src: string;
  alt: string;

  width?: ImageWidth;
  height?: number | string;
  maxWidth?: string;

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

  href?: string;
  target?: "_blank" | "_self";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}

const EmailImage: React.FC<EmailImageProps> = ({
  src,
  alt,
  href,
  target = "_blank",
  width = "50%",
  height = "auto",
  maxWidth = "600px",
  borderRadius = 0,
  borderStyle = "none",
  borderWidth = 1,
  borderColor = "#000000",
  containerBackgroundColor = "transparent",
  containerBorderRadius = 0,
  contentAlignment = "center",
  padding = { top: 0, bottom: 0, left: 0, right: 0 },
  objectFit = "cover",
}) => {
  const imageStyle = {
    borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
    border:
      borderStyle !== "none"
        ? `${borderWidth}px ${borderStyle} ${borderColor}`
        : "none",
    maxWidth,
    width: width,
    height: height,
    objectFit,
    objectPosition: "center",
    display: "block",
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

  const renderImage = () => (
    <Img src={src} alt={alt} width={width} height={height} style={imageStyle} />
  );

  return (
    <div style={containerStyle}>
      {href ? (
        <Link href={href} style={{ textDecoration: "none" }} target={target}>
          {renderImage()}
        </Link>
      ) : (
        renderImage()
      )}
    </div>
  );
};

export default EmailImage;
