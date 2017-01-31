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

			$.get(URL_CASE, {case_id : CID}, function(data){
				$('#in_date').text(data.date);
				data.case_type ? $('#case_type').text("复诊") : $('#case_type').text("初诊");
			}, 'JSON');
			
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

	
	// **************************************************
	// 导航功能栏
	$('#nav a').not('.active, .return').click(function(){
		$(this).prop('href', $(this).prop('href') + toquerystring({
			uid : UID,
			tid : TID,
			cid : CID,
		}));
	});
	$('#nav a.return').click(function(){
		$(this).prop('href', "medicalrecord.html" + toquerystring({uid  : UID}));
	});
});