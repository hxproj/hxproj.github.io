$(document).ready(function(){

	// **************************************************
	// POST
	$('form').form({
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
			cure_plan: {
				identifier: 'cure_plan',
				rules: [
					{
						type   : 'empty',
            			prompt : '请选择治疗方案'
					}
				]
			},
		},
		inline: true,
		onSuccess: function(){


			// Fixme: design form data and field "specification"
			var FormData = ;
			$.ajax({
				url      : window.URL_DIAGNOSE,
				type     : "POST", 
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
});