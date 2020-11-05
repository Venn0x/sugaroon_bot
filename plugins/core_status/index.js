
module.exports = {

	getInfo: function(){

		return "The plugin that handles the bot status";

	}

}

let activityPhase = 0, serversNo = 0, usersNo = 0;

bot.on("ready", () =>{  

	serversNo = bot.guilds.cache.size;
	usersNo = bot.users.cache.size;

});




setInterval(() => {

	if(activityPhase == 0){

		bot.user.setActivity(botSettings.prefix + "info", {
			type: "LISTENING"
		});

	}

	else if(activityPhase == 1){

		bot.user.setActivity(serversNo + " servers", {
			type: "WATCHING"
		});

	}

	else if(activityPhase == 2){

		bot.user.setActivity(usersNo + " users", {
			type: "WATCHING"
		});

	}

	else if(activityPhase == 3){

		bot.user.setActivity("with " + pluginList.length + " plugins", {
			type: "PLAYING"
		});

	}

	activityPhase++;

	if(activityPhase == 4) activityPhase = 0;

	

}, 5000);