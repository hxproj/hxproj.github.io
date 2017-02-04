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
	var $InfoSegement = $('#tableinfo'),
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
	// GET：主诉
	$.ajax({
		url      : URL_TOOTH,
		type     : "GET", 
		data     : toform({tooth_id : TID}),
		dataType : "json",
		error    : function() {
			// TODO: check the return data 
			$FormSegement.show();
		},
		success  : function(vData) {
			$InfoSegement.show();

			IsEditMode = true;
			displayChiefComplaintInfo(vData);
			$FormSegement.hide();
		}
	});
	// GET：现病史
	$.ajax({
		url      : URL_PRESENTILLNESS,
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
			displayPresentIllnessHistoryInfo(vData);
			$FormSegement.hide();
		}
	});
	// GET：个人史
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
			displayPersonalHistoryInfo(vData);
			$FormSegement.hide();
		}
	});
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
		Nav($('#nav'), data.case_type, data.if_handle, Nav_Item.illnesshistory, {
			UID : UID,
			TID : TID,
			CID : CID,
		});
	}, 'JSON');


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
	$('#ID_Confirm .confirm.button').click(function(){
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
		$('#PH_radiation_therapy_history').text(getFormData(PersonalHistoryForm, "radiation_therapy_history"));
		$('#PH_loss_caries_index_up').text(getFormData(PersonalHistoryForm, "loss_caries_index_up"));
		$('#PH_loss_caries_surface_index_up').text(getFormData(PersonalHistoryForm, "loss_caries_surface_index_up"));
		$('#PH_orthodontic').text(getFormData(PersonalHistoryForm, "orthodontic"));
		$('#PH_additional').text(getFormData(PersonalHistoryForm, "additional"));
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



	// **************************************************
	// Function
	function displayChiefComplaintInfo(vData) {
		$('td[type=CC_tooth_location]').text(vData.tooth_location);
		$('td[type=CC_symptom]').text(vData.symptom);
		$('td[type=CC_time_of_occurrence]').text(vData.time_of_occurrence);
		$('td[type=CC_additional]').text(vData.additional);
	}

	function displayPresentIllnessHistoryInfo(vData) {
		if (vData.is_primary == 0) {
			$('td[type=PI_type]').text("原发性龋病");

			$('td[type=PI_is_very_bad]').parent().removeClass("disabled");

			$('td[type=PI_is_very_bad]').text(vData.is_very_bad);
			$('td[type=PI_is_night_pain_self_pain]').text(vData.is_night_pain_self_pain);
			$('td[type=PI_is_hypnalgia]').text(vData.is_hypnalgia);
			$('td[type=PI_is_sensitive_cold_heat]').text(vData.is_sensitive_cold_heat);
			$('td[type=PI_is_cold_hot_stimulationpain]').text(vData.is_cold_hot_stimulationpain);
			$('td[type=PI_is_delayed_pain]').text(vData.is_delayed_pain);
			$('td[type=PI_medicine_name]').text(vData.medicine_name);
			$('td[type=PI_is_relief]').text(vData.is_relief);
			$('td[type=PI_additional]').text(vData.additional);
		} else {
			$('td[type=PI_type]').text("继发性龋病");

			$('td[type=PI_type]').parent().removeClass("disabled");
			$('td[type=PI_cure_time]').parent().removeClass("disabled");
			$('td[type=PI_fill_type]').parent().removeClass("disabled");

			$('td[type=PI_cure_time]').text(vData.cure_time);
			$('td[type=PI_fill_type]').text(vData.fill_type);
			$('td[type=PI_fill_state]').text(vData.fill_state);

			$('td[type=PI_is_night_pain_self_pain]').text(vData.is_night_pain_self_pain);
			$('td[type=PI_is_hypnalgia]').text(vData.is_hypnalgia);
			$('td[type=PI_is_sensitive_cold_heat]').text(vData.is_sensitive_cold_heat);
			$('td[type=PI_is_cold_hot_stimulationpain]').text(vData.is_cold_hot_stimulationpain);
			$('td[type=PI_is_delayed_pain]').text(vData.is_delayed_pain);
			$('td[type=PI_medicine_name]').text(vData.medicine_name);
			$('td[type=PI_is_relief]').text(vData.is_relief);
			$('td[type=PI_additional]').text(vData.additional);
		}
	}

	function displayPersonalHistoryInfo(vData) {
		$('td[type=PH_consumption_of_sweet]').text(vData.consumption_of_sweet);
		$('td[type=PH_frequency_of_sweet]').text(vData.frequency_of_sweet);
		$('td[type=PH_frequency_of_meal]').text(vData.frequency_of_meal);
		$('td[type=PH_is_carbonic_acid]').text(vData.is_carbonic_acid);
		$('td[type=PH_is_floss]').text(vData.is_floss);
		$('td[type=PH_times_of_teeth_brush]').text(vData.times_of_teeth_brush);
		$('td[type=PH_time_of_teeth_brush]').text(vData.time_of_teeth_brush);
		$('td[type=PH_long_of_teeth_brush]').text(vData.long_of_teeth_brush);
		$('td[type=PH_electric_tooth_brush]').text(vData.electric_tooth_brush);
		$('td[type=PH_is_fluorine]').text(vData.is_fluorine);
		$('td[type=PH_is_cavity_examination]').text(vData.is_cavity_examination);
		$('td[type=PH_is_periodontal_treatment]').text(vData.is_periodontal_treatment);
		$('td[type=PH_sjogren_syndrome]').text(vData.sjogren_syndrome);
		$('td[type=PH_salivary_gland_disease]').text(vData.salivary_gland_disease);
		$('td[type=PH_consciously_reduce_salivary_flow]').text(vData.consciously_reduce_salivary_flow);
		$('td[type=PH_development_of_the_situation]').text(vData.development_of_the_situation);
		$('td[type=PH_radiation_therapy_history]').text(vData.radiation_therapy_history);
		$('td[type=PH_loss_caries_index_up]').text(vData.loss_caries_index_up);
		$('td[type=PH_loss_caries_surface_index_up]').text(vData.loss_caries_surface_index_up);
		$('td[type=PH_orthodontic]').text(vData.orthodontic);
		$('td[type=PH_additional]').text(vData.additional);
	}

});