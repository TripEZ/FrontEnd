const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const nunjucks = require('nunjucks')
const Nexmo = require('nexmo')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
nunjucks.configure('dist/frontend/', {express:app})

const nexmo = new Nexmo({ 
    apiKey: '48441f95',
    apiSecret: 'pyXFXNrJhdPFc6rO'
  })
  
  app.get('/', (req, res) => { 
    res.render('twoFactor.html', { message: 'Enter your verification code' }) 
  })

  app.post('/verify', (req, res) => {
    nexmo.verify.request({
      number: req.body.number,
      brand: 'ACME Corp'
    }, (error, result) => {
      if(result.status != 0) {
        res.render('twoFactor.html', { message: result.error_text })
      } else {
        res.render('check.html', { requestId: result.request_id })
      }
    })
    app.post('/check', (req, res) => {
        nexmo.verify.check({
          request_id: req.body.requestId,
          code: req.body.code
        }, (error, result) => {
          if(result.status != 0) {
            res.render('twoFactor.html', { message: result.error_text })
          } else {
            res.render('success.html')
          }
        })
      })
  })
const app = express();

// Serve only the static files form the dist directory
app.use(express.static('./dist/frontend'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/frontend/'}),
);

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 4200);
