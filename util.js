/**
   Copyright (c) 2017 Takeshi Yoshida

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
**/

module.exports = {
    logWithLabel: function(mode, label, str) {
    	if (mode === true){
			console.log( label + ": " + str);
	    }
	},
    log: function(mode, str) {
    	if (mode === true){
			console.log(str);
	    }
	},
    setSlash: function(str) {
    	if (str.length > 0) {
    		if ( str.slice(-1) === "/" ){
    			return str;
    		} else {
    			return str + "/";
    		}
    	}
    	return str;
	},
	escapeAfterStringify: function(str, flag_escape) {
		var json = JSON.stringify(str);
	   	return flag_escape ? json.replace(/[\u007f-\uffff]/g,
			function(c) { 
				return '\\u'+('0000'+c.charCodeAt(0).toString(16)).slice(-4);
		  	}
	   	): json;
	},
	getOGCParameter: function(nodeValue, msg, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload.Main) === "[object Object]") && (typeof msg.payload.Main[key] !== "undefined")) {
			v = msg.payload.Main[key];
		} else if ((toString.call(msg.ontime) === "[object Object]") && (toString.call(msg.ontime.parameters) === "[object Object]") && (toString.call(msg.ontime.parameters.Main) === "[object Object]") && (typeof msg.ontime.parameters.Main[key] !== "undefined")) {
			v = msg.ontime.parameters.Main[key];
		}
		return v;
	},
	getParameterArray: function(nodeValue, msg, parentKey, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload[parentKey]) === "[object Object]") && (typeof msg.payload[parentKey][key] !== "undefined")) {
			v = msg.payload[parentKey][key];
		}

		if (toString.call(v) === "[object Array]") {
			//
		} else if (v.length === 0) {
			v = [];
		} else if ((v.match(/;/g)||[]).length === 0) {
		 	v = [v];
		} else {
		 	v = v.split(";");
		}
		return v;
	},
	getParameterNumber: function(nodeValue, msg, parentKey, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload[parentKey]) === "[object Object]") && (typeof msg.payload[parentKey][key] !== "undefined")) {
			v = msg.payload[parentKey][key];
		}

		if (toString.call(v) === "[object Number]") {
			//
		} else if (toString.call(v) === "[object String]") {
			v = Number(v);
		} else if (v.length === 0) {
			v = 0;
		}
		return v;
	},
	getParameterString: function(nodeValue, msg, parentKey, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload[parentKey]) === "[object Object]") && (typeof msg.payload[parentKey][key] !== "undefined")) {
			v = msg.payload[parentKey][key];
		}
		return v;
	},
	getOGCParameters: function(apiver, applid, applver, customid, token) {
		var obj = {
			"Main":{
				"APIVer":apiver,
				"ApplID":applid,
				"ApplVer":applver,
				"Token":token
			}
		}
		if (customid !== "") {
			obj.Main.CustomID = customid;
		}
		return obj;
	},
	getMainParameters: function(apiver, applid, applver, customid, token) {
		var obj = {
			"APIVer":apiver,
			"ApplID":applid,
			"ApplVer":applver
		}
		if (token !== "") {
			obj.Token = token;
		}
		if (customid !== "") {
			obj.CustomID = customid;
		}
		return obj;
	}
};