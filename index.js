global.Discord = require('discord.js');
const fs = require('fs');


var botSettingsRaw = require("./botsettings.json");
global.botSettings = {};
let key;

for (key in botSettingsRaw) {
	if(key != "token") botSettings[key] = botSettingsRaw[key];
}



global.pluginList = require("./plugins/pluginList.json")

global.bot = new Discord.Client();

global.plugins = {};

global.servers = {};

for(let i = 0; i < pluginList.length; i++){

	plugins[pluginList[i]] = require("./plugins/" + pluginList[i]);

}

bot.on('ready', () => {

	let guild;

	for (guild of bot.guilds.cache){

		let guildId = guild[0];

		fs.stat('./servers/' + guildId + ".json", function(err, stat) {

			if(err == null){

				servers[guildId] = require("./servers/" + guildId + ".json");

				plugins.core_plugin.loadPluginsForGuild(guildId);

			}

			else if(err.code === 'ENOENT') {

			    fs.copyFile("./servers/defaults.json", "./servers/" + guildId + ".json", fs.constants.COPYFILE_EXCL, () => {});

				servers[guildId] = require("./servers/defaults.json");

				plugins.core_plugin.loadPluginsForGuild(guildId);

			} else {

			    console.log('Reading servers error: ', err.code);
			
			}

		});

	}


});


/*setTimeout(() => {

	console.log(servers);

}, 5000);*/

bot.login(botSettingsRaw.token);
