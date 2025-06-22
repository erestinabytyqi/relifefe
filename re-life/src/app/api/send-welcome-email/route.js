import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('Email payload received:', body);

    const { email, password } = body;

    if (!email || !password) {
      console.warn('Missing email or password');
      return new Response(JSON.stringify({ error: 'Missing email or password' }), {
        status: 400,
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Sending email to:', email);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to ReLife',
      text: `Welcome! Your temporary login password is: ${password}`,
    });

    console.log('Email sent!');
    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    console.error('Email sending failed:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
    });
  }
}
