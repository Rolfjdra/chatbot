//This is still work in progress

'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var FB = require('facebook')
var Bot = require('bot)

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
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token')
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			Bot.read(entry.sender.id, entry.message.text, function (sender, reply) {
        			FB.newMessage(sender, reply)
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})



// recommended to inject access tokens as environmental variables, e.g.
const token = "EAACtPl97H00BAAMiuwNWZAP6km5cFbZBZCTd9z1vsk9ZBVVA1gjPe3exnjh94k9B2ZAo1mMwJ0zqP3q1q67p6bP4jvSW8I2f0ZCXeZC1GKZB0eo4SJSZBLm0moZBHMldGSTUO1TNEg1taMTEYcpDFA3UJjRWhMBFJs37u0PhZBLbPoPvwZDZD"


function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}



// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})