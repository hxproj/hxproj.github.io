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
        if($('#context').css("display") == "block"){ $('#context').css("display") == "none"; }
        if(!$('#display').css("display") == "none"){ $('#context').css("display") == "block"; }

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

$(document).ready(function(){
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));
  	$('#context .menu .item').tab({ context: $('#context') });
	
	var U_ID = Number(requestParameter("uid"));
	
	var Level1 = "1. 复诊检查周期：每6-12个月<br/><br/>"
			   + "2. 影像学检查频率：每24-36个月<br/><br/>"
			   + "3. 氯己定：不需要或仅唾液检测细菌培养计数高者使用<br/><br/>"
			   + "4. 木糖醇：仅唾液检测细菌培养计数高者使用<br/><br/>"
			   + "5. 氟制剂：普通非处方含氟牙膏（每天两次，早饭后及睡觉前），当存在牙根暴露或者敏感时可进行涂氟治疗<br/><br/>"
			   + "6. 再矿化制剂：不需要，当存在牙根暴露或者敏感时可使用<br/><br/>"
			   + "7. 窝沟封闭：可选择<br/><br/>";

	var Level2 = "1. 复诊检查周期：每4-6个月<br/><br/>"
			   + "2. 影像学检查频率：每18-24个月<br/><br/>"
			   + "3. 氯己定：仅唾液检测细菌培养计数高者使用<br/><br/>"
			   + "4. 木糖醇：推荐使用（一次两片，每天4次）<br/><br/>"
			   + "5. 氟制剂：普通非处方含氟牙膏（每天两次，早饭后及睡觉前）、可补充0.05%NaF漱口水每天漱口、可补充涂氟治疗<br/><br/>"
			   + "6. 再矿化制剂：不需要，当存在牙根暴露或者敏感时可使用<br/><br/>"
			   + "7. 窝沟封闭<br/><br/>";

	var Level3 = "1. 复诊检查周期：每3-4个月（同时补充涂氟）<br/><br/>"
			   + "2. 影像学检查频率：每6-18个月或直到无成洞性龋损<br/><br/>"
			   + "3. 氯己定：每个月连续1周每天使用10ml 0.12%葡萄糖酸氯己定漱口1分钟，直到下一次复诊再评估<br/><br/>"
			   + "4. 木糖醇：推荐使用（一次两片，每天4次）<br/><br/>"
			   + "5. 氟制剂：高含氟(1.1%NaF)牙膏（每天两次，早饭后及睡觉前）； 可补充0.2%NaF含氟漱口水每天漱口，使用1瓶之后换成0.05% NaF漱口水每天漱口2次；补充涂氟治疗<br/><br/>"
			   + "6. 再矿化制剂：可选择<br/><br/>"
			   + "7. 窝沟封闭<br/><br/>";

	var Level4 = "1. 复诊检查周期：每3个月（同时补充涂氟）<br/><br/>"
			   + "2. 影像学检查频率：每6个月或直到无成洞性龋损<br/><br/>"
			   + "3. 氯己定：每个月连续1周每天使用10ml0.12%葡萄糖酸氯己定漱口1分钟。直到下一次复诊再评估<br/><br/>"
			   + "4. 木糖醇：推荐使用（一次两片，每天4次）<br/><br/>"
			   + "5. 氟制剂：高含氟(1.1%NaF)牙膏（每天两次，早饭后及睡觉前）； 0.05% NaF漱口水漱口（当感觉口干时，饭后及吃零食后）；补充涂氟治疗<br/><br/>"
			   + "6. 再矿化制剂：要求每天使用磷酸钙2次<br/><br/>"
			   + "7. 窝沟封闭<br/><br/>";
			   + "6. 当感觉口干时，饭后及吃零食后使用小苏打水漱口<br/><br/>";

	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url     : URL_MANAGE,
  		type    : "get",
  		data    : addParameter("user_id", U_ID),
  		dataType: "json",
  		error   : function(){
  		},
  		success : function(data){
  			$('#context').hide();

  			DATA = data;
  			switch (DATA.patient_type) {
  				case 1: {
		  			$('#Level').text("低风险患者");
		  			$('#Describe').html(Level1);
  					break;
  				}
  				case 2: {
		  			$('#Level').text("中风险患者");
		  			$('#Describe').html(Level2);
  					break;
  				}
  				case 3: {
		  			$('#Level').text("高风险患者");
		  			$('#Describe').html(Level3);
  					break;
  				}
  				case 4: {
		  			$('#Level').text("极高风险患者");
		  			$('#Describe').html(Level4);
  					break;
  				}
  			}

  			$('#display').show();
  		}
	});

	if (DATA == null) {$('#context').show();};

	// ***************************************************************
	// FUNCTION: 提交
	$('#context .segment button').click(function(){
		var SelectItemValue = $(this).parent().attr('data-tab');
		var AddtionParameter = addParameter("user_id", U_ID)+ "&" + addParameter("patient_type", SelectItemValue);

	    $.ajax({
      		url      : URL_MANAGE,
      		type     : DATA == null ? "POST" : "PUT", 
      		data     : AddtionParameter,
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
	// FUNCTION: 修改
	$('.edit.button').click(function(){
		$('#display').hide();

		$ContextLink = $('#context .menu a').removeClass('active');
		$TabSegment  = $('#context .tab.segment').removeClass('active');
		ChangeTabActive($ContextLink, $TabSegment, DATA.patient_type - 1);

		$('#context').show();
	});

	function ChangeTabActive($Context, $TabSegment, Index){
		$Context.eq(Index).addClass('active');
		$TabSegment.eq(Index).addClass('active');
	}
});