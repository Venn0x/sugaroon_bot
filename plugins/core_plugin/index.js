const fs = require('fs');

module.exports = {

	loadPluginsForGuild: function(guild){

		for(let i = 0; i < servers[guild].pluginsEnabled.length; i++){

			plugins[servers[guild].pluginsEnabled[i]].onPluginLoad(guild);

		}

		return 1;
	},

	getInfo: function(){

		return "The plugin that handles enabling and disabling plugins.\n\nCommands: **" + botSettings.prefix + "plugin <enable / disable / list>**";

	},

	enablePluginEx: function(guild, plugin){enablePlugin(guild, plugin)},

	disablePluginEx: function(guild, plugin){disablePlugin(guild, plugin)},

}


function enablePlugin(guild, plugin){

	if(servers[guild].pluginsEnabled.includes(plugin)) return 1;

	servers[guild].pluginsEnabled.push(plugin);

	plugins[plugin].onPluginLoad(guild);

	updatePlugins(guild);

}

function disablePlugin(guild, plugin){

	if(!servers[guild].pluginsEnabled.includes(plugin)) return 1;

	for(let i = 0; i < servers[guild].pluginsEnabled.length; i++){

		if(servers[guild].pluginsEnabled[i] == plugin){

			servers[guild].pluginsEnabled.splice(i, 1);

		}

	}

	plugins[plugin].onPluginUnload(guild);

	updatePlugins(guild);


}

function updatePlugins(guild){

	fs.writeFile('./servers/' + guild + ".json", JSON.stringify(servers[guild]), function (err) {
	  if (err) throw err;
	});

}

bot.on("message", msg =>{  

	if(!msg.guild) return 1;

	let isCmd = msg.content.startsWith(botSettings.prefix);

	let commandNoPrefix = msg.content.replace(botSettings.prefix, '').toLowerCase();

	let args = commandNoPrefix.split(" ");

	commandNoPrefix = args[0];

	if(isCmd){

		if(commandNoPrefix == "plugins" || commandNoPrefix == "plugin") {

			

			switch(args[1]){
				case ("enable"):{
					
					if(args[2].startsWith("core_")){

						msg.channel.send("You can't toggle the bot core plugins");

						return 1;

					}

					if(!plugins.hasOwnProperty(args[2])) {

						msg.channel.send("Invalid plugin");

						return 1;

					}

					let plugin = args[2];

					if(servers[msg.guild.id].pluginsEnabled.includes(plugin)){

						msg.channel.send("That plugin is already enabled");

						return 1;

					}

					enablePlugin(msg.guild.id, plugin);

					msg.channel.send("Plugin **" + plugin + "** enabled." );

					break;
				}

				case ("disable"):{
					
					if(args[2].startsWith("core_")){

						msg.channel.send("You can't toggle the bot core plugins");

						return 1;

					}

					if(!plugins.hasOwnProperty(args[2])) {

						msg.channel.send("Invalid plugin");

						return 1;

					}

					let plugin = args[2];

					if(!servers[msg.guild.id].pluginsEnabled.includes(plugin)){

						msg.channel.send("That plugin is not enabled");

						return 1;

					}

					disablePlugin(msg.guild.id, plugin);

					msg.channel.send("Plugin **" + plugin + "** disabled." );

					break;
				}

				case ("list"):{
					
					msg.channel.send("Plugins enabled: ```" + servers[msg.guild.id].pluginsEnabled.toString() + " ```");

					break;
				}

				default:{
					
					msg.channel.send("Syntax: " + botSettings.prefix + "plugins <enable / disable / list>");

					break;
				}


			}

		}

	}

})