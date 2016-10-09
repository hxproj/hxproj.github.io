$(document).ready(function(){

	// ***************************************************************
	// FUNCTION: 设置tab可选性
	$('#context .menu .item').tab({ context: $('#context') });
	
	// ***************************************************************
	// FUNCTION: 点击标签
	$('.segment a.label').click(function(){
		var DataBaseTableName = $(this).parents('.ui.segment').attr('id'),
			DataBaseFieldName = $(this).parents('.ui.labels').attr('value'),
			SearchItemName    = $(this).text(),
			SearchItemValue   = $(this).attr('value');

		DataBaseFieldName == "other" ? DataBaseFieldName = $(this).attr('filed') : 
			SearchItemName = $(this).parents('td').prev().text() + "：" + SearchItemName;

		search({
			DataBaseTableName : DataBaseTableName,
			DataBaseFieldName : DataBaseFieldName,
			SearchItemName    : SearchItemName,
			SearchItemValue   : SearchItemValue
		});
	});

	// ***************************************************************
	// FUNCTION: 搜索
	var $SearchButton = $('#id_search .ui.button'),
		$SearchInput  = $('#id_search input');
	// 点击
	$SearchButton.click(function(){
		var InputValue = $SearchInput.val();
		if (InputValue == "") {
			$('.ui.message').transition('drop');
			return false;
		}

		search({
			DataBaseTableName : "user",
			DataBaseFieldName : "name",
			SearchItemName    : InputValue,
			SearchItemValue   : InputValue
		});
	});
	// Enter
	$('body').keydown(function(){ if (event.keyCode == "13") { $SearchButton.click(); } });

	// ***************************************************************
	// FUNCTION: 页面跳转
	function search(Parameters) {
		window.location.href = "Search.html?" + addParameter("type", Parameters.DataBaseTableName) + "&"
				+ addParameter("name", Parameters.DataBaseFieldName) + "&"
				+ addParameter("value", Parameters.SearchItemValue) + "&"
				+ addParameter("search", Parameters.SearchItemName);
	}
});