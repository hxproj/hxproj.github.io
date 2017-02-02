$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	// TODO: Request Parameters From URL
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
	// **************************************************
	// GET: get case info and init nav
	$.get(URL_CASE, {case_id : CID}, function(data){
		$('#in_date').text(data.date);
		data.case_type ? $('#case_type').text("复诊") : $('#case_type').text("初诊");

		// nav.js
		Nav($('#nav'), data.case_type, data.if_handle, Nav_Item.riskevaluation, {
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
				url      : URL_RISKEVALUATION,
				type     : IsEditMode ? "PUT" : "POST", 
				data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {
					location.reload();
				}
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
	$('.manage.button').click(function(){
		window.location = "manage.html" + toquerystring({
			uid  : UID,
			tid  : TID,
			cid  : CID,
		});
	});


	// **************************************************
	// Function
	function showData(vData) {
		$('#fluorine_protection').text(vData.fluorine_protection);
		$('#sugary_foods').text(vData.sugary_foods);
		$('#relative_illness').text(vData.relative_illness);
		$('#need_record').text(vData.need_record);

		$('#alcohol_drugs').text(vData.alcohol_drugs);
		$('#radiotherapy').text(vData.radiotherapy);
		$('#eating_disorders').text(vData.eating_disorders);
		$('#saliva_medicine').text(vData.saliva_medicine);
		$('#special_care').text(vData.special_care);

		$('#caries_lost').text(vData.caries_lost);
		$('#soft_dirt').text(vData.soft_dirt);
		$('#special_tooth_shape').text(vData.special_tooth_shape);
		$('#adjacent_caries').text(vData.adjacent_caries);
		$('#tooth_exposure').text(vData.tooth_exposure);
		$('#fill_overhang').text(vData.fill_overhang);
		$('#appliance').text(vData.appliance);
		$('#dry_syndrome').text(vData.dry_syndrome);
		$('#hole').text(vData.hole);

		var Level = "";
		switch (vData.risk_level) {
			case 1:  {
				Level = "1"; 
				$('#risk_level').text("低风险患者");
				break;
			}
			case 2:  {
				Level = "2"; 
				$('#risk_level').text("中风险患者");
				break;
			}
			case 3:  {
				Level = "3"; 
				$('#risk_level').text("高风险患者");
				break;
			}
		}
	}

	function setDefultFormData(vData) {
		$('select[name=fluorine_protection]').dropdown("set selected", vData.fluorine_protection);
		$('select[name=sugary_foods]').dropdown("set selected", vData.sugary_foods);
		$('select[name=relative_illness]').dropdown("set selected", vData.relative_illness);
		$('select[name=need_record]').dropdown("set selected", vData.need_record);

		$('select[name=alcohol_drugs]').dropdown("set selected", vData.alcohol_drugs);
		$('select[name=radiotherapy]').dropdown("set selected", vData.radiotherapy);
		$('select[name=eating_disorders]').dropdown("set selected", vData.eating_disorders);
		$('select[name=saliva_medicine]').dropdown("set selected", vData.saliva_medicine);
		$('select[name=special_care]').dropdown("set selected", vData.special_care);

		$('select[name=caries_lost]').dropdown("set selected", vData.caries_lost);
		$('select[name=soft_dirt]').dropdown("set selected", vData.soft_dirt);
		$('select[name=special_tooth_shape]').dropdown("set selected", vData.special_tooth_shape);
		$('select[name=adjacent_caries]').dropdown("set selected", vData.adjacent_caries);
		$('select[name=tooth_exposure]').dropdown("set selected", vData.tooth_exposure);
		$('select[name=fill_overhang]').dropdown("set selected", vData.fill_overhang);
		$('select[name=appliance]').dropdown("set selected", vData.appliance);
		$('select[name=dry_syndrome]').dropdown("set selected", vData.dry_syndrome);
		$('select[name=hole]').dropdown("set selected", vData.hole);
	}
});