$(document).ready(function(){

	// **************************************************
	// INIT
	// INIT PARAMENTERS
	// TODO: Request Parameters From URL
	var UID = 6,
		TID = 1,
		CID = 1,
		Image_type = 1,
		IsEditMode = false;
	// INIT SELECTOR
	var $InfoSegement = $('table'),
		$FormSegement = $('form');


	// **************************************************
	// GET
	/*
	$.ajax({
		url      : URL_DIAGNOSE,
		type     : "GET", 
		data     : toform({case_id : CID}),
		dataType : "json",
		error    : function() {
			// TODO: check the return data 
			$FormSegement.show();
		},
		success  : function(vData) {
			$InfoSegement.show();

			IsEditMode = true;
			showData(vData);
			setDefultFormData(vData);
		}
	});
	*/


	// **************************************************
	// POST
	$('form').form({
		fields: {
			tooth_location: {
				identifier: 'tooth_location',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择病人牙位'
					}
				]
			},
			caries_tired_display: {
				identifier: 'caries_tired_display',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择龋坏累及牙面'
					}
				]
			},
			depth: {
				identifier: 'depth',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择深度'
					}
				]
			},
			flex_of_caries: {
				identifier: 'flex_of_caries',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			cold: {
				identifier: 'cold',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			hot: {
				identifier: 'hot',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			touch: {
				identifier: 'touch',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			bite: {
				identifier: 'bite',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			X_Ray_depth: {
				identifier: 'X_Ray_depth',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			X_Ray_fill_quality: {
				identifier: 'X_Ray_fill_quality',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
			bop: {
				identifier: 'bop',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择该项选项'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){

			switch ($(this).form('get value', 'cure_plan')) {
				case "牙非手术治疗": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification1'));
					break;
				}
				case "龋病微创修复": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification2'));
					break;
				}
				case "复合树脂修复": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification3'));
					break;
				}
				case "美容修复": {
					$(this).form('set value', 'specification', $(this).form('get value', 'specification4'));
					break;
				}
			}

			$.ajax({
				url      : URL_DIAGNOSE,
				type     : IsEditMode ? "PUT" : "POST", 
				data     : toform({user_id : UID, case_id : CID, tooth_id : TID}) + $(this).serialize(),
				dataType : "json",
				error    : function() {networkError();},
				success  : function(data){
					
					/*
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
					*/

					location.reload();
				}
			});

			return false;
		}
	});


	// **************************************************
	// Other Envent
	$('.edit.button').click(function(){
		$InfoSegement.hide();
   		$FormSegement.find('.submit.button').text("确认修改").after('<div class="ui right floated teal small button" onclick="location.reload()">取消</div>');
		$FormSegement.show();
	});


	// **************************************************
	// 具体治疗计划选择
	$('select[name=cure_plan]').parent().dropdown({
		onChange: function(CurePlan) { 
			$('.select.field').addClass("invisible");
			$("div[field=" + CurePlan + "]").removeClass("invisible");
		}
	});

	// **************************************************
	// Function
	function showData(vData) {
		// 获取牙位信息
		var MouthData = null;
		$.ajax({
  			url      : URL_MOUTHEXAM,
  			type     : "get",
  			data     : {tooth_id : vData.tooth_id},
  			dataType : "json",
			async    : false,
  			success  : function(data) { MouthData = data; }
		})

		var ToothLocation = "<bold>注：还未设置病人“牙位”和“累及牙面”，请到“口腔检查”功能项中完善相关信息</bold>",
			Description   = "";
	
		if (MouthData != null) {
    	ToothLocation = MouthData.tooth_location + "牙";
			Description   = ToothLocation;

        $.each(MouthData.caries_tired.split(","), function(){
          Description += this;
        });
        Description += "面" + vData.caries_degree;

			if (vData.caries_type != "无") {
        	Description += "<br/><br/>" + ToothLocation + vData.caries_type;
   		}	
		} else {
			Description += vData.caries_degree;

			if (vData.caries_type != "无") {
        	Description += "<br/><br/>" + vData.caries_type;
   		}	
			Description += "<br/><br/>" + ToothLocation;
		}
		$('#ID_Description').html(Description);

	    // 显示诊断图片
		$.ajax({
			url      : URL_IMAGEUPLOAD,
			type     : "GET",
			data     : {case_id : CID, type : Image_type},
			dataType : "json",
			success  : function(FileData) {

				if (FileData.length == 0) {
					$('#IMAGE').text("未添加任何图片，请点击右下角修改按钮添加");
				} else {
					$.each(FileData, function(){
						var $ClonedImage = $('#IMAGE .hidden.image').clone().removeClass('hidden');
						$ClonedImage.attr("value", this.img_id);

						var ImagePath = this.path;
						ImagePath = ImagePath.substring(ImagePath.lastIndexOf("Medical_Case\\"), ImagePath.length);
						window.loadImage(ImagePath, function(){
							$ClonedImage.find('img').attr('src', ImagePath);
							$ClonedImage.find('.corner').removeClass('hidden');
						});
						
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
			}
		});
	}

	function setDefultFormData(vData) {
        $('select[name=caries_degree]').dropdown("set selected", vData.caries_degree);
        $('select[name=caries_type]').dropdown("set selected", vData.caries_type);
        $('select[name=cure_plan]').dropdown("set selected", vData.cure_plan);

		$("div[field=" + vData.cure_plan + "]").removeClass("invisible");
		switch (vData.cure_plan) {
			case "牙非手术治疗": {
				$('select[name=specification1]').dropdown("set selected", vData.specification);
				break;
			}
			case "龋病微创修复": {
				$('select[name=specification2]').dropdown("set selected", vData.specification);
				break;
			}
			case "复合树脂修复": {
				$('select[name=specification3]').dropdown("set selected", vData.specification);
				break;
			}
			case "美容修复": {
				$('select[name=specification4]').dropdown("set selected", vData.specification);
				break;
			}
		}
	}
});