import { createClient } from "@/lib/supabase/server";

// Email service using a simple endpoint (can be SendGrid, Resend, etc.)
export async function sendEmailNotification(
  recipientEmail: string,
  subject: string,
  message: string
) {
  try {
    if (!process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL) {
      console.log("Email notifications not configured");
      return;
    }

    // Using Resend.com or similar service
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.NEXT_PUBLIC_NOTIFICATION_EMAIL,
        to: recipientEmail,
        subject,
        html: message,
      }),
    });

    if (!response.ok) {
      console.error("Failed to send email:", await response.text());
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// SMS notification using Twilio
export async function sendSmsNotification(
  phoneNumber: string,
  message: string
) {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      console.log("SMS notifications not configured");
      return;
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER || "",
          To: phoneNumber,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to send SMS:", await response.text());
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
}

// Notify when someone receives a message
export async function notifyMessageReceived(
  recipientId: string,
  senderName: string
) {
  try {
    const supabase = await createClient();

    // Get recipient profile with notification preferences
    const { data: recipient } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", recipientId)
      .maybeSingle();

    if (!recipient) return;

    const message = `${senderName} sent you a message on Gachi!`;
    const subject = `New message from ${senderName}`;
    const htmlMessage = `
      <p>${senderName} sent you a message on Gachi!</p>
      <p><a href="https://eatgachi.com/app/matches">View message</a></p>
    `;

    if (recipient.email_notifications && recipient.email) {
      await sendEmailNotification(recipient.email, subject, htmlMessage);
    }

    if (recipient.sms_notifications && recipient.phone_number) {
      await sendSmsNotification(recipient.phone_number, message);
    }

    // Log notification event
    await supabase.from("notification_events").insert({
      profile_id: recipientId,
      event_type: "message_received",
    });
  } catch (error) {
    console.error("Error notifying message:", error);
  }
}

// Notify when someone proposes a plan
export async function notifyPlanProposed(
  recipientId: string,
  senderName: string,
  restaurantName: string
) {
  try {
    const supabase = await createClient();

    const { data: recipient } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", recipientId)
      .maybeSingle();

    if (!recipient) return;

    const message = `${senderName} proposed dining at ${restaurantName}!`;
    const subject = `Dining proposal from ${senderName}`;
    const htmlMessage = `
      <p>${senderName} proposed a plan to dine at ${restaurantName}!</p>
      <p><a href="https://eatgachi.com/app/matches">View proposal</a></p>
    `;

    if (recipient.email_notifications && recipient.email) {
      await sendEmailNotification(recipient.email, subject, htmlMessage);
    }

    if (recipient.sms_notifications && recipient.phone_number) {
      await sendSmsNotification(recipient.phone_number, message);
    }

    await supabase.from("notification_events").insert({
      profile_id: recipientId,
      event_type: "plan_proposed",
    });
  } catch (error) {
    console.error("Error notifying plan:", error);
  }
}
