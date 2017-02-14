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
			success  : function(Data){
				var ChiefComplaint = Data.tooth_location;
				ChiefComplaint += Data.is_fill_tooth ? "要求补牙" : Data.symptom + Data.time_of_occurrence;
				ChiefComplaint += "。";
				$('div[type=chiefcomplaint] p').text(ChiefComplaint);
				// TODO: 补充主诉

				$('div[type=chiefcomplaint]').removeClass('invisible');
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
			success  : function(DATA) {
				var DescribeText = !DATA.is_primary ? "<span>原发性龋病：</span>" : "<span>有治疗史龋病：</span>";

				if (!DATA.is_primary) {
					DescribeText += DATA.is_very_bad + "，";
					DescribeText += DATA.is_night_pain_self_pain + "，";
					DescribeText += DATA.is_hypnalgia + "，";
					DescribeText += DATA.is_sensitive_cold_heat + "，";
					DescribeText += DATA.is_cold_hot_stimulationpain + "，";
					DescribeText += DATA.is_delayed_pain + "，";
					DescribeText += DATA.medicine_name + "，";
					DescribeText += DATA.is_relief;
				} else {
					DescribeText += "在" + DATA.cure_time + "曾进行充填修复治疗，";
					DescribeText += "为" + DATA.fill_type + "，";
					DescribeText += DATA.fill_state + "，";
					DescribeText += DATA.is_night_pain_self_pain + "，";
					DescribeText += DATA.is_hypnalgia + "，";
					DescribeText += DATA.is_sensitive_cold_heat + "，";
					DescribeText += DATA.is_cold_hot_stimulationpain + "，";
					DescribeText += DATA.is_delayed_pain + "，";
					DescribeText += DATA.medicine_name + "，";
					DescribeText += DATA.is_relief;
				}
				DescribeText += "。";

				$('div[type=presentillness] p').html(DescribeText);
			
				$('div[type=presentillness]').removeClass('invisible');
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
			success  : function(DATA){
				var $PersonalHistory = $('div[type=personalhistory]');
				// 饮食习惯
				var Eating_Habits = "<span>饮食习惯：</span>";
				Eating_Habits += DATA.consumption_of_sweet + "，";
				Eating_Habits += DATA.frequency_of_sweet + "，";
				Eating_Habits += DATA.frequency_of_meal + "，";
				Eating_Habits += DATA.is_carbonic_acid;
				Eating_Habits += "。";
				appendpragraph($PersonalHistory, Eating_Habits);

				// 口腔卫生维护
				var Oral_Maintenance = "<span>口腔卫生维护：</span>";
				Oral_Maintenance += DATA.is_floss + "，";
				Oral_Maintenance += DATA.times_of_teeth_brush + "，";
				Oral_Maintenance += DATA.time_of_teeth_brush + "，";
				Oral_Maintenance += DATA.long_of_teeth_brush + "，";
				Oral_Maintenance += DATA.electric_tooth_brush + "，";
				Oral_Maintenance += DATA.is_fluorine + "，";
				Oral_Maintenance += DATA.is_cavity_examination + "，";
				Oral_Maintenance += DATA.is_periodontal_treatment;
				Oral_Maintenance += "。";
				appendpragraph($PersonalHistory, Oral_Maintenance);

				// 宿主易感性
				var Sensitive = "<span>宿主易感性：</span>";
				Sensitive += DATA.salivary_gland_disease + "，";
				Sensitive += DATA.sjogren_syndrome + "，";
				Sensitive += DATA.consciously_reduce_salivary_flow;
				Sensitive += "。";
				appendpragraph($PersonalHistory, Sensitive);

				// TODO: add attribute


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