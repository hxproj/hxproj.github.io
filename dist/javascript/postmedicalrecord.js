$(document).ready(function(){

	(function(){
		$('body').append(
			"<div class='ui modal' id='ID_AddMedicalRecordModal'>" + 
				"<div class='header'>添加病历</div>" + 
				"<div class='content'>" + 
				    "<div class='description'>" + 
						"<form class='ui clearing form'>" + 
							"<h3 class='ui blue header'>基本信息</h3>" + 
						    "<div class='three fields'>" + 
						    	"<div class='field'>" + 
						    		"<label>姓名</label>" + 
						    		"<input type='text' name='name' placeholder='输入姓名'>" + 
						    	"</div>" + 
						    	"<div class='field'>" + 
						    		"<label>性别</label>" + 
						    		"<select name='gender' class='ui dropdown'>" + 
					                "<option value=''>选择</option>" + 
					                "<option value='0'>男</option>" + 
					                "<option value='1'>女</option>" + 
					              	"</select>" + 
						    	"</div>" + 
						    	"<div class='field'>" + 
						    		"<label>身份证号</label>" + 
						    		"<input type='text' name='ID' placeholder='身份证号' value='512222198111056324'>" + 
						    	"</div>" + 
						    "</div>	" + 
						    "<div class='three fields'>" + 
						    	"<div class='field'>" + 
						    		"<label>职业</label>" + 
						    		"<input type='text' name='occupation' placeholder='输入职业'>" + 
						    	"</div>" + 
						    	"<div class='field'>" + 
						    		"<label>联系方式</label>" + 
						    		"<input type='text' name='contact' placeholder='输入联系方式'>" + 
						    	"</div>" + 
						    "</div>" + 
						"</form>" + 
				    "</div>" + 
			  	"</div>" + 
				"<div class='actions'>" + 
					"<div class='ui orange deny button'>取消</div>" + 
					"<div class='ui primary approve right labeled icon button'>" + 
						"添加<i class='checkmark icon'></i>" + 
					"</div>" + 
				"</div>" + 
			"</div>"
		);

		// ***************************************************************
		// POST
		$('.AddMedicalRecordButton').click(function(){
			$('#ID_AddMedicalRecordModal').modal({
				closable  : false,
				onApprove : function() {
					$("#ID_AddMedicalRecordModal form").form({
						fields: {
							name: {
								identifier: 'name',
								rules: [
									{
										type   : 'empty',
				            			prompt : '请填写病人的姓名'
									}
								]
							},
							gender: {
								identifier: 'gender',
								rules: [
									{
										type   : 'empty',
				            			prompt : '请填写病人的性别'
									}
								]
							},
							age: {
								identifier: 'ID',
								rules: [
									{
										type   : 'empty',
				            			prompt : '请填写病人身份证号'
									}
								]
							},
							occupation: {
								identifier: 'occupation',
								rules: [
									{
										type   : 'empty',
				            			prompt : '请填写病人的职业'
									}
								]
							},
							contact: {
								identifier: 'contact',
								rules: [
									{
										type   : 'empty',
				            			prompt : '请填写病人的联系方式'
									}
								]
							},
						},
						inline: true,
						onSuccess: function(){
							$.ajax({
								url      : URL_USER,
								type     : "POST",
								async    : false, 
								data     : $(this).serialize(),
								dataType : "json",
								error    : function() {networkError();},
								success  : function() {location.reload();}
							});
							return false;
						}
					}).submit();

					return false;
				}
			}).modal('show');
		});


		function submitUserInfo(Data) {
			
		}

	}());

});
