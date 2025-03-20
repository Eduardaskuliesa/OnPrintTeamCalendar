import React from "react";
import { Html, Head, Body, Tailwind } from "@react-email/components";
import Button from "./emailComponents/Button";
import EmailImage from "./emailComponents/Image";
import EmailHeading from "./emailComponents/Header";
import EmailSpacer from "./emailComponents/Spacer";
import EmailText from "./emailComponents/Text";

interface EmailComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

interface EmailTemplateProps {
  emailComponents: EmailComponent[];
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({
  emailComponents: components,
}) => {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Body className="p-0 box-content max-w-2xl mx-auto">
          {components.map((component) => {
            switch (component.type) {
              case "button":
                return <Button  key={component.id} {...component.props} />;

              case "image":
                return (
                  <EmailImage
                    src={""}
                    alt={""}
                    key={component.id}
                    {...component.props}
                  />
                );
              case "header":
                return <EmailHeading key={component.id} {...component.props} />;
              case "spacer":
                return <EmailSpacer key={component.id} {...component.props} />;
              case "text":
                return <EmailText key={component.id} {...component.props} />;
              default:
                return (
                  <div
                    key={component.id}
                    style={{
                      padding: "10px",
                      border: "1px dashed #ccc",
                      textAlign: "center",
                      margin: "10px 0",
                    }}
                  >
                    Unsupported component type: {component.type}
                  </div>
                );
            }
          })}
        </Body>
      </Html>
    </Tailwind>
  );
};

export default EmailTemplate;
