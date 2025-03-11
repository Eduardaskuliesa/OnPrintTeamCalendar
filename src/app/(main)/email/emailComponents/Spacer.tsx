import { Container } from "@react-email/components";

export interface EmailSpacerProps {
  containerBackgroundColor?: string;
  height?: number;
}

const EmailSpacer: React.FC<EmailSpacerProps> = ({
  containerBackgroundColor = "transaprent",
  height = 20,
}) => {
  const sectionStyles = {
    backgroundColor: containerBackgroundColor,
    height: `${height}px`,
  } as React.CSSProperties;
  return <Container style={sectionStyles} />;
};

export default EmailSpacer;
