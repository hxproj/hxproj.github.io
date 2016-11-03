$(document).ready(function(){

	$('.orange.header').text("USPHS评估 - " + decodeURI(requestParameter("name")));
	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url      : URL_USPHS,
  		type     : "get",
  		data     : {tooth_id : T_ID},
  		dataType : "json",
      	async    : false,
  		success  : function(data){
  			$('form').hide();
  			DATA = data;

        	// 表头
        $('#display th').text("USPHS评估 - " + decodeURI(requestParameter("name")));
  			$('#color').text(DATA.color);
  			$('#marginal_accuracy').text(DATA.marginal_accuracy);
  			$('#anatomic_form').text(DATA.anatomic_form);
        $('#surfaceness').text(DATA.surfaceness);
  			$('#edge_color').text(DATA.edge_color);
  			$('#occlusal_contact').text(DATA.occlusal_contact);
  			$('#sensitivity_of_tooth').text(DATA.sensitivity_of_tooth);
  			$('#secondary_caries').text(DATA.secondary_caries);
        $('#integrity').text(DATA.integrity);
  			$('#usphs_level').text(DATA.level);

  			$('#display').show();
  		}
	});

	if (DATA == null) {$('form').show();};

	// ***************************************************************
	// FUNCTION: 提交
	$('form').form({
		onSuccess: function(){
			$.ajax({
				url      : URL_USPHS,
				type     : DATA == null ? "post" : "PUT", 
				data     : toform({user_id : U_ID, tooth_id : T_ID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function() {location.reload();}
			});

			return false;
		}
	});

  // ***************************************************************
  // FUNCTION: 修改
	$('.edit.button').click(function(){
		$('#display').hide();

    	$('input[value=' + DATA.color + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.marginal_accuracy + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.anatomic_form + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.surfaceness + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.occlusal_contact + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.sensitivity_of_tooth + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.secondary_caries + ']').parent().checkbox('check'); 
    	$('input[value=' + DATA.integrity + ']').parent().checkbox('check'); 

      // jquery选择器中包括"%"会报错
      var InputIndex = "小于50%的窝洞边缘着色" == DATA.edge_color ? 1 : "大于50%的窝洞边缘着色" == DATA.edge_color ? 2 : 0;
      $('input[name=edge_color]').eq(InputIndex).parent().checkbox('check'); 
    	
   		$('form .submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$('form').show();
	});

	// ***************************************************************
	// FUNCTION: 上一项，处置
	$('.left.labeled.button').click(function(){
    	redirection("Cure.html", U_ID, T_ID, requestParameter("name"));
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