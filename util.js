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
	getUsersAllTypeParameter: function(nodeValue, msg, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload.UsersAll) === "[object Object]") && (typeof msg.payload.UsersAll[key] !== "undefined")) {
			v = msg.payload.UsersAll[key];
		}
		return v;
	},
	getUsersAllParameter: function(nodeValue, msg, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload.UsersAll) === "[object Object]") && (typeof msg.payload.UsersAll[key] !== "undefined")) {
			v = msg.payload.UsersAll[key];
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
	getUsersInfoParameter: function(nodeValue, msg, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload.UsersInfo) === "[object Object]") && (typeof msg.payload.UsersInfo[key] !== "undefined")) {
			v = msg.payload.UsersInfo[key];
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
	getCalendarsParameter: function(nodeValue, msg, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload.Calendars) === "[object Object]") && (typeof msg.payload.Calendars[key] !== "undefined")) {
			v = msg.payload.Calendars[key];
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
	getCalendarsDateTimeParameter: function(nodeValue, msg, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload.Calendars) === "[object Object]") && (typeof msg.payload.Calendars[key] !== "undefined")) {
			v = msg.payload.Calendars[key];
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
	getParameterString: function(nodeValue, msg, parentKey, key) {
		var v = "";
		var toString = Object.prototype.toString;
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((toString.call(msg.payload) === "[object Object]") && (toString.call(msg.payload[parentKey]) === "[object Object]") && (typeof msg.payload[parentKey][key] !== "undefined")) {
			v = msg.payload[parentKey][key];
		}
		return v;
	}
};