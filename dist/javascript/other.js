$(document).ready(function(){

	// 设置选项可以额外添加选项值
	$('.search.dropdown').dropdown({
		allowAdditions: true
	});

	// 添加其它
	window.submitOtherOption = function(Parameters, callback_success, callback_error) {

		$.each(Parameters, function(){
			var Options = $(this.filed).val();
			if ($.inArray(this.value, Options) == -1) {
				submitOtherOption(this);
			}
		});

		callback_error != undefined ? callback_error() : location.reload();
		callback_success != undefined ? callback_success() : location.reload();
	}

	function submitOtherOption(Parameters) {
		$.ajax({
			url      : URL_SELECTION,
			type     : "POST", 
			data     : Parameters,
			async	 : false,  
			dataType : "json"
		});
	}
});