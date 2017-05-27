/**
	Copyright (c) 2017 Takeshi Yoshida
	Released under the MIT license
	https://opensource.org/licenses/mit-license.php
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
	getOGCParameter: function(nodeValue, msg, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload.Main) === "[object Object]") && (typeof msg.payload.Main[key] !== "undefined")) {
			v = msg.payload.Main[key];
		} else if ((toString.call(msg.OGCParameters) === "[object Object]") && (toString.call(msg.OGCParameters.Main) === "[object Object]") && (typeof msg.OGCParameters.Main[key] !== "undefined")) {
			v = msg.OGCParameters.Main[key];
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