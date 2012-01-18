var xmpp = require('node-xmpp'),
	LDAPHandler = require('./ldap.js').LDAPHandler,
	util = require('util'),
    stanza_handler = require('./stanza_handler.js').stanza_handler,
    roster_handler = require('./roster_handler.js').roster_handler;

var server = new xmpp.C2SServer({
	port: 5222,
	domain: '0.0.0.0'
});

roster = new roster_handler();

roster.get_roster();

server.on('connect', function(client){
	console.log("Client connected");


	conn = {};
	conn.LDAPHandler = new LDAPHandler();
    conn.stanza_handler = new stanza_handler(client);
    conn.roster = roster;
    conn.client = client;

	server.on('register', function(opts, cb){
		console.log("Register");
		console.log(opts);
	});

	client.on('authenticate', function(opts, cb){
		console.log("Auth...");

		conn.LDAPHandler.auth_user(opts.user, opts.password, function(data){
			
			if(data != false){
                //console.log(client);
                //conn.roster.add_client(opts.jid);
				cb();
			} else {
				cb(false);
			}
		});
	});

	client.on('online', function(data){
		console.log("Client online");
        conn.roster.add_client(client.jid);

	});

	client.on('stanza', function(stanza){
		console.log("Stanza received...");
		conn.stanza_handler.parse_stanza(stanza, conn);
	});

	client.on('end', function(){
		// handle disconnected client
        console.log("Disconnected\n--------");
        conn.roster.remove_client(conn.client.jid);
        //console.log(client);
	});
});
