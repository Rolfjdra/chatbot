'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
// tester dfoface2
const WIT_TOKEN = process.env.WIT_TOKEN
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}