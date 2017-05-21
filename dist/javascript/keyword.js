$(document).ready(function(){

	// ***************************************************************
	// FUNCTION: 设置tab可选性
	$('#context .menu .item').tab({ context: $('#context') });
	
	// ***************************************************************
	// FUNCTION: 点击标签
	$('.ui.table a.label').click(function(){
		var DataBaseTableName = $(this).parents('.ui.table').attr('id'),
			DataBaseFieldName = $(this).parents('.ui.labels').attr('value'),
			SearchItemText    = $(this).text(),
			SearchItemValue   = $(this).attr('value') == undefined ? SearchItemText : $(this).attr('value'),
			SearchItemName    = $(this).parents('td').prev().text();

		search({
			DataBaseTableName : DataBaseTableName,
			DataBaseFieldName : DataBaseFieldName,
			SearchItemText    : SearchItemText,
			SearchItemValue   : SearchItemValue,
			SearchItemName    : SearchItemName,
		});
	});

	// Enter
	// $('body').keydown(function(){ if (event.keyCode == "13") { $SearchButton.click(); } });

	// ***************************************************************
	// FUNCTION: 页面跳转
	function search(Parameters) {
		window.location.href = "keywordsearch.html" + toquerystring({
			type     : Parameters.DataBaseTableName,
			name     : Parameters.DataBaseFieldName,
			text     : Parameters.SearchItemText,
			value    : Parameters.SearchItemValue,
			itemName : Parameters.SearchItemName,
		});
	}

	// ***************************************************************
	// FUNCTION: 搜索内容
	$('.search.detail').click(function(){

		var DataBaseTableName = $(this).parents('.ui.table').attr('id'),
			$Item             = $(this).parents('tr'),
			DataBaseFieldName = $Item.find('.ui.labels').attr('value'),
			SearchItemName    = $Item.find('td:first').text();

		var $Modal = $('#SearchModal');
		$Modal.find('.form .ui.header').text(SearchItemName);
		$Modal.find('.form input[name=DataBaseTableName]').val(DataBaseTableName);
		$Modal.find('.form input[name=DataBaseFieldName]').val(DataBaseFieldName);
		$Modal.find('.form input[name=SearchItemName]').val(SearchItemName);
		$Modal.modal("show");
	});

	$('#SearchModal form').form({
		fields: {
			search: {
				identifier: 'search',
				rules: [
					{
						type   : 'empty',
						prompt : '请输入需要搜索的内容'
					}
				]
			},
		},
		inline    : true,
		onSuccess : function(){
			
			search({
				DataBaseTableName : $(this).form('get value', "DataBaseTableName"),
				DataBaseFieldName : $(this).form('get value', "DataBaseFieldName"),
				SearchItemText    : $(this).form('get value', "search"),
				SearchItemValue   : $(this).form('get value', "search"),
				SearchItemName    : $(this).form('get value', "SearchItemName"),
			});

			return false;
		}
	});
})
