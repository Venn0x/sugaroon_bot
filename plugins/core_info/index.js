
module.exports = {

	getInfo: function(){

		return "The plugin that handles 'info' and 'help' commands";

	}

}

bot.on("message", msg =>{  

	if(!msg.guild) return 1;

	let isCmd = msg.content.startsWith(botSettings.prefix);

	let commandNoPrefix = msg.content.replace(botSettings.prefix, '').toLowerCase();

	let args = commandNoPrefix.split(" ");

	commandNoPrefix = args[0];

	if(isCmd){

		if(commandNoPrefix == "info") {

			const exampleEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('Bot info')
				.setDescription('Plugin-based bot.')
				.addFields(
					{ name: 'Commands:', value: '\u200B' },
					{ name: 'This message', value: botSettings.prefix + 'info', inline: true },
					{ name: 'Plugins', value: botSettings.prefix + 'plugin <enable / disable / list>', inline: true },
					{ name: 'Help', value: botSettings.prefix + 'help plugin **[plugin name]**', inline: true },
				)

			msg.channel.send(exampleEmbed);

		}

		if(commandNoPrefix == "help") {

			let response = "General information: **" + botSettings.prefix + "info**";

			if(args[1] == "plugin" || args[1] == "plugins"){

				if(args[2] == null) response = "Use **" + botSettings.prefix + "help plugin [plugin name]**";

				else{

					if(!plugins.hasOwnProperty(args[2])) {

						response = "Invalid plugin";

					}

					else{

						response = plugins[args[2]].getInfo();

					}

				}

			}

			msg.channel.send(response);

		}

	}

})