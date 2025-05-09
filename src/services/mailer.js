import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: 'shlendyrincon13@gmail.com',
    pass: 'alze uuio fyte mbit',
  },
})
