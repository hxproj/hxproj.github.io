$(document).ready(function(){
	
	// **************************************************
	// GET: get user basic info
	$.ajax({
		url      : URL_USER + toquerystring({user_id : requestParameter("uid")}),
		type     : "GET",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(data){
			var $BasicInfo = $('#ID_basicinfo'),
				$Gender    = $BasicInfo.find('div[name=gender]');
			
			 if (data.gender) {
				$Gender.find("i").addClass("woman");
				$Gender.find("span").text("女");
			 } else {
				$Gender.find("i").addClass("man");
				$Gender.find("span").text("男");
			 }

			$BasicInfo.find('div[name=name]').text(data.name);
			$BasicInfo.find('div[name=age]').text(data.age);
			$BasicInfo.find('div[name=ID]').text(data.id_number);
			$BasicInfo.find('div[name=occupation]').text(data.occupation);
			$BasicInfo.find('div[name=contact]').text(data.contact);
		}
	});
});