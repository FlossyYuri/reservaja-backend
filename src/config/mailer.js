const nodemailer = require('nodemailer')
const mail = require('./mail.json')
var inLineCss = require('nodemailer-juice');
const hbs = require('nodemailer-express-handlebars')
const transport = nodemailer.createTransport({ ...mail })

transport.verify(function (error, success) {
  if (error) {
    console.log(error)
  } else {
    console.log('*****************************')
    console.log('*   Mail Server: OK         *')
    console.log('*****************************')
  }
})

const mailer = (payload) => {
  return new Promise((resolve, reject) => {
    const { to, subject, template, context } = payload

    const options = {
      viewEngine: {
        extname: '.html', // handlebars extension
        layoutsDir: './views/', // location of handlebars templates
        defaultLayout: false, // name of main template
        partialsDir: './views/', // location of your subtemplates aka. header, footer etc
      },
      viewPath: './views/',
      extName: '.html',
    }

    transport.use('compile', hbs(options))
    transport.use('compile', inLineCss(options))
    transport.sendMail(
      {
        from: 'reservaja-suporte@ejitech.co.mz',
        to,
        subject, // email subject `Repor a palavra-passe de RADAR`
        template,
        context,
      },
      (err) => {
        if (err) {
          console.log({ status: err })
          reject(err)
        }
        console.log({ status: 'Sended' })
        resolve({ status: 'Sended' })
      }
    )
  })
}

module.exports = mailer
