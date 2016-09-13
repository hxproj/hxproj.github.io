$(document).ready(function(){

	$('.ui.dropdown').dropdown();

	window.URL_SERVER = "http://127.0.0.1:9000";
	window.requestParameter = function(Name) {
		var REG = new RegExp("(^|&)" + Name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(REG);
		if (r!=null) return (r[2]); return null;
	}
});