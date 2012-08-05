(function($){

function dropHandler(e){

  e.stopPropagation();
  e.preventDefault();

  var fileList = e.dataTransfer.files;

  var file = fileList[0];

  var form = new FormData();
  form.append('files', file);

  console.log(file);

  var dfd = $.ajax({
    url: "/upload",
    type: "post",
    cache: false,
    processData: false,
    contentType: false,
    beforeSend: function(xhr, settings){
      xhr.setRequestHeader("X-File-Name", file.name);
      xhr.setRequestHeader("X-File-Size", file.size);
      xhr.setRequestHeader("X-File-Type", file.type);
    },
    data: form
  });

  dfd.done(function( data ){
    console.log(data);
  });

}

document.addEventListener('dragenter', function(e){
  e.preventDefault();
  e.stopPropagation();
}, false);

document.addEventListener('dragover', function(e){
  e.preventDefault();
  e.stopPropagation();
}, false);

document.addEventListener('drop', dropHandler, false);

})(jQuery);
