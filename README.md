# FromNowBot - Telegram Bot

FromNowBot is a Telegram Bot made to reply with the time difference from now until the given time/date.

Live at [@FromNowBot](https://telegram.me/FromNowBot)

Makes use of [benjick:telegram-bot](https://github.com/benjick/meteor-telegram-bot) extensively.

### settings.json
Run the app with this supplied json file to make use of all the features of the bot.

Note that custom messages' `input` will be lower-cased before comparison. `reply` is markdown-enabled.

> Run with `meteor run --settings settings.json`
```json
{
  "BotAPIKey": "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11",
  "BotCustomMessages": [
	  { "input": "help", "reply": "Send me a time/date you would like to calculate the difference from now til!" },
	  { "input": "list", "reply": "Send me a time/date you would like to calculate the difference from now til!" },
	  { "input": "/help", "reply": "Send me a time/date you would like to calculate the difference from now til!" },
	  { "input": "/list", "reply": "Send me a time/date you would like to calculate the difference from now til!" },
	  { "input": "start", "reply": "Send me a time/date you would like to calculate the difference from now til!" },
	  { "input": "/start", "reply": "Send me a time/date you would like to calculate the difference from now til!" },
	  { "input": "what is love?", "reply": "_Baby don't hurt me_" },
	  { "input": "don't hurt me", "reply": "*No more*" },
	  { "input": "r2d2", "reply": "[R2D2's Secret Message](https://www.youtube.com/watch?v=6-HUgzYPm9g)" }
  ],
  "public": {
    "dateDisplayFormat": "dddd, MMMM Do YYYY, h:mm:ssa (Z)"
  }
}
```

---

> This is my first public experiment with Meteor!
