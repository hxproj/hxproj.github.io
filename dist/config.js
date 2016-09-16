$(document).ready(function(){

	$('.ui.dropdown').dropdown();

	window.URL_SERVER           = "http://127.0.0.1:9000";
	window.URL_PERSONAL_HISTORY = URL_SERVER + "/medical-case-of-illness/personal-history";
	window.URL_MOUTHEXAM        = URL_SERVER + "/medical-case-of-illness/oral-examination";
	window.URL_DIAGNOSE			= URL_SERVER + "/medical-case-of-illness/diagnose";
	window.URL_DIFFICULTYASSE   = URL_SERVER + "/medical-case-of-illness/difficulty-assessment";
	window.URL_CURE             = URL_SERVER + "/medical-case-of-illness/handle";
	window.URL_USPHS            = URL_SERVER + "/medical-case-of-illness/usphs";

	window.requestParameter = function(Name) {
		var REG = new RegExp("(^|&)" + Name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(REG);
		if (r!=null) return (r[2]); return null;
	};

	window.addParameter = function(Name, Value) {
		return Name + "=" + Value;
	};
});