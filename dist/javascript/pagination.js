jQuery.extend({

	PaginationBody: "<div class='ui right floated blue inverted borderless menu' id='Pagination'>"
		+ "<a class='left item' href='#''><i class='angle double left icon'></i></a>"
		+ "<a class='right item' href='#''><i class='angle double right icon'></i></a>"			
		+ "</div>",	

	PaginationDisabledItem: "<div class='disabled item'>...</div>",
	PaginationItem: "<a class='blue item' href='#'></a>",
	MaxDisplayPages: 5,

	requestPage: function($AfterSelector, TotalPageNums, PageNum, URL, ErrorFunc, SuccessFunc) {
		$.ajax({
			url      : URL,
			type     : "get",
			data     : {page : PageNum},
			dataType : "json",
			error    : ErrorFunc,
			success  : SuccessFunc,
		});

		$.Page($AfterSelector, TotalPageNums, PageNum, URL, ErrorFunc, SuccessFunc);
	},

	Page: function($AfterSelector, TotalPageNums, PageNum, URL, ErrorFunc, SuccessFunc) {

		var $Menu = $('#Pagination');
		if ($Menu.length > 0) {
			$Menu.find('.blue.item, .disabled.item').remove();
		} 
		// 如果前端分页不存在
		else {
			$AfterSelector.after($.PaginationBody);
			$Menu = $('#Pagination');
		} 

		// 计算分页起始页
		var StartPage = PageNum - 2,
			EndPage   = PageNum + 2;
		if (StartPage < 1) {StartPage = 1;}
		if (EndPage < this.MaxDisplayPages) {EndPage = this.MaxDisplayPages;}
		if (EndPage > TotalPageNums) {EndPage = TotalPageNums;} 
		if (EndPage - StartPage < this.MaxDisplayPages && EndPage - this.MaxDisplayPages > 0) {
			StartPage = EndPage - this.MaxDisplayPages + 1;
		}

		var $LeftItem  = $Menu.find('.left.item'),
			$RightItem = $Menu.find('.right.item');

		// 设置首尾页点击事件
		$LeftItem.unbind().bind('click', function(){$.requestPage($AfterSelector, TotalPageNums, 1, URL, ErrorFunc, SuccessFunc)});
		$RightItem.unbind().bind('click', function(){$.requestPage($AfterSelector, TotalPageNums, TotalPageNums, URL, ErrorFunc, SuccessFunc)});

		// 添加disable item
		var $Item = $LeftItem;
		if (StartPage > 1) { $Item = $Item.after($.PaginationDisabledItem).next(); }
		if (TotalPageNums - EndPage > 0) { $RightItem.before($.PaginationDisabledItem); }

		// 设置页面状态和单击事件
		for (var i=StartPage; i<=EndPage; ++i) {
			$Item = $Item.after($.PaginationItem).next().text(i);

			i == PageNum ? $Item.addClass('active') : 
					$Item.bind('click', function(){$.requestPage($AfterSelector, TotalPageNums, Number(this.text), URL, ErrorFunc, SuccessFunc)});
		}
	},
});