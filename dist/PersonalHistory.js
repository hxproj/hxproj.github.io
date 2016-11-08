$(document).ready(function(){

  // 其它
  $('.orange.header').text("个人史 - " + decodeURI(requestParameter("name")));
  
  var DATA = null,
      U_ID = Number(requestParameter("uid"));

	// ***************************************************************
	// FUNCTION: 请求数据
  $.ajax({
		url      : URL_PERSONAL_HISTORY,
		type     : "get",
		data     : {user_id : U_ID},
		dataType : "json",
    async    : false,
		success  : function(data){
      DATA = data;
			$('#submit').hide();

      // 表头
      $('#display th').text("个人史 - " + decodeURI(requestParameter("name")));

      // 饮食习惯
      var ID_Eating_Habits = "";
      ID_Eating_Habits += DATA.consumption_of_sweet + "，";
      ID_Eating_Habits += DATA.frequency_of_sweet + "，";
      ID_Eating_Habits += DATA.frequency_of_meal + "，";
      ID_Eating_Habits += DATA.is_carbonic_acid;
      $('#ID_Eating_Habits').text(ID_Eating_Habits);

     	// 口腔卫生维护
      var ID_Oral_Maintenance = "";
      ID_Oral_Maintenance += DATA.is_floss + "，";
      ID_Oral_Maintenance += DATA.times_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.time_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.long_of_teeth_brush + "，";
      ID_Oral_Maintenance += DATA.electric_tooth_brush + "，";
      ID_Oral_Maintenance += DATA.is_fluorine + "，";
      ID_Oral_Maintenance += DATA.is_cavity_examination + "，";
      ID_Oral_Maintenance += DATA.is_periodontal_treatment;
      $('#ID_Oral_Maintenance').text(ID_Oral_Maintenance);

      // 宿主易感性
      var ID_Sensitive = "";
      ID_Sensitive += DATA.salivary_gland_disease + "，";
      ID_Sensitive += DATA.sjogren_syndrome + "，";
      ID_Sensitive += DATA.consciously_reduce_salivary_flow;
      $('#ID_Sensitive').text(ID_Sensitive);
      
      $('#display').show();
		}
	});

  if (DATA == null) {$('#submit').show();}

  // 一些通用描述
  var Des_brushtime    = "刷牙时间点为",
      Des_brush        = "每次刷牙",
      Des_disease      = "患有唾液腺疾病：",
      Des_nodisease    = "无唾液腺疾病",
      Des_reduceflow   = "自觉唾液流量减少",
      Des_noreduceflow = "唾液流量未明显减少";

  // ***************************************************************
  // FUNCTION: 设置病历个人史表单相关属性
	$("form").form({
		fields: {
			long_of_teeth_brush: {
				identifier: 'long_of_teeth_brush_display',
				rules: [
					{
						type   : 'empty',
            prompt : '请输入刷牙时长'
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
			},
		},
		inline    : true,
		onSuccess : function(){
      // 设置相关描述
      var disease       = $(this).form('get value', 'salivary_gland_disease_display'),
          reduceflow    = $(this).form('get value', 'consciously_reduce_salivary_flow_display'),
          additionField = toform({
            user_id : U_ID,
            salivary_gland_disease : disease == "" ? Des_nodisease : Des_disease + disease,
            consciously_reduce_salivary_flow : reduceflow == "" ? Des_noreduceflow : Des_reduceflow + reduceflow,
            time_of_teeth_brush : Des_brushtime + $(this).form('get value', 'time_of_teeth_brush_display'),
            long_of_teeth_brush : Des_brush + $(this).form('get value', 'long_of_teeth_brush_display'),
          });

      $.ajax({
        url      : URL_PERSONAL_HISTORY,
        type     : DATA == null ? "post" : "PUT", 
        data     : additionField + $(this).serialize(),
        dataType : "json",
        error    : function() {networkError();},
        success  : function() {location.reload();}
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
   
		$('select[name=electric_tooth_brush]').dropdown("set selected", DATA.electric_tooth_brush);
		$('select[name=method_of_tooth_brush]').dropdown("set selected", DATA.method_of_tooth_brush);
		$('select[name=is_fluorine]').dropdown("set selected", DATA.is_fluorine);
		$('select[name=is_cavity_examination]').dropdown("set selected", DATA.is_cavity_examination);
		$('select[name=is_periodontal_treatment]').dropdown("set selected", DATA.is_periodontal_treatment);

		$('select[name=sjogren_syndrome]').dropdown("set selected", DATA.sjogren_syndrome);

    // 去除描述语句
    var long_of_teeth_brush    = DATA.long_of_teeth_brush,
        time_of_teeth_brush    = DATA.time_of_teeth_brush;
        salivary_gland_disease = DATA.salivary_gland_disease,
        consciously_reduce_salivary_flow = DATA.consciously_reduce_salivary_flow,

    long_of_teeth_brush = long_of_teeth_brush.substring(Des_brush.length);
    time_of_teeth_brush = time_of_teeth_brush.substring(Des_brushtime.length);
    salivary_gland_disease = salivary_gland_disease == Des_nodisease ? "" : salivary_gland_disease.substring(Des_disease.length);
    consciously_reduce_salivary_flow = consciously_reduce_salivary_flow == Des_noreduceflow ? "" : consciously_reduce_salivary_flow.substring(Des_reduceflow.length);

    var SplitTime = time_of_teeth_brush.split(',');
    for (var i=0; i<SplitTime.length; ++i){
      $('select[name=time_of_teeth_brush_display]').dropdown("set selected", SplitTime[i]);
    }
    $('input[name=long_of_teeth_brush_display]').val(long_of_teeth_brush);
    $('input[name=salivary_gland_disease_display]').val(salivary_gland_disease);
    $('input[name=consciously_reduce_salivary_flow_display]').val(consciously_reduce_salivary_flow);

    $('#submit .submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$('#submit').show();
	});

  // ***************************************************************
  // FUNCTION: 返回病人病历概述
  $('.returnMedical.button').click(function(){
    window.location = "MedicalRecordDetail.html" + toquerystring({uid  : U_ID});
  });
});