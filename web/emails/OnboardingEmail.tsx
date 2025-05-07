import {
  Html,
  Head,
  Body,
  Container,
  Img,
  Text,
  Section,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily: "Helvetica, Arial, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto ",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  color: "#333333",
  marginBottom: "20px",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#5A67D8",
  color: "#ffffff",
  padding: "12px 24px",
  fontSize: "16px",
  borderRadius: "6px",
  textDecoration: "none",
};

const hr = {
  borderTop: "1px solid #cccccc",
  margin: "40px 0",
};

const footer = {
  fontSize: "12px",
  color: "#999999",
  textAlign: "center" as const,
};

export const OnBoardinigMail = (userFirstname: string) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Welcome to Habit Monk – Build habits with a beautiful grid-based
        tracker.
      </Preview>
      <Container style={container}>
        <Img
          src={"https://habitmonk.kishalay.tech/habit-monk-logo-min.png"}
          width="170"
          height="170"
          alt="Habit Monk"
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname.toUpperCase()},</Text>
        <Text style={paragraph}>
          Welcome to <strong>Habit Monk</strong> — your personal habit tracker
          designed to help you build good habits and stay consistent with a
          visual grid-based system.
        </Text>
        <Section style={btnContainer}>
          <Button
            style={button}
            href="https://habitmonk.kishalay.tech/dashboard"
          >
            Get Started
          </Button>
        </Section>
        <Text style={paragraph}>
          Let’s start building the life you want, one habit at a time.
          <br />– The Habit Monk Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          © {new Date().getFullYear()} Habit Monk, All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);
