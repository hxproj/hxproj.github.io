function getBasicInfo(NavItem, UID, CID, TID) {
	// **************************************************
	// GET: get user basic info
	$.ajax({
		url      : URL_USER + toquerystring({user_id : UID}),
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

	// **************************************************
	// GET: get case info and init nav
	$.get(URL_CASE, {case_id : CID}, function(data){

		if (data.case_type == 0) {
			$('#case_type').text("初诊");
			$('#in_date').text("初诊时间：" + data.date);
		} else {
			$('#case_type').text("复诊");
			$('#in_date').text("复诊时间：" + data.date);
		}

		// nav.js
		Nav($('#nav'), data.case_type, data.if_handle, NavItem, {
			UID : UID,
			TID : TID,
			CID : CID,
		});
	}, 'JSON');
}