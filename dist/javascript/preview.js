$(document).ready(function(){

	// INIT
	var UID  = Number(requestParameter("uid")),
		TID  = Number(requestParameter("tid")),
		TYPE = Number(requestParameter("preview_type")); 

	$('.ui.sticky').sticky({
		context: '#maincontent'
	});
	// Text format
	var Fcomma = "，";

	// ***************************************************************
	// FUNCTION: 病人基本信息
	$.ajax({
		url      : URL_USER,
		type     : "get",
		data     : {user_id : UID},
		dataType : "json",
		success  : function(vData){
			var BasicInfo = (!vData.gender ? "男" : "女") + Fcomma; 
			BasicInfo += vData.age + "岁" + Fcomma; 
			BasicInfo += vData.occupation + Fcomma; 
			BasicInfo += "联系方式：" + vData.contact + Fcomma;
			BasicInfo += "身份证号：" + vData.id_number + Fcomma;
			BasicInfo += "病历录入时间：" + vData.in_date;

			$('#basicinfo a[type="time"]').text(vData.in_date);
			$('div[type=basicinfo] p').text(BasicInfo);
			$('div[type=basicinfo] .header').text(vData.name);
			$('div[type=basicinfo]').removeClass('invisible');
		}
	});

	// **************************************************
	// GET
	var ToothLocation = "";
	$.ajax({
		url      : URL_USERTOOTHINFO + toquerystring({tooth_id : TID}),
		type     : "GET",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(vData){

			ToothLocation = vData.tooth_location_number + "牙";
			$('.orange.header').text("病人" + ToothLocation + "信息预览");
			
			if (TYPE == 0) {
				showMedicalRecord_Patient(vData);
			} else if(TYPE == 1) {
				showMedicalRecord_Doctor(vData);
			}
		}
	});

	// **************************************************
	// Setting ajax：检查所有ajax请求是否完成
	var NumAJAX  = 0,
		ajaxBack = $.ajax,
		allAjaxDone = function() {
			$.each($('.case.segment:not(:first)'), function(){
				if ($(this).find('.ui.segment').not('.invisible').length != 0) {
					$(this).removeClass('invisible');
				}
			});
		};

	$.ajax = function(setting) {
		NumAJAX++;
		var callback = setting.complete; 
		setting.complete = function(){
			if($.isFunction(callback)) {callback.apply(setting.context, arguments);}
			NumAJAX--;
			if (NumAJAX==0 && $.isFunction(allAjaxDone)) {
				allAjaxDone();
			}
		}
		ajaxBack(setting);
	}

	// 病人版
	function showMedicalRecord_Patient(vData) {

		var $Case = $('.invisible.case');
		$.each(vData.cases.reverse(), function(){
			var $ClonedCase = $Case.clone();
			$ClonedCase.find('a[type=casetime]').text(this.date);

			// 初诊
			if (this.case_type == 0) {
				$ClonedCase.find('a[type=casetype]').text("初诊");

				getAndShowDiagnose($ClonedCase, this.case_id);
				getAndShowRiskEvaluationAndManage($ClonedCase, this.case_id);
				getAndShowDifficultyAssessment($ClonedCase, this.case_id);
				getAndShowCurePlan($ClonedCase, this.case_id);
			} 
			// 复诊
			else if (this.case_type == 1) {
				$ClonedCase.find('a[type=casetype]').text("复诊");
				// 非处置复诊
				if(this.if_handle == 0) {
					getAndShowUSPHS($ClonedCase, this.case_id);
					getAndShowRiskEvaluationAndManage($ClonedCase, this.case_id);
				}
				// 处置复诊
				else if (this.if_handle == 1) {
					getAndShowUSPHS($ClonedCase, this.case_id);
					getAndShowDiagnose($ClonedCase, this.case_id);
					getAndShowRiskEvaluationAndManage($ClonedCase, this.case_id);
					getAndShowDifficultyAssessment($ClonedCase, this.case_id);
					getAndShowCurePlan($ClonedCase, this.case_id);
				}

			}

			$Case.after($ClonedCase);
		});

	}
	// 医生版
	function showMedicalRecord_Doctor(vData) {

		var $Case = $('.invisible.case');
		$.each(vData.cases.reverse(), function(){
			var $ClonedCase = $Case.clone();
			$ClonedCase.find('a[type=casetime]').text(this.date);

			// 初诊
			if (this.case_type == 0) {
				$ClonedCase.find('a[type=casetype]').text("初诊");
				// 病史
				showBasicMedicalRecordInfo(this.case_id);

				getAndShowDiagnose($ClonedCase, this.case_id);
				getAndShowMouthExamination($ClonedCase, this.case_id);
				getAndShowRiskEvaluationAndManage($ClonedCase, this.case_id);
				getAndShowDifficultyAssessment($ClonedCase, this.case_id);
				getAndShowCurePlan($ClonedCase, this.case_id);
			} 
			// 复诊
			else if (this.case_type == 1) {
				$ClonedCase.find('a[type=casetype]').text("复诊");
				// 非处置复诊
				if(this.if_handle == 0) {
					getAndShowUSPHS($ClonedCase, this.case_id);
					getAndShowRiskEvaluationAndManage($ClonedCase, this.case_id);
				}
				// 处置复诊
				else if (this.if_handle == 1) {
					getAndShowUSPHS($ClonedCase, this.case_id);
					getAndShowDiagnose($ClonedCase, this.case_id);
					getAndShowMouthExamination($ClonedCase, this.case_id);
					getAndShowRiskEvaluationAndManage($ClonedCase, this.case_id);
					getAndShowDifficultyAssessment($ClonedCase, this.case_id);
					getAndShowCurePlan($ClonedCase, this.case_id);
				}
			}

			$Case.after($ClonedCase);
		});
	}

	// 病历基本信息
	function showBasicMedicalRecordInfo(case_id) {
		$.ajax({
			url      : URL_ILLNESSHISTORY,
			type     : "get",
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData){
				showChiefComplaint(vData.chief_complaint);
				showPresentIllness(vData.illness_history);
				showPersonalHistory(vData.personal_history);
				showPastHistory(vData.past_history);
			}
		});
	}

	// 主诉
	function showChiefComplaint(vData) {

		var $ChiefComplaint = $('div[type=chiefcomplaint]');

		appendpragraph($ChiefComplaint, vData.tooth_location + vData.symptom + vData.time_of_occurrence + "。");
		if (vData.additional) {
			appendpragraph($ChiefComplaint, "<span>补充主诉：</span>" + vData.additional);
		}

		$ChiefComplaint.removeClass('invisible');
	}

	// 现病史
	function showPresentIllness(vData) {
		var $PresentIllness = $('div[type=presentillness]'),
			DescribeText = !vData.is_primary ? "<span>原发性龋病：</span>" : "<span>继发性龋病：</span>";

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
	function showPersonalHistory(vData) {
		var $PersonalHistory = $('div[type=personalhistory]');

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
		appendpragraph($PersonalHistory, "<span>患牙其他治疗情况：</span>" + vData.orthodontic);
		if (vData.additional) {
			appendpragraph($PersonalHistory, "<span>患牙补充说明：</span>" + vData.additional);
		}

		$PersonalHistory.removeClass('invisible');
	}

	// 既往史
	function showPastHistory(vData) {
		var $PastHistory = $('div[type=pasthistory]');

		var systemillness = "<span>系统病史：</span>";
		if (vData.systemillness != "") {
			systemillness += "患有" + vData.systemillness + "系统性疾病，";
		} else {
			systemillness += "无高血压、心脏病、糖尿病等系统性疾病，";
		}
		if (vData.infectiousdisease != "") {
			systemillness += "患有" + vData.infectiousdisease + "传染性疾病";
		} else {
			systemillness += "无肝炎、结核等传染性疾病";
		}
		systemillness += "。";
		appendpragraph($PastHistory, systemillness);

		if (vData.dragallergy != "") {
			appendpragraph($PastHistory, "<span>药物过敏史：</span>" + vData.dragallergy + "。");
		} else {
			appendpragraph($PastHistory, "<span>药物过敏史：</span>" + "无药物过敏史。");
		}

		$PastHistory.show();
	}
	

	// ***************************************************************
	// FUNCTION: 返回病人病历概述
	$('.returnMedical.button').click(function(){
		redirection("medicalrecord.html", {
			uid : UID
		});
	});


	// ***************************************************************
	// FUNCTION:
	function appendpragraph($Item, Text) {
		$Item.append("<p>" + Text + "</p>");
	}
	function appendimage($Item, case_id, imagetype) {

		$Item.append('<div type="image"><img class="ui hidden rounded image" style="max-width:100%; max-height:300px;"></div>');
		
		$.ajax({
			url      : URL_IMAGE,
			type     : "GET",
			data     : {case_id : case_id, type : imagetype},
			dataType : "json",
			success  : function(FileData) {showPreviewImage(FileData, $Item.find('div[type=image]'));}
		});
	}


	// ***************************************************************
	// FUNCTION: 获取及显示口腔检查信息
	function getAndShowMouthExamination($Case, case_id) {
		$.ajax({
			url      : URL_MOUTHEXAM,
			type     : "get",
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData){

				var $MouthExam = $Case.find('div[type=mouthexamination]');

				// 牙体情况
				var MouthBody = "<span>牙体情况：</span>";
				MouthBody += vData.tooth_location + "牙";
				MouthBody += "龋坏累及" + vData.caries_tired + "，";
				if (vData.depth != "近髓") {
					MouthBody += "深达";
				}
				MouthBody += vData.depth + "，";		

				if (vData.fill != "无") {
					MouthBody += "原充填体为" + vData.fill + "，";
					MouthBody += vData.secondary + "，";
				}

				MouthBody += vData.color_of_caries + "，";
				MouthBody += vData.flex_of_caries + "，";
				MouthBody += vData.cold + "，";
				MouthBody += vData.hot + "，";
				MouthBody += vData.touch + "，";
				MouthBody += vData.bite;

				if (vData.vitality_value_of_teeth != "") {
					MouthBody += "，牙齿活力值：" + vData.vitality_value_of_teeth;
				};

				MouthBody += "。";
				appendpragraph($MouthExam, MouthBody);

				// 牙周情况
				var MouthAround = "<span>牙周情况：</span>";
				MouthAround += vData.gingival_hyperemia + "，";
				MouthAround += vData.gingival_color + "，";
				MouthAround += vData.tartar_up + "，";
				MouthAround += vData.tartar_down + "，";
				MouthAround += vData.bop + "，";
				MouthAround += vData.periodontal_pocket_depth + "，";

				if (vData.furcation != "根分叉病变无") {
					MouthAround += vData.furcation + "，";
					MouthAround += vData.location + "，";
				}

				MouthAround += vData.fistula + "，";
				MouthAround += vData.overflow_pus + "，";
				MouthAround += vData.mobility;
				MouthAround += "。";
				appendpragraph($MouthExam, MouthAround);

				// 患牙与邻牙接触关系
				var Neighbor = "<span>患牙与邻牙接触关系：</span>";
				Neighbor += vData.relations_between_teeth + "，";
				Neighbor += vData.is_teeth_crowd + "，";
				Neighbor += vData.involution_teeth + "，";
				Neighbor += "牙体形态";
				if (vData.tooth_shape != "正常") {
					Neighbor += "为";
				}
				Neighbor += vData.tooth_shape + "。";
				appendpragraph($MouthExam, Neighbor);

				// X线片表现
				var X_Ray = "<span>X线片表现：</span>";
				X_Ray += vData.tooth_location + "牙";
				X_Ray += vData.X_Ray_location + "，";
				X_Ray += vData.X_Ray_depth + "，";
				X_Ray += vData.X_Ray_fill_quality + "，根尖周组织无明显异常";

				if (vData.CT_shows) {
					X_Ray += "，CT表现：" + vData.CT_shows;
				}
				if (vData.piece) {
					X_Ray += "，咬翼片表现：" + vData.piece;
				}
				if (vData.OtherExpression) {
					X_Ray += "，其他表现：" + vData.OtherExpression;
				}
				X_Ray += "。";

				appendpragraph($MouthExam, X_Ray);

				appendimage($MouthExam, case_id, IMAGE_TYPE.MOUTHEXAM);

				$MouthExam.removeClass('invisible');
			}
		});
	}


	// ***************************************************************
	// FUNCTION: 获取及显示难度评估
	function getAndShowDifficultyAssessment($Case, case_id) {
		$.ajax({
			url      : URL_DIFFICULTYASSE,
			type     : "GET", 
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData) {

				var $DifficultyAssessment = $Case.find('div[type=difficultyassessment]');

				var Level  = "<span>难度等级：</span>",
					Advice = "<span>转诊意见：</span>";

				switch (vData.difficulty_level) {
					case 1:  {
						Level  += "Ⅰ级"; 
						Advice += "建议转诊到A级医师进行处理";
						break;
					}
					case 2:  {
						Level  += "Ⅱ级"; 
						Advice += "建议转诊到B级医师进行处理";
						break;
					}
					case 3:  {
						Level  += "Ⅲ级"; 
						Advice += "建议转诊到C级医师进行处理";
						break;
					}
				}

				appendpragraph($DifficultyAssessment, Level);
				appendpragraph($DifficultyAssessment, Advice);

				$DifficultyAssessment.removeClass('invisible');
			}
		});
	}


	// ***************************************************************
	// FUNCTION: 获取诊断及治疗计划
	function getAndShowDiagnose($Case, case_id) {
		$.ajax({
			url      : URL_DIAGNOSE,
			type     : "GET", 
			data     : toform({case_id : case_id}),
			dataType : "json",
			success  : function(vData) {
				var $Diagnose     = $Case.find('div[type=diagnose]'),
					Diagnose      = "<span>诊断：</span>";

				Diagnose += ToothLocation;
				Diagnose += vData.caries_degree;
				if (vData.caries_type != "无") {
					Diagnose += "，" + ToothLocation + vData.caries_type;
				}	
				appendpragraph($Diagnose, Diagnose);

				// other diagnose
				if (vData.additional != "") {
					appendpragraph($Diagnose, "<span>其他诊断：</span>" + vData.additional);
				}

				// show plan
				var CurePlan = "<span>治疗计划：</span>" + vData.cure_plan
				if (vData.specification != "") {
					CurePlan += "（" + vData.specification + "）";
				}
				appendpragraph($Diagnose, CurePlan);
				appendimage($Diagnose, case_id, IMAGE_TYPE.DIAGNOSE);

				$Diagnose.removeClass('invisible');
			}
		});
	}


	// ***************************************************************
	// FUNCTION: 获取及显示风险评估结果和龋病预后管理方案
	function getAndShowRiskEvaluationAndManage($Case, case_id) {
		$.ajax({
			url      : URL_RISKEVALUATION,
			type     : "GET", 
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData) {
				var Type = "";
				switch (vData.risk_level) {
					case 1:  {
						Type = "低风险患者";
						$Case.find('div[type=manage] .segment[data-tab=1]').removeClass('invisible');
						break;
					}
					case 2:  {
						Type = "中风险患者";
						$Case.find('div[type=manage] .segment[data-tab=2]').removeClass('invisible');
						break;
					}
					case 3:  {
						Type = "高风险患者";
						$Case.find('div[type=manage] .segment[data-tab=3]').removeClass('invisible');
						break;
					}
				}

				appendpragraph($Case.find('div[type=riskevaluation]').removeClass('invisible'), "<span>风险评估结果：</span>" + Type);
				$Case.find('div[type=manage]').removeClass('invisible');
			}
		});
	}

	// ***************************************************************
	// FUNCTION: 显示USPHS
	function getAndShowUSPHS($Case, case_id) {
		$.ajax({
			url      : URL_USPHS,
			type     : "GET", 
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData) {

				var $USPHS = $Case.find('div[type=usphs]'),
					USPHS  = "<span>USPHS评估结果：</span>";

				switch (vData.level) {
					case 'A': {
						USPHS += "A(临床可接受)";
						break;
					}
					case 'B': {
						USPHS += "B(临床可接受)";
						break;
					}
					case 'C': {
						USPHS += "C(临床不可接受)";
						break;
					}
					case 'D': {
						USPHS += "D(临床不可接受)";
						break;
					}
				}

				appendpragraph($USPHS.removeClass('invisible'), USPHS);
				appendimage($USPHS, case_id, IMAGE_TYPE.USPHS);
			}
		});
	}


	// ***************************************************************
	// FUNCTION: 获取及显示风险评估结果和龋病预后管理方案
	function getAndShowCurePlan($Case, case_id) {
		$.ajax({
			url      : URL_CURE,
			type     : "GET", 
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData) {
				var $Cure = $Case.find('div[type=cure]');
				appendpragraph($Cure, getCureData(vData));
				appendimage($Cure, case_id, IMAGE_TYPE.CURE);

				$Cure.removeClass('invisible');
			}
		});
	}

	NewLine = "<br/><br/>";
	function getCureData(vData) {

		var DescriptionStr;
		switch (vData.handle_type) {
			// 非手术治疗
			case 0: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>";
				switch (vData.specific_method) {
					case "药物治疗": {
						DescriptionStr = shownoSurgical1(vData, DescriptionStr);
						break;
					}
					case "再矿化治疗": {
						DescriptionStr = shownoSurgical2(vData, DescriptionStr);
						break;
					}
					case "窝沟封闭": {
						DescriptionStr = shownoSurgical3(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}

				break;
			};
			// 龋病微创修复
			case 1: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				switch (vData.specific_method) {
					case "ART修复": {
						DescriptionStr = showMinimal1(vData, DescriptionStr);
						break;
					}
					case "预防性充填": {
						DescriptionStr = showMinimal2(vData, DescriptionStr);
						break;
					}
					case "玻璃离子过渡性修复": {
						DescriptionStr = showMinimal3(vData, DescriptionStr);
						break;
					}
					case "釉质成型术": {
						DescriptionStr = showMinimal4(vData, DescriptionStr);
						break;
					}
					case "微打磨术": {
						DescriptionStr = showMinimal5(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}

				break;
			};
			// 复合树脂修复
			case 2: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				switch (vData.specific_method) {
					case "树脂直接充填修复": {
						DescriptionStr = showResin1(vData, DescriptionStr);
						break;
					}
					case "安抚治疗&树脂充填修复": {
						DescriptionStr = showResin2(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}

				break;
			};
			// 美容修复
			case 3: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				switch (vData.specific_method) {
					case "渗透树脂修复": {
						DescriptionStr = showLook1(vData, DescriptionStr);
						break;
					}
					case "微创复合树脂分层修复": {
						DescriptionStr = showLook2(vData, DescriptionStr);
						break;
					}
					default: {
						showErrorInfo();
					}
				}
				
				break;
			};
			// 间接修复
			case 4: {
				DescriptionStr = "<bold>" + vData.specific_method + "：</bold>" + NewLine;
				DescriptionStr = showIndirect(vData, DescriptionStr);
				break;
			};
			default: {
				showErrorInfo();
			};
		}

		// show image
		/*
		$.ajax({
			url      : URL_IMAGE,
			type     : "GET",
			data     : {case_id : CID, type : Image_type},
			dataType : "json",
			success  : function(FileData) {showImage(FileData);}
		});
		*/

		return DescriptionStr;
	}
	// 非手术治疗
	function shownoSurgical1(vData, vDescription) {
		vDescription += ToothLocation + "将" + vData.fluorination + "，" + vData.silver_nitrate + "涂布于龋损处30s";
		return vDescription;
	}
	function shownoSurgical2(vData, vDescription) {
		vDescription += ToothLocation + "患牙清洁，干燥，将矿化液浸湿的小棉球置于患牙牙面，反复涂搽3-4次";
		return vDescription;
	}
	function shownoSurgical3(vData, vDescription) {
		vDescription  +=  "<br/><br/>1. " + ToothLocation + "清洁牙面： 在低速手机上装好" + vData.additional_device 
						+ "，蘸取适量" + vData.reagent + "于牙面，对牙面和窝沟来回刷洗1分钟，同时不断滴水保持毛刷湿润" + NewLine
						+ "2. 用棉纱球隔湿，压缩空气牙面吹干，" + vData.tools + "蘸取酸蚀剂置于牙尖斜面的2/3上，" + vData.time_of_etching + NewLine
						+ "3. 流水冲洗牙面10-15秒，去除牙釉质表面和反应沉淀物" + NewLine
						+ "4. 洗刷笔蘸取适量封闭剂沿窝沟从远中向近中涂布在酸蚀后的牙面上" + NewLine
						+ "5. " + vData.lamp + NewLine
						+ "6. 探针进行检查，调合，" + vData.check_time;
		return vDescription;
	}
	// 龋病微创修复
	function showMinimal1(vData, vDescription) {
		vDescription += "1. ";
		vDescription += ToothLocation;
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "2. 干燥，隔湿，";
		if (vData.is_piece != "未使用成形片") {
			vDescription += "使用";
		}
		vDescription += vData.is_piece + "，";
		if (vData.is_chock != "未使用楔子") {
			vDescription += "使用";
		}
		vDescription += vData.is_chock + NewLine;

		vDescription += "3. 处理剂清洁窝洞，彻底冲洗，吹干" + NewLine;
		vDescription += "4. 干燥隔湿，使用玻璃离子充填龋洞" + NewLine;
		vDescription += "5. 修形，调合，涂布凡士林" + NewLine;

		return vDescription;
	}
	function showMinimal2(vData, vDescription) {
		vDescription += "1. ";
		vDescription += ToothLocation;
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "2. 干燥，隔湿，";
		if (vData.is_piece != "未使用成形片") {
			vDescription += "使用";
		}
		vDescription += vData.is_piece + "，";
		if (vData.is_chock != "未使用楔子") {
			vDescription += "使用";
		}
		vDescription += vData.is_chock + NewLine;

		vDescription += "3. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "4. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom) {
			vDescription += "，" + vData.bottom;
		};
		vDescription += NewLine;

		vDescription += "5. 酸蚀，彻底冲洗，吹干" + NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.compromise + "调合" + "，";
		vDescription += vData.polishing + "抛光";

		if (vData.compromise_polishing_additional != "") {
			vDescription += "。调和抛光补充说明：" + vData.compromise_polishing_additional;
		}

		return vDescription;
	}
	function showMinimal3(vData, vDescription) {
		vDescription += "1. ";
		vDescription += ToothLocation;
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		if (vData.is_piece != "未使用成形片") {
			vDescription += "使用";
		}
		vDescription += vData.is_piece + "，";
		if (vData.is_chock != "未使用楔子") {
			vDescription += "使用";
		}
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.modification != "无") {
			vDescription += "，" + vData.modification;
		}
		vDescription += NewLine;

		vDescription += "5. " + vData.modulo + "玻璃离子充填" + NewLine;
		vDescription += "6. 修型，调合，涂凡士林";
		
		return vDescription;
	}
	function showMinimal4(vData, vDescription) {
		vDescription += ToothLocation + "用火焰状金刚砂针磨去浅的沟裂，将釉质磨圆钝，形成光滑、蝶形的利于清洁的表面";
		
		return vDescription;
	}
	function showMinimal5(vData, vDescription) {
		vDescription += "1. ";
		vDescription += ToothLocation;
		vDescription += "低速手机装上" + vData.microscope + "蘸取适量牙膏于牙面，来回刷洗无龋牙面及窝沟1min，彻底冲洗清洁" + NewLine;
		vDescription += "2. 涂抹约2～3mm厚的磨膏层于牙面，低速手机装上" + vData.modulo
			 + "蘸取6.6%盐酸及碳化硅微粒的水溶性磨砂膏剂来进行微打磨，轻微加力，在牙齿表面打磨(2-3min，4-6min)。在每次微打磨之后，使用清水冲洗干净";
		
		return vDescription;
	}
	// 复合树脂修复
	function showResin1(vData, vDescription) {
		vDescription += "1. ";
		vDescription += ToothLocation;
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		if (vData.is_piece != "未使用成形片") {
			vDescription += "使用";
		}
		vDescription += vData.is_piece + "，";
		if (vData.is_chock != "未使用楔子") {
			vDescription += "使用";
		}
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "5. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom != "无") {
			vDescription += "，" + vData.bottom;
		}
		vDescription += NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.compromise + "调合" + "，";
		vDescription += vData.polishing + "抛光";

		if (vData.compromise_polishing_additional != "") {
			vDescription += "。调和抛光补充说明：" + vData.compromise_polishing_additional;
		}
		
		return vDescription;
	}
	function showResin2(vData, vDescription) {
		// 初诊
		vDescription += "<bold>初诊：</bold>";
		vDescription += "使用"+ vData.appease_medicine + "，";
		vDescription += "观察" + vData.observed_time;
		vDescription += NewLine;

		// 复诊：1. 
		vDescription += "<bold>复诊：</bold>" + NewLine;
		
		vDescription += "1. ";
		vDescription += ToothLocation;
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		if (vData.is_piece != "未使用成形片") {
			vDescription += "使用";
		}
		vDescription += vData.is_piece + "，";
		if (vData.is_chock != "未使用楔子") {
			vDescription += "使用";
		}
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "5. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom != "无") {
			vDescription += "，" + vData.bottom;
		}
		vDescription += NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.compromise + "调合" + "，";
		vDescription += vData.polishing + "抛光";

		if (vData.compromise_polishing_additional != "") {
			vDescription += "。调和抛光补充说明：" + vData.compromise_polishing_additional;
		}

		return vDescription;
	}
	// 美容修复
	function showLook1(vData, vDescription) {
		vDescription += "1. ";
		vDescription += ToothLocation;
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		if (vData.rubber == "使用开口器") {
			vDescription += vData.rubber + "，";
		}
		if (vData.microscope == "使用咬合块") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.penetration_resin;
		vDescription += NewLine;

		vDescription += "2. ";
		if (vData.is_micro != "否") {
			vDescription += vData.is_micro;

			if (vData.modulo != "无") {
				vDescription += "：" + vData.modulo + "保护牙龈";
			}
			if (vData.low_mobile != "无") {
				vDescription += "，低速手机装上" + vData.low_mobile;
			}
			if (vData.micro != "无") {
				vDescription += "，" + vData.micro + "微研磨剂打磨";
			}
			if (vData.fluoride_protector != "无") {
				vDescription += "，冲洗，吹干，涂布" + vData.fluoride_protector + "氟保护剂";
			}
			vDescription += "。";
		}
		vDescription += "酸蚀剂酸蚀病变区域及周围牙体组织" + vData.acid_time + "，";
		vDescription += "涂布干燥剂" + vData.dry_times + "，";
		vDescription += "涂布渗透树脂，光固化" + vData.time_of_lamp;
	
		return vDescription;
	}
	function showLook2(vData, vDescription) {
		vDescription += "1. ";
		vDescription += ToothLocation;
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "去龋，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm" + NewLine;

		vDescription += "3. 干燥，隔湿，";
		if (vData.is_piece != "未使用成形片") {
			vDescription += "使用";
		}
		vDescription += vData.is_piece + "，";
		if (vData.is_chock != "未使用楔子") {
			vDescription += "使用";
		}
		vDescription += vData.is_chock + NewLine;

		vDescription += "4. ";
		vDescription += vData.shade_guide + "比色，选择牙色";
		vDescription += vData.color_of_tooth + NewLine;

		vDescription += "5. ";
		vDescription += vData.disinfect + "窝洞消毒";
		if (vData.bottom != "无") {
			vDescription += "，" + vData.bottom;
		}
		vDescription += NewLine;

		vDescription += "6. ";
		vDescription += vData.etching_type + "：";
		if (vData.etching_type == "全酸蚀粘接系统") {
			vDescription += vData.full_etching + "，";
		} else {
			vDescription += vData.self_etching + "，";
		}
		vDescription += "涂布" + vData.coating_time + "，";
		vDescription += "光照" + vData.illumination_time;
		vDescription += NewLine;

		vDescription += "7. ";
		vDescription += "树脂：" + vData.resin + "，";
		vDescription += "颜色：" + vData.color_of_resin;
		vDescription += NewLine;

		vDescription += "8. " + vData.modification + "，";
		vDescription += vData.lamp + "光照" + vData.time_of_lamp;
		vDescription += NewLine;

		vDescription += "9. ";
		vDescription += vData.compromise + "调合" + "，";
		vDescription += vData.polishing + "抛光";

		if (vData.compromise_polishing_additional != "") {
			vDescription += "。调和抛光补充说明：" + vData.compromise_polishing_additional;
		}
		
		return vDescription;
	}
	// 间接修复
	function showIndirect(vData, vDescription) {
		vDescription += "嵌体修复材料类型：" + vData.prosthesis_type + NewLine;

		vDescription += "1. ";
		vDescription += ToothLocation;
		// FIXME: add tooth location
		if (vData.anesthesia_medicine != "无") {
			vDescription += vData.anesthesia_medicine + "，";
		}
		if (vData.part_anesthesia != "无") {
			vDescription += vData.part_anesthesia + "，";
		}
		vDescription += vData.rubber;
		vDescription += NewLine;

		vDescription += "2. ";
		// FIXME: add tooth location
		if (vData.microscope == "显微镜下") {
			vDescription += vData.microscope + "，";
		}
		vDescription += vData.tools + "，以龋蚀显示剂指示，继续去净龋坏，";
		vDescription += vData.shape_of_hole + "制备洞形，深度：";
		vDescription += vData.depth_of_hole + "mm。";
		vDescription += "使用钻针" + vData.drill_needle + "。";
		if (vData.is_chock == "是") {
			vDescription += "行直接充填，充填材料为：" + vData.fill_material + "。";
		}
		vDescription += NewLine;

		if (vData.additional != "") {
			vDescription += "<span>操作补充说明：</span>" + vData.additional;
			vDescription += NewLine;
		}

		vDescription += "3. ";
		vDescription += "使用" + vData.gingival_retraction + "排龈，";
		vDescription += vData.modulo + "取模";
		vDescription += NewLine;

		vDescription += "4. ";
		if (vData.etching_type == "是") {
			vDescription += "制作临时修复体，临时修复体粘接，粘接剂为" + vData.bind_material;
			vDescription += NewLine;

			vDescription += "5. ";
		}

		vDescription += "复诊，去除临时修复体，试戴，调改接触点，检查有无翘动，固位好，边缘密合，";
		vDescription += vData.bind_type + "氢氟酸酸蚀修复体";
		if (vData.fluoride_acid_time != "无") {
			vDescription += vData.fluoride_acid_time;
		}
		vDescription += "，冲洗、干燥，";

		if (vData.silicon == "是") {
			vDescription += "涂布硅烷偶联剂，";
		}
		vDescription += "磷酸酸蚀牙面" + vData.phosphorus_acid_time + "，";
		vDescription += "涂布" + vData.bind_type_component + "粘接剂，";
		vDescription += "修复体就位，临时光照" + vData.observed_time + "，去除多余粘接剂，";
		vDescription += vData.compromise + "调合" + "，";
		vDescription += vData.polishing + "抛光";

		if (vData.compromise_polishing_additional != "") {
			vDescription += "。调和抛光补充说明：" + vData.compromise_polishing_additional;
		}
		
		return vDescription;
	}
	// Handle error
	function showErrorInfo() {
		// TODO: design error UI
		alert("Network Error...");
	}
});