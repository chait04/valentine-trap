import { Client, Users, Databases, Query } from 'node-appwrite';
import nodemailer from 'nodemailer';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT) // This is automatically set by Appwrite
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const users = new Users(client);
  const databases = new Databases(client);

  // Configure nodemailer with Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER, // Set this in Appwrite Console
      pass: process.env.SMTP_PASS  // Set this in Appwrite Console
    }
  });

  try {
    // Check for pending emails in the email_queue collection
    const pendingEmails = await databases.listDocuments(
      process.env.APPWRITE_FUNCTION_DATABASE_ID,
      'email_queue',
      [
        Query.equal('status', 'pending')
      ]
    );

    for (const emailDoc of pendingEmails.documents) {
      try {
        // Send email using nodemailer
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: emailDoc.to,
          subject: emailDoc.subject,
          html: emailDoc.content
        });

        // Update email status to sent
        await databases.updateDocument(
          process.env.APPWRITE_FUNCTION_DATABASE_ID,
          'email_queue',
          emailDoc.$id,
          {
            status: 'sent',
            sentAt: new Date().toISOString()
          }
        );

        log(`Email sent successfully to ${emailDoc.to}`);
      } catch (emailError) {
        error(`Failed to send email to ${emailDoc.to}: ${emailError.message}`);
        
        // Update email status to failed
        await databases.updateDocument(
          process.env.APPWRITE_FUNCTION_DATABASE_ID,
          'email_queue',
          emailDoc.$id,
          {
            status: 'failed',
            error: emailError.message
          }
        );
      }
    }

    return res.json({
      success: true,
      processed: pendingEmails.documents.length
    });
  } catch (err) {
    error("Function error: " + err.message);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};
