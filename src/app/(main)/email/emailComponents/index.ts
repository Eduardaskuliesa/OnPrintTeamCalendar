import Button from "./Button";
import Image from "./Image";

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
    target: "_blank",
  },
  image: {
    src: "https://placehold.co/600x400",
    alt: "Placeholder image",
    width: "100%",
  },
};
