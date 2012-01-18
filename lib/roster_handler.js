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

    self.client_roster = {};

};

roster_handler.prototype = {
    is_client_connected: function(username){
        var self = this;
    },
    /**
     * Add a client resource
     * @param jid
     */
    add_client: function(jid){
        var self = this;
        if(jid.user in self.client_roster){
            if(!(jid.resource in self.client_roster[jid.user].conns)){
                self.client_roster[jid.user].conns[jid.resource] = jid;
            }
        }
    },
    /**
     * Remove a client resource
     * @param jid
     */
    remove_client: function(jid){
        var self = this;

        if(jid.user in self.client_roster){
            if(jid.resource in self.client_roster[jid.user].conns){
                delete self.client_roster[jid.user].conns[jid.resource];
                console.log(self.client_roster[jid.user].conns);
            }
        }

    },
    get_roster: function(){
        var self = this;

        self.LDAPHandler.get_users_for_roster(function(data){
            if(data != false){
                for(var i in data){
                    var user = {
                        user_data: {
                            jid: data[i].uid[0],
                            name: data[i].cn[0],
                            subscription: 'both'
                        },
                        // connections indexed by resource
                        conns: {}
                    };

                    self.client_roster[user.user_data.jid] = user;
                }
            } else {
                console.log("Error getting roster");
            }
        });
    }
};

exports.roster_handler = roster_handler;