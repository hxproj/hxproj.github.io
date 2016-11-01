$(document).ready(function(){

	$('#context .menu .item').tab({ context: $('#context') });

  var DATA = null,
      U_ID = Number(requestParameter("uid")),
      T_ID = Number(requestParameter("tid"));

  // ***************************************************************
  // FUNCTION: 请求牙位信息
  $.get(URL_TOOTH, {tooth_id : T_ID}, function(toothdata){
    var ToothDescription = toothdata.is_fill_tooth ? "要求补牙" : toothdata.symptom + toothdata.time_of_occurrence;
    $('.locationdescription').text(toothdata.tooth_location + ToothDescription);
  }, "json");

	// ***************************************************************
	// FUNCTION: 请求现病史数据
  $.ajax({
  		url      : URL_PRESENTILLNESS,
  		type     : "GET",
  		data     : {tooth_id : T_ID},
      dataType : "json",
      async    : false,
  		success  : function(data){
        $('#context').hide();
  			DATA = data;

        // 表头
        $('#display th').text("现病史 - " + decodeURI(requestParameter("name")));

        // 设置描述（需提前获取牙位信息）
        $.get(URL_TOOTH, {tooth_id : DATA.tooth_id}, function(ToothData){

          var DescribeText = ToothData.tooth_location;
              DescribeText += ToothData.is_fill_tooth ? "要求补牙" : ToothData.time_of_occurrence + "前发现" + ToothData.symptom + "，";
         
          if (!DATA.is_primary) {
            // 设置病种
            $('#illnessType').text("原发性龋病");

            DescribeText += DATA.is_very_bad + "，";
            DescribeText += DATA.is_night_pain_self_pain + "，";
            DescribeText += DATA.is_hypnalgia + "，";
            DescribeText += DATA.is_sensitive_cold_heat + "，";
            DescribeText += DATA.is_cold_hot_stimulationpain + "，";
            DescribeText += DATA.is_delayed_pain + "，";
            DescribeText += DATA.medicine_name + "，";
            DescribeText += DATA.is_relief;

          } else {
            $('#illnessType').text("有治疗史龋病");

            DescribeText += "在" + DATA.cure_time + "前曾进行充填修复治疗，";
            DescribeText += "为" + DATA.fill_type + "，";
            DescribeText += "今充填体" + DATA.fill_state + "，";
            DescribeText += DATA.is_night_pain_self_pain + "，";
            DescribeText += DATA.is_hypnalgia + "，";
            DescribeText += DATA.is_sensitive_cold_heat + "，";
            DescribeText += DATA.is_cold_hot_stimulationpain + "，";
            DescribeText += DATA.is_delayed_pain + "，";
            DescribeText += DATA.medicine_name + "，";
            DescribeText += DATA.is_relief;

          }

          $('#describe').text(DescribeText);
        }, "json");

        $('#display').show();
  		}
	});

  if (DATA == null) {$('#context').show();};

  // 一些通用描述
  var Des_medicine   = "曾服用",
      Des_nomedicine = "未服用药物";

  // ***************************************************************
  // FUNCTION: 提交原发性龋病
  $(".tab.segment[data-tab=1] form").form({
    fields : {
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
    inline   : true,
    onSuccess: function() { 
      
      ajaxSubmit($(this));
      return false;
    }
  });

  // ***************************************************************
  // FUNCTION: 提交有治疗史龋病
  $(".tab.segment[data-tab=2] form").form({
    fields : {
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
            prompt : '请选择充填体类型'
          }
        ]
      },
      fill_state: {
        identifier: 'fill_state',
        rules: [
          {
            type   : 'empty',
            prompt : '请选择充填体状况'
          }
        ]
      },
      is_relief: {
        identifier: 'is_relief',
        rules: [
          {
            type   : 'empty',
            prompt : '请选择症状是否缓解'
          }
        ]
      }
    },
    inline   : true,
    onSuccess: function() { 

      ajaxSubmit($(this));
      return false;
    }
  });

  // ***************************************************************
  // FUNCTION: AJAX提交现病史
  function ajaxSubmit($Form){

    var medicine_name = $Form.form('get value', 'medicine_name_display'),
        FormData = toform({
          user_id  : U_ID,
          tooth_id : T_ID,
          medicine_name : medicine_name == "" ? Des_nomedicine : Des_medicine + medicine_name
        }) + $Form.serialize();

    $.ajax({
      url      : URL_PRESENTILLNESS,
      type     : DATA == null ? "POST" : "PUT", 
      data     : FormData,
      dataType : "json",
      error    : function() {networkError();},
      success  : function() {location.reload();}
    });
  }

  // ***************************************************************
  // FUNCTION: 修改现病史
  $('.edit.button').click(function(){
      $('#display').hide();

      // Change Tab
      var TabIndex = DATA.is_primary ? 2 : 1;
      $('#context .menu .active').removeClass("active");
      $('#context .segment.active').removeClass("active");
      $('#context .menu a[data-tab=' + TabIndex + ']').addClass("active");
      $('#context .segment[data-tab=' + TabIndex + ']').addClass("active");

      if (TabIndex == 1) {
        $('select[name=is_very_bad]').dropdown("set selected", DATA.is_very_bad);
       
      } else if (TabIndex == 2) {
        $('select[name=fill_type]').dropdown("set selected", DATA.fill_type);
        $('select[name=fill_state]').dropdown("set selected", DATA.fill_state);
        $('input[name=cure_time]').val(DATA.cure_time);
      }

      $('select[name=is_night_pain_self_pain]').dropdown("set selected", DATA.is_night_pain_self_pain);
      $('select[name=is_hypnalgia]').dropdown("set selected", DATA.is_hypnalgia);
      $('select[name=is_sensitive_cold_heat]').dropdown("set selected", DATA.is_sensitive_cold_heat);
      $('select[name=is_cold_hot_stimulationpain]').dropdown("set selected", DATA.is_cold_hot_stimulationpain);
      $('select[name=is_delayed_pain]').dropdown("set selected", DATA.is_delayed_pain);
      $('select[name=is_relief]').dropdown("set selected", DATA.is_relief);

      var medicine_name = DATA.medicine_name;
      $('input[name=medicine_name_display]').val(medicine_name == Des_nomedicine ? "" : medicine_name.substring(Des_medicine.length));

      $('#context .submit.button').text("确认修改").after('<div class="ui right floated teal button" onclick="location.reload()">取消</div>');
      $('#context').show();
  });

  // ******************************************************
  // 添加牙位
  $('#ID_CureTime').click(function(){
    $('#ID_SetCureTime').modal('show');
  });

  $('#ID_SetCureTime a.label').click(function(){
    $('#ID_CureTime input').val($(this).text() + $(this).prevAll('div.label').text());
    $('#ID_SetCureTime').modal('hide');
  });

	// ***************************************************************
	// FUNCTION: 下一项-口腔检查
  $('.right.labeled.button').click(function(){
    redirection("MouthExamination.html", U_ID, T_ID, requestParameter("name"));
  });

  // ***************************************************************
  // FUNCTION: 导航栏
  $('#nav a').not('.active, .return').click(function(){
    $(this).prop('href', $(this).prop('href') + toquerystring({
      uid  : U_ID,
      tid  : T_ID,
      name : requestParameter("name")
    }));
  });

  // ***************************************************************
  // FUNCTION: 导航栏，返回病历
  $('#nav a.return').click(function(){
    $(this).prop('href', "MedicalRecordDetail.html" + toquerystring({uid  : U_ID}));
  });
});