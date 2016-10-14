$(document).ready(function(){
	
	// 其它
	$('.orange.header').text("龋病预后管理 - " + decodeURI(requestParameter("name")));
  	$('#context .menu .item').tab({ context: $('#context') });

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

	var DATA = null,
		U_ID = Number(requestParameter("uid"));
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url      : URL_MANAGE,
  		type     : "get",
  		data     : {user_id : U_ID},
  		dataType : "json",
		async    : false,
  		success  : function(data){
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

	if (DATA == null) {$('#context').show();}

	// ***************************************************************
	// FUNCTION: 提交
	$('#context .segment div.button').click(function(){
	    $.ajax({
      		url      : URL_MANAGE,
      		type     : DATA == null ? "POST" : "PUT", 
      		data     : {user_id : U_ID, patient_type : $(this).parent().attr('data-tab')},
      		dataType : "json",
			error    : function() {networkError();},
			success  : function() {location.reload();}
    	});

	});

	// ***************************************************************
	// FUNCTION: 修改
	$('.edit.button').click(function(){
		$('#display').hide();

		$ContextLink = $('#context .menu a').removeClass('active');
		$TabSegment  = $('#context .tab.segment').removeClass('active');
		ChangeTabActive($ContextLink, $TabSegment, DATA.patient_type - 1);

		$('#context .submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$('#context').show();
	});

	function ChangeTabActive($Context, $TabSegment, Index){
		$Context.eq(Index).addClass('active');
		$TabSegment.eq(Index).addClass('active');
	}

	// ***************************************************************
	// FUNCTION: 返回病人病历概述
	$('.returnMedical.button').click(function(){
		window.location = "MedicalRecordDetail.html" + toquerystring({uid  : U_ID});
	});
});