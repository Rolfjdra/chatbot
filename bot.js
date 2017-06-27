'use strict';

// dfo - Under utvilking
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./config.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Hent facebook-bruker session
    // TODO: Hent facebook username?
    const recipientId = context._fbid_;
    if (recipientId) {
		 if(message.quick_replies) { // Wit.ai vil bruke quickreply!!
          message.quick_replies = ["ja","nei"];

          for(var i = 0, len = message.quick_replies.length; i < len; i++) { // Loop through quickreplies
              message.quick_replies.push({ title: message.quick_replies[i], content_type: 'text', payload: 'janei' });
          }
		  return FB.fbMessage(recipientId,message)
          delete message.quick_replies;
      }
	  
      // Fant mottaker
      // Sender bot respons.
      FB.fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Callback til bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Callback til bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    // Resetter link-context
    delete context.links 
    // Henter entity og lagrer i context
    const category = firstEntityValue(entities, 'intent');
    if (category) {
      context.cat = category; // lagrer i context
    }

    cb(context);
  },

  error(sessionId, context, error) {
    console.log(error.message);
  },

  // Links til brukerveiledning
  	['fetch-links'](sessionId, context, cb) {
		const wantedLinks = allLinks[context.cat || 'default']
		context.links = wantedLinks[Math.floor(Math.random() * wantedLinks.length)]

		cb(context)
	},
};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}

//Liste over lenker til brukerdokumentasjon:

const allLinks = {
  default: [''],
  Nettleser: ['https://dfo.no/kundesider/lonnstjenester/selvbetjening/stottede-nettlesere/'],
  Sperret : ['https://dfo.no/Documents/LA/Selvbetjening/Honorar/Hjelp_med_selvbetjeningsportalen.pdf'],

};