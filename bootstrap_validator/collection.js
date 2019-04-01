$(function() {

$.fn.bootstrapValidator.validators.collection = {
    html5Attributes: {
        message: 'message',
        separator: 'separator'
    },

    enableByHtml5: function($field) {
      return false;
    },

    /**
     * Processes an array of validations.
     *
     * @param {BootstrapValidator} validator The validator plugin instance
     * @param {jQuery} $field Field element
     * @param {Object} is an array of dictionaries each containing key-valued options. Each dictionary represents a regular validator descriptions as described in the documentation.
     * @returns {Object} with {valid: [true|false], message: 'custom message'}
     */
    validate: function(validator, $field, options) {
      // if (this.enableByHtml5($field)) {
      //   return false;
      // }

      var isValid = true,
          response = null,
          errorsMessage = null,
          errorsMessages = [],
          validate = true;

      options.items.forEach(function(validators_dict){
        for (var validators in validators_dict.validator){
          for (var v in validators_dict.validator) {
            active = validators_dict.active;
            if (active != undefined){
              switch(typeof(active)){
                case 'function':
                  validate = active();
                  break;
                case 'boolean':
                  validate = active;
                  break;
              }
            }

          if (!validate)
            continue;

          switch(v) {
            case 'callback':
                response = $.fn.bootstrapValidator.helpers.call(validators_dict.validator[v].callback, [$field.val(), validator, $field]);
                break;
            default:
                response = $.fn.bootstrapValidator.validators[v].validate(validator, $field, validators_dict.validator[v]);
          }

          var resp;
          switch (typeof(response)) {
            case 'boolean':
                resp = response;
                isValid = isValid && response;
                if (!response) {
                  errorsMessage = validators_dict.validator[v].message || $.fn.bootstrapValidator.i18n[v]['default']
                  if (!errorsMessage.match(/%s/))
                    errorsMessages.push(errorsMessage);
                }
                break;
            case 'object':
                resp = response.valid;
                isValid = isValid && response.valid;
                if (!isValid) 
                  errorsMessages.push(response.message);
                break;
            default:
              throw new Error('Unknown validation result type for ' + typeof(response));
          }
         }
       }
      });//forEach

      var result = {valid: isValid};
      if (!isValid) {
        result['message'] = errorsMessages.join('. ');
      }

      return result;
    }
};

});