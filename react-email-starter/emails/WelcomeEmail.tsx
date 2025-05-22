import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";

const baseURL = process.env.NODE_ENV === "production" ? "https://cdn.com" : "";

// Email Logo Component
const EmailLogo = () => {
  return (
    <div style={{ textAlign: "center", margin: "0 auto 20px" }}>
      <Link href="https://propreso.com" style={linkStyle}>
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
      </Link>
    </div>
  );
};

export const WelcomeEmail = ({ name = "there" }) => (
  <Html>
    <Head />
    <Preview>
      Welcome to Propreso - Start creating winning proposals today!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          {/* Replaced image with EmailLogo component */}
          <EmailLogo />

          <Text style={greeting}>Hi {name}!</Text>
          <Text style={header}>Welcome to Propreso</Text>

          <Hr style={hr} />

          <Text style={paragraph}>
            We&apos;re excited to have you join our community of freelancers who
            are transforming how they win new clients.
          </Text>

          <Text style={paragraph}>
            <strong>With Propreso, you can:</strong>
          </Text>

          <Text style={listItem}>
            • Generate customized proposals using AI technology
          </Text>
          <Text style={listItem}>
            • Showcase your professional experience effectively
          </Text>
          <Text style={listItem}>
            • Save hours on proposal writing and win more clients
          </Text>
          <Text style={listItem}>
            • Manage all your client communications in one place
          </Text>

          <Text style={paragraph}>
            <strong>Your first step</strong> is to create a freelancer profile
            that will help us generate tailored proposals specific to your
            skills and experience.
          </Text>

          <Button style={button} href="https://propreso.com/profile/create">
            Create Your Profile
          </Button>

          <Hr style={hr} />

          <Section style={founderBox}>
            <Img
              src={`${baseURL}/static/christopher-okafor.jpg`}
              width="120px"
              height="120px"
              alt="Christopher Okafor"
              style={{ borderRadius: "200px", margin: "0 auto 15px" }}
            />

            <Text style={founderMessage}>
              &ldquo;I created Propreso because I saw too many talented
              freelancers losing opportunities due to poor proposals. Our
              mission is to help you showcase your value and win the clients you
              deserve. I&apos;m personally committed to making this platform
              work for you.
            </Text>

            <Text style={founderMessage}>
              I&apos;d love to hear about your experience. Feel free to reach
              out directly with any feedback or questions.&rdquo;
            </Text>

            <Text style={founderSignature}>Christopher Okafor</Text>
            <Text style={founderTitle}>Founder, Propreso</Text>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            If you need any assistance, our support team is always here to help.
            Just reply to this email or visit our{" "}
            <Link style={anchor} href="https://propreso.com/support">
              support center
            </Link>
            .
          </Text>

          <Text style={paragraph}>— The Propreso Team</Text>

          <Hr style={hr} />

          <Text style={footer}>© 2025 Propreso. All rights reserved.</Text>
          <Text style={footer}>
            You&apos;re receiving this email because you recently created an
            account on Propreso.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

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
  margin: "30px 0 0",
  letterSpacing: "-0.4px",
};

const header = {
  fontFamily: "'Poppins', sans-serif",
  color: "#2C2C2C",
  fontSize: "30px",
  fontWeight: "600",
  textAlign: "center" as const,
  margin: "5px 0 30px",
  letterSpacing: "-0.4px",
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

const listItem = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  fontFamily: "'Lato', sans-serif",
  margin: "8px 0 8px 10px",
};

const anchor = {
  color: "#BF4008",
  textDecoration: "underline",
};

const button = {
  backgroundColor: "#BF4008",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "30px 0",
  fontFamily: "'Lato', sans-serif",
};

const founderBox = {
  backgroundColor: "#FDF9F6",
  padding: "24px",
  borderRadius: "8px",
  margin: "32px 0",
};

const founderMessage = {
  color: "#404040",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
  fontFamily: "'Lato', sans-serif",
  fontStyle: "italic",
  margin: "8px 0",
};

const founderSignature = {
  color: "#2C2C2C",
  fontSize: "18px",
  fontWeight: "600",
  textAlign: "center" as const,
  fontFamily: "'Poppins', sans-serif",
  margin: "16px 0 4px",
};

const founderTitle = {
  color: "#404040",
  fontSize: "14px",
  textAlign: "center" as const,
  fontFamily: "'Lato', sans-serif",
  margin: "0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  margin: "8px 0",
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
