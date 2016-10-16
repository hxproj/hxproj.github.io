$(document).ready(function(){

	var DATA       = null,
		U_ID       = Number(requestParameter("uid")),
		T_ID       = Number(requestParameter("tid"))
		Image_type = 1;

	// ***************************************************************
	// FUNCTION: 请求牙位信息
	$.get(URL_TOOTH, {tooth_id : T_ID}, function(toothdata){
		var ToothDescription = "";
		if (!toothdata.is_fill_tooth) {
      		ToothDescription += toothdata.tooth_location + toothdata.time_of_occurrence + "前" + toothdata.symptom;
		} else {
			ToothDescription += toothdata.tooth_location + "要求补牙";
		}

		$('.locationdescription').text(ToothDescription);
	}, "json");

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

  			$('#display th').text("诊断 - " + decodeURI(requestParameter("name")));

  			// 设置诊断描述
	        $.get(URL_TOOTH, {tooth_id : DATA.tooth_id}, function(toothdata){

	        	$('#id_tooth_location').text(toothdata.tooth_location);
	        	$('#caries_degree').text(DATA.caries_degree);
	        	$('#caries_type').text(DATA.caries_type);

	        }, "json");

		    // 显示诊断图片
			$.ajax({
				url      : URL_IMAGEUPLOAD,
				type     : "GET",
				data     : {tooth_id : T_ID, type : Image_type},
				dataType : "json",
				success  : function(FileData) {

					$.each(FileData, function(){
						var $ClonedImage = $('#IMAGE .hidden.image').clone(true).removeClass('hidden');
						$ClonedImage.attr("value", this.img_id);

						var ImagePath = this.path;
						ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
						$ClonedImage.find('img').attr('src', ImagePath);
						
						$ClonedImage.find('.corner').bind('click', function(){
							var $Image = $(this).parent();
	                
							$('#deletemodal').modal({
								onApprove: function() {
									$.ajax({
										url      : URL_IMAGEUPLOAD + toquerystring({picture_id : $Image.attr("value")}),
										type     : "DELETE",
										data     : {},
										dataType : "text",
										error    : function(data) {
											alert("删除文件失败，请检查网络设置。");
										},
										success  : function() {
											$Image.remove();
										}
									});
								}
							}).modal('show');
              			});

						$('#IMAGE').append($ClonedImage).append('<div class="ui hidden divider"></div>');
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
		fields: {
			caries_degree: {
				identifier: 'caries_degree',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择龋损程度'
					}
				]
			},
			caries_type: {
				identifier: 'caries_type',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择龋齿病种'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){
			$.ajax({
				url      : URL_DIAGNOSE,
				type     : DATA == null ? "post" : "PUT", 
				data     : toform({user_id : U_ID, tooth_id : T_ID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function(data){
					// 上传图片
					$.ajaxFile({
						url           : URL_IMAGEUPLOAD, 
						type          : 'POST',  
						fileElementId : 'imageupload',
						dataType      : 'text',
						data          : {tooth_id : data.tooth_id, picture_type : Image_type},
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
        
		$('#DiagnoseForm .submit.button').text("确认修改").after('<div class="ui right floated teal button" onclick="location.reload()">取消</div>');
		$('#DiagnoseForm').show();
	});

	// ***************************************************************
	// FUNCTION: 下一项，难度评估
	$('.right.labeled.button').click(function(){
   		redirection("DifficultyAssessment.html", U_ID, T_ID, requestParameter("name"));
	});
	// ***************************************************************
	// FUNCTION: 上一项，口腔检查
	$('.left.labeled.button').click(function(){
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