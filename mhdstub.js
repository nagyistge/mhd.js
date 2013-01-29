var server = require("./lib/server.js");
var fs = require("fs");
var xds = require("./test/stub/xdsAdapter.js"); 
xds["registry"] = {
		hostname: "192.168.10.99",
		port: 2010,
		path: "/openxds/services/DocumentRegistry/"};
		
xds["repository"] = {
		hostname: "192.168.10.99",
		port: 2010,
		path: "/openxds/services/DocumentRepository/"
		};
 
var config = {
	name: "Mobile access to Health Documents (MHD) service",
	port: 1337,
	options: {
	  key: fs.readFileSync("key.pem"),
	  cert: fs.readFileSync("cert.pem")
	},
	xds: xds,
    patientIdPattern:"^[0-9]{9}[\^]{3}[&]2.16.840.1.113883.2.1.3.9.1.0.0&ISO$" //open XDS test system patient identifier
  };

server.start(config);
