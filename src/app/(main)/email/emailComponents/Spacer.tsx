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
    display: "flex",
    width: "100%",
  } as React.CSSProperties;
  return <div style={sectionStyles} />;
};

export default EmailSpacer;
