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
		$FormSegement = $('#formsegment');
	// INIT Basic info
	getBasicInfo(Nav_Item.illnesshistory, UID, CID, TID);
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
		is_relief: {
			identifier: 'is_relief',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择症状是否缓解'
				}
			]
		},
	},
	PresentIllnessHistoryFields2 = {
		is_relief: {
			identifier: 'is_relief',
			rules: [
				{
					type   : 'empty',
					prompt : '请选择症状是否缓解'
				}
			]
		},
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
		url      : URL_ILLNESSHISTORY,
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
			showChiefComplaint($('#tableinfo'), vData.chief_complaint);
			showPresentIllness($('#tableinfo'), vData.illness_history);
			showPersonalHistory($('#tableinfo'), vData.personal_history);
			setDefultFormData(vData);
			$FormSegement.hide();
		}
	});


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

		var IsSubmited = true;
		// Submit tooth info
		$.ajax({
			url      : URL_TOOTH,
			type     : "PUT", 
			data     : toform({tooth_id : TID}) + $('#ChiefComplaint form').serialize(),
			dataType : "json",
			async    : false,
			error    : function() {IsSubmited = false;},
			success  : function(vData) {}
		});

		// Submit presentillness
		$.ajax({
			url      : URL_PRESENTILLNESS,
			type     : IsEditMode ? "PUT" : "POST", 
			data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + PresentIllnessHistoryForm.serialize(),
			dataType : "json",
			async    : false,
			error    : function() {IsSubmited = false;},
			success  : function(vData) {}
		});

		// Submit personal history
		$.ajax({
			url      : URL_PERSONALHISTORY,
			type     : IsEditMode ? "PUT" : "POST", 
			data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $('#PersonalHistory form').serialize(),
			dataType : "json",
			async    : false,
			error    : function() {IsSubmited = false;},
			success  : function(vData) {}
		});

		if (IsSubmited) {location.reload();}
	});

	function getFormData(Form, Field) {
		return Form.form('get value', Field);
	}
	function displayConfirmInfo() {
		// Form
		var ChiefComplaintForm  = $('#ChiefComplaint'),
			PersonalHistoryForm = $('#PersonalHistory');

		showChiefComplaint($('#ID_Confirm'), {
			tooth_location : getFormData(ChiefComplaintForm, "tooth_location"),
			symptom : getFormData(ChiefComplaintForm, "symptom"),
			time_of_occurrence : getFormData(ChiefComplaintForm, "time_of_occurrence"),
			additional : getFormData(ChiefComplaintForm, "additional"),
		});

		showPresentIllness($('#ID_Confirm'), {
			is_primary : 0,
			is_very_bad : getFormData(PresentIllnessHistoryForm, "is_very_bad"),
			is_night_pain_self_pain : getFormData(PresentIllnessHistoryForm, "is_night_pain_self_pain"),
			is_hypnalgia : getFormData(PresentIllnessHistoryForm, "is_hypnalgia"),
			is_sensitive_cold_heat : getFormData(PresentIllnessHistoryForm, "is_sensitive_cold_heat"),
			is_cold_hot_stimulationpain : getFormData(PresentIllnessHistoryForm, "is_cold_hot_stimulationpain"),
			is_delayed_pain : getFormData(PresentIllnessHistoryForm, "is_delayed_pain"),
			medicine_name : getFormData(PresentIllnessHistoryForm, "medicine_name"),
			is_relief : getFormData(PresentIllnessHistoryForm, "is_relief"),
			additional : getFormData(PresentIllnessHistoryForm, "additional"),
			fill_type : getFormData(PresentIllnessHistoryForm, "fill_type"),
			fill_state : getFormData(PresentIllnessHistoryForm, "fill_state"),
			cure_time : getFormData(PresentIllnessHistoryForm, "cure_time"),
		});

		showPersonalHistory($('#ID_Confirm'), {
			consumption_of_sweet : getFormData(PersonalHistoryForm, "consumption_of_sweet"),
			frequency_of_sweet : getFormData(PersonalHistoryForm, "frequency_of_sweet"),
			frequency_of_meal : getFormData(PersonalHistoryForm, "frequency_of_meal"),
			is_carbonic_acid : getFormData(PersonalHistoryForm, "is_carbonic_acid"),
			is_floss : getFormData(PersonalHistoryForm, "is_floss"),
			times_of_teeth_brush : getFormData(PersonalHistoryForm, "times_of_teeth_brush"),
			time_of_teeth_brush : getFormData(PersonalHistoryForm, "time_of_teeth_brush"),
			long_of_teeth_brush : getFormData(PersonalHistoryForm, "long_of_teeth_brush"),
			electric_tooth_brush : getFormData(PersonalHistoryForm, "electric_tooth_brush"),
			is_fluorine : getFormData(PersonalHistoryForm, "is_fluorine"),
			is_cavity_examination : getFormData(PersonalHistoryForm, "is_cavity_examination"),
			is_periodontal_treatment : getFormData(PersonalHistoryForm, "is_periodontal_treatment"),
			sjogren_syndrome : getFormData(PersonalHistoryForm, "sjogren_syndrome"),
			salivary_gland_disease : getFormData(PersonalHistoryForm, "salivary_gland_disease"),
			consciously_reduce_salivary_flow : getFormData(PersonalHistoryForm, "consciously_reduce_salivary_flow"),
			development_of_the_situation : getFormData(PersonalHistoryForm, "development_of_the_situation"),
			radiation_therapy_history : getFormData(PersonalHistoryForm, "radiation_therapy_history"),
			loss_caries_index_up : getFormData(PersonalHistoryForm, "loss_caries_index_up"),
			loss_caries_surface_index_up : getFormData(PersonalHistoryForm, "loss_caries_surface_index_up"),
			orthodontic : getFormData(PersonalHistoryForm, "orthodontic"),
			additional : getFormData(PersonalHistoryForm, "additional"),
		});
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

	$('.edit.button').click(function(){
		var Cancel = "<div class='ui right floated teal small button' onclick='location.reload()'>取消</div>";
		$InfoSegement.hide();
   		$FormSegement.find('.confirm.button').text("确认修改").after(Cancel);
   		$FormSegement.find('.next.button').after(Cancel);
		$FormSegement.show();
	});



	// **************************************************
	// Function: show
	// 主诉
	function showChiefComplaint($Item, vData) {
		var $ChiefComplaint = $Item.find('div[type=chiefcomplaint]'),
			ChiefComplaint  = vData.tooth_location;

		$ChiefComplaint.find('p').remove();

		ChiefComplaint += vData.is_fill_tooth ? "要求补牙" : vData.symptom + vData.time_of_occurrence;
		ChiefComplaint += "。";
		appendpragraph($ChiefComplaint, ChiefComplaint);

		if (vData.additional) {
			appendpragraph($ChiefComplaint, "<span>补充主诉：</span>" + vData.additional);
		}

		$ChiefComplaint.removeClass('invisible');
	}

	// 现病史
	function showPresentIllness($Item, vData) {
		var $PresentIllness = $Item.find('div[type=presentillness]'),
			DescribeText = !vData.is_primary ? "<span>原发性龋病：</span>" : "<span>有治疗史龋病：</span>";

		$PresentIllness.find('p').remove();

		if (!vData.is_primary) {
			DescribeText += vData.is_very_bad + "，";
			DescribeText += vData.is_night_pain_self_pain + "，";
			DescribeText += vData.is_hypnalgia + "，";
			DescribeText += vData.is_sensitive_cold_heat + "，";
			DescribeText += vData.is_cold_hot_stimulationpain + "，";
			DescribeText += vData.is_delayed_pain + "，";

			vData.medicine_name ? DescribeText += "服用" + vData.medicine_name :
								DescribeText += "未服用任何药物";
			
			DescribeText += "，" + vData.is_relief;
		} else {
			DescribeText += "在" + vData.cure_time + "曾进行充填修复治疗，";
			DescribeText += "为" + vData.fill_type + "，";
			DescribeText += vData.fill_state + "，";
			DescribeText += vData.is_night_pain_self_pain + "，";
			DescribeText += vData.is_hypnalgia + "，";
			DescribeText += vData.is_sensitive_cold_heat + "，";
			DescribeText += vData.is_cold_hot_stimulationpain + "，";
			DescribeText += vData.is_delayed_pain + "，";

			vData.medicine_name ? DescribeText += "服用" + vData.medicine_name :
								DescribeText += "未服用任何药物";

			DescribeText += "，" + vData.is_relief;
		}

		appendpragraph($PresentIllness, DescribeText);

		if (vData.additional) {
			appendpragraph($PresentIllness, "<span>补充现病史：</span>" + vData.additional);
		}
	
		$PresentIllness.removeClass('invisible');
	}

	// 个人史
	function showPersonalHistory($Item, vData) {
		var $PersonalHistory = $Item.find('div[type=personalhistory]');

		$PersonalHistory.find('p').remove();

		// 饮食习惯
		var Eating_Habits = "<span>饮食习惯：</span>";
		Eating_Habits += vData.consumption_of_sweet + "，";
		Eating_Habits += vData.frequency_of_sweet + "，";
		Eating_Habits += vData.frequency_of_meal + "，";
		Eating_Habits += vData.is_carbonic_acid;
		Eating_Habits += "。";
		appendpragraph($PersonalHistory, Eating_Habits);

		// 口腔卫生维护
		var Oral_Maintenance = "<span>口腔卫生维护：</span>";
		Oral_Maintenance += vData.is_floss + "，";
		Oral_Maintenance += vData.times_of_teeth_brush + "，";
		Oral_Maintenance += vData.time_of_teeth_brush + "，";
		Oral_Maintenance += vData.long_of_teeth_brush + "，";
		Oral_Maintenance += vData.electric_tooth_brush + "，";
		Oral_Maintenance += vData.is_fluorine + "，";
		Oral_Maintenance += vData.is_cavity_examination + "，";
		Oral_Maintenance += vData.is_periodontal_treatment;
		Oral_Maintenance += "。";
		appendpragraph($PersonalHistory, Oral_Maintenance);

		// 宿主易感性
		var Sensitive = "<span>宿主易感性：</span>";
		Sensitive += vData.salivary_gland_disease + "，";
		Sensitive += vData.sjogren_syndrome + "，";
		Sensitive += vData.consciously_reduce_salivary_flow;
		Sensitive += "。";
		appendpragraph($PersonalHistory, Sensitive);

		// TODO: add attribute
		$PersonalHistory.removeClass('invisible');
	}

	function setDefultFormData(vData) {

		var ChiefComplaint  = vData.chief_complaint,
			IllnessHistory  = vData.illness_history,
			PersonalHistory = vData.personal_history;

		// 主诉
        $('#ChiefComplaint select[name=tooth_location]').dropdown("set selected", ChiefComplaint.tooth_location);
        $('#ChiefComplaint select[name=symptom]').dropdown("set selected", ChiefComplaint.symptom);
        $('#ChiefComplaint input[name=time_of_occurrence]').val(ChiefComplaint.time_of_occurrence);
        $('#ChiefComplaint textarea[name=additional]').val(ChiefComplaint.additional);

        // 现病史
        // 原发性龋病
        $('#PresentIllnessHistory select[name=is_very_bad]').dropdown("set selected", IllnessHistory.is_very_bad);
        $('#PresentIllnessHistory select[name=is_night_pain_self_pain]').dropdown("set selected", IllnessHistory.is_night_pain_self_pain);
        $('#PresentIllnessHistory select[name=is_hypnalgia]').dropdown("set selected", IllnessHistory.is_hypnalgia);
        $('#PresentIllnessHistory select[name=is_sensitive_cold_heat]').dropdown("set selected", IllnessHistory.is_sensitive_cold_heat);
        $('#PresentIllnessHistory select[name=is_cold_hot_stimulationpain]').dropdown("set selected", IllnessHistory.is_cold_hot_stimulationpain);
        $('#PresentIllnessHistory select[name=is_delayed_pain]').dropdown("set selected", IllnessHistory.is_delayed_pain);
        $('#PresentIllnessHistory input[name=medicine_name]').val(IllnessHistory.medicine_name);
        $('#PresentIllnessHistory select[name=is_relief]').dropdown("set selected", IllnessHistory.is_relief);
        $('#PresentIllnessHistory select[name=fill_type]').dropdown("set selected", IllnessHistory.fill_type);
        $('#PresentIllnessHistory select[name=fill_state]').dropdown("set selected", IllnessHistory.fill_state);
        $('#PresentIllnessHistory input[name=cure_time]').val(IllnessHistory.cure_time);
        $('#PresentIllnessHistory textarea[name=additional]').val(IllnessHistory.additional);


	}


	// ***************************************************************
	// FUNCTION:
	function appendpragraph($Item, Text) {
		$Item.append("<p>" + Text + "</p>");
	}

});