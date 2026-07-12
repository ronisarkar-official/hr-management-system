"use server";

import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(payload: EmailPayload): Promise<boolean> {
  if (!EMAIL_USER || !EMAIL_PASS) {
    console.warn("[Email] Gmail SMTP not configured. Set EMAIL_USER and EMAIL_PASS in .env");
    return false;
  }

  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: '"HrFlow" <' + EMAIL_USER + ">",
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    });

    console.log('[Email] Sent: "' + payload.subject + '" to ' + payload.to);
    return true;
  } catch (err) {
    console.error("[Email] Gmail SMTP error:", err);
    return false;
  }
}

export async function sendLeaveStatusEmail(params: {
  employeeEmail: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "approved" | "rejected";
  adminRemarks?: string | null;
}): Promise<boolean> {
  const statusLabel = params.status === "approved" ? "Approved" : "Rejected";
  const statusColor = params.status === "approved" ? "#16a34a" : "#dc2626";

  const html =
    `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <div style="background: #0a1229; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #D4F547; margin: 0; font-size: 20px;">HrFlow</h1>
      </div>
      <div style="border: 1px solid #e5e5e5; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 8px; font-size: 18px;">Leave Request ` +
    statusLabel +
    `</h2>
        <p style="color: #737373; margin: 0 0 16px;">Hi ` +
    params.employeeName +
    `,</p>
        <p style="color: #737373; margin: 0 0 16px;">Your leave request has been <strong style="color: ` +
    statusColor +
    `;">` +
    statusLabel +
    `</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="padding: 8px 0; color: #737373; font-size: 14px;">Leave Type</td><td style="padding: 8px 0; font-size: 14px; font-weight: 500;">` +
    params.leaveType +
    `</td></tr>
          <tr><td style="padding: 8px 0; color: #737373; font-size: 14px;">Start Date</td><td style="padding: 8px 0; font-size: 14px; font-weight: 500;">` +
    params.startDate +
    `</td></tr>
          <tr><td style="padding: 8px 0; color: #737373; font-size: 14px;">End Date</td><td style="padding: 8px 0; font-size: 14px; font-weight: 500;">` +
    params.endDate +
    `</td></tr>
          <tr><td style="padding: 8px 0; color: #737373; font-size: 14px;">Status</td><td style="padding: 8px 0; font-size: 14px; font-weight: 500; color: ` +
    statusColor +
    `;">` +
    statusLabel +
    `</td></tr>
          ` +
    (params.adminRemarks
      ? `<tr><td style="padding: 8px 0; color: #737373; font-size: 14px;">Remarks</td><td style="padding: 8px 0; font-size: 14px; font-style: italic;">` +
        params.adminRemarks +
        `</td></tr>`
      : "") +
    `
        </table>
        <p style="color: #737373; font-size: 12px; margin: 0;">This is an automated notification from HrFlow.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.employeeEmail,
    subject: "Leave Request " + statusLabel + " — HrFlow",
    html,
  });
}

export async function sendWelcomeEmail(params: {
  email: string;
  name: string;
  loginId: string;
  tempPassword: string;
}): Promise<boolean> {
  const html =
    `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <div style="background: #0a1229; padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #D4F547; margin: 0; font-size: 20px;">HrFlow</h1>
      </div>
      <div style="border: 1px solid #e5e5e5; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
        <h2 style="margin: 0 0 8px; font-size: 18px;">Welcome to HrFlow!</h2>
        <p style="color: #737373; margin: 0 0 16px;">Hi ` +
    params.name +
    `,</p>
        <p style="color: #737373; margin: 0 0 16px;">Your account has been created. Use the credentials below to sign in.</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px; font-size: 12px; color: #737373;">Login ID</p>
          <p style="margin: 0 0 16px; font-family: monospace; font-size: 16px; font-weight: bold;">` +
    params.loginId +
    `</p>
          <p style="margin: 0 0 8px; font-size: 12px; color: #737373;">Temporary Password</p>
          <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: bold;">` +
    params.tempPassword +
    `</p>
        </div>
        <p style="color: #737373; font-size: 12px; margin: 0;">Please change your password after first login.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.email,
    subject: "Welcome to HrFlow — Your Account Credentials",
    html,
  });
}
