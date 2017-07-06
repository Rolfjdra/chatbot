'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
// tester dfoface2
const WIT_TOKEN = process.env.WIT_TOKEN || "WRAXCGEZKGZCMMAHKGDQGKBHQZUB273X"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAACtPl97H00BANw3vkyiALfImKBmY3FYNKXvBO7j9xNHZAEHVAYiMIYFZA00qbyvN8NxZCPY6dTcCYDHdDayjfGwVTkj9QSVZCyO7S3J6iu2uWlIUNpGWni2pcZCOuqpGQejKDn4lA4hymzj3BxDCZBq7KcgwGN5aqzPsRmjwq7QZDZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'rolf'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}