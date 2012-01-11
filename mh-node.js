#!/usr/bin/env node

/*
  mh-node.js - A nodeJS version of Modify Headers Firefox add-on 
  ---------------------------------------------------------------------
  
  Copyright 2011 (C) by Guido D'Albore (guido@bitstorm.it)
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
  http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  
*/

///////////////////
// Configuration // 

/* Location of JSON exported by Modify Header Firefox add-on */
const modifyheaderslocation = 
	__dirname + "/modifyheaders.json"
;

/* Binding address and port of Modify Header proxy */
const proxy = {
	host: "127.0.0.1",
	port: 8079,
};

/* Host and port of backend server */
const backend = {
	host: "127.0.0.1",
	port: 8080,
};

///////////////////////////////
// HTTP Modify Headers Proxy //

var modifyheadersrules = require(modifyheaderslocation);
var http  = require('http');

/* A Modify Headers is composed by an array of objects like this
{
    "action":"Add",
    "name":"User-Agent",
    "value":"Mozilla/5.0 (Linux; U; Android 2.3.2; iw-il; LT15a Build/3.0.A.2.181) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "comment":"Android phone",
    "enabled":false
}
{
    ...
}
*/

const actions = {
    add: "Add",
    modify: "Modify",
    filter: "Filter"
}

const forbiddenmultiples = ["host", "user-agent", "referer"];

function addheader(headers, name, value) {
    var field = name.toLowerCase();
    
    if((headers[field] === undefined) || (forbiddenmultiples.indexOf(field) != -1)) {
        headers[field] = value;
    } else {
        headers[field] = headers[field] + ", " + value;     
    }
    
    return headers;
}

function modifyheader(headers, name, value) {
    var field = name.toLowerCase();
    
    if(headers[field] !== undefined) {
        headers[field] = value;
    }
    
    return headers;
}

function filterheader(headers, name) {
    var field = name.toLowerCase();
    
    if(headers[field] !== undefined) {
        delete headers[field];
        
    }
    
    return headers;
}

function modifyheaders(headers, url) {
    for(var entry in modifyheadersrules) {
        
        var rule = modifyheadersrules[entry];
        
        if(rule["enabled"]) {            
            switch(rule["action"]) {
                case actions.modify:
                    console.log("Modify detected");
                    headers = modifyheader(headers, rule["name"], rule["value"]);
                    break;                
                case actions.add:
                    console.log("Add detected");
                    headers = addheader(headers, rule["name"], rule["value"]);
                    break;
                case actions.filter:
                    console.log("Filter detected");
                    headers = filterheader(headers, rule["name"]);
                    break;
                default:
                    console.log("Unknown action.");
            }            
        }
    }
    
    console.log("* Request Header '" + url + "'");
    console.log(JSON.stringify(headers, null, 4));
    return headers;
}

http.createServer(function (req, res) {
    //console.log("> Proxing Request '" + req.url + "' on backend...");
   
    clientRequest = http.get(
        {  host:backend.host,
           port:backend.port,
           path:req.url,
           headers: modifyheaders(req.headers, req.url)
        },
        
        function(backendResponse) {
            console.log("* Response Header '" + req.url + "'");
            console.log(JSON.stringify(backendResponse.headers, null, 4));
            res.writeHead(backendResponse.statusCode, backendResponse.headers);
              
            backendResponse.on('data', function (chunk) {
                res.write(chunk);
            });

            backendResponse.on('end', function () {
                //console.log("> Proxing Request '" + req.url + "' on backend......done");
                res.end();
            });
        });
   
        req.on('close', function() {
            //console.log("> Proxing Request '" + req.url + "' closed unexpectedly.");
            clientRequest.destroy();
        });

}).listen(proxy.port, proxy.host);

console.log('>> HTTP Modify Headers Proxy running at http://' + proxy.host + ':' + proxy.port);
