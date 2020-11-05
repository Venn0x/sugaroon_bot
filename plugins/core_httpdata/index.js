var http = require('http');
var url = require('url');
module.exports = {

	getInfo: function(){

		return "The plugin that links the dashboard to the bot lol";

	}

}


http.createServer(function (req, res) {


	var q = url.parse(req.url, true).query;

	if(q.token == botSettings.dashboard_token){

		if(q.request == "data"){

			if(q.item == "guilds"){

				let dn = ""

				var x;
					for (x in servers) {
					dn += x + ", ";
				}

				dn = dn.slice(0, -2);

				res.write(dn);


			}

			if(q.item == "plugins"){

				if(q.server != -1){
					if(servers[q.server] != null) res.write(servers[q.server].pluginsEnabled.toString());
				}
				else{

					res.write(pluginList.toString());

				}
			}

		}
		else if(q.request == "modify"){

			if(q.item = "toggleplugin"){

				if(q.guild != null && q.plugin != null){

					if(servers.hasOwnProperty(q.guild) && plugins.hasOwnProperty(q.plugin)){

						if(servers[q.guild].pluginsEnabled.includes(q.plugin)) plugins['core_plugin'].disablePluginEx(q.guild, q.plugin);

						else plugins['core_plugin'].enablePluginEx(q.guild, q.plugin);

						res.write("Success.");

					}

				}

			}

		}

	}

	else{
		res.write('Access denied');
	}

	
	res.end(); 
}).listen(5348); 

