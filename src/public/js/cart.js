function addItemToCart(data) {
  fetch('/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then((response) => response.text())
  .then((data) => {
    data = JSON.parse(data);
    if (data.status == 'Success') {
      Swal.fire({
        title: data.status,
        text: data.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
    if (data.status == 'Fail') {
      Swal.fire({
        title: data.status,
        text: data.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  })
  .catch((e) => {
    console.error(e);
  });
}

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
  $('.addToCart').click(function (e) {
    e.preventDefault();
    const productId = $(this).attr('productId');

    addItemToCart({
      productId,
      quantity: 1,
    });
  });

  $('#addProductToCart').click(function (e) {
    e.preventDefault();
    const productId = $(this).attr('productId');
    const quantity = $('#quantityInput').val() * 1;

    if (quantity > 0) {
      addItemToCart({
        productId,
        quantity,
      });
    } else {
      const lng = readCookie('i18next');

      if (lng == 'en') {
        Swal.fire({
          title: 'Invalid Quantity!',
          text: 'Quantity must be greater than zero!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      } else  if (lng == 'vi') {
        Swal.fire({
          title: 'Số lượng không hợp lệ!',
          text: 'Số lượng phải lớn hơn 0!',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }

    }
  });
});
