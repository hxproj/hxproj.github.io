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
		url      : URL_USPHS,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "JSON",
		error    : function() {
			// network error

		},
		success  : function(vData) {
			
		}
	});
	// **************************************************
	// GET: get case info and init nav
	$.get(URL_CASE, {case_id : CID}, function(data){
		$('#in_date').text(data.date);
		data.case_type ? $('#case_type').text("复诊") : $('#case_type').text("初诊");

		// nav.js
		Nav($('#nav'), data.case_type, data.if_handle, Nav_Item.usphs, {
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