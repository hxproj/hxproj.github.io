$(document).ready(function(){

	// INIT
	var UID = Number(requestParameter("uid")),
		TID = Number(requestParameter("tid"));

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

			$('div[type=basicinfo] p').text(BasicInfo);
			$('div[type=basicinfo] header').text(vData.name);
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
			$('.orange.header').text("病人牙位信息：" + ToothLocation);

			showChiefComplaint(vData);

			$.each(vData.cases, function(){
				// 处置
				if (this.case_type == 0) {

					showPresentIllness(this.case_id);
					showPersonalHistory(this.case_id);

				} 
				// 复诊
				else if (this.case_type == 1) {

				}
			});
		}
	});


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
});