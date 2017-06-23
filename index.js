//This is still work in progress
//asd
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var Config = require('./config')

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hei, jeg er DFØ sin chatbot!')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === Config.FB_VERTIFY_TOKEN) {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})


// to send messages to facebook
app.post('/webhooks', function (req, res) {
  var entry = FB.getMessageEntry(req.body)
  // IS THE ENTRY A VALID MESSAGE?
  if (entry && entry.message) {
    if (entry.message.attachments) {
      // NOT SMART ENOUGH FOR ATTACHMENTS YET
      FB.newMessage(entry.sender.id, "That's interesting!")
    } else {
      // SEND TO BOT FOR PROCESSING
       Bot.read(entry.sender.id, entry.message.text, function (sender, reply) {
         FB.newMessage(sender, reply)
      })
    }
  }

  res.sendStatus(200)
})



