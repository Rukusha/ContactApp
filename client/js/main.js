$(function(){
  var fileInput = $('logo');
  var maxSize = fileInput.data('max-size');
  $('.upload-form').submit(function(e){
      if(fileInput.get(0).files.length){
          var fileSize = fileInput.get(0).files[0].size; // in bytes
          if(fileSize>maxSize){
              alert('file size is more than ' + maxSize + ' bytes');
              return false;
          }else{
              alert('file size is correct - '+fileSize+' bytes');
          }
      }else{
          alert('Please select the file to upload');
          return false;
      }

  });
});