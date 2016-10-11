$(document).ready(function(){

  // 其它
  $('.orange.header').text("个人史 - " + decodeURI(requestParameter("name")));
  
  var DATA = null;
	var U_ID = Number(requestParameter("uid"));

	// ***************************************************************
	// FUNCTION: 请求数据
  	$.ajax({
  		url      : URL_PERSONAL_HISTORY,
  		type     : "get",
  		data     : {user_id : U_ID},
  		dataType : "json",
      async    : false,
  		success  : function(data){
  			$('#submit').hide();
  			DATA = data;

        // 表头
        $('#display th').text("个人史 - " + decodeURI(requestParameter("name")));

        // 饮食习惯
        $('#more_sweet').text(DATA.more_sweet);

        var TempText = "";
        switch (Number(DATA.consumption_of_sweet)) {
          case 124: TempText = "<125g"; break;
          case 125: TempText = "125-249g"; break;
          case 250: TempText = "250-500g"; break;
          case 500: TempText = ">500g"; break;
        }
        $('#consumption_of_sweet').text(TempText);

  			switch (Number(DATA.frequency_of_sweet)) {
  				case 1: TempText = "小于1次/天"; break;
  				case 2: TempText = "2次/天"; break;
  				case 3: TempText = "3次/天"; break;
  				case 4: TempText = "4次/天"; break;
  				case 5: TempText = "5次/天"; break;
  				case 6: TempText = "大于5次/天"; break;
  			}
        $('#frequency_of_sweet').text(TempText);

  			switch (Number(DATA.frequency_of_meal)) {
  				case 1: TempText = "≤1"; break;
  				case 2: TempText = "1＜频率≤2"; break;
  				case 3: TempText = "≥3"; break;
  			}
        $('#frequency_of_meal').text(TempText);

        $('#is_carbonic_acid').text(DATA.is_carbonic_acid);
        $('#is_floss').text(DATA.is_floss);

       	// 口腔卫生维护
  			switch (Number(DATA.times_of_teeth_brush)) {
  				case 1: TempText = "1次"; break;
  				case 2: TempText = "2次"; break;
  				case 3: TempText = "3次"; break;
  			}
        $('#times_of_teeth_brush').text(TempText);
        $('#time_of_teeth_brush').text(DATA.time_of_teeth_brush);
        $('#long_of_teeth_brush').text(DATA.long_of_teeth_brush);
  		
        $('#electric_tooth_brush').text(DATA.electric_tooth_brush);
        $('#method_of_tooth_brush').text(DATA.method_of_tooth_brush);
        $('#is_fluorine').text(DATA.is_fluorine);
        $('#is_cavity_examination').text(DATA.is_cavity_examination);
        $('#is_periodontal_treatment').text(DATA.is_periodontal_treatment);
        $('#sjogren_syndrome').text(DATA.sjogren_syndrome);

        // 宿主易感性
        $('#salivary_gland_disease').text(DATA.salivary_gland_disease);
        $('#consciously_reduce_salivary_flow').text(DATA.consciously_reduce_salivary_flow);

        $('#display').show();
  		}
	});

  if (DATA == null) {$('#submit').show();}

  // ***************************************************************
  // FUNCTION: 设置病历个人史表单相关属性
	// 添加额外事件
  $.fn.form.settings.rules.matchOption = function() {
    return ($("form").form('get value', 'times_of_teeth_brush') == $("select[name=time_of_teeth_brush_display]").dropdown('get selectionCount').toString().split(",")[0]);
  };
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
			time_of_teeth_brush_display: {
				identifier: 'time_of_teeth_brush_display',
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
      var AddtionParameter = addParameter("user_id", U_ID) + "&"
               + addParameter("time_of_teeth_brush", $(this).form('get value', 'time_of_teeth_brush_display')).toString() + "&";

      $.ajax({
        url      : URL_PERSONAL_HISTORY,
        type     : DATA == null ? "post" : "PUT", 
        async    : false, 
        data     : AddtionParameter + $(this).serialize(),
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

    if (DATA.time_of_teeth_brush != "") {
      var SplitTime = DATA.time_of_teeth_brush.split(',');
      for (var i=0; i<SplitTime.length; ++i){
        $('select[name=time_of_teeth_brush_display]').dropdown("set selected", SplitTime[i]);
      }
    };
   
    $('input[name=long_of_teeth_brush]').val(DATA.long_of_teeth_brush);
		$('select[name=electric_tooth_brush]').dropdown("set selected", DATA.electric_tooth_brush);
		$('select[name=method_of_tooth_brush]').dropdown("set selected", DATA.method_of_tooth_brush);
		$('select[name=is_fluorine]').dropdown("set selected", DATA.is_fluorine);
		$('select[name=is_cavity_examination]').dropdown("set selected", DATA.is_cavity_examination);
		$('select[name=is_periodontal_treatment]').dropdown("set selected", DATA.is_periodontal_treatment);

		$('select[name=sjogren_syndrome]').dropdown("set selected", DATA.sjogren_syndrome);
    $('input[name=salivary_gland_disease]').val(DATA.salivary_gland_disease);
    $('input[name=consciously_reduce_salivary_flow]').val(DATA.consciously_reduce_salivary_flow ? DATA.consciously_reduce_salivary_flow  : "");

    $('#submit .submit.button').text("确认修改").after('<div class="ui right floated teal button" onclick="location.reload()">取消</div>');
		$('#submit').show();
	});
});