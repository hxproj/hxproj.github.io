$(document).ready(function(){

	var U_ID = Number(requestParameter("uid"));

	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
  	$.ajax({
  		url     : URL_PERSONAL_HISTORY,
  		type    : "get",
  		data    : addParameter("user_id", U_ID),
  		dataType: "json",
  		success : function(data){
  			
  			$('#submit').hide();
  			$('#display').show();

  			DATA = data;

  			var PH_Habit_Text  = "";
  			var PH_Health_Text = "";
  			var PH_Host_Text   = "";

  			// 饮食习惯
			if (DATA.more_sweet == "是") {
  				PH_Habit_Text += "食用多甜食、多蛋白质类食物";
  			} else {
  				PH_Habit_Text += "未食用多甜食、多蛋白质类食物";
  			}
  			PH_Habit_Text += "，";

  			PH_Habit_Text += "食用量：";
  			switch (Number(DATA.consumption_of_sweet)) {
  				case 124: PH_Habit_Text += "<125g"; break;
  				case 125: PH_Habit_Text += "125-249g"; break;
  				case 250: PH_Habit_Text += "250-500g"; break;
  				case 500: PH_Habit_Text += ">500g"; break;
  			}
  			PH_Habit_Text += "，";
  			
  			PH_Habit_Text += "食用频率：";
  			switch (Number(DATA.frequency_of_sweet)) {
  				case 1: PH_Habit_Text += "小于1次/天"; break;
  				case 2: PH_Habit_Text += "2次/天"; break;
  				case 3: PH_Habit_Text += "3次/天"; break;
  				case 4: PH_Habit_Text += "4次/天"; break;
  				case 5: PH_Habit_Text += "5次/天"; break;
  				case 6: PH_Habit_Text += "大于5次/天"; break;
  			}
  			PH_Habit_Text += "，";

  			PH_Habit_Text += "正餐间进食频率：";
  			switch (Number(DATA.frequency_of_meal)) {
  				case 1: PH_Habit_Text += "≤1"; break;
  				case 2: PH_Habit_Text += "1＜频率≤2"; break;
  				case 3: PH_Habit_Text += "≥3"; break;
  			}
  			PH_Habit_Text += "，";

			if (DATA.is_carbonic_acid == "是") {
  				PH_Habit_Text += "正餐间进食含碳酸";
  			} else {
  				PH_Habit_Text += "正餐间进食不含碳酸";
  			}

       		// 口腔卫生维护
			if (DATA.is_floss == "是") {
  				PH_Health_Text += "使用牙线";
  			} else {
  				PH_Health_Text += "不使用牙线";
  			}
  			PH_Health_Text += "，";

  			PH_Health_Text += "每天刷牙次数：";
  			switch (Number(DATA.frequency_of_meal)) {
  				case 1: PH_Health_Text += "1次"; break;
  				case 2: PH_Health_Text += "2次"; break;
  				case 3: PH_Health_Text += "3次"; break;
  			}
  			PH_Health_Text += "，";

  			// FIXME: 刷牙时间点

  			PH_Health_Text += "刷牙时长：" + DATA.long_of_teeth_brush;
  			PH_Health_Text += "，";

			if (DATA.electric_tooth_brush == "是") {
  				PH_Health_Text += "使用电动牙刷";
  			} else {
  				PH_Health_Text += "不使用电动牙刷";
  			}
  			PH_Health_Text += "，";

			if (DATA.method_of_tooth_brush == "是") {
  				PH_Health_Text += "刷牙方法正确";
  			} else {
  				PH_Health_Text += "刷牙方法不正确";
  			}
  			PH_Health_Text += "，";

			if (DATA.method_of_tooth_brush == "是") {
  				PH_Health_Text += "牙膏不含氟";
  			} else {
  				PH_Health_Text += "牙膏含氟";
  			}
  			PH_Health_Text += "，";

			if (DATA.is_cavity_examination == "是") {
  				PH_Health_Text += "口腔定期检查";
  			} else {
  				PH_Health_Text += "口腔不定期检查";
  			}
  			PH_Health_Text += "，";

			if (DATA.is_cavity_examination == "是") {
  				PH_Health_Text += "定期牙周洁治";
  			} else {
  				PH_Health_Text += "不定期牙周洁治";
  			}

  			// 宿主易感性
			if (DATA.is_cavity_examination == "是") {
  				PH_Host_Text += "有干燥综合征";
  			} else {
  				PH_Host_Text += "没有干燥综合征";
  			}
  			PH_Host_Text += "，";

			if (DATA.salivary_gland_disease == "") {
  				PH_Host_Text += "没有唾液腺疾病";
  			} else {
  				PH_Host_Text += "唾液腺疾病：" + DATA.salivary_gland_disease;
  			}
  			PH_Host_Text += "，";

			if (DATA.consciously_reduce_salivary_flow == "") {
  				PH_Host_Text += "未自觉唾液流量减少";
  			} else {
  				PH_Host_Text += "自觉唾液流量减少，减少时间：" + DATA.consciously_reduce_salivary_flow;
  			}

       		$('#PH_Habit').text(PH_Habit_Text);
       		$('#PH_Health').text(PH_Health_Text);
       		$('#PH_Host').text(PH_Host_Text);
  		}
	});

	// 设置表头用户数据
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));

	// ***************************************************************
	// FUNCTION: 添加额外事件
	$.fn.form.settings.rules.matchOption = function() {
		return ($("form").form('get value', 'times_of_teeth_brush') == $("select[name=time_of_teeth_brush]").dropdown('get selectionCount').toString().split(",")[0]);
	};

	// 设置病历个人史表单相关属性
	$("form").form({
		fields: {
			long_of_teeth_brush: {
				identifier: 'long_of_teeth_brush',
				rules: [
					{
						type   : 'empty',
            			prompt : '请输入刷牙时长'
					}
				]
			},
			time_of_teeth_brush: {
				identifier: 'time_of_teeth_brush',
				rules: [
					{
						type   : 'matchOption',
            			prompt : '刷点时间点次数必须与每天刷牙次数相等'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){
      		var AddtionParameter = "user_id=" + U_ID + "&";
      		
			$.ajax({
  				url      : URL_PERSONAL_HISTORY,
				type     : DATA == null ? "post" : "PUT", 
				async    : false, 
				data     : AddtionParameter + $(this).serialize(),
				dataType : "json",
				error    : function(){
  					alert("网络连接错误...");
  				},
  				success  : function(data){
  					location.reload();
				}
			});

			return false;
		}
	});

	// ***************************************************************
	// FUNCTION: 修改个人史
	$('.edit.button').click(function(){
		$('#display').hide();

		$('select[name=more_sweet]').dropdown("set selected", DATA.more_sweet);
		$('select[name=consumption_of_sweet]').dropdown("set selected", DATA.consumption_of_sweet);
		$('select[name=frequency_of_sweet]').dropdown("set selected", DATA.frequency_of_sweet);
		$('select[name=frequency_of_meal]').dropdown("set selected", DATA.frequency_of_meal);
		$('select[name=is_carbonic_acid]').dropdown("set selected", DATA.is_carbonic_acid);

		$('select[name=is_floss]').dropdown("set selected", DATA.is_floss);
		$('select[name=times_of_teeth_brush]').dropdown("set selected", DATA.times_of_teeth_brush);
		// FIXME: 刷牙时间点time_of_teeth_brush
    $('input[name=long_of_teeth_brush]').val(DATA.long_of_teeth_brush);
		$('select[name=electric_tooth_brush]').dropdown("set selected", DATA.electric_tooth_brush);
		$('select[name=method_of_tooth_brush]').dropdown("set selected", DATA.method_of_tooth_brush);
		$('select[name=is_fluorine]').dropdown("set selected", DATA.is_fluorine);
		$('select[name=is_cavity_examination]').dropdown("set selected", DATA.is_cavity_examination);
		$('select[name=is_periodontal_treatment]').dropdown("set selected", DATA.is_periodontal_treatment);

		$('select[name=sjogren_syndrome]').dropdown("set selected", DATA.sjogren_syndrome);
    $('input[name=salivary_gland_disease]').val(DATA.salivary_gland_disease);
    $('input[name=consciously_reduce_salivary_flow]').val(DATA.consciously_reduce_salivary_flow ? DATA.consciously_reduce_salivary_flow  : "");

		$('#submit').show();
	});
});