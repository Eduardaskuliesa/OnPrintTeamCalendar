// src/features/emailBuilder/emailComponents/Image.tsx
import React from "react";
import { Img, Link } from "@react-email/components";

export interface EmailImageProps {
  src: string;
  alt: string;

  href?: string;

  width?: number | string;
  height?: number | string;
  maxWidth?: string;

  borderRadius?: number;
  border?: {
    width?: number;
    color?: string;
    style?: "solid" | "dashed" | "dotted";
  };

  align?: "left" | "center" | "right";
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const Image: React.FC<EmailImageProps> = ({
  src,
  alt,
  href,
  width = "100%",
  height = "auto",
  maxWidth = "600px",
  borderRadius = 0,
  border,
  align = "center",
  margin = { top: 16, bottom: 16 },
}) => {
  const widthValue = typeof width === "number" ? `${width}px` : width;
  const heightValue = typeof height === "number" ? `${height}px` : height;

  const borderStyle = border
    ? `${border.width || 1}px ${border.style || "solid"} ${border.color || "#e2e8f0"}`
    : undefined;

  const imageStyle = {
    borderRadius: borderRadius > 0 ? `${borderRadius}px` : undefined,
    border: borderStyle,
    maxWidth,
    width: widthValue,
    height: heightValue,
  } as React.CSSProperties;

  const containerStyle = {
    textAlign: align,
    marginTop: margin.top ? `${margin.top}px` : "0",
    marginRight: margin.right ? `${margin.right}px` : "0",
    marginBottom: margin.bottom ? `${margin.bottom}px` : "0",
    marginLeft: margin.left ? `${margin.left}px` : "0",
  } as React.CSSProperties;

  const renderImage = () => (
    <Img
      src={src}
      alt={alt}
      width={widthValue}
      height={heightValue}
      style={imageStyle}
    />
  );

  return (
    <div style={containerStyle}>
      {href ? (
        <Link href={href} target="_blank" style={{ textDecoration: "none" }}>
          {renderImage()}
        </Link>
      ) : (
        renderImage()
      )}
    </div>
  );
};

export default Image;
