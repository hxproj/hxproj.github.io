$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		IsEditMode = false;
	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('form');


	// **************************************************
	// GET
	$.ajax({
		url      : URL_USPHS,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "JSON",
		error    : function() {
			// network error
			$FormSegement.show();
		},
		success  : function(vData) {
			$InfoSegement.show();

			IsEditMode = true;
			showData(vData);
			setDefultFormData(vData);
			$FormSegement.hide();
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
	// POST | PUT
	$('form').form({
		onSuccess: function(){
			$.ajax({
				url      : URL_USPHS,
				type     : IsEditMode ? "PUT" : "POST", 
				data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});
			
			return false;
		}
	});


	// **************************************************
	// Other Envent
	$('.edit.button').click(function(){
		$InfoSegement.hide();
   		$FormSegement.find('.submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$FormSegement.show();
	});


	// **************************************************
	// Function
	function showData(vData) {
		$('#color').text(vData.color);
		$('#marginal_accuracy').text(vData.marginal_accuracy);
		$('#anatomic_form').text(vData.anatomic_form);
		$('#edge_color').text(vData.edge_color);
		$('#secondary_caries').text(vData.secondary_caries);

		switch (vData.level) {
			case 'A': {
				$('#usphs_level').text("A(临床可接受)");
				break;
			}
			case 'B': {
				$('#usphs_level').text("B(临床可接受)");
				break;
			}
			case 'C': {
				$('#usphs_level').text("C(临床不可接受)");
				break;
			}
			case 'D': {
				$('#usphs_level').text("D(临床不可接受)");
				break;
			}
		}
		
	}

	function setDefultFormData(vData) {
		$('input[value=' + vData.color + ']').parent().checkbox('check'); 
		$('input[value=' + vData.marginal_accuracy + ']').parent().checkbox('check'); 
		$('input[value=' + vData.anatomic_form + ']').parent().checkbox('check'); 
		$('input[value=' + vData.edge_color + ']').parent().checkbox('check'); 
		$('input[value=' + vData.secondary_caries + ']').parent().checkbox('check'); 
	}
});