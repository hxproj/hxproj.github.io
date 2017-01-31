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
		dataType : "json",
		error    : function() {
			// network error

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