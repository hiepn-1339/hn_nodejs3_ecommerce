function addItemToCart(data) {
  fetch('/cart/update', {
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

async function updateCartItem(data) {
  const response = await fetch('/cart/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const text = await response.text();
  const result = JSON.parse(text);

  return result.status;
}

async function deleteCartItem(id) {
  await fetch(`/cart/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
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
      productId: parseInt(productId),
      quantity: 1,
    });
  });

  $('#addProductToCart').click(function (e) {
    e.preventDefault();
    const productId = $(this).attr('productId');
    const quantity = $('#quantityInput').val() * 1;

    if (quantity > 0) {
      addItemToCart({
        productId: parseInt(productId),
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

  $('.decreseQuantityItem').click(async function (e) {
    e.preventDefault();
    const productId = $(this).attr('productId');
    const input = $(`#input-quantity-${productId}`);
    const price = $(`#item-price-${productId}`).attr('value');
    $(this).prop('disabled', true);

    if (input.val() <= 1) {
      $(this).prop('disabled', false);
      return;
    }

    const status = await updateCartItem({
      productId: parseInt(productId),
      quantity: -1,
    });

    if (status === 'Success') {
      input.val(parseInt(input.val()) - 1);
      $(`#total-${productId}`).text(`${price * input.val()}$`);
    } 

    $(this).prop('disabled', false);
  });

  $('.increseQuantityItem').click(async function (e) {
    e.preventDefault();
    const productId = $(this).attr('productId');
    const input = $(`#input-quantity-${productId}`);
    const price = $(`#item-price-${productId}`).attr('value');
    $(this).prop('disabled', true);

    const status = await updateCartItem({
      productId: parseInt(productId),
      quantity: 1,
    });

    if (status === 'Success') {
      input.val(parseInt(input.val()) + 1);
      $(`#total-${productId}`).text(`${price * input.val()}$`);
    } 

    $(this).prop('disabled', false);
  });

  $('.deleteItem').click(function (e) {
    e.preventDefault();

    const id = $(this).attr('itemId');
    const productName = $(this).attr('productName');

    const lng = readCookie('i18next');

    let swalOptions;

    if (lng == 'en') {
      swalOptions = {
        title: 'Warning',
        text: `Are you sure you want to delete ${productName}?`,
        icon: 'warning',
        confirmButtonText: 'Yes',
      };
    } else  if (lng == 'vi') {
      swalOptions = {
        title: 'Cảnh Báo',
        text: `Bạn muốn xóa ${productName}?`,
        icon: 'warning',
        confirmButtonText: 'Đúng',
      };
    }

    Swal.fire({
      title: swalOptions.title,
      text: swalOptions.text,
      icon: swalOptions.icon,
      confirmButtonText: swalOptions.confirmButtonText,
    })
    .then(async () => {
      await deleteCartItem(id);
      window.location.reload();
    }); 
  });

  $('#applyCoupon').click(async () => {
    const name = $('#coupon').val();

    if (!name) return;

    const data = {
      name,
    };

    await fetch('/cart/apply-coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(async response => {
      const result = await response.text();
      var bodyContent = result.match(/<body>(.*)<\/body>/)[1];
      $('body').html(bodyContent);
    });
  });
});
