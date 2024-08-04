const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: 'info@cochisweb.com',
        pass: 'uxrodsiiwzgsxryv'
        /* pass: 'uxrodsiiwzgsxryv' */
    }
});

transporter.verify().then(() => {
    console.info('Ready for send emails');
})


module.exports = {
    transporter,
}
