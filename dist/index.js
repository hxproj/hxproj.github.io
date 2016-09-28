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

		DataBaseFieldName == "other" ? DataBaseFieldName = $(this).attr('id') : 
			SearchItemName = $(this).parents('td').prev().text() + "：" + SearchItemName;

		window.location.href = "Search.html?" + addParameter("type", DataBaseTableName) + "&"
						+ addParameter("name", DataBaseFieldName) + "&"
						+ addParameter("value", SearchItemValue) + "&"
						+ addParameter("search", SearchItemName);
	});
});