/**
		Copyright (c) 2017 Takeshi Yoshida
	Released under the MIT license
	https://opensource.org/licenses/mit-license.php
**/

module.exports = {
    logWithLabel: function (mode, label, str){
    	if (mode === true){
			console.log( label + ": " + str);
	    }
	},
    log: function (mode, str){
    	if (mode === true){
			console.log(str);
	    }
	},
    setSlash: function (str){
    	if (str.length > 0) {
    		if ( str.slice(-1) === "/" ){
    			return str;
    		} else {
    			return str + "/";
    		}
    	}
    	return str;
	},
	getOGCParameter: function (nodeValue, msg, key) {
		var v = "";
		if (nodeValue !== "") {
			v = nodeValue;
		} else if ((typeof msg.payload.Main !== "undefined") && (typeof msg.payload.Main[key] !== "undefined")) {
			v = msg.payload.Main[key];
		} else if ((typeof msg.OGCParameters !== "undefined") && (typeof msg.OGCParameters.Main !== "undefined") && (typeof msg.OGCParameters.Main[key] !== "undefined")) {
			v = msg.OGCParameters.Main[key];
		}
		return v;
	}
};