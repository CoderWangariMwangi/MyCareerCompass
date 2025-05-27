import { Resend } from "resend"
import { type NextRequest, NextResponse } from "next/server"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, subject, message } = await request.json()

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 },
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "MyCareerCompass Test <onboarding@resend.dev>", // Using Resend's test domain
      to: ["sylviamwangi42@gmail.com"],
      subject: `Contact Form: ${subject}`,
      replyTo: email,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="color: #e0e7ff; margin: 5px 0 0 0;">MyCareerCompass</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
            <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
              <h2 style="color: #1e293b; margin-top: 0;">Contact Information</h2>
              <p><strong>Name:</strong> ${firstName} ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 6px;">
              <h2 style="color: #1e293b; margin-top: 0;">Message</h2>
              <div style="background: #f1f5f9; padding: 15px; border-radius: 4px; border-left: 4px solid #3b82f6;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #dbeafe; border-radius: 6px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af; font-size: 14px;">
                <strong>💡 Tip:</strong> You can reply directly to this email to respond to ${firstName}.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #64748b; font-size: 12px;">
            <p>This email was sent from the MyCareerCompass contact form</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission - MyCareerCompass

From: ${firstName} ${lastName}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from MyCareerCompass
Timestamp: ${new Date().toLocaleString()}
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send email. Please try again or contact directly.",
        },
        { status: 500 },
      )
    }

    console.log("Email sent successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      emailId: data?.id,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message. Please try again.",
      },
      { status: 500 },
    )
  }
}
