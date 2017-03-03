$(document).ready(function(){

	// INIT
	var UID  = Number(requestParameter("uid")),
		TID  = Number(requestParameter("tid")),
		TYPE = Number(requestParameter("preview_type")); 

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
	$.ajax({
		url      : URL_USERTOOTHINFO + toquerystring({tooth_id : TID}),
		type     : "GET",
		dataType : "json",
		error    : function(){ networkError(); },
		success  : function(vData){

			var ToothLocation = vData.tooth_location_number + "牙";
			$('.orange.header').text("牙位：" + ToothLocation);
			
			if (TYPE == 0) {
				showMedicalRecord_Patient(vData);
			} else if(TYPE == 1) {
				showMedicalRecord_Doctor(vData);
			}
		}
	});

	// 病人版
	function showMedicalRecord_Patient(vData) {

		var $Case = $('.invisible.case');
		$.each(vData.cases.reverse(), function(){
			var $ClonedCase = $Case.clone().removeClass('invisible');
			$ClonedCase.find('a[type=casetime]').text(this.date);

			// 初诊
			if (this.case_type == 0) {
				$ClonedCase.find('a[type=casetype]').text("初诊");

				getAndShowDiagnose($ClonedCase, case_id);
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
			var $ClonedCase = $Case.clone().removeClass('invisible');
			$ClonedCase.find('a[type=casetime]').text(this.date);

			// 初诊
			if (this.case_type == 0) {
				$ClonedCase.find('a[type=casetype]').text("初诊");
				// 病史
				showChiefComplaint(vData);
				showPresentIllness(this.case_id);
				showPersonalHistory(this.case_id);
				showPastHistory(this.case_id);

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

	// 主诉
	function showChiefComplaint(vData) {
		$.ajax({
			url      : URL_TOOTH,
			type     : "get",
			data     : {tooth_id : vData.tooth_id},
			dataType : "json",
			success  : function(vData){

				var $ChiefComplaint = $('div[type=chiefcomplaint]');

				appendpragraph($ChiefComplaint, vData.tooth_location + vData.symptom + vData.time_of_occurrence + "。");
				if (vData.additional) {
					appendpragraph($ChiefComplaint, "<span>补充主诉：</span>" + vData.additional);
				}

				$ChiefComplaint.removeClass('invisible');
			}
		});
	}

	// 现病史
	function showPresentIllness(case_id) {
		$.ajax({
			url      : URL_PRESENTILLNESS,
			type     : "GET",
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData) {
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
		});
	}

	// 个人史
	function showPersonalHistory(case_id) {
		$.ajax({
			url      : URL_PERSONALHISTORY,
			type     : "get",
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData){
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
		});
	}

	// 既往史
	function showPastHistory(case_id) {
		$.ajax({
			url      : URL_PASTHISTORY,
			type     : "GET",
			data     : {case_id : case_id},
			dataType : "json",
			success  : function(vData) {
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
		});
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
				Neighbor += vData.tooth_shape;
				Neighbor += "。";
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

				// TODO
				// 显示口腔检查图片

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
				// 获取牙位信息
				$.ajax({
					url      : URL_TOOTH + toquerystring({tooth_id : TID}),
					type     : "get",
					dataType : "json",
					success  : function(ToothInfo) { 

						var $Diagnose     = $Case.find('div[type=diagnose]'),
							Diagnose      = "<span>诊断：</span>",
							ToothLocation = ToothInfo.tooth_location_number + "牙";

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

						$Diagnose.removeClass('invisible');
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
					}
				})
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
	// FUNCTION: 获取及显示风险评估结果和龋病预后管理方案
	function getAndShowCurePlan($Case, case_id) {
		var $Cure = $Case.find('div[type=cure]');

		appendpragraph($Cure, "<span>FIXME: TODO</span>");

		$Cure.removeClass('invisible')
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
			}
		});
	}
});