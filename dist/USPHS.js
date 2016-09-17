$(document).ready(function(){
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));

	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url     : URL_USPHS,
  		type    : "get",
  		data    : addParameter("tooth_id", T_ID),
  		dataType: "json",
  		error   : function(){
  		},
  		success : function(data){
  			$('form').hide();

  			DATA = data;
  			$('#color').text(DATA.color);
  			$('#marginal_accuracy').text(DATA.marginal_accuracy);
  			$('#anatomic_form').text(DATA.anatomic_form);
        $('#surfaceness').text(DATA.surfaceness);
  			$('#edge_color').text(DATA.edge_color);
  			$('#occlusal_contact').text(DATA.occlusal_contact);
  			$('#sensitivity_of_tooth').text(DATA.sensitivity_of_tooth);
  			$('#secondary_caries').text(DATA.secondary_caries);
  			$('#integrity').text(DATA.integrity);

  			$('#display').show();
  		}
	});

	if (DATA == null) {$('form').show();};

	// ***************************************************************
	// FUNCTION: 提交
	$('form').form({
		onSuccess: function(){
			var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";

			$.ajax({
				url      : URL_USPHS,
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

    $('input[value=' + DATA.color + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.marginal_accuracy + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.anatomic_form + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.surfaceness + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.edge_color + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.occlusal_contact + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.sensitivity_of_tooth + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.secondary_caries + ']').parent().checkbox('check'); 
    $('input[value=' + DATA.integrity + ']').parent().checkbox('check'); 

		$('form').show();
	});

	// ***************************************************************
	// FUNCTION: 上一项
	$('.right.labeled.button').click(function(){
		var href = "Cure.html";
		href += "?" + addParameter("uid", U_ID) + "&" + addParameter("tid", T_ID) + "&"
			+ addParameter("name", requestParameter("name"));

		window.location.href = href;
	});
});