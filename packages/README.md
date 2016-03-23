# FromNowBot - Telegram Bot


### settings.json
Run the app with this supplied json file to make use of all the features of the bot

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
	  { "input": "what is love?", "reply": "baby don't hurt me" },
	  { "input": "don't hurt me", "reply": "no more" }
  ],
  "public": {
    "dateDisplayFormat": "dddd, MMMM Do YYYY, h:mm:ssa (Z)"
  }
}
```
