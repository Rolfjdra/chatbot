'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN || "BLYWUAJGTL3CNRAFTFYNHDUPJLJSWCQD"
if (!WIT_TOKEN) {
  throw new Error("Ingen WIT_TOKEN. Hent: https://wit.ai/")
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || "EAACtPl97H00BAAMiuwNWZAP6km5cFbZBZCTd9z1vsk9ZBVVA1gjPe3exnjh94k9B2ZAo1mMwJ0zqP3q1q67p6bP4jvSW8I2f0ZCXeZC1GKZB0eo4SJSZBLm0moZBHMldGSTUO1TNEg1taMTEYcpDFA3UJjRWhMBFJs37u0PhZBLbPoPvwZDZD";
if (!FB_PAGE_TOKEN) {
	throw new Error("Ingen FB_PAGE_TOKEN. Gå til https://developers.facebook.com/docs/pages/access-tokens")
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'my_voice_is_my_password_verify_me'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}