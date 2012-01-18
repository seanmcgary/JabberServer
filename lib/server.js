var xmpp = require('node-xmpp'),
	LDAPHandler = require('./ldap.js').LDAPHandler,
	util = require('util'),
    stanza_handler = require('./stanza_handler.js').stanza_handler,
    roster_handler = require('./roster_handler.js').roster_handler;

var server = new xmpp.C2SServer({
	port: 5222,
	domain: '0.0.0.0'
});

roster_handler = new roster_handler();

server.on('connect', function(client){
	console.log("Client connected");
	//console.log(client);

	conn = {};
	conn.LDAPHandler = new LDAPHandler();
    conn.stanza_handler = new stanza_handler(client);

	server.on('register', function(opts, cb){
		console.log("Register");
		console.log(opts);
	});

	client.on('inStanza', function(stz) {
		console.log("inStanza");
		console.log(stz);
	});

	client.on('authenticate', function(opts, cb){
		console.log("Auth...");
		
		conn.LDAPHandler.auth_user(opts.user, opts.password, function(data){
			
			if(data != false){
				cb();
			} else {
				cb(false);
			}
		});
	});

	client.on('online', function(){
		console.log("Client online");
	});

	client.on('stanza', function(stanza){
		console.log("Stanza received...");
		//console.log(stanza);
		//console.log(util.inspect(stanza, true, 8));

		conn.stanza_handler.parse_stanza(stanza);

	});

	client.on('disconnect', function(client){
		console.log('client disconnected');
	});
});
