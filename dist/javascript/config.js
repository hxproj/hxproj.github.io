$(document).ready(function(){

	// ***************************************************************
	// FUNCTION: Server Application Interface
	window.URL_SERVER           = "http://192.168.191.1:9000"; //192.168.191.1
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
	window.URL_IMAGEUPLOAD      = URL_SERVER + "/medical-case-of-illness/img";

	// ***************************************************************
	// FUNCTION: System Common Functions
	window.requestParameter = function(Name) {
		var REG = new RegExp("(^|&)" + Name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(REG);
		if (r!=null) return (r[2]); return null;
	};

	window.networkError = function() { $('#networkerror').modal('show'); }
	window.redirection  = function(URL, Parameters) {
		window.location.href = URL + window.toquerystring(Parameters);
	}
	
	window.toform = function(parameters) {
		var form = "";
		$.each(parameters, function(key, value) {form += key + "=" + value + "&";});
		return form;
	};

	window.toquerystring = function(parameters) {
		var querystring = "?" + window.toform(parameters);
		// Delete the last charactor '&' if exist
		return querystring.length > 0 ? querystring.substring(0, querystring.length - 1) : querystring;
	};

	window.loadImage = function(url, callback){
		var Img = new Image();
		Img.src = url;
		// If the image is aready in the brower cache, then load it
		if (Img.complete) {
			callback(Img);
			return;
		}

		Img.onload = function() {
			callback(Img);
		};
	}

	// ***************************************************************
	// FUNCTION: Page Common Settings
	$('.ui.dropdown').dropdown();
});

jQuery.extend({
	ajaxFile: function(Parameters) {

		// 设置form数据:添加文件
		var formData       = new FormData(),
			$FilesSelector = $("#" + Parameters.fileElementId),
			FilesName      = $FilesSelector.attr('name'),
			Files          = $FilesSelector[0].files;

		$.each(Files, function() {formData.append(FilesName, this);});
		$.each(Parameters.data, function(name, value) {formData.append(name, value);});
		Parameters.data = formData;

  		$.ajax(Parameters);
	}
})
