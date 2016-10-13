$(document).on('change', '.file.button :file', function() {
    var input     = $(this),
        fileLists = input.get(0).files;
        numFiles  = fileLists ? fileLists.length : 1,
        label     = "";

    for (var i=0; i<fileLists.length; ++i)
    {
      label += fileLists[i].name;   
      if (i != fileLists.length - 1) { label += "/"; }; 
    }
    input.trigger('fileselect', [numFiles, label]);
});


$(document).ready(function(){
    // ***************************************************************
    // FUNCTION: 图片添加
    $('.file.button :file').on('fileselect', function(event, numFiles, label) {
        $(".FileLabel").text(label);
    });
});