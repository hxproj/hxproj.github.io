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
	// INIT Basic info
	getBasicInfo(Nav_Item.difficultyassessment, UID, CID, TID);


	// **************************************************
	// GET
	$.ajax({
		url      : URL_DIFFICULTYASSE,
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
			setDefultFormData(vData);
			showDifficultyAssessmentData(vData);
		}
	});


	// **************************************************
	// POST | PUT
	$('form').form({
		fields: {
			tooth_surface_and_location: {
				identifier: 'tooth_surface_and_location',
				rules: [
					{
						type   : 'empty',
						prompt : '请选择累及牙面及部位'
					}
				]
			},
			caries_depth: {
				identifier: 'caries_depth',
				rules: [
					{
						type   : 'empty',
						prompt : '请选择龋损深度'
					}
				]
			},
			technology_type: {
				identifier: 'technology_type',
				rules: [
					{
						type   : 'empty',
						prompt : '请选择技术类型'
					}
				]
			},
			history_of_fill: {
				identifier: 'history_of_fill',
				rules: [
					{
						type   : 'empty',
						prompt : '请选择充填修复史及充填失败史'
					}
				]
			},
			difficulty_rating: {
				identifier: 'difficulty_rating',
				rules: [
					{
						type   : 'empty',
						prompt : '请选择龋病风险难度分级'
					}
				]
			}
		},
		inline: true,
		onSuccess: function(){
			$.ajax({
				url      : URL_DIFFICULTYASSE,
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
	function showDifficultyAssessmentData(vData) {
		$('#tooth_surface_and_location').text(vData.tooth_surface_and_location);
		$('#caries_depth').text(vData.caries_depth);
		$('#technology_type').text(vData.technology_type);
		$('#history_of_fill').text(vData.history_of_fill);
		$('#mouth_opening').text(vData.mouth_opening);
		$('#gag_reflex').text(vData.gag_reflex);
		$('#saliva').text(vData.saliva);
		$('#dental_phobia').text(vData.dental_phobia);
		$('#difficulty_rating').text(vData.difficulty_rating);

		var Level = "";
		switch (vData.difficulty_level) {
			case 1:  {
				Level = "Ⅰ级"; 
				$('#id_advice').text("建议转诊到A级医师进行处理");
				break;
			}
			case 2:  {
				Level = "Ⅱ级"; 
				$('#id_advice').text("建议转诊到B级医师进行处理");
				break;
			}
			case 3:  {
				Level = "Ⅲ级"; 
				$('#id_advice').text("建议转诊到C级医师进行处理");
				break;
			}
		}
		$('#difficulty_level').text(Level);
	}

	function setDefultFormData(vData) {
		$('select[name=tooth_surface_and_location]').dropdown("set selected", vData.tooth_surface_and_location);
		$('select[name=caries_depth]').dropdown("set selected", vData.caries_depth);
		$('select[name=technology_type]').dropdown("set selected", vData.technology_type);
		$('select[name=history_of_fill]').dropdown("set selected", vData.history_of_fill);
		$('select[name=mouth_opening]').dropdown("set selected", vData.mouth_opening);
		$('select[name=gag_reflex]').dropdown("set selected", vData.gag_reflex);
		$('select[name=saliva]').dropdown("set selected", vData.saliva);
		$('select[name=dental_phobia]').dropdown("set selected", vData.dental_phobia);
		$('select[name=difficulty_rating]').dropdown("set selected", vData.difficulty_rating);
	}
});