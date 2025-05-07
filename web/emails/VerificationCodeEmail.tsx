import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface HabitMonkVerifyEmailProps {
  verificationCode?: string;
}

export default function HabitMonkVerifyEmail({
  verificationCode,
}: HabitMonkVerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Your Habit Monk password reset code</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            <Section
              className="flex items-center justify-center w-full"
              style={imageSection}
            >
              <Img
                src={"https://habitmonk.kishalay.tech/habit-monk-logo.png"}
                width="170"
                height="170"
                alt="Habit Monk Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>Reset your Habit Monk password</Heading>
              <Text style={mainText}>
                You requested to reset your password for your Habit Monk
                account. Use the verification code below to continue. If you
                didn’t request this, please ignore this message.
              </Text>
              <Section style={verificationSection}>
                <Text style={verifyText}>Your verification code</Text>
                <Text style={codeText}>{verificationCode}</Text>
                <Text style={validityText}>(Valid for 2 minutes)</Text>
              </Section>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={cautionText}>
                For your security, never share this code with anyone. Habit Monk
                will never ask you to disclose your password or verification
                code via email or phone.
              </Text>
            </Section>
          </Section>
          <Text style={footerText}>
            © {new Date().getFullYear()} Habit Monk, All rights reserved.
            <br />
            <Link
              href="https://habitmonk.kishalay.tech"
              style={link}
              target="_blank"
            >
              Visit Habit Monk
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#f5f5f5",
};

const h1 = {
  color: "#1a1a1a",
  fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#4c51bf",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const imageSection = {
  backgroundColor: "#4c51bf",
  display: "flex",
  padding: "20px 0",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

const coverSection = {
  backgroundColor: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const upperSection = { padding: "25px 35px" };

const lowerSection = { padding: "25px 35px" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
  textAlign: "center" as const,
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: "bold",
  textAlign: "center" as const,
};

const codeText = {
  ...text,
  fontWeight: "bold",
  fontSize: "36px",
  margin: "10px 0",
  textAlign: "center" as const,
};

const validityText = {
  ...text,
  margin: "0px",
  textAlign: "center" as const,
};

const verificationSection = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
};

const mainText = { ...text, marginBottom: "14px" };

const cautionText = { ...text, margin: "0px" };
