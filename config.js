'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
// tester dfoface
const WIT_TOKEN = process.env.WIT_TOKEN || "WRAXCGEZKGZCMMAHKGDQGKBHQZUB273X"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAABcpUgvhNoBAEsZCLChENftlNaMmzS9bF69YfKqiGSH7m4ZAZCsmvdGmkfNEymmPuzKmhuHLPFePwwnfWUyZCdIQpttqydZAr1eUYAsrD333rLDWKvlyxipms7CMCLE7ZAvwiFZAzKFofGZBWsZAunBmCmEuDZCjMkZANURmzDGhLZCJ6ZAZBmbZCNo8hrBf93pr9PCfoZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'my_voice_is_my_password_verify_me'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}