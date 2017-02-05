$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid")),
		CID = Number(requestParameter("cid")),
		IsEditMode = false;
	// INIT Context
	$('#context .menu .item').tab({ context: $('#context') });


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
		Nav($('#nav'), data.case_type, data.if_handle, Nav_Item.cure, {
			UID : UID,
			TID : TID,
			CID : CID,
		});
	}, 'JSON');
	// **************************************************
	// GET
	/*
	$.ajax({
		url      : URL_RISKEVALUATION,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "json",
		error    : function() {
			// TODO: check the return data 
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
	*/


	// **************************************************
	// POST || PUT
	// **************************************************
	// 药物治疗
	$('div[data-tab=noSurgicalContext1]').form({
		fields: {
			fluorination: {
				identifier: 'fluorination',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择药物氟化物'
					}
				]
			},
			silver_nitrate: {
				identifier: 'silver_nitrate',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择硝酸银'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){

			submitForm();

			return false;
		}
	});



	// **************************************************
	// Function
	function submitForm(vData) {
		alert("submited");
	}
});