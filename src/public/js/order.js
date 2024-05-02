$(document).ready(function () {
  const inputPaymentMethod = $('.form-check-payment-method');

  inputPaymentMethod.change(function(){
    if ($(this).is(':checked')) {
      inputPaymentMethod.not(this).prop('checked', false);
      $('#proof-input').addClass('d-none');
      $('#proof').removeAttr('required');

      if ($(this).val() == 'BANK_TRANSFER') {
        $('#proof-input').removeClass('d-none');
        $('#proof').attr('required', 'required');
      } 
    } else {
      if ($(this).val() == 'BANK_TRANSFER') {
        $('#proof-input').addClass('d-none');
        $('#proof').removeAttr('required');
      } 
    }
  });
});
