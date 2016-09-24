$(document).ready(function(){
  // ***************************************************************
    // FUNCTION: 其它
    $('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));
    $('#context .menu .item').tab({ context: $('#context') });

	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));

	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
  $.ajax({
  		url      : URL_PRESENTILLNESS,
  		type     : "GET",
  		data     : addParameter("tooth_id", T_ID),
  		dataType : "json",
  		success  : function(data){
        $('#context').hide();
        $('#display').show();

  			DATA = data;

  			if (DATA.is_primary) {
  				$('#illnessType').text("有治疗史龋病");
  			} else {
  				$('#illnessType').text("原发性龋病");
  			}

  			var DescribeText = "";
  			
        if (DATA.is_very_bad == "否") {
          DescribeText += "症状未加重，";
        } else if (DATA.is_very_bad == "是") {
          DescribeText += "症状加重，";
        }
        
        if (DATA.is_night_pain_self_pain == "否") {
          DescribeText += "无自发痛或夜间痛，";
        } else if (DATA.is_night_pain_self_pain == "是") {
          DescribeText += "有自发痛或夜间痛，";
        }
        
        if (DATA.is_relief == "否") {
          DescribeText += "症状未缓解，";
        } else if (DATA.is_relief == "是") {
          DescribeText += "症状缓解，";
        }

        if (DATA.medicine_name == "") {
          DescribeText += "未服用药物，";
        } else {
          DescribeText += "服用" + DATA.medicine_name + "，";
        }
        
        if (DATA.is_treatment == "否") {
          DescribeText += "未做过治疗";
        } else if (DATA.is_treatment == "是") {
          DescribeText += "做过治疗";
        }

        if (DATA.fill_type != "") {
          DescribeText += "充填体类型：" + DATA.fill_type;
        }

        $('#describe').text(DescribeText);
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
    		error    : function(){
        	alert("网络连接错误...");
    		},
    		success  : function(data){
          location.reload();
    		}
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

      $('#context').show();
  });

	// ***************************************************************
	// FUNCTION: 下一项
  $('.right.labeled.button').click(function(){
    var href = "MouthExamination.html";
    href += "?" + addParameter("uid", U_ID) + "&" + addParameter("tid", T_ID) + "&"
        + addParameter("name", requestParameter("name"));

    window.location.href = href;
  });
});