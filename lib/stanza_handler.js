/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 1/17/12
 * Time: 7:40 PM
 * To change this template use File | Settings | File Templates.
 */
var xmpp = require('node-xmpp'),
    util = require('util');

var stanza_handler = function(client, conn){
    var self = this;

    self.client = client;
    self.conn = conn;

};

stanza_handler.prototype = {
    parse_stanza: function(stanza){
        var self = this;

        if('type' in stanza){
            switch(stanza.name){
                case 'presence':
                    self._presence(stanza);
                    break;
                case 'iq':
                    self._iq(stanza);
                    break;
                case 'message':
                    self._message(stanza);
                    break;
                default:
                    // handle error
            }

        } else {
            // handle error
        }

    },
    _presence: function(stanza){
        var self = this;

        console.log("presence: ");
        //console.log(util.inspect(stanza, true, 8));

        if('children' in stanza){
            for(var i in stanza.children){
                if(stanza.children[i].name == 'c'){
                    // initial presence
                }
            }
        }
    },
    _iq: function(stanza){
        var self = this;
        //console.log(util.inspect(stanza, true, 5));
        if(stanza.name == 'iq' && stanza.attrs.type == 'get'){

            var elem = new xmpp.Element('iq', {from: 'csh.rit.edu', type: 'result', id: stanza.attrs.id}).up();

            try {
                self.client.send(elem);
            } catch(e){
                console.log(e);
            }
        }

        if(stanza.name == 'iq'){
            //console.log(util.inspect(stanza, true, 5));
        }
    },
    _message: function(stanza){
        var self = this;

        console.log("message: ");
        //console.log(util.inspect(stanza, true, 8));
    }
};

exports.stanza_handler = stanza_handler;

