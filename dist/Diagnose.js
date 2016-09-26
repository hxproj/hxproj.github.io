$(document).ready(function(){
	$('.orange.header').text($('.orange.header').text() + " - " + decodeURI(requestParameter("name")));
	
	var U_ID = Number(requestParameter("uid"));
	var T_ID = Number(requestParameter("tid"));
	
	var DATA = null;
	// ***************************************************************
	// FUNCTION: 请求数据
	$.ajax({
  		url      : URL_DIAGNOSE,
  		type     : "get",
  		data     : {tooth_id : T_ID},
  		dataType : "json",
      	async    : false,
  		success  : function(data){
  			$('#DiagnoseForm').hide();

  			DATA = data;
  			$('#Degree').text(DATA.caries_degree);
  			$('#Type').text(DATA.caries_type);

		    // 显示口腔检查图片
			$.ajax({
				url      : URL_IMAGEUPLOAD,
				type     : "GET",
				data     : {tooth_id : T_ID},
				dataType : "json",
				success  : function(FileData) {
					$.each(FileData, function(Index, Value){
						$('#Image').append("<img class='ui image'>");
						$('#Image .ui.image').eq(Index).attr('src', this);
					});
				}
			});

  			$('#display').show();
  		}
	});

	if (DATA == null) {$('#DiagnoseForm').show();};

	// ***************************************************************
	// FUNCTION: 提交
	$('#DiagnoseForm form').form({
		onSuccess: function(){
			var AddtionParameter = "user_id=" + U_ID + "&" + "tooth_id=" + T_ID + "&";
			$.ajax({
				url      : URL_DIAGNOSE,
				type     : DATA == null ? "post" : "PUT", 
				data     : AddtionParameter + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function(data){
	              // 上传图片
	              $.ajaxFile({
	                url           : URL_IMAGEUPLOAD, 
	                type          : 'POST',  
	                fileElementId : 'imageupload',
	                dataType      : 'text',
	                data          : {tooth_id : data.tooth_id},
	                async         : false,  
	                cache         : false,  
	                contentType   : false,  
	                processData   : false,
	                success       : function() {
	                  location.reload()
	                },
	                error         : function() {
	                  alert("文件上传失败");
	                }
	              });
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
	// FUNCTION: 下一项，难度评估
	$('.right.labeled.button').click(function(){
		var href = "DifficultyAssessment.html";
		href += "?" + addParameter("uid", U_ID) + "&" + addParameter("tid", T_ID) + "&"
			+ addParameter("name", requestParameter("name"));

		window.location.href = href;
	});
	// ***************************************************************
	// FUNCTION: 上一项，口腔检查
	$('.left.labeled.button').click(function(){
		var href = "MouthExamination.html";
		href += "?" + addParameter("uid", U_ID) + "&" + addParameter("tid", T_ID) + "&"
			+ addParameter("name", requestParameter("name"));

		window.location.href = href;
	});
});