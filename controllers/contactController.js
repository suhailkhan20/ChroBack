const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
    const { name, email, message } = req.body;

    // 1. Create a transporter object using your SMTP details
    let transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services or your own SMTP
        auth: {
            user: 'suhailkhan2k5p@gmail.com', // Your Gmail email address
            pass: 'rgav gsxc rsqa neca' // Your Gmail app password
        }
    });

    // 2. Define the email content
    const mailOptions = {
        from: `"${name}" <${email}>`, // Sender's information
        to: 'suhailkhan2k5p@gmail.com', // Recipient's email address
        subject: `New Contact Message from ${name}`,
        html: `<p>You have a new message from a ChroLog visitor:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`
    };

    // 3. Send the email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error sending message.' });
    }
};

module.exports = { sendEmail };