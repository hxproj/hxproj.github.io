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
			identifier: 'time_of_teeth_brush',
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
	function nextStep(CurrentStepIndex, NextStepIndex, CurrentStepID, NextStepID, CallbackFun) {
		$('.steps .step').eq(CurrentStepIndex).removeClass('active').addClass('completed');
		$('.steps .step').eq(NextStepIndex).removeClass('disabled').addClass('active');

		$(CurrentStepID).hide("normal", "linear", CallbackFun);
		$(NextStepID).show();
	}
	function prevStep(CurrentStepIndex, PrevStepIndex, CurrentStepID, PrevStepID) {
		$('.steps .step').eq(CurrentStepIndex).removeClass('active').addClass('disabled');
		$('.steps .step').eq(PrevStepIndex).removeClass('completed').addClass('active');

		$(CurrentStepID).hide();
		$(PrevStepID).show();
	}
	// Step 1：主诉
	$('#ChiefComplaint .next.button').click(function(){
		$(this).parents('.form').form({
			fields: ChiefComplaintFields,
			inline: true,
			onSuccess: function() { 
				nextStep(0, 1, "#ChiefComplaint", "#PresentIllnessHistory");
				return false; 
			}
		}).submit();
	});
	// Step 2：现病史
	$('#PresentIllnessHistory .prev.button').click(function(){
		prevStep(1, 0, "#PresentIllnessHistory", "#ChiefComplaint");
	});
	var PresentIllnessHistoryForm;
	$('#PresentIllnessHistory .next.button').click(function(){
		PresentIllnessHistoryForm = $(this).parents('.ui.form');

		PresentIllnessHistoryForm.form({
			fields: $(this).parents('.tab.segment').attr("data-tab") == 1 ? PresentIllnessHistoryFields1 : PresentIllnessHistoryFields2,
			inline: true,
			onSuccess: function() { 
				nextStep(1, 2, "#PresentIllnessHistory", "#PersonalHistory");
				return false; 
			}
		}).submit();
	});
	// Step 3: 个人史
	$('#PersonalHistory').form({
		fields: PersonalHistoryFields,
		inline: true,
		onSuccess: function() { 
			nextStep(2, 3, "#PersonalHistory", "#ID_Confirm", displayConfirmInfo);
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
		// Submit tooth info
		$.ajax({
			url      : URL_TOOTH,
			type     : "PUT", 
			data     : toform({tooth_id : TID}) + $('#ChiefComplaint form').serialize(),
			dataType : "json",
			error    : function() {},
			success  : function(vData) {}
		});

		// Submit presentillness
		$.ajax({
			url      : URL_PRESENTILLNESS,
			type     : "POST", 
			data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + PresentIllnessHistoryForm.serialize(),
			dataType : "json",
			error    : function() {},
			success  : function(vData) {}
		});

		// Submit personal history
		$.ajax({
			url      : URL_PERSONALHISTORY,
			type     : "POST", 
			data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $('#PersonalHistory form').serialize(),
			dataType : "json",
			error    : function() {},
			success  : function(vData) {}
		});
	});

	function getFormData(Form, Field) {
		return Form.form('get value', Field);
	}
	function displayConfirmInfo() {
		// Form
		var ChiefComplaintForm  = $('#ChiefComplaint'),
			PersonalHistoryForm = $('#PersonalHistory');

		// display confirm info
		// 主诉
		$('#CC_tooth_location').text(getFormData(ChiefComplaintForm, "tooth_location"));
		$('#CC_symptom').text(getFormData(ChiefComplaintForm, "symptom"));
		$('#CC_time_of_occurrence').text(getFormData(ChiefComplaintForm, "time_of_occurrence"));
		$('#CC_additional').text(getFormData(ChiefComplaintForm, "additional"));

		// 现病史
		if (Number(getFormData(PresentIllnessHistoryForm, "is_primary")) == 0) {
			$('#PI_type').text("原发性龋病");
			$('#PI_is_very_bad').parent().removeClass("disabled");

			$('#PI_is_very_bad').text(getFormData(PresentIllnessHistoryForm, "is_very_bad"));
			$('#PI_is_night_pain_self_pain').text(getFormData(PresentIllnessHistoryForm, "is_night_pain_self_pain"));
			$('#PI_is_hypnalgia').text(getFormData(PresentIllnessHistoryForm, "is_hypnalgia"));
			$('#PI_is_sensitive_cold_heat').text(getFormData(PresentIllnessHistoryForm, "is_sensitive_cold_heat"));
			$('#PI_is_cold_hot_stimulationpain').text(getFormData(PresentIllnessHistoryForm, "is_cold_hot_stimulationpain"));
			$('#PI_is_delayed_pain').text(getFormData(PresentIllnessHistoryForm, "is_delayed_pain"));
			$('#PI_medicine_name').text(getFormData(PresentIllnessHistoryForm, "medicine_name"));
			$('#PI_is_relief').text(getFormData(PresentIllnessHistoryForm, "is_relief"));
			$('#PI_additional').text(getFormData(PresentIllnessHistoryForm, "additional"));
		} else {
			$('#PI_type').text("继发性龋病");
			$('#PI_cure_time').parent().removeClass("disabled");
			$('#PI_fill_type').parent().removeClass("disabled");
			$('#PI_fill_state').parent().removeClass("disabled");

			$('#PI_cure_time').text(getFormData(PresentIllnessHistoryForm, "cure_time"));
			$('#PI_fill_type').text(getFormData(PresentIllnessHistoryForm, "fill_type"));
			$('#PI_fill_state').text(getFormData(PresentIllnessHistoryForm, "fill_state"));

			$('#PI_is_night_pain_self_pain').text(getFormData(PresentIllnessHistoryForm, "is_night_pain_self_pain"));
			$('#PI_is_hypnalgia').text(getFormData(PresentIllnessHistoryForm, "is_hypnalgia"));
			$('#PI_is_sensitive_cold_heat').text(getFormData(PresentIllnessHistoryForm, "is_sensitive_cold_heat"));
			$('#PI_is_cold_hot_stimulationpain').text(getFormData(PresentIllnessHistoryForm, "is_cold_hot_stimulationpain"));
			$('#PI_is_delayed_pain').text(getFormData(PresentIllnessHistoryForm, "is_delayed_pain"));
			$('#PI_medicine_name').text(getFormData(PresentIllnessHistoryForm, "medicine_name"));
			$('#PI_is_relief').text(getFormData(PresentIllnessHistoryForm, "is_relief"));
			$('#PI_additional').text(getFormData(PresentIllnessHistoryForm, "additional"));
		}

		// 个人史
		$('#PH_consumption_of_sweet').text(getFormData(PersonalHistoryForm, "consumption_of_sweet"));
		$('#PH_frequency_of_sweet').text(getFormData(PersonalHistoryForm, "frequency_of_sweet"));
		$('#PH_frequency_of_meal').text(getFormData(PersonalHistoryForm, "frequency_of_meal"));
		$('#PH_is_carbonic_acid').text(getFormData(PersonalHistoryForm, "is_carbonic_acid"));
		$('#PH_is_floss').text(getFormData(PersonalHistoryForm, "is_floss"));
		$('#PH_times_of_teeth_brush').text(getFormData(PersonalHistoryForm, "times_of_teeth_brush"));
		$('#PH_time_of_teeth_brush').text(getFormData(PersonalHistoryForm, "time_of_teeth_brush"));
		$('#PH_long_of_teeth_brush').text(getFormData(PersonalHistoryForm, "long_of_teeth_brush"));
		$('#PH_electric_tooth_brush').text(getFormData(PersonalHistoryForm, "electric_tooth_brush"));
		$('#PH_is_fluorine').text(getFormData(PersonalHistoryForm, "is_fluorine"));
		$('#PH_is_cavity_examination').text(getFormData(PersonalHistoryForm, "is_cavity_examination"));
		$('#PH_is_periodontal_treatment').text(getFormData(PersonalHistoryForm, "is_periodontal_treatment"));
		$('#PH_sjogren_syndrome').text(getFormData(PersonalHistoryForm, "sjogren_syndrome"));
		$('#PH_salivary_gland_disease').text(getFormData(PersonalHistoryForm, "salivary_gland_disease"));
		$('#PH_consciously_reduce_salivary_flow').text(getFormData(PersonalHistoryForm, "consciously_reduce_salivary_flow"));
		$('#PH_development_of_the_situation').text(getFormData(PersonalHistoryForm, "development_of_the_situation"));
		$('#PH_sjogren_syndrome').text(getFormData(PersonalHistoryForm, "sjogren_syndrome"));
		$('#PH_loss_caries_index_up').text(getFormData(PersonalHistoryForm, "loss_caries_index_up"));
		$('#PH_loss_caries_surface_index_up').text(getFormData(PersonalHistoryForm, "loss_caries_surface_index_up"));
		$('#PH_orthodontic').text(getFormData(PersonalHistoryForm, "orthodontic"));
		$('#PH_time_of_occurrence').text(getFormData(PersonalHistoryForm, "additional"));
	}


	// **************************************************
	// Other Event
	$('#ChiefComplaint input[name=time_of_occurrence], #ID_CureTime').parent().click(function(){
		$('#ID_TimeModal').modal('show');

		var $Input = $(this).find("input");
		$('#ID_TimeModal a.label').unbind().click(function(){
			$Input.val($(this).text() + $(this).prevAll('div.label').text());
			$('#ID_TimeModal').modal('hide');
		});

	});

});