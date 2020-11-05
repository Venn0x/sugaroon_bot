let operatingOnGuilds = [];

module.exports = {

	onPluginLoad: function(guild){

		console.log("example plugin loaded for guild " + guild);

		operatingOnGuilds.push(guild)

	},

	onPluginUnload: function(guild){

		console.log("example plugin unloaded for guild " + guild);

		for(let i = 0; i < operatingOnGuilds.length; i++){

			if(operatingOnGuilds[i] == guild){

				operatingOnGuilds.splice(i, 1);

			}

		}

	},

	getInfo: function(){

		return "An example plugin.\n\nCommands: **" + botSettings.prefix + "hello**";

	}


}

bot.on("message", msg =>{ 

	if(!msg.guild) return 1; 

	if(!operatingOnGuilds.includes(msg.guild.id)) return 1;

	let isCmd = msg.content.startsWith(botSettings.prefix);

	let commandNoPrefix = msg.content.replace(botSettings.prefix, '').toLowerCase();

	if(isCmd){

		if(commandNoPrefix == "hello") msg.reply("world");

	}

})
