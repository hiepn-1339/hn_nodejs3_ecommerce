function readCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

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

  $('.cancelOrder').click(function() {
    var orderId = $(this).data('order-id');
    
    const lng = readCookie('i18next');

    let options;

    if (lng == 'en') {
      options ={
        title: 'Warning',
        text: `Are you sure you want to cancel order with id: ${orderId}`,
        icon: 'warning',
        confirmButtonText: 'Yes',
      };
    } else if (lng == 'vi') {
      options = {
        title: 'Cảnh báo',
        text: `Bạn có chắc muốn hủy order có id: ${orderId}`,
        icon: 'warning',
        confirmButtonText: 'Đúng',
      };
    }

    Swal.fire(options)
    .then(() => {
      $('#loader').removeClass('d-none');
      fetch(`/order/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.text())
      .then((data) => {
        data = JSON.parse(data);
        let options;
        if (data.status == 'Success') {
          options = {
            title: data.status,
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          };
        }
        if (data.status == 'Fail') {
          options = {
            title: data.status,
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          };
        }
      $('#loader').addClass('d-none');
        Swal.fire(options)
        .then(() => {
          window.location.reload();
        });
      })
      .catch((e) => {
        console.error(e);
      });
    });
  });

  $('.approveOrder').click(function() {
    var orderId = $(this).data('order-id');
    
    const lng = readCookie('i18next');

    let options;

    if (lng == 'en') {
      options ={
        title: 'Warning',
        text: `Are you sure you want to approve order with id: ${orderId}`,
        icon: 'warning',
        confirmButtonText: 'Yes',
      };
    } else if (lng == 'vi') {
      options = {
        title: 'Cảnh báo',
        text: `Bạn có chắc muốn chấp nhận order có id: ${orderId}`,
        icon: 'warning',
        confirmButtonText: 'Đúng',
      };
    }

    Swal.fire(options)
    .then(() => {
      $('#loader').removeClass('d-none');
      fetch(`/admin/order/${orderId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.text())
      .then((data) => {
        $('#loader').addClass('d-none');
        data = JSON.parse(data);
        let options;
        if (data.status == 'Success') {
          options = {
            title: data.status,
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          };
        }
        if (data.status == 'Fail') {
          options = {
            title: data.status,
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          };
        }
        Swal.fire(options)
        .then(() => {
          window.location.reload();
        });
      })
      .catch((e) => {
        console.error(e);
      });
    });
  });

  $('.completeOrder').click(function() {
    var orderId = $(this).data('order-id');
    
    const lng = readCookie('i18next');

    let options;

    if (lng == 'en') {
      options ={
        title: 'Warning',
        text: `Are you sure you want to complete order with id: ${orderId}`,
        icon: 'warning',
        confirmButtonText: 'Yes',
      };
    } else if (lng == 'vi') {
      options = {
        title: 'Cảnh báo',
        text: `Bạn có chắc muốn hoàn thành order có id: ${orderId}`,
        icon: 'warning',
        confirmButtonText: 'Đúng',
      };
    }

    Swal.fire(options)
    .then(() => {
      $('#loader').removeClass('d-none');
      fetch(`/admin/order/${orderId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.text())
      .then((data) => {
        $('#loader').addClass('d-none');
        data = JSON.parse(data);
        let options;
        if (data.status == 'Success') {
          options = {
            title: data.status,
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          };
        }
        if (data.status == 'Fail') {
          options = {
            title: data.status,
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK',
          };
        }
        Swal.fire(options)
        .then(() => {
          window.location.reload();
        });
      })
      .catch((e) => {
        console.error(e);
      });
    });
  });

  $('.rejectOrder').click(function() {
    var orderId = $(this).data('order-id');

    $('#orderId').val(orderId);
  });

  $('#submitRejectOrder').click(function(e) {
    e.preventDefault();

    var orderId = $('#orderId').val();
    var reasonReject = $('#reasonReject').val();
    
    let data = {};
    if (reasonReject) {
      data.reasonReject = reasonReject;
    } else {
      $('#errorReason').removeClass('d-none');
      return;
    }

    $('#loader').removeClass('d-none');
    fetch(`/admin/order/${orderId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.text())
    .then((data) => {
      $('#loader').addClass('d-none');
      data = JSON.parse(data);
      let options;
      if (data.status == 'Success') {
        options = {
          title: data.status,
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        };
      }
      if (data.status == 'Fail') {
        options = {
          title: data.status,
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK',
        };
      }
      Swal.fire(options)
      .then(() => {
        window.location.reload();
      });
    });
      
  });
});
