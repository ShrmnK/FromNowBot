History = new Mongo.Collection('history');

if(Meteor.isClient) {
	Meteor.subscribe('history');

	Template.body.helpers({
		history: function() {
			return History.find({});
		}
	});

	Template.history_item_success.helpers({
		formatHumanDate: function(date) {
			return moment(date).fromNow();
		},
		formatRawDate: function(date) {
			return moment(date).format(Meteor.settings.public.dateDisplayFormat);
		}
	});

	Template.history_item_fail.helpers({
		formatHumanDate: function(date) {
			return moment(date).fromNow();
		},
		formatRawDate: function(date) {
			return moment(date).format(Meteor.settings.public.dateDisplayFormat);
		}
	});
}

if(Meteor.isServer) {
	Meteor.startup(function () {
		var chrono = Meteor.npmRequire('chrono-node');

		TelegramBot.token = Meteor.settings.BotAPIKey;

		var botUsername = '';
		const getMe = TelegramBot.method('getMe');
		if(getMe) {
			botUsername = getMe.result.username;
			console.log('Connected to Telegram Bot API successfully with @' + botUsername);

			TelegramBot.addListener('/start', function(command, username) {
				return 'Send me a time/date you would like to calculate the difference from now til!';
			});

			TelegramBot.addListener('/help', function(command, username) {
				return 'Send me a time/date you would like to calculate the difference from now til!';
			});

			TelegramBot.addListener('/list', function(command, username) {
				return 'There are no commands! Send me a time/date you would like to calculate the difference from now til!';
			});

			TelegramBot.setCatchAllText(true, function(username, message) {
				const parseText = message.text.replace('@' + botUsername, '').trim();
				const messageDate = new Date(message.date * 1000);
				var givenDate = chrono.parse(parseText, messageDate);

				if(givenDate[0] == null) {
					Meteor.call('addHistory', username, message.chat.id, parseText, messageDate);
					// Custom Message Handler
					if(typeof(Meteor.settings.BotCustomMessages) !== 'undefined') {
						const obj = _.find(Meteor.settings.BotCustomMessages, obj => obj.input == parseText.toLowerCase());
						if(obj) {
							TelegramBot.send(obj.reply, message.chat.id, true);
							return console.log('> ' + message.chat.id + '/' + username + ' [c]: ' + obj.reply);
						}
					}
					return TelegramBot.send('Sorry, I did not understand that.\nEnter any date and I will calculate the time difference from now til then!', message.chat.id);
				} else {
					var m = moment(givenDate[0].start.date());
					Meteor.call('addHistory', username, message.chat.id, parseText, messageDate, givenDate[0].start.date());

					var diffSeconds = m.diff(messageDate, 'seconds');
					if(diffSeconds == 0) return TelegramBot.send("That's right now...", message.chat.id, true);

					// Parse precise difference
					var diffPrefix = '';
					var diffSuffix = '';
					if(diffSeconds > 0) diffPrefix = ' is in:';
					else {
						diffSeconds *= -1;
						diffSuffix = ' ago';
					}

					return TelegramBot.send(parseText + diffPrefix + '\n'
						+ '*' + moment.duration(diffSeconds, 'seconds').format('y [years], M [months], d [days], h [hours] m [minutes and] s [seconds]') + '*' + diffSuffix
						+ '\nor more broadly, *' + m.from(messageDate) + "*\n`" + m.format(Meteor.settings.public.dateDisplayFormat) + '`'
						, message.chat.id, true);
				}
			});

			TelegramBot.start();
			console.log('Polling started');

		} else {
			console.log('Sorry, it seems that there are errors connecting to the Telegram API. Are you sure you have supplied the API key?');
		}
	});

	Meteor.publish('history', function () {
		return History.find();
	});
}

Meteor.methods({
	addHistory: function(username, chatId, inputText, messageDate, success) {
		if(typeof(success) == 'object') {
			History.insert({
				username: username,
				chat_id: chatId,
				timestamp: messageDate,
				inputText: inputText,
				target_date: success,
				query_success: true
			});
			console.log(chatId + '/' + username + ' [y]: ' + inputText);
		} else {
			History.insert({
				username: username,
				chat_id: chatId,
				timestamp: messageDate,
				inputText: inputText,
				target_date: new Date(),
				query_success: false
			});
			console.log(chatId + '/' + username + ' [n]: ' + inputText);
		}
	}
});
