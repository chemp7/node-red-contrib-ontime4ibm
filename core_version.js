/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
/**
	Copyright (c) 2017 Takeshi Yoshida
	Released under the MIT license
	https://opensource.org/licenses/mit-license.php

	This program has been created on the basis of the "http request node".
	Added support for Ontime Group Calendar on domino server.
**/

module.exports = function(RED) {
    "use strict";
    var http = require("follow-redirects").http;
    var https = require("follow-redirects").https;
    var urllib = require("url");
    var mustache = require("mustache");
    var querystring = require("querystring");
    var util = require("./util");
    var DEBUG = false;

    function HTTPRequest(n) {
    	RED.nodes.createNode(this,n);
        var node = this;
        var nodeName = n.name;
        var nodeAPIVer = n.APIVer || "use";
		var nodeUrl = n.url;
        var nodeHost = n.host;
        var nodeApplID = n.ApplID;
		var nodeApplVer = n.ApplVer;
		var nodeCustomID = n.CustomID;
        if (n.tls) {
            var tlsNode = RED.nodes.getNode(n.tls);
        }
        this.ret = "obj";
        if (RED.settings.httpRequestTimeout) { this.reqTimeout = parseInt(RED.settings.httpRequestTimeout) || 120000; }
        else { this.reqTimeout = 120000; }

        var prox, noprox;
        if (process.env.http_proxy != null) { prox = process.env.http_proxy; }
        if (process.env.HTTP_PROXY != null) { prox = process.env.HTTP_PROXY; }
        if (process.env.no_proxy != null) { noprox = process.env.no_proxy.split(","); }
        if (process.env.NO_PROXY != null) { noprox = process.env.NO_PROXY.split(","); }
        
        util.log(DEBUG, "----------" + nodeName + "----------");
		util.logWithLabel(DEBUG, "node: host", nodeHost);
		util.logWithLabel(DEBUG, "node: APIVer", nodeAPIVer);
		util.logWithLabel(DEBUG, "node: ApplID", nodeApplID);
		util.logWithLabel(DEBUG, "node: ApplVer", nodeApplVer);
		util.logWithLabel(DEBUG, "node: CustomID", nodeCustomID);
        util.log(DEBUG, "------------------------------");
        
        this.on("input",function(msg) {
            var preRequestTimestamp = process.hrtime();
            node.status({fill:"blue",shape:"dot",text:"httpin.status.requesting"});
            var method = "POST";
			
            var host = nodeHost || ((typeof msg.host === "undefined") ? "" : msg.host);
		    if (nodeAPIVer === "use"){
        		nodeAPIVer = "";
			}
			var APIVer = Number(util.getOGCParameter(nodeAPIVer, msg, "APIVer"));
			var ApplID = util.getOGCParameter(nodeApplID, msg, "ApplID");
			var ApplVer = util.getOGCParameter(nodeApplVer, msg, "ApplVer");
			var Token = util.getOGCParameter("", msg, "Token");
			var CustomID = util.getOGCParameter(nodeCustomID, msg, "CustomID");
			
	        util.log(DEBUG, "----------" + nodeName + "----------");
			util.logWithLabel(DEBUG, "host", host);
			util.logWithLabel(DEBUG, "APIVer", APIVer);
			util.logWithLabel(DEBUG, "ApplID", ApplID);
			util.logWithLabel(DEBUG, "ApplVer", ApplVer);
			util.logWithLabel(DEBUG, "CustomID", CustomID);
	        util.log(DEBUG, "------------------------------");
			
			// Set host
			msg.host = host;
			
			// Set msg.payload.Main
			if (typeof msg.payload.Main === "undefined") {
				msg.payload = {
					"Main":{}
				};
			}
			msg.payload.Main.APIVer = APIVer;
			msg.payload.Main.ApplID = ApplID;
			msg.payload.Main.ApplVer = ApplVer;
			msg.payload.Main.Token = Token;
			if (CustomID === "") {
				delete msg.payload.Main["CustomID"];
			} else {
				msg.payload.Main.CustomID = CustomID;
			}
			msg.payload.Version = {};
			
			// Set msg.OGCParameters.Main
			if (typeof msg.OGCParameters === "undefined") {
				msg.OGCParameters = {};
			}
			if (typeof msg.OGCParameters.Main === "undefined") {
				msg.OGCParameters.Main = {};
			}
			msg.OGCParameters.Main.APIVer = APIVer;
			msg.OGCParameters.Main.ApplID = ApplID;
			msg.OGCParameters.Main.ApplVer = ApplVer;
			msg.OGCParameters.Main.Token = Token;
			if (CustomID === "") {
				delete msg.OGCParameters.Main["CustomID"];
			} else {
				msg.OGCParameters.Main.CustomID = CustomID;
			}
			
			delete msg["headers"];
			delete msg.payload["Status"];
			delete msg.payload["Token"];
			
            // API
			var apiPath = "apihttp/";
            var url = encodeURI(util.setSlash( host ) + apiPath);
			
	        util.log(DEBUG, "----------" + nodeName + "----------");
			util.log("url", url);
			util.log(DEBUG, msg);
	        util.log(DEBUG, "------------------------------");
			
			if (host === "") {
				var errorparam = "";
				errorparam = (host === "") ? errorparam + " host," : errorparam;
				node.error("Parameter is missing:" + errorparam.substr(0, errorparam.length-1 ));
				node.status({fill:"red",shape:"ring",text:"pamareter error"});
				return;
			}
            
            if (msg.url && nodeUrl && (nodeUrl !== msg.url)) {  // revert change below when warning is finally removed
                node.warn(RED._("common.errors.nooverride"));
            }
            if (!url) {
                node.error(RED._("httpin.errors.no-url"),msg);
                return;
            }
            // url must start http:// or https:// so assume http:// if not set
            if (!((url.indexOf("http://") === 0) || (url.indexOf("https://") === 0))) {
                if (tlsNode) {
                    url = "https://"+url;
                } else {
                    url = "http://"+url;
                }
            }
            
            var opts = urllib.parse(url);
            opts.method = method;
            opts.headers = {};
            var ctSet = "Content-Type"; // set default camel case
            var clSet = "Content-Length";
            if (msg.headers) {
                for (var v in msg.headers) {
                    if (msg.headers.hasOwnProperty(v)) {
                        var name = v.toLowerCase();
                        if (name !== "content-type" && name !== "content-length") {
                            // only normalise the known headers used later in this
                            // function. Otherwise leave them alone.
                            name = v;
                        }
                        else if (name === 'content-type') { ctSet = v; }
                        else { clSet = v; }
                        opts.headers[name] = msg.headers[v];
                    }
                }
            }
            if (this.credentials && this.credentials.user) {
                opts.auth = this.credentials.user+":"+(this.credentials.password||"");
            }
            if (this.credentials && this.credentials.user) {
                opts.auth = this.credentials.user+":"+(this.credentials.password||"");
            }
            var payload = null;

            if (msg.payload && (method == "POST" || method == "PUT" || method == "PATCH" ) ) {
                if (typeof msg.payload === "string" || Buffer.isBuffer(msg.payload)) {
                    payload = msg.payload;
                } else if (typeof msg.payload == "number") {
                    payload = msg.payload+"";
                } else {
                    if (opts.headers['content-type'] == 'application/x-www-form-urlencoded') {
                        payload = querystring.stringify(msg.payload);
                    } else {
                        payload = JSON.stringify(msg.payload);
                        if (opts.headers['content-type'] == null) {
                            opts.headers[ctSet] = "application/json";
                        }
                    }
                }
                if (opts.headers['content-length'] == null) {
                    if (Buffer.isBuffer(payload)) {
                        opts.headers[clSet] = payload.length;
                    } else {
                        opts.headers[clSet] = Buffer.byteLength(payload);
                    }
                }
            }
            // revert to user supplied Capitalisation if needed.
            if (opts.headers.hasOwnProperty('content-type') && (ctSet !== 'content-type')) {
                opts.headers[ctSet] = opts.headers['content-type'];
                delete opts.headers['content-type'];
            }
            if (opts.headers.hasOwnProperty('content-length') && (clSet !== 'content-length')) {
                opts.headers[clSet] = opts.headers['content-length'];
                delete opts.headers['content-length'];
            }
            var urltotest = url;
            var noproxy;
            if (noprox) {
                for (var i in noprox) {
                    if (url.indexOf(noprox[i]) !== -1) { noproxy=true; }
                }
            }
            if (prox && !noproxy) {
                var match = prox.match(/^(http:\/\/)?(.+)?:([0-9]+)?/i);
                if (match) {
                    //opts.protocol = "http:";
                    //opts.host = opts.hostname = match[2];
                    //opts.port = (match[3] != null ? match[3] : 80);
                    opts.headers['Host'] = opts.host;
                    var heads = opts.headers;
                    var path = opts.pathname = opts.href;
                    opts = urllib.parse(prox);
                    opts.path = opts.pathname = path;
                    opts.headers = heads;
                    opts.method = method;
                    urltotest = match[0];
                }
                else { node.warn("Bad proxy url: "+process.env.http_proxy); }
            }
            if (tlsNode) {
                tlsNode.addTLSOptions(opts);
            }
            var req = ((/^https/.test(urltotest))?https:http).request(opts,function(res) {
                (node.ret === "bin") ? res.setEncoding('binary') : res.setEncoding('utf8');
                msg.statusCode = res.statusCode;
                msg.headers = res.headers;
                msg.responseUrl = res.responseUrl;
                msg.payload = "";
                // msg.url = url;   // revert when warning above finally removed
                res.on('data',function(chunk) {
                    msg.payload += chunk;
                });
                res.on('end',function() {
                    if (node.metric()) {
                        // Calculate request time
                        var diff = process.hrtime(preRequestTimestamp);
                        var ms = diff[0] * 1e3 + diff[1] * 1e-6;
                        var metricRequestDurationMillis = ms.toFixed(3);
                        node.metric("duration.millis", msg, metricRequestDurationMillis);
                        if (res.client && res.client.bytesRead) {
                            node.metric("size.bytes", msg, res.client.bytesRead);
                        }
                    }
                    if (node.ret === "bin") {
                        msg.payload = new Buffer(msg.payload,"binary");
                    }
                    else if (node.ret === "obj") {
                        try {
                             msg.payload = JSON.parse(msg.payload);
                        	if (msg.payload.Status === "OK") {
                        		msg.OGCParameters.Main.Token = msg.payload.Token;	// Response
                        	}
                        }
                        catch(e) { node.warn(RED._("httpin.errors.json-error")); }
                    }
                    node.send(msg);
                    node.status({});
                });
            });
            req.setTimeout(node.reqTimeout, function() {
                node.error(RED._("common.notification.errors.no-response"),msg);
                setTimeout(function() {
                    node.status({fill:"red",shape:"ring",text:"common.notification.errors.no-response"});
                },10);
                req.abort();
            });
            req.on('error',function(err) {
                node.error(err,msg);
                msg.payload = err.toString() + " : " + url;
                msg.statusCode = err.code;
                node.send(msg);
                node.status({fill:"red",shape:"ring",text:err.code});
            });
            if (payload) {
                req.write(payload);
            }
            req.end();
        });
        
        this.on("close",function() {
            node.status({});
        });
    }
    
    RED.nodes.registerType("core version",HTTPRequest,{
        credentials: {
            user: {type:"text"},
            password: {type: "password"}
        }
    });
}
