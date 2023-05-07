$(function() {
  $('form').submit(function(event) {
    event.preventDefault();
    
    const formData = new FormData($('form')[0]);
    console.log("About to upload...");

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        alert('File uploaded successfully!');
        // $.ajax({
        //   url: '/process',
        //   type: 'POST',
        //   data: {filename: data.filename},
        //   success: function(data) {
        //     alert('Text processed successfully!');
        //     // Do something with the processed text
        //   },
        //   error: function(jqXHR, textStatus, errorThrown) {
        //     alert('Error processing text: ' + textStatus + ', ' + errorThrown);
        //   }
        // });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        alert('Error uploading file: ' + textStatus + ', ' + errorThrown);
      }
    });
  });
});
