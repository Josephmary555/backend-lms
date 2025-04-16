const nodemailer = require('nodemailer');

const createTransporter = (service, user, pass) => {
  return nodemailer.createTransport({
    service,
    auth: {
      user,
      pass, // use app password if 2FA is enabled
    },
  });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourlibraryemail@gmail.com',
    pass: 'yourpassword', // use app password if 2FA is enabled
  },
});

const sendReservationEmail = (to, bookTitle, service = 'gmail', user = 'yourlibraryemail@gmail.com', pass = 'yourpassword') => {
  const transporter = createTransporter(service, user, pass);

  const mailOptions = {
    from: user,
    to,
    subject: 'Book Reserved',
    text: `Your reservation for "${bookTitle}" has been confirmed.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error('Email failed:', err);
    else console.log('Email sent:', info.response);
  });
};

module.exports = { sendReservationEmail };
