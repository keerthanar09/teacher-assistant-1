import { sendEmail } from '../../../utils/sendEmail';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email, username, password, role, verificationCode, action } = req.body;
  console.log(req.body);

  try {
    if (action === 'send-code') {
      // Generate a 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Code expires in 10 minutes

      console.log(code);

      // Save or update verification code in DB
      try {
        const result = await prisma.verification.upsert({
          where: { email },
          update: { code, expiresAt },
          create: { email, code, expiresAt },
        });
        
        console.log("Verification record:", result); // Log successful insert
      } catch (error) {
        console.error("Prisma Upsert Error:", error);
        return res.status(500).json({ error: "Database error", details: error.message });
      }

      // Send verification email
      const emailSent = await sendEmail(email, 'Your Verification Code', `<p>Your verification code is: <strong>${code}</strong></p>`);
      if (!emailSent) return res.status(500).json({ error: 'Failed to send verification email. Try again.' });

      return res.status(200).json({ message: 'Verification code sent. Check your email.' });
    }

    if (action === 'verify-code') {
      const storedCode = await prisma.verification.findUnique({ where: { email } });

      if (!storedCode || storedCode.code !== verificationCode || new Date() > storedCode.expiresAt) {
        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      return res.status(200).json({ message: 'Verification successful. You can now proceed.' });
    }

    if (action === 'signup') {
      // Ensure role is either TEACHER or STUDENT
      if (!["TEACHER", "STUDENT"].includes(role.toUpperCase())) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ error: 'Account already exists' });

      const storedCode = await prisma.verification.findUnique({ where: { email } });
      if (!storedCode) return res.status(400).json({ error: 'Verification required' });

      console.log("Creating user with:", { username, email, password, role});


      // Create user in the User table
      await prisma.user.create({ 
        data: { username: username, email: email, password: password, role: role.toUpperCase(), } 
      });

      // Remove verification code after successful signup
      await prisma.verification.delete({ where: { email } });

      return res.status(200).json({ message: 'Signup successful. You can now log in.' });
    }

    return res.status(400).json({ error: 'Invalid request' });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ error: 'Internal Server Error. Please try again later.' });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects to prevent connection issues
  }
}
