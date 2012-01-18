/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 1/17/12
 * Time: 7:59 PM
 * To change this template use File | Settings | File Templates.
 */
var LDAPHandler = require('./ldap.js').LDAPHandler;

var roster_handler = function(){
    var self = this;

    self.LDAPHandler = new LDAPHandler();

    self.connected_clients = {};

};

roster_handler.prototype = {
    is_client_connected: function(username){
        var self = this;
    },
    add_client: function(client){
        var self = this;
    },
    remove_client: function(client){
        var self = this;
    },
    get_roster: function(){
        var self = this;
    }
};

exports.roster_handler = roster_handler;