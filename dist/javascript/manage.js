$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid"));


	// **************************************************
	// GET
	$.ajax({
		url      : URL_MANAGE,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "JSON",
		error    : function() {
			// network error
			$(".edit.button").text("设置预后管理方案");
		},
		success  : function(vData) {
			
			$('.invisible.segment[data-tab=' + vData.patient_type+ ']').show();
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
		Nav($('#nav'), data.case_type, data.if_handle, Nav_Item.manage, {
			UID : UID,
			TID : TID,
			CID : CID,
		});
	}, 'JSON');


	// **************************************************
	// Other Envent
	$('.edit.button').click(function(){
		window.location = "riskevaluation.html" + toquerystring({
			uid  : UID,
			tid  : TID,
			cid  : CID,
		});
	});
});