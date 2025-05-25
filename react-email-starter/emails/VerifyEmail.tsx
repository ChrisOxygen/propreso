import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

// Create wrapper components to fix type issues
interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

// Use native HTML anchor tag instead of EmailLink
const SafeLink = (props: SafeLinkProps) => <a {...props} />;

interface VerifyEmailProps {
  verificationCode?: string;
  name?: string;
}

const baseURL = process.env.BASE_URL as string;

// Email Logo Component
const EmailLogo = () => {
  return (
    <div style={{ textAlign: "center", margin: "0 auto 20px" }}>
      <SafeLink href="https://propreso.com" style={linkStyle}>
        <Row>
          <Column style={logoContainerStyle}>
            <div style={iconContainerStyle}>
              <Img
                src={`${baseURL}/static/site-icon-white.svg`}
                alt="Propreso Logo"
                width="14"
                height="19"
                style={iconStyle}
              />
            </div>
          </Column>
          <Column style={textContainerStyle}>
            <Text style={logoTextStyle}>Propreso</Text>
          </Column>
        </Row>
      </SafeLink>
    </div>
  );
};

// This section is now redundant as SafeLink is already defined above

export default function VerifyEmail({
  verificationCode = "123456",
  name = "there",
}: VerifyEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              margin: 0 auto !important;
            }
            .content {
              padding: 0 16px !important;
            }
            .header {
              font-size: 26px !important;
            }
            .greeting {
              font-size: 20px !important;
            }
            .paragraph {
              font-size: 15px !important;
            }
          }
        `}</style>
      </Head>
      <Preview>Verify your Propreso account email address</Preview>
      <Body style={main}>
        <Container style={container} className="container">
          <Section style={box} className="content">
            <EmailLogo />

            <Text style={greeting} className="greeting">
              Hi {name}!
            </Text>
            <Text style={header} className="header">
              Verify your email
            </Text>

            <Hr style={hr} />

            <Text style={paragraph} className="paragraph">
              Thanks for creating your Propreso account. To complete your
              registration and access all features, please enter the
              verification code below when prompted:
            </Text>

            <Section style={codeSection}>
              <Text style={codeLabel}>Verification code</Text>
              <Text style={code}>{verificationCode}</Text>
              <Text style={codeExpiry}>
                (This code is valid for 30 minutes)
              </Text>
            </Section>

            <Text style={paragraph} className="paragraph">
              If you didn&apos;t create a Propreso account, you can safely
              ignore this email.
            </Text>

            <Hr style={hr} />

            <Text style={cautionText}>
              Propreso will never email you asking for your password, credit
              card details, or other sensitive information. If you receive such
              a request, please don&apos;t respond and contact our support team.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>© 2025 Propreso. All rights reserved.</Text>
            <Text style={footer}>
              <SafeLink href="https://propreso.com/privacy" style={anchor}>
                Privacy Policy
              </SafeLink>{" "}
              •
              <SafeLink href="https://propreso.com/terms" style={anchor}>
                Terms of Service
              </SafeLink>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Email styling
const main = {
  backgroundColor: "#F8E5DB",
  fontFamily:
    "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  maxWidth: "600px",
};

const box = {
  padding: "0 48px",
};

const greeting = {
  fontFamily: "'Poppins', sans-serif",
  color: "#2C2C2C",
  fontSize: "24px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "30px 0 16px", // Increased bottom margin for more spacing
  letterSpacing: "-0.4px",
};

const header = {
  fontFamily: "'Poppins', sans-serif",
  color: "#2C2C2C",
  fontSize: "30px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "0 0 30px", // Removed top margin since greeting has bottom margin now
  letterSpacing: "-0.4px",
  lineHeight: "1.3", // Added line height as requested
};

const hr = {
  borderColor: "#F8E5DB",
  margin: "20px 0",
};

const paragraph = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  fontFamily: "'Lato', sans-serif",
  margin: "16px 0",
};

const codeSection = {
  backgroundColor: "#FDF9F6",
  padding: "24px",
  borderRadius: "8px",
  margin: "32px 0",
  textAlign: "center" as const,
};

const codeLabel = {
  fontFamily: "'Lato', sans-serif",
  color: "#404040",
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 8px",
};

const code = {
  fontFamily: "'IBM Plex Mono', monospace",
  color: "#BF4008",
  fontSize: "36px",
  fontWeight: "bold",
  margin: "16px 0",
  letterSpacing: "5px",
};

const codeExpiry = {
  fontFamily: "'Lato', sans-serif",
  color: "#666666",
  fontSize: "12px",
  margin: "8px 0 0",
};

const cautionText = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "left" as const,
  fontFamily: "'Lato', sans-serif",
  margin: "16px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "8px 0",
};

const anchor = {
  color: "#BF4008",
  textDecoration: "none",
};

// Logo component styles
const linkStyle = {
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
};

const logoContainerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingRight: "12px",
};

const iconContainerStyle: React.CSSProperties = {
  backgroundColor: "#BF4008",
  borderRadius: "50%",
  width: "35px",
  height: "35px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const iconStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const textContainerStyle = {
  display: "flex",
  alignItems: "center",
};

const logoTextStyle = {
  color: "#000000",
  fontSize: "24px",
  fontWeight: "600",
  fontFamily: "'IBM Plex Mono', monospace",
  margin: "0",
};
