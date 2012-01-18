var xmpp = require('node-xmpp'),
	LDAPHandler = require('./ldap.js').LDAPHandler,
	util = require('util');

var server = new xmpp.C2SServer({
	port: 5222,
	domain: '0.0.0.0'
});	

server.on('connect', function(client){
	console.log("Client connected");
	//console.log(client);

	conn = {};
	conn.LDAPHandler = new LDAPHandler();

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
		//console.log(opts);
		
		conn.LDAPHandler.auth_user(opts.user, opts.password, function(data){
			//console.log(data);
			
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
		console.log(util.inspect(stanza, true, 8));

		if(stanza.name == 'iq' && stanza.attrs.type == 'get'){

			var elem = new xmpp.Element('iq', {from: 'csh.rit.edu', type: 'result', id: stanza.attrs.id}).up();

        	client.send(elem);
		}
	

	});

	client.on('disconnect', function(client){
		console.log('client disconnected');
	});
});
