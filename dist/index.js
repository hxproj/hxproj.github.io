$(document).ready(function(){

	// ***************************************************************
	// FUNCTION: 点击标签
	$('#LabelSearch a.label').click(function(){

		var Table  = $(this).parents('.description').attr('id');
		var Field  = $(this).parents('.ui.labels').attr('value');
		var Search = $(this).text();
		var Value  = $(this).attr("value"); 
		// 如果是其它项，则其Label的value值即为字段名
		if (Field == "other") {
			Field = $(this).attr('id');
		} else {
			Search = $(this).prevAll('div.label').text() + Search;
		}

		location.href = "Search.html?" + addParameter("type", Table) + "&"
						+ addParameter("name", Field) + "&"
						+ addParameter("value", Value) + "&"
						+ addParameter("search", Search);
	});
});