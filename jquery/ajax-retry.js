if (typeof(jQuery) === 'function'){
  function retryAjax(ajax, options) {
    var interval = options && options.interval || 2000,
        maxRetries = options && options.maxRetries || 5,
        continueDecider = options && options.continueDecider;

    var oldSuccess = ajax.success,
        oldError = ajax.error,
        oldComplete = ajax.complete;

    function onSuccess(data, status, xhr) {
      if (oldSuccess)
        oldSuccess(data, status, xhr);
      if (oldComplete)
        oldComplete(xhr, status);
    };

    function runRetries(ajaxOptions, currentRetry, maxRetries, interval) {
      ajaxOptions.error = function(jqXHR, textStatus, errorThrown) {
        var proceed = true;
         
        if (continueDecider)
          proceed = continueDecider();
         
        if (proceed){
          nextRetry = currentRetry + 1;
          proceed = nextRetry <= maxRetries;
          if (proceed) {
             setTimeout(function(){ runRetries(ajaxOptions, nextRetry, maxRetries, interval); }, interval);
           } else {
            if (oldError)
              oldError(jqXHR, textStatus, errorThrown);
            if (oldComplete)
              oldComplete(jqXHR, status);
          }            
        }
     }

     $.ajax(ajax);
   };// runRetries

   ajax.success = onSuccess;
   ajax.complete = null;
   runRetries(ajax, 1, maxRetries, interval);
 };
};
