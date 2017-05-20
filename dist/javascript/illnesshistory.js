$(document).ready(function(){

	$('#PresentIllnessContext .menu .item').tab({ context: $('#PresentIllnessContext') });
	
	// **************************************************
	// INIT
	// INIT PARAMENTERS
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
	var PresentIllnessHistoryFields1 = {
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
	// GET Addition Option of Selection
	window.getOtherOption({
		table_name : TABLE.PERSONAL_HISTORY,
		fields     : ["development_of_the_situation"]
	});
	window.getOtherOption({
		table_name : TABLE.CHIEF_COMPLAINT,
		fields     : ["symptom"]
	});
	

	// **************************************************
	// GET
	$.ajax({
		url      : URL_ILLNESSHISTORY,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "json",
		error    : function() {
			$FormSegement.show();
		},
		success  : function(vData) {
			$InfoSegement.show();

			IsEditMode = true;
			showChiefComplaint($('#tableinfo'), vData.chief_complaint);
			showPresentIllness($('#tableinfo'), vData.illness_history);
			showPersonalHistory($('#tableinfo'), vData.personal_history);
			showPastHistory($('#tableinfo'), vData.past_history);

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
			nextStep(2, 3, "#PersonalHistory", "#PastHistory");
			return false; 
		}
	});
	$('#PersonalHistory .prev.button').click(function(){
		prevStep(2, 1, "#PersonalHistory", "#PresentIllnessHistory");
	});
	$('#PersonalHistory .next.button').click(function(){
		$(this).parents('.form').submit();
	});
	// Step 4：既往史
	$('#PastHistory .prev.button').click(function(){
		prevStep(3, 2, "#PastHistory", "#PersonalHistory");
	});
	$('#PastHistory .next.button').click(function(){
		nextStep(3, 4, "#PastHistory", "#ID_Confirm", displayConfirmInfo);
	});

	// Step 5：确认
	$('#ID_Confirm .prev.button').click(function(){
		prevStep(4, 3, "#ID_Confirm", "#PastHistory");
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
			success  : function(vData) {},
			complete : function() {
				addOtherOption({
					form       : $('#ChiefComplaint form'),
					table_name : TABLE.CHIEF_COMPLAINT,
					fields     : ["symptom"]
				});
			}
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
			data     : toform({user_id : UID, case_id : CID, tooth_id : TID, time_of_teeth_brush : $('#PersonalHistory form').form('get value', "time_of_teeth_brush_display")}) + $('#PersonalHistory form').serialize(),
			dataType : "json",
			async    : false,
			error    : function() {IsSubmited = false;},
			success  : function(vData) {},
			complete : function() {
				addOtherOption({
					form       : $('#PersonalHistory form'),
					table_name : TABLE.PERSONAL_HISTORY,
					fields     : ["development_of_the_situation"]
				});
			}
		});

		// Submit personal history
		$.ajax({
			url      : URL_PASTHISTORY,
			type     : IsEditMode ? "PUT" : "POST", 
			data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $('#PastHistory form').serialize(),
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
			PersonalHistoryForm = $('#PersonalHistory'),
			PastHistoryForm     = $('#PastHistory');

		showChiefComplaint($('#ID_Confirm'), {
			tooth_location : getFormData(ChiefComplaintForm, "tooth_location"),
			symptom : getFormData(ChiefComplaintForm, "symptom"),
			time_of_occurrence : getFormData(ChiefComplaintForm, "time_of_occurrence"),
			additional : getFormData(ChiefComplaintForm, "additional"),
		});

		showPresentIllness($('#ID_Confirm'), {
			is_primary : Number(getFormData(PresentIllnessHistoryForm, "is_primary")),
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
			time_of_teeth_brush : getFormData(PersonalHistoryForm, "time_of_teeth_brush_display"),
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

		showPastHistory($('#ID_Confirm'), {
			systemillness : getFormData(PastHistoryForm, "systemillness"),
			infectiousdisease : getFormData(PastHistoryForm, "infectiousdisease"),
			dragallergy : getFormData(PastHistoryForm, "dragallergy"),
		});
	}
	

	// **************************************************
	// Other Event
	$('#ID_TimeModal').modal({
		onApprove : function() {
			$('input[name=time_of_occurrence]').val("");
		}
	});
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
		var $ChiefComplaint = $Item.find('div[type=chiefcomplaint]');
		$ChiefComplaint.find('p').remove();

		appendpragraph($ChiefComplaint, vData.tooth_location + vData.symptom + vData.time_of_occurrence);
		if (vData.additional) {
			appendpragraph($ChiefComplaint, vData.additional);
		}

		$ChiefComplaint.removeClass('invisible');
	}

	// 现病史
	function showPresentIllness($Item, vData) {
		var $PresentIllness = $Item.find('div[type=presentillness]'),
			DescribeText    = "";

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
		DescribeText += "。";

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
		Eating_Habits += "甜食或蛋白质类食物食用量" + vData.consumption_of_sweet + "，";
		Eating_Habits += vData.frequency_of_sweet + "，";
		Eating_Habits += vData.frequency_of_meal + "，";
		Eating_Habits += vData.is_carbonic_acid;
		Eating_Habits += "。";
		appendpragraph($PersonalHistory, Eating_Habits);

		// 口腔卫生维护
		var Oral_Maintenance = "<span>口腔卫生维护：</span>";
		Oral_Maintenance += vData.is_floss + "，";
		Oral_Maintenance += vData.time_of_teeth_brush + "，";
		Oral_Maintenance += vData.times_of_teeth_brush + "，";
		Oral_Maintenance += "每次刷牙" + vData.long_of_teeth_brush + "，";
		Oral_Maintenance += vData.electric_tooth_brush + "，";
		Oral_Maintenance += vData.is_fluorine + "，";
		Oral_Maintenance += vData.is_cavity_examination + "，";
		Oral_Maintenance += vData.is_periodontal_treatment;
		Oral_Maintenance += "。";
		appendpragraph($PersonalHistory, Oral_Maintenance);

		// 宿主易感性
		var Sensitive = "<span>宿主易感性：</span>";
		Sensitive += vData.sjogren_syndrome + "，";

		vData.salivary_gland_disease ? Sensitive += "患有唾液腺疾病：" + vData.salivary_gland_disease :
								Sensitive += "无唾液腺疾病";
		Sensitive += "，";

		vData.consciously_reduce_salivary_flow ? Sensitive += "自觉唾液流量减少" + vData.consciously_reduce_salivary_flow :
								Sensitive += "唾液流量未明显减少";
		Sensitive += "，";
		Sensitive += vData.development_of_the_situation + "，";
		Sensitive += vData.radiation_therapy_history + "。";

		appendpragraph($PersonalHistory, Sensitive);

		// DMFT/DMFS
		if (vData.loss_caries_index_up || vData.loss_caries_surface_index_up) {
			var DMFT_DMFS = "<span>DMFT/DMFS：</span>";

			if (vData.loss_caries_index_up && vData.loss_caries_surface_index_up) {
				DMFT_DMFS += "龋失补指数(DMFT)：" + vData.loss_caries_index_up + "，";
				DMFT_DMFS += "龋失补牙面数(DMFS)：" + vData.loss_caries_surface_index_up;
			} else {
				if (vData.loss_caries_index_up) {
					DMFT_DMFS += "龋失补指数(DMFT)：" + vData.loss_caries_index_up;
				}
				if (vData.loss_caries_surface_index_up) {
					DMFT_DMFS += "龋失补牙面数(DMFS)：" + vData.loss_caries_surface_index_up;
				}
			}

			appendpragraph($PersonalHistory, DMFT_DMFS);
		}

		// Other
		appendpragraph($PersonalHistory, "<span>患牙其他治疗情况：</span>" + vData.orthodontic + "。");
		if (vData.additional) {
			appendpragraph($PersonalHistory, "<span>患牙补充说明：</span>" + vData.additional + "。");
		}

		$PersonalHistory.removeClass('invisible');
	}

	function showPastHistory($Item, vData) {
		var $PastHistory = $Item.find('div[type=pasthistory]');
		$PastHistory.find('p').remove();

		var systemillness = "<span>系统病史：</span>";
		systemillness += vData.systemillness != "" ? vData.systemillness : "否认高血压、冠心病等心血管疾病、糖尿病等系统性疾病";
		appendpragraph($PastHistory, systemillness);

		var infectiousdisease = "<span>传染性疾病：</span>";
		infectiousdisease += vData.infectiousdisease != "" ? vData.infectiousdisease : "否认肝炎等传染性疾病";
		appendpragraph($PastHistory, infectiousdisease);

		vData.dragallergy != "" ? appendpragraph($PastHistory, "<span>药物过敏史：</span>" + vData.dragallergy) : appendpragraph($PastHistory, "<span>药物过敏史：</span>" + "无药物过敏史");

		$PastHistory.removeClass('invisible');
	}

	function setDefultFormData(vData) {

		var ChiefComplaint  = vData.chief_complaint,
			IllnessHistory  = vData.illness_history,
			PersonalHistory = vData.personal_history,
			PastHistory     = vData.past_history;

		// 主诉
        $('#ChiefComplaint select[name=tooth_location]').dropdown("set selected", ChiefComplaint.tooth_location);
        $('#ChiefComplaint select[name=symptom]').dropdown("set selected", ChiefComplaint.symptom);
        $('#ChiefComplaint input[name=time_of_occurrence]').val(ChiefComplaint.time_of_occurrence);
        $('#ChiefComplaint textarea[name=additional]').val(ChiefComplaint.additional);

		// 现病史
		$('#PresentIllnessHistory select[name=is_very_bad]').dropdown("set selected", IllnessHistory.is_very_bad);
		$('#PresentIllnessHistory select[name=is_night_pain_self_pain]').dropdown("set selected", IllnessHistory.is_night_pain_self_pain);
		$('#PresentIllnessHistory select[name=is_hypnalgia]').dropdown("set selected", IllnessHistory.is_hypnalgia);
		$('#PresentIllnessHistory select[name=is_sensitive_cold_heat]').dropdown("set selected", IllnessHistory.is_sensitive_cold_heat);
		$('#PresentIllnessHistory select[name=is_cold_hot_stimulationpain]').dropdown("set selected", IllnessHistory.is_cold_hot_stimulationpain);
		$('#PresentIllnessHistory select[name=is_delayed_pain]').dropdown("set selected", IllnessHistory.is_delayed_pain);
		$('#PresentIllnessHistory select[name=is_relief]').dropdown("set selected", IllnessHistory.is_relief);
		$('#PresentIllnessHistory select[name=fill_type]').dropdown("set selected", IllnessHistory.fill_type);
		$('#PresentIllnessHistory select[name=fill_state]').dropdown("set selected", IllnessHistory.fill_state);
		$('#PresentIllnessHistory input[name=medicine_name]').val(IllnessHistory.medicine_name);
		$('#PresentIllnessHistory input[name=cure_time]').val(IllnessHistory.cure_time);
        $('#PresentIllnessHistory textarea[name=additional]').val(IllnessHistory.additional);
        // Change Tab
		var TabIndex = IllnessHistory.is_primary ? 2 : 1;
		$('#PresentIllnessHistory .menu .active').removeClass("active");
		$('#PresentIllnessHistory .segment.active').removeClass("active");
		$('#PresentIllnessHistory .menu a[data-tab=' + TabIndex + ']').addClass("active");
		$('#PresentIllnessHistory .segment[data-tab=' + TabIndex + ']').addClass("active");

        // 个人史
        $('#PersonalHistory select[name=consumption_of_sweet]').dropdown("set selected", PersonalHistory.consumption_of_sweet);
        $('#PersonalHistory select[name=frequency_of_sweet]').dropdown("set selected", PersonalHistory.frequency_of_sweet);
        $('#PersonalHistory select[name=frequency_of_meal]').dropdown("set selected", PersonalHistory.frequency_of_meal);
        $('#PersonalHistory select[name=is_carbonic_acid]').dropdown("set selected", PersonalHistory.is_carbonic_acid);
        $('#PersonalHistory select[name=is_floss]').dropdown("set selected", PersonalHistory.is_floss);
        $('#PersonalHistory select[name=times_of_teeth_brush]').dropdown("set selected", PersonalHistory.times_of_teeth_brush);
        $('#PersonalHistory select[name=long_of_teeth_brush]').dropdown("set selected", PersonalHistory.long_of_teeth_brush);
        $('#PersonalHistory select[name=electric_tooth_brush]').dropdown("set selected", PersonalHistory.electric_tooth_brush);
        $('#PersonalHistory select[name=is_fluorine]').dropdown("set selected", PersonalHistory.is_fluorine);
        $('#PersonalHistory select[name=is_cavity_examination]').dropdown("set selected", PersonalHistory.is_cavity_examination);
        $('#PersonalHistory select[name=is_periodontal_treatment]').dropdown("set selected", PersonalHistory.is_periodontal_treatment);
        $('#PersonalHistory select[name=sjogren_syndrome]').dropdown("set selected", PersonalHistory.sjogren_syndrome);
        $('#PersonalHistory select[name=electric_tooth_brush]').dropdown("set selected", PersonalHistory.electric_tooth_brush);
        $('#PersonalHistory select[name=development_of_the_situation]').dropdown("set selected", PersonalHistory.development_of_the_situation);
        $('#PersonalHistory input[name=salivary_gland_disease]').val(PersonalHistory.salivary_gland_disease);
        $('#PersonalHistory input[name=consciously_reduce_salivary_flow]').val(PersonalHistory.consciously_reduce_salivary_flow);
        $('#PersonalHistory input[name=loss_caries_index_up]').val(PersonalHistory.loss_caries_index_up);
        $('#PersonalHistory input[name=loss_caries_surface_index_up]').val(PersonalHistory.loss_caries_surface_index_up);
        $('#PersonalHistory textarea[name=additional]').val(PersonalHistory.additional);
		
		var SplitTime = PersonalHistory.time_of_teeth_brush.split(',');
		for (var i=0; i<SplitTime.length; ++i){
			$('#PersonalHistory select[name=time_of_teeth_brush_display]').dropdown("set selected", SplitTime[i]);
		}

		// 既往史
		 $('#PastHistory textarea[name=systemillness]').val(PastHistory.systemillness);
		 $('#PastHistory textarea[name=infectiousdisease]').val(PastHistory.infectiousdisease);
		 $('#PastHistory textarea[name=dragallergy]').val(PastHistory.dragallergy);
	}

	// ***************************************************************
	// FUNCTION:
	function appendpragraph($Item, Text) {
		$Item.append("<p>" + Text + "</p>");
	}

});