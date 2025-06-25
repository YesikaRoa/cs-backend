import nodemailer from 'nodemailer'
import { EmailService } from './EmailService.js'

export class NodemailerAdapter extends EmailService {
  constructor() {
    super()
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // ⚠️ Ignora certificados no confiables
      },
    })
  }

  async sendEmail({ to, subject, html }) {
    const from = process.env.EMAIL_USER
    const mailOptions = {
      from,
      to,
      subject,
      html,
    }

    return this.transporter.sendMail(mailOptions)
  }
}
