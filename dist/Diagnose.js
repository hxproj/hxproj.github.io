$(document).ready(function(){
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));
	
	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url     : URL_DIAGNOSE,
  		type    : "get",
  		data    : addParameter("tooth_id", T_ID),
  		dataType: "json",
  		error   : function(){
  		},
  		success : function(data){
  			$('#DiagnoseForm').hide();

  			DATA = data;
  			$('#Degree').text(DATA.caries_degree);
  			$('#Type').text(DATA.caries_type);

  			$('#display').show();
  		}
	});

	if (DATA == null) {$('#DiagnoseForm').show();};

	// ***************************************************************
	// FUNCTION: 提交
	$('#DiagnoseForm').form({
		onSuccess: function(){
			var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";

			$.ajax({
				url      : URL_DIAGNOSE,
				type     : DATA == null ? "post" : "PUT", 
				data     : AddtionParameter + $(this).serialize(),
				dataType : "json",
				error    : function(){	
					alert("网络连接错误...");
				},
				success: function(data){
					location.reload();
				}
			});

			return false;
		}
	});

	// ***************************************************************
	// FUNCTION: 修改
	$('.edit.button').click(function(){
		$('#display').hide();

        $('select[name=caries_degree]').dropdown("set selected", DATA.caries_degree);
        $('select[name=caries_type]').dropdown("set selected", DATA.caries_type);

		$('#DiagnoseForm').show();
	});

	// ***************************************************************
	// FUNCTION: 下一项
	$('.right.labeled.button').click(function(){
		var href = "DifficultyAssessment.html";
		href += "?" + addParameter("uid", U_ID) + "&" + addParameter("tid", T_ID) + "&"
			+ addParameter("name", requestParameter("name"));

		window.location.href = href;
	});
	// ***************************************************************
	// FUNCTION: 上一项
	$('.left.labeled.button').click(function(){
		var href = "MouthExamination.html";
		href += "?" + addParameter("uid", U_ID) + "&" + addParameter("tid", T_ID) + "&"
			+ addParameter("name", requestParameter("name"));

		window.location.href = href;
	});
});