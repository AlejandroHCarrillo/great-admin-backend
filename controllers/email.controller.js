var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ignaciojaimes976@gmail.com',
      pass: 'Ij4!m35YLL7147147135'
    }
  });
  
  // var mailOptions = {
  //   from: 'ignaciojaimes976@gmail.com',
  //   to: 'el_grande_ahc@hotmail.com',
  //   subject: 'Sending Email using Node.js',
  //   text: 'That was easy!'
  // };
  
//  transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

  const enviarCorreo = (req, res = response) => { 
    console.log("enviarCorreo...");
    const emailOptions = req.body;

    console.log(emailOptions);

    try{

        transporter.sendMail(emailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.status(500).json({
                ok: false,
                msg: "Error de evio de correo.",
                error
            });
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).json({
                    ok: true,
                    msg: "Correo enviado."
                });
            }
          });
          


    } catch(err){
        res.status(500).json({
            ok: false,
            msg: "Error de evio de correo.",
            err
        });
    }

  }

  module.exports = {
    enviarCorreo
  }