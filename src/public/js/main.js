(function ($) {
  'use strict';

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner(0);

  function buildURLWithQuery(currentURL, newQueryObject) {
    const parsedURL = new URL(currentURL);

    const mergedQuery = { ...Object.fromEntries(parsedURL.searchParams), ...newQueryObject };

    const newSearchParams = new URLSearchParams(mergedQuery);

    const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

    return newURL;
  }

  function formatDate(inputDate) {
    let date = new Date(inputDate);

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
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

  function setSelectedLng () {
    let lng = 'vi';
    const params = new URLSearchParams(window.location.search);
    if (readCookie('i18next')) {
      lng = readCookie('i18next');
    }
    if (params.get('lng')) {
      lng = params.get('lng');
    }

    if (lng === 'vi') {
      $('#lngVi').prop('selected', true);
    } else if (lng === 'en') {
      $('#lngEn').prop('selected', true);
    }
  }

  $(document).ready(function() {
    var pages = $('.page');

    pages.each(function() {
      var query = {page: $(this).attr('value')};
      var url = buildURLWithQuery(window.location.href, query);

      $(this).attr('href', url);
    });
    
    try {
      var ctx1 = $('#count-orders').get(0).getContext('2d');
      var ctx2 = $('#salse-revenue').get(0).getContext('2d');
      const dataChart =JSON.parse($('#salse-revenue').attr('data-order-data'));
      const labels = [];
      const countOrder = [];
      const total = [];
      const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      dataChart.forEach(data => {
        labels.push(data.month);
        countOrder.push(data.data.count);
        total.push(data.data.total);
      });
      var myChart1 = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Order',
              data: countOrder,
              backgroundColor: 'rgba(0, 156, 255, .5)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                callback: function(val, index) {
                  return MONTHS[val-1];
                },
              },
            },
          },
        },
      });
      var myChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Revenue',
              data: total,
              backgroundColor: 'rgba(0, 156, 255, .3)',
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              ticks: {
                callback: function(val, index) {
                  return '$' + val;
                },
              },
            },
            x: {
              ticks: {
                callback: function(val, index) {
                  return MONTHS[val-1];
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error(error);
    }

    $('#placeOrder').click(function() {
      $('#loader').removeClass('d-none');
    });

    var dates = $('.date');

    dates.each(function() {
      $(this).text(formatDate($(this).attr('value')));
    });

    try {
      const url = window.location.href;

      let sidebarActive = 'sidebar';
      if (url.includes('overview')) {
        sidebarActive += 'Overview'; 
      }
      if (url.includes('user')) {
        sidebarActive += 'User'; 
      }
      if (url.includes('product')) {
        sidebarActive += 'Product'; 
      }
      if (url.includes('category')) {
        sidebarActive += 'Category'; 
      }
      if (url.includes('coupon')) {
        sidebarActive += 'Coupon'; 
      }
      if (url.includes('order')) {
        sidebarActive += 'Order'; 
      }

      $(`#${sidebarActive}`).addClass('sidebar-active');
    } catch (error) {
      
    }

    setSelectedLng();

    document.querySelector('.select-language').oninput = function() {
      const params = new URLSearchParams(window.location.search);
      params.set('lng', this.value);
      window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    $('#register-btn').click(function() {
      $('#loader').removeClass('d-none');
    });

    $('#searchProduct').click(function() {
      var keyword = $('#keyword').val();
      var minPrice = $('#minPrice').val();
      var maxPrice = $('#maxPrice').val();

      var query = {
        page: 1,
      };

      if (keyword) {
        query.keyword = keyword;
      }
      if (minPrice) {
        query.minPrice = minPrice;
      }
      if (maxPrice) {
        query.maxPrice = maxPrice;
      }

      const parsedURL = new URL(window.location.href);

      const newSearchParams = new URLSearchParams(query);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

      window.location.href = newURL;
    });

    $('#searchOrder').click(function() {
      var startDate = $('#startDate').val();
      var endDate = $('#endDate').val();
      var payment = $('#payment').val();
      var status = $('#status').val();

      var query = {
        page: 1,
      };

      if (startDate) {
        query.startDate = startDate;
      }
      if (endDate) {
        query.endDate = endDate;
      }
      if (payment) {
        query.paymentMethod = payment;
      }
      if (status) {
        query.status = status;
      }

      const parsedURL = new URL(window.location.href);

      const newSearchParams = new URLSearchParams(query);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

      window.location.href = newURL;
    });

    $('#searchUser').click(function() {
      var keyword = $('#keyword').val();
      var genders = $('#gender').val();
      var statuses = $('#status').val();

      var query = {
        page: 1,
      };

      if (keyword) {
        query.keyword = keyword;
      }
      if (genders) {
        query.genders = genders;
      }
      if (statuses) {
        query.statuses = statuses;
      }

      const parsedURL = new URL(window.location.href);

      const newSearchParams = new URLSearchParams(query);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

      window.location.href = newURL;
    });

    $('#searchAdminOrder').click(function() {
      var keyword = $('#keyword').val();
      var totalMin = $('#totalMin').val();
      var totalMax = $('#totalMax').val();
      var startDate = $('#startDate').val();
      var endDate = $('#endDate').val();
      var payment = $('#payment').val();
      var status = $('#status').val();

      var query = {
        page: 1,
      };

      if (keyword) {
        query.keyword = keyword;
      }
      if (totalMin) {
        query.totalMin = totalMin;
      }
      if (totalMax) {
        query.totalMax = totalMax;
      }
      if (startDate) {
        query.startDate = startDate;
      }
      if (endDate) {
        query.endDate = endDate;
      }
      if (payment) {
        query.paymentMethod = payment;
      }
      if (status) {
        query.status = status;
      }

      const parsedURL = new URL(window.location.href);

      const newSearchParams = new URLSearchParams(query);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

      window.location.href = newURL;
    });

    $('#searchCategory').click(() => {
      var keyword = $('#keyword').val();
      var query = {
        page: 1,
      };

      if (keyword) {
        query.keyword = keyword;
      }

      const parsedURL = new URL(window.location.href);

      const newSearchParams = new URLSearchParams(query);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

      window.location.href = newURL;
    });

    $('#addCategory').click((e) => {
      e.preventDefault();

      $('#errorCreateCategory').text('');
    });

    $('#submitCreateCategory').click((e) => {
      e.preventDefault();

      const name = $('#name').val();

      $('#loader').removeClass('d-none');
      fetch('/admin/category/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
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

          Swal.fire(options)
          .then(() => {
            window.location.reload();
          });
        }
        if (data.status == 'Fail') {
          $('#errorCreateCategory').text(data.message);
        }
      });
    });

    $('.updateCategory').click(function(e) {
      e.preventDefault();

      $('#errorUpdateCategory').text('');

      $('#id').val($(this).data('category-id'));
      $('#updateName').val($(this).data('category-name'));
    });

    $('#submitUpdateCategory').click((e) => {
      e.preventDefault();

      const name = $('#updateName').val();

      const id = $('#id').val();

      $('#loader').removeClass('d-none');
      fetch(`/admin/category/${id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
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

          Swal.fire(options)
          .then(() => {
            window.location.reload();
          });
        }
        if (data.status == 'Fail') {
          $('#errorUpdateCategory').text(data.message);
        }
      });
    });

    $('#submitCreateCoupon').click((e) => {
      e.preventDefault();

      const name = $('#nameInput').val();
      const percentage = $('#percentageInput').val();
      const startDate = $('#startDateInput').val();
      const endDate = $('#endDateInput').val();

      const data = {};

      if (name) {
        data.name = name;
      }
      if (percentage) {
        data.percentage = percentage;
      }
      if (startDate) {
        data.startDate = startDate;
      }
      if (endDate) {
        data.endDate = endDate;
      }

      $('#loader').removeClass('d-none');
      fetch('/admin/coupon/create', {
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

          Swal.fire(options)
          .then(() => {
            window.location.reload();
          });
        }
        if (data.status == 'Fail') {
          data.errors.forEach(error => {
            const path = error.path;
            $(`p[path='${path}']`).text(error.msg);
          });
        }
      });
    });

    $('.updateCoupon').click(function(e) {
      e.preventDefault();

      $('.error').text('');

      $('#id').val($(this).data('coupon').id);
      $('#nameInputUpdate').val($(this).data('coupon').name);
      $('#percentageInputUpdate').val($(this).data('coupon').percentage);
      $('#startDateInputUpdate').val((new Date($(this).data('coupon').startDate)).toISOString().slice(0, 10));
      $('#endDateInputUpdate').val((new Date($(this).data('coupon').endDate)).toISOString().slice(0, 10));
    });

    $('#submitUpdateCoupon').click((e) => {
      e.preventDefault();

      const id = $('#id').val();
      const name = $('#nameInputUpdate').val();
      const percentage = $('#percentageInputUpdate').val();
      const startDate = $('#startDateInputUpdate').val();
      const endDate = $('#endDateInputUpdate').val();

      const data = {};

      if (name) {
        data.name = name;
      }
      if (percentage) {
        data.percentage = percentage;
      }
      if (startDate) {
        data.startDate = startDate;
      }
      if (endDate) {
        data.endDate = endDate;
      }

      $('#loader').removeClass('d-none');
      fetch(`/admin/coupon/${id}/update`, {
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

          Swal.fire(options)
          .then(() => {
            window.location.reload();
          });
        }
        if (data.status == 'Fail') {
          if (data.message) {
            options = {
              title: data.status,
              text: data.message,
              icon: 'error',
              confirmButtonText: 'OK',
            };
  
            Swal.fire(options);
          } else {
            data.errors.forEach(error => {
              const path = error.path;
              $(`p[path='${path}']`).text(error.msg);
            });
          }
        }
      });
    });

    $(document).ready(function() {
      $('.js-example-basic-multiple').select2();
    });

    $('#searchReset').click(function() {
      const parsedURL = new URL(window.location.href);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}`;

      window.location.href = newURL;
    });

    $('#adminSearchProduct').click(function() {
      var keyword = $('#keyword').val();
      var minPrice = $('#minPrice').val();
      var maxPrice = $('#maxPrice').val();
      var categories = $('#category').val();
      var ratingAvgs = $('#ratingAvg').val();
      var statuses = $('#status').val();

      var query = {
        page: 1,
      };

      if (keyword) {
        query.keyword = keyword;
      }
      if (minPrice) {
        query.minPrice = minPrice;
      }
      if (maxPrice) {
        query.maxPrice = maxPrice;
      }
      if (categories != '') {
        query.categories = categories;
      }
      if (ratingAvgs != '') {
        query.ratingAvgs = ratingAvgs;
      }
      if (statuses != '') {
        query.statuses = statuses;
      }

      const parsedURL = new URL(window.location.href);

      const newSearchParams = new URLSearchParams(query);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

      window.location.href = newURL;
    });

    $('#adminSearchCoupon').click(function() {
      var keyword = $('#keyword').val();
      var startDate = $('#startDate').val();
      var endDate = $('#endDate').val();
      var percentage = $('#percentage').val();

      var query = {
        page: 1,
      };

      if (keyword) {
        query.keyword = keyword;
      }
      if (startDate) {
        query.startDate = startDate;
      }
      if (endDate) {
        query.endDate = endDate;
      }
      if (percentage) {
        query.percentage = percentage;
      }

      const parsedURL = new URL(window.location.href);

      const newSearchParams = new URLSearchParams(query);

      const newURL = `${parsedURL.protocol}//${parsedURL.host}${parsedURL.pathname}?${newSearchParams}`;

      window.location.href = newURL;
    });

    $('.btn-minus').click(function(e) {
      e.preventDefault();

      const quantity = $('#quantityInput').val() * 1;

      if (quantity > 0) {
        $('#quantityInput').val(`${quantity - 1}`);
      }
    });

    $('.btn-plus').click(function(e) {
      e.preventDefault();

      const quantity = $('#quantityInput').val() * 1;

      $('#quantityInput').val(`${quantity + 1}`);
    });

    $('.openModalRating').click(function() {
      var orderId = $(this).data('order-id');

      $('#orderItemId').val(orderId);
    });

    $('#submitRating').click(function(e) {
      e.preventDefault();

      var ratingPoint = $('input[name="ratingPoint"]:checked').val();
      var comment = $('#comment').val();
      var orderItemId = $('#orderItemId').val();

      let data = {};

      if (ratingPoint) {
        data.ratingPoint = ratingPoint;
      }
      if (comment) {
        data.comment = comment;
      }
      if (orderItemId) {
        data.orderItemId = orderItemId;
      }

      const parsedURL = new URL(window.location.href);

      fetch(parsedURL.pathname, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
          options ={
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

    $('.inactiveUser').on('click', (e) => {
      const userId = $(e.target).data('user-id');
      
      const lng = readCookie('i18next');

      let options;

      if (lng === 'en') {
        options = {
          title: 'Warning',
          text: 'Are you sure you want to inactivate this user?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      } else {
        options = {
          title: 'Warning',
          text: 'Bạn có chắc chắn muốn vô hiệu hóa người dùng này không?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      }

      Swal.fire(options)
      .then(() => {
        $('#loader').removeClass('d-none');
        fetch(`/admin/user/${userId}/inactive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.text())
        .then((data) => {
          $('#loader').addClass('d-none');
          data = JSON.parse(data);
          Swal.fire({
            title: data.status,
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          })
          .then(() => {
            window.location.reload();
          });
        })
        .catch((e) => {
          console.error(e);
        });
      });
    });

    $('.activeUser').on('click', (e) => {
      const userId = $(e.target).data('user-id');
      
      const lng = readCookie('i18next');

      let options;

      if (lng === 'en') {
        options = {
          title: 'Warning',
          text: 'Are you sure you want to activate this user?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      } else {
        options = {
          title: 'Warning',
          text: 'Bạn có chắc chắn muốn kích hoạt người dùng này không?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      }

      Swal.fire(options)
      .then(() => {
        $('#loader').removeClass('d-none');
        fetch(`/admin/user/${userId}/active`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.text())
        .then((data) => {
          $('#loader').addClass('d-none');
          data = JSON.parse(data);
          Swal.fire({
            title: data.status,
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          })
          .then(() => {
            window.location.reload();
          });
        })
        .catch((e) => {
          console.error(e);
        });
      });
    });

    $('.inactiveProduct').on('click', (e) => {
      const productId = $(e.target).data('product-id');
      
      const lng = readCookie('i18next');

      let options;

      if (lng === 'en') {
        options = {
          title: 'Warning',
          text: 'Are you sure you want to inactivate this product?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      } else {
        options = {
          title: 'Warning',
          text: 'Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này không?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      }

      Swal.fire(options)
      .then(() => {
        $('#loader').removeClass('d-none');
        fetch(`/admin/product/${productId}/inactive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.text())
        .then((data) => {
          $('#loader').addClass('d-none');
          data = JSON.parse(data);
          if (data.status === 'Success') {
            Swal.fire({
              title: data.status,
              text: data.message,
              icon: 'success',
              confirmButtonText: 'OK',
            })
            .then(() => {
              window.location.reload();
            });
          } else {
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
      });
    });

    $('.activeProduct').on('click', (e) => {
      const productId = $(e.target).data('product-id');
      
      const lng = readCookie('i18next');

      let options;

      if (lng === 'en') {
        options = {
          title: 'Warning',
          text: 'Are you sure you want to activate this product?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      } else {
        options = {
          title: 'Warning',
          text: 'Bạn có chắc chắn muốn kích hoạt sản phẩm này không?',
          icon: 'warning',
          confirmButtonText: 'Ok',
        };
      }

      Swal.fire(options)
      .then(() => {
        $('#loader').removeClass('d-none');
        fetch(`/admin/product/${productId}/active`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.text())
        .then((data) => {
          $('#loader').addClass('d-none');
          data = JSON.parse(data);
          Swal.fire({
            title: data.status,
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          })
          .then(() => {
            window.location.reload();
          });
        })
        .catch((e) => {
          console.error(e);
        });
      });
    });
  });

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 55) {
        $('.fixed-top').css('top', -55);
    } else {
        $('.fixed-top').css('top', 0);
    }
  });
  
  
  // Back to top button
  $(window).scroll(function () {
  if ($(this).scrollTop() > 300) {
    $('.back-to-top').fadeIn('slow');
  } else {
    $('.back-to-top').fadeOut('slow');
  }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
    return false;
  });


  // Testimonial carousel
  $('.testimonial-carousel').owlCarousel({
    autoplay: true,
    smartSpeed: 2000,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav : true,
    navText : [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0:{
        items:1,
      },
      576:{
        items:1,
      },
      768:{
        items:1,
      },
      992:{
        items:2,
      },
      1200:{
        items:2,
      },
    },
  });


  // vegetable carousel
  $('.vegetable-carousel').owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav : true,
    navText : [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0:{
        items:1,
      },
      576:{
        items:1,
      },
      768:{
        items:2,
      },
      992:{
        items:3,
      },
      1200:{
        items:4,
      },
    },
  });


  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $('.btn-play').click(function () {
      $videoSrc = $(this).data('src');
    });

    $('#videoModal').on('shown.bs.modal', function (e) {
      $('#video').attr('src', $videoSrc + '?autoplay=1&amp;modestbranding=1&amp;showinfo=0');
    });

    $('#videoModal').on('hide.bs.modal', function (e) {
      $('#video').attr('src', $videoSrc);
    });
  });



  // Product Quantity
  $('.quantity button').on('click', function () {
    var button = $(this);
    var oldValue = button.parent().parent().find('input').val();
    if (button.hasClass('btn-plus')) {
      var newVal = parseFloat(oldValue) + 1;
    } else {
      if (oldValue > 0) {
        var newVal = parseFloat(oldValue) - 1;
      } else {
        newVal = 0;
      }
    }
    button.parent().parent().find('input').val(newVal);
  });

  $(document).on('click', 'i.del' , function() {
    $(this).parent().remove();
  });

  $(document).on('change','.uploadFile', function() {
    var uploadFile = $(this);
    var files = !!this.files ? this.files : [];
    if (!files.length || !window.FileReader) return;

    if (/^image/.test( files[0].type)){
      var reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onloadend = function(){ 
        uploadFile.closest('.imgUp').find('.img-account-profile').attr('src', this.result);
      };
    }
  });
})(jQuery);
