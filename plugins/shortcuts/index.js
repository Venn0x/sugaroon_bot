const fs = require('fs');

let operatingOnGuilds = [];

//let customevents = require("./unparsed.json"); //resources auth token ca sa comunice webserverul cu botul securely gen sa nu intre oricine pe link sa vada comenzile

let customevents = {}

module.exports = {

	onPluginLoad: function(guild){

		console.log("plugin shortcuts loaded for guild " + guild);

		operatingOnGuilds.push(guild);

		//load shortcuts for server//

		fs.stat('./plugins/shortcuts/servers/' + guild + ".json", function(err, stat) {

			if(err == null){

				customevents[guild] = require("./servers/" + guild + ".json");

			}

			else if(err.code === 'ENOENT') {

			    fs.copyFile("./plugins/shortcuts/servers/defaults.json", "./plugins/shortcuts/servers/" + guild + ".json", fs.constants.COPYFILE_EXCL, () => {});

				customevents[guild] = require("./servers/defaults.json");

			} else {

			    console.log('Reading shortcuts error: ', err.code);
			
			}

		});

		


	},

	onPluginUnload: function(guild){

		delete require.cache[require.resolve("./servers/" + guild + ".json")]; ;

		console.log("plugin shortcuts unloaded for guild " + guild);

		for(let i = 0; i < operatingOnGuilds.length; i++){

			if(operatingOnGuilds[i] == guild){

				operatingOnGuilds.splice(i, 1);

			}

		}

		delete customevents[guild];

	},

	getInfo: function(){

		return "The plugin that helps you buils easy but complex systems with shortcuts.\n\nCommands: **" + botSettings.prefix + "reloadshortcuts**\n\nOther commands can be cusotom made.";

	}


}

bot.on("message", msg =>{  

	if(!msg.guild) return 1;

	if(!operatingOnGuilds.includes(msg.guild.id)) return 1;

	let guild = msg.guild.id;

	let isCmd = msg.content.startsWith(botSettings.prefix);

	let commandNoPrefix = msg.content.replace(botSettings.prefix, '').toLowerCase();

	if(commandNoPrefix == "reloadshortcuts" && isCmd){

		delete require.cache[require.resolve("./servers/" + guild + ".json")];

		customevents[guild] = require("./servers/" + guild + ".json");

		msg.channel.send("The shortcuts were reloaded")

		return 1;

	}

	for(let i = 0; i < customevents[guild].length; i++){

		if(customevents[guild][i].calledOn.event == "user_text"){

			if(customevents[guild][i].calledOn.content == commandNoPrefix){

				if(customevents[guild][i].calledOn.cmdPrefix && isCmd){

					let trigger = msg;
			

					runEvent(guild, {trg: trigger, blocks: customevents[guild][i].cmdBlocks})

				}

			}

		}

	}

})

bot.on('guildMemberAdd', member => {

	if(!operatingOnGuilds.includes(member.guild.id)) return 1;
	
	let guild = member.guild.id;

	for(let i = 0; i < customevents[guild].length; i++){

		if(customevents[guild][i].calledOn.event == "user_join"){


			let trigger = {author: member, channel: {id: -1}};

			runEvent(guild, {trg: trigger, blocks: customevents[i].cmdBlocks})				

		}

	}

});

function runEvent(guild, params){

	let trg = params.trg;
	let blocks = params.blocks;

	for(let i = 0; i < blocks.length; i++){

		if(blocks[i].block_type == "send_text"){

			let sendToCh = 0;

			if(blocks[i].channel == -1) sendToCh = trg.channel.id;

			else sendToCh = blocks[i].channel;

			bot.guilds.cache.get(guild).channels.cache.get(sendToCh).send(parseStringObs(guild, blocks[i].content, {
				servername: bot.guilds.cache.get(guild).name,
				user: trg.author
			}));
		}

		if(blocks[i].block_type == "send_private_text"){

			let rcv = {}

			if(blocks[i].receiver == "%user%") rcv = trg.author;



			rcv.send(parseStringObs(guild, blocks[i].content, {
				servername: bot.guilds.cache.get(guild).name,
				user: trg.author
			}))

		}


		if(blocks[i].block_type == "give_role"){

			let rcv = {}

			if(blocks[i].user == "%user%") rcv = trg.author;

			let role = bot.guilds.cache.get(guild).roles.cache.get(blocks[i].roleid);

			let user = bot.guilds.cache.get(guild).members.cache.get(rcv.id);

			user.roles.add(role);

		}

		if(blocks[i].block_type == "if_statement"){

			let prop = parseStringObs(guild, blocks[i].checkFor, {
				servername: bot.guilds.cache.get(guild).name,
				user: trg.author
			});

			let eq = parseStringObs(guild, blocks[i].equalTo, {
				servername: bot.guilds.cache.get(guild).name,
				user: trg.author
			});

			if(blocks[i].hasToBeTrue == true){
				if(prop == eq) runEvent(guild, {trg: trg, blocks: blocks[i].then.cmdBlocks}) 
				else runEvent(guild, {trg: trg, blocks: blocks[i].else.cmdBlocks})
			}

			else if(blocks[i].hasToBeTrue == false){
				if(prop != eq) runEvent(guild, {trg: trg, blocks: blocks[i].then.cmdBlocks})
				else runEvent(guild, {trg: trg, blocks: blocks[i].else.cmdBlocks})
			}

		}

	}


}

function parseStringObs(guild, string, atts){


	let userstatus = bot.guilds.cache.get(guild).members.cache.get(atts.user.id).presence;
	let currentstatus = "";

	for(let i = 0; i < userstatus.activities.length; i++){
		var activity = userstatus.activities[i];
		if(activity.type == "LISTENING"){
	        
	        currentstatus += "Listening to spotify\n" + activity.details + " by " + activity.state + "\n\n"

	    }
	    if(activity.type == "PLAYING"){

	        currentstatus += "Playing " + activity.name + "\n" + activity.details + " " + activity.state + "\n\n"

	    }
	    
	    if(activity.type == "CUSTOM_STATUS"){

	        currentstatus += activity.state + "\n\n"

	    }
	      

	}


	string = string.replace("%user%", atts.user.username);
	string = string.replace("%user.mention%", "<@" + atts.user.id + ">");
	string = string.replace("%user.status%", currentstatus);
	string = string.replace("%servername%", atts.servername);

	return string;

}

