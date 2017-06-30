'use strict';
// Henter opp vertifikasjoner -> Facebookside, WIT-api, Heroku-webhook
// tester dfoface
const WIT_TOKEN = process.env.WIT_TOKEN || "WRAXCGEZKGZCMMAHKGDQGKBHQZUB273X"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAABcpUgvhNoBAI7GE4Tf6VTF2xayOnIUxBBBhM3DUveW2kKQDByPtGx4KEe8UxxCe4DK2q71qTJoALgYZCIj0odZC5UMZBamshWeywQ6LWfSXIhpJ9OOazeK0V8ZABzFZAXL6VwnDLSGnZCpP7UOZCabw1FDGhdgXQw9ZCyZBvRyBo03hxoxMmFVF7oo4Dg8FRaAZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'my_voice_is_my_password_verify_me'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}