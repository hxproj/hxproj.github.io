$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid"));
	// INIT Basic info
	getBasicInfo(Nav_Item.manage, UID, CID, TID);


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
	// Other Envent
	$('.edit.button').click(function(){
		window.location = "riskevaluation.html" + toquerystring({
			uid  : UID,
			tid  : TID,
			cid  : CID,
		});
	});
});