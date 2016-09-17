$(document).ready(function(){

	$('.ui.dropdown').dropdown();

	window.URL_SERVER           = "http://127.0.0.1:9000";
	window.URL_PERSONAL_HISTORY = URL_SERVER + "/medical-case-of-illness/personal-history";
	window.URL_USER             = URL_SERVER + "/medical-case-of-illness/user";
	window.URL_TOOTH            = URL_SERVER + "/medical-case-of-illness/tooth-location-record";
	window.URL_PAGE             = URL_SERVER + "/medical-case-of-illness/index-info";
	window.URL_PRESENTILLNESS   = URL_SERVER + "/medical-case-of-illness/illness-history";
	window.URL_MOUTHEXAM        = URL_SERVER + "/medical-case-of-illness/oral-examination";
	window.URL_DIAGNOSE			= URL_SERVER + "/medical-case-of-illness/diagnose";
	window.URL_DIFFICULTYASSE   = URL_SERVER + "/medical-case-of-illness/difficulty-assessment";
	window.URL_CURE             = URL_SERVER + "/medical-case-of-illness/handle";
	window.URL_USPHS            = URL_SERVER + "/medical-case-of-illness/usphs";
	window.URL_MANAGE           = URL_SERVER + "/medical-case-of-illness/prognosis";
	window.URL_RISKEVALUATION   = URL_SERVER + "/medical-case-of-illness/risk-assessment";
	window.URL_SEARCH           = URL_SERVER + "/medical-case-of-illness/search-by-conditons";
	window.URL_DOC              = URL_SERVER + "/medical-case-of-illness/doc";

	window.requestParameter = function(Name) {
		var REG = new RegExp("(^|&)" + Name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(REG);
		if (r!=null) return (r[2]); return null;
	};

	window.addParameter = function(Name, Value) {
		return Name + "=" + Value;
	};
});