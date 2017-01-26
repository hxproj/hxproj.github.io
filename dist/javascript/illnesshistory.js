$(document).ready(function(){

	$('#PresentIllnessContext .menu .item').tab({ context: $('#PresentIllnessContext') });

	
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
	// INIT form fields validation
	var ChiefComplaintFields = {
		tooth_surface_and_location: {
			identifier: 'tooth_location',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择患牙位置'
				}
			]
		},
		symptom: {
			identifier: 'symptom',
			rules: [
				{
					type   : 'empty',
					prompt : '症状'
				}
			]
		},
		time_of_occurrence: {
			identifier: 'time_of_occurrence',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择病程时间'
				}
			]
		}
	},
	PresentIllnessHistoryFields1 = {
		// Nothing
	},
	PresentIllnessHistoryFields2 = {
		cure_time: {
			identifier: 'cure_time',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择治疗时间'
				}
			]
		},
		fill_type: {
			identifier: 'fill_type',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择修复体类型'
				}
			]
		},
		fill_state: {
			identifier: 'fill_state',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择修复体状况'
				}
			]
		}
	},
	PersonalHistoryFields = {
		times_of_teeth_brush: {
			identifier: 'times_of_teeth_brush',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择每天刷牙次数'
				}
			]
		},
		time_of_teeth_brush_display: {
			identifier: 'time_of_teeth_brush_display',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择刷牙时间点'
				}
			]
		}
	};


	// **************************************************
	// GET
	$.ajax({
		url      : URL_PERSONALHISTORY,
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
	// POST | PUT


	// **************************************************
	// Step
	// Next Step
	function nextStep(CurrentStepIndex, NextStepIndex, CurrentStepID, NextStepID) {
		$('.steps .step').eq(CurrentStepIndex).removeClass('active').addClass('completed');
		$('.steps .step').eq(NextStepIndex).removeClass('disabled').addClass('active');

		$(CurrentStepID).hide("normal", "linear");
		$(NextStepID).show();
	}
	function prevStep(CurrentStepIndex, PrevStepIndex, CurrentStepID, PrevStepID) {
		$('.steps .step').eq(CurrentStepIndex).removeClass('active').addClass('disabled');
		$('.steps .step').eq(PrevStepIndex).removeClass('completed').addClass('active');

		$(CurrentStepID).hide();
		$(PrevStepID).show();
	}
	// Step 1：主诉
	$('#ChiefComplaint').form({
		fields: ChiefComplaintFields,
		inline: true,
		onSuccess: function() { 
			nextStep(0, 1, "#ChiefComplaint", "#PresentIllnessHistory");
			return false; 
		}
	});
	$('#ChiefComplaint .next.button').click(function(){
		$(this).parents('.form').submit();
	});
	// Step 2：现病史
	$('#PresentIllnessHistory .form[data-tab=1]').form({
		fields: PresentIllnessHistoryFields1,
		inline: true,
		onSuccess: function() { 
			nextStep(1, 2, "#PresentIllnessHistory", "#PersonalHistory");
			return false; 
		}
	});
	$('#PresentIllnessHistory .form[data-tab=2]').form({
		fields: PresentIllnessHistoryFields2,
		inline: true,
		onSuccess: function() { 
			nextStep(1, 2, "#PresentIllnessHistory", "#PersonalHistory");
			return false; 
		}
	});
	$('#PresentIllnessHistory .prev.button').click(function(){
		prevStep(1, 0, "#PresentIllnessHistory", "#ChiefComplaint");
	});
	$('#PresentIllnessHistory .next.button').click(function(){
		$(this).parents('.tab.form').submit();
	});
	// Step 3: 个人史
	$('#PersonalHistory').form({
		fields: PersonalHistoryFields,
		inline: true,
		onSuccess: function() { 
			nextStep(2, 3, "#PersonalHistory", "#ID_Confirm");
			return false; 
		}
	});
	$('#PersonalHistory .prev.button').click(function(){
		prevStep(2, 1, "#PersonalHistory", "#PresentIllnessHistory");
	});
	$('#PersonalHistory .next.button').click(function(){
		$(this).parents('.form').submit();
	});
	// Step 4：确认
	$('#ID_Confirm .prev.button').click(function(){
		prevStep(3, 2, "#ID_Confirm", "#PersonalHistory");
	});
	$('#ID_Confirm .next.button').click(function(){
		// TODO: submit
	});



	// **************************************************
	// Other Event
	var $TimeofOccurrence = $('#ChiefComplaint input[name=time_of_occurrence]');
	$TimeofOccurrence.parent().click(function(){
		$('#ID_TimeModal').modal('show');
	});
	$('#ID_TimeModal a.label').click(function(){
		$TimeofOccurrence.val($(this).text() + $(this).prevAll('div.label').text());
		$('#ID_TimeModal').modal('hide');
	});

	// **************************************************
	// Function

});