$(document).ready(function(){

  $('#context .menu .item').tab({ context: $('#context') });

  var DATA = null; 
  var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	// ***************************************************************
	// FUNCTION: 请求数据
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
        $.get(URL_TOOTH, {tooth_id : DATA.tooth_id}, function(toothdata){

          var DescribeText = "";
          if (!DATA.is_primary) {
            // 设置病种
            $('#illnessType').text("原发性龋病");

            // 设置描述
            DescribeText += toothdata.tooth_location + "在" + toothdata.time_of_occurrence + "前发现" + toothdata.symptom;

            if (DATA.is_very_bad == "否") {
              DescribeText += "，症状未加重";
            } else if (DATA.is_very_bad == "是") {
              DescribeText += "，症状加重";
            }

            if (DATA.is_night_pain_self_pain == "否") {
              DescribeText += "，无自发痛或夜间痛";
            } else if (DATA.is_night_pain_self_pain == "是") {
              DescribeText += "，有自发痛或夜间痛";
            }

            if (DATA.medicine_name == "") {
              DescribeText += "，未服用药物";
            } else {
              DescribeText += "，服用" + DATA.medicine_name;
            }

            if (DATA.is_treatment == "否") {
              DescribeText += "，未做过治疗";
            } else if (DATA.is_treatment == "是") {
              DescribeText += "，做过治疗";
            }

            if (DATA.is_relief == "否") {
              DescribeText += "，症状未缓解";
            } else if (DATA.is_relief == "是") {
              DescribeText += "，症状缓解";
            }
          } else {
            $('#illnessType').text("有治疗史龋病");

            DescribeText += toothdata.tooth_location + "曾进行修复治疗";

            if (DATA.fill_type != "") {
              DescribeText += "，充填体（" + DATA.fill_type + "）";
            }

            if (DATA.medicine_name == "") {
              DescribeText += "，未服用药物";
            } else {
              DescribeText += "，服用" + DATA.medicine_name;
            }
            
            if (DATA.is_treatment == "否") {
              DescribeText += "，未做过治疗";
            } else if (DATA.is_treatment == "是") {
              DescribeText += "，做过治疗";
            }
            
            if (DATA.is_relief == "否") {
              DescribeText += "，症状未缓解";
            } else if (DATA.is_relief == "是") {
              DescribeText += "，症状缓解";
            }
          }

          $('#describe').text(DescribeText);
        }, "json");

        $('#display').show();
  		}
	});

  if (DATA == null) {$('#context').show();};

	// ***************************************************************
	// FUNCTION: AJAX提交现病史
	$('.ui.tab .submit.button').click(function(){

      var AddtionParameter = addParameter("user_id", U_ID) + "&" + addParameter("tooth_id", T_ID) + "&";

    	$.ajax({
    		url      : URL_PRESENTILLNESS,
    		type     : DATA == null ? "POST" : "PUT", 
    		data     : AddtionParameter + $(this).parent().serialize(),
    		dataType : "json",
        error    : function() {networkError();},
        success  : function() {location.reload();}
  	  });
	});

  // ***************************************************************
  // FUNCTION: 修改现病史
  $('.edit.button').click(function(){
      $('#display').hide();

      var TabIndex = DATA.is_primary ? 2 : 1;

      // Change Tab
      $('#context .menu .active').removeClass("active");
      $('#context .segment.active').removeClass("active");
      $('#context .menu a[data-tab=' + TabIndex + ']').addClass("active");
      $('#context .segment[data-tab=' + TabIndex + ']').addClass("active");

      if (TabIndex == 1) {
        $('select[name=is_very_bad]').dropdown("set selected", DATA.is_very_bad);
        $('select[name=is_night_pain_self_pain]').dropdown("set selected", DATA.is_night_pain_self_pain);
        $('select[name=is_treatment]').dropdown("set selected", DATA.is_treatment);
        $('select[name=is_relief]').dropdown("set selected", DATA.is_relief);
        $('input[name=medicine_name]').val(DATA.medicine_name);
      } else if (TabIndex == 2) {
        $('select[name=fill_type]').dropdown("set selected", DATA.fill_type);
        $('select[name=is_relief]').dropdown("set selected", DATA.is_relief);
        $('input[name=medicine_name]').val(DATA.medicine_name);
      }

      $('#context .submit.button').text("确认修改").after('<div class="ui right floated teal button" onclick="location.reload()">取消</div>');
      $('#context').show();
  });

	// ***************************************************************
	// FUNCTION: 下一项-口腔检查
  $('.right.labeled.button').click(function(){
    redirection("MouthExamination.html", U_ID, T_ID, requestParameter("name"));
  });

  // ***************************************************************
  // FUNCTION: 导航栏
  $('#nav a').not('.active, .return').click(function(){
    $(this).prop('href', $(this).prop('href') + "?" + toquerystring({
      uid  : U_ID,
      tid  : T_ID,
      name : requestParameter("name")
    }));
  });
});