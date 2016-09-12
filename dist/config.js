$(document).ready(function(){

	URL_SERVER = "http://127.0.0.1:9000";

	$('.ui.dropdown').dropdown();

	function request(Name) {
		var REG = new RegExp("(^|&)" + Name + "=([^&]*)(&|$)","i");
		var r = window.location.search.substr(1).match(REG);
		if (r!=null) return (r[2]); return null;
	}
});