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

  $(document).ready(function() {
    var pages = $('.page');

    pages.each(function() {
      var query = {page: $(this).attr('value')};
      var url = buildURLWithQuery(window.location.href, query);

      $(this).attr('href', url);
    });

    var dates = $('.date');

    dates.each(function() {
      $(this).text(formatDate($(this).attr('value')));
    });

    $('#cancelOrder').click(function() {
      var orderId = $(this).data('order-id');
      $('#orderId').text(orderId);
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

      var url = buildURLWithQuery(window.location.href, query);

      window.location.href = url;
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
        uploadFile.closest('.imgUp').find('.imagePreview').css('background-image', 'url('+this.result+')');
      };
    }
  });
})(jQuery);

