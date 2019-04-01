$(function() {
  $('body').on('submit', 'form[data-live-remote]', function(e){
    e.preventDefault();

    function onSuccess(form, data, status, xhr) {
      form.trigger('ajax:success', [data, status, xhr]);
      var newContent = data.form;
      if (newContent)
        form.replaceWith(newContent);
    };

    function onError(form, xhr, status, errorThrown) {
      form.trigger('ajax:error', [xhr, status, errorThrown]);
    };

    function onComplete(form, xhr, status) {
      form.trigger('ajax:complete', [xhr, status]);
    };

    var form = $(this),
        method = form.find('input[name="_method"]').eq(0).attr('value') || form.attr('method') || form.data('method') || 'POST',
        responseType = form.data('response-type') || 'json',
        sender = $(document.activeElement),
        senderName = sender.attr('name'),
        senderVal = sender.val();
  
    var formData = form.serialize();
    if (sender)
      formData += '&'+senderName+'='+(senderVal || 1);

    var request = {
      type: method,
      data: formData,
      url: form.attr('action'),
      dataType: responseType,
      success: function(data, status, xhr) { onSuccess(form, data, status, xhr); },
      error: function(xhr, status, errorThrown){ onError(form, xhr, status, errorThrown); },
      complete: function(xhr, status){ onComplete(form, xhr, status); },
      beforeSend: function(xhr) { form.trigger('ajax:beforeSend', [xhr]); }
    };

    if (typeof(retryAjax) === 'undefined') {
      $.ajax(request);
    } else {
      retryAjax(request);
    }
  });
});