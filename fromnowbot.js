History = new Mongo.Collection("history");

if(Meteor.isClient) {
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
		TelegramBot.start();
		
		TelegramBot.addListener('/start', function(command, username) {
			return 'Send me a time/date you would like to calculate the difference from now til!';
		});
		
		/*TelegramBot.addListener('/test', function(command, username) {
			var commandCat = "";
			if(command.length >= 2)
				for(var i = 1; i < command.length; i++)
					commandCat += " " + command[i];
			
			return "test: " + commandCat.trim();
		});*/
		
		/*TelegramBot.addListener('/fromnow', function(command, username, message) {
			if(command.length < 2) return "You have not given any input!";
			var allText = "";
			for(var i = 1; i < command.length; i++)
				allText += " " + command[i];
			
			const messageDate = new Date(message.date * 1000);
			var givenDate = chrono.parse(allText, messageDate);
			
			if(givenDate[0] == null) {
				Meteor.call("addHistory", username, message.chat.id, allText, messageDate);
				return "Sorry, I did not understand the date you gave me.";
			} else {
				//TelegramBot.send("Raw chrono parse: " + chrono.parseDate(message), chat_id);
				var m = moment(givenDate[0].start.date());
				Meteor.call("addHistory", username, message.chat.id, allText, messageDate, givenDate[0].start.date());
				TelegramBot.send('_' + allText + '_ is *' + m.from(messageDate) + "*\n`" + m.format(Meteor.settings.public.dateDisplayFormat) + '`', message.chat.id, true);
				//return allText + ' is ' + m.fromNow() + "\n" + m.format(Meteor.settings.public.dateDisplayFormat);
				return false;
			}
		});*/
		
		TelegramBot.setCatchAllText(true, function(username, message) {
			const parseText = message.text;
			const messageDate = new Date(message.date * 1000);
			var givenDate = chrono.parse(parseText, messageDate);
			
			if(givenDate[0] == null) {
				Meteor.call("addHistory", username, message.chat.id, parseText, messageDate);
				TelegramBot.send("Sorry, I did not understand the date you gave me.", message.chat.id);
			} else {
				var m = moment(givenDate[0].start.date());
				Meteor.call("addHistory", username, message.chat.id, parseText, messageDate, givenDate[0].start.date());
				
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
				
				TelegramBot.send(parseText + diffPrefix + '\n'
					+ '*' + moment.duration(diffSeconds, 'seconds').format('y [years], M [months], d [days], h [hours] m [minutes and] s [seconds]') + '*' + diffSuffix
					+ '\nor more broadly, *' + m.from(messageDate) + "*\n`" + m.format(Meteor.settings.public.dateDisplayFormat) + '`'
					, message.chat.id, true);
			}
		});
	});
}

Meteor.methods({
	addHistory: function(username, chatId, inputText, messageDate, success) {
		if(typeof(success) == "object") {
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