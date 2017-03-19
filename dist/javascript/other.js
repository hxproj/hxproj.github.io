$(document).ready(function(){

	// 设置选项可以额外添加选项值
	$('.search.dropdown').dropdown({
		allowAdditions: true
	});


	// 获取其它
	window.getOtherOption = function(parameters) {

		$.each(parameters.fields, function(index, filed){
			$.ajax({
				url      : URL_SELECTION + toquerystring({table_name : parameters.table_name, filed : filed}),
				type     : "GET", 
				dataType : "json",
				async	 : false,  
				success  : function(vData) {
					$.each(vData, function(){
						$("select[name=" + filed + "]").append("<option class='additional' value=" + this.value + ">" + this.value + "</option>");
					});
				}
			});
		});
	}


	// 添加其它
	window.addOtherOption = function(parameters) {

		$.each(parameters.fields, function(Index, Field){
			var InputValues = parameters.form.form('get value', Field);

			if (InputValues instanceof Array) {
				// 多选
				$.each(InputValues, function(){
					if ($("select[name=" + Field + "] option[value=" + escapeJquery(this) + "]").hasClass('addition')) {
						submitOtherOption({
							table_name : parameters.table_name,
							filed      : Field,
							value      : this,
						});
					}
				});
			} 
			else {
				// 单选。其中，escapeJquery处理选项值中可能出现的特殊符号
				if ($("select[name=" + Field + "] option[value=" + escapeJquery(InputValues) + "]").hasClass('addition')) {
					submitOtherOption({
						table_name : parameters.table_name,
						filed      : Field,
						value      : InputValues,
					});
				}
			}
		});
	}
	function submitOtherOption(parameters) {
		$.ajax({
			url      : URL_SELECTION,
			type     : "POST", 
			data     : parameters,
			async	 : false,  
			dataType : "json"
		});
	}

	// 删除其他
	$('i[type=selection_edit]').click(function(){
		var $Field   = $(this).parents('.field'),
			$Options = $Field.find('select option'),
			$Labels  = $('#edit_option_modal .ui.labels');

		$Labels.attr("field", $Field.find('select').attr('name')).find('.label').remove();
		$('#edit_option_modal .header').text($Field.find('label').text());

		if ($Options.length > 0){
			$.each($Options, function() {
				if ($(this).hasClass('additional')) {
					$Labels.append("<a class='ui label'>" + $(this).text() + "<i class='delete icon'></i></a>");
				} 
				else if($(this).hasClass('addition')) {
				}
				else {
					$Labels.append("<a class='ui disabled label'>" + $(this).text() + "</a>");
				}
			});

			$('#edit_option_modal .label i.delete').bind('click', function() {
				var Field  = $(this).parents('.ui.labels').attr("field"),
					Value  = $(this).parent().text();
				$('#deletemodal').modal({
					onApprove : function(){
						deleteOtherOption({
							field : Field,
							value : Value
						}, function() {
							$Field.find('select').dropdown('restore defaults').find("option[value=" + Value + "]").remove();
						});
					}
				}).modal('show');
			});
		}

		$('#edit_option_modal').modal({}).modal("show");
	});

	function deleteOtherOption(parameters, success_callback) {
		$.ajax({
			url      : URL_SELECTION + toquerystring(parameters),
			type     : "DELETE", 
			async	 : false,  
			success  : function() {
				success_callback();
			}
		});
	}
});