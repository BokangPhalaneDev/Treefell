(function () {
  'use strict';

  /* ============================================================
     1. Sticky header shadow on scroll
     ============================================================ */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     2. Footer year
     ============================================================ */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================================================
     3. Toast helper
     ============================================================ */
  var toastEl = document.getElementById('toast');
  var toastMsg = document.getElementById('toastMsg');
  var toastTimer = null;

  function showToast(title, message, duration) {
    if (!toastEl) return;
    toastEl.querySelector('b').textContent = title || 'Notice';
    if (toastMsg) toastMsg.textContent = message || '';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, duration || 5000);
  }

  /* ============================================================
     4. File upload display
     ============================================================ */
  var fileInput = document.getElementById('fileUpload');
  var fileChip = document.getElementById('fileChip');
  var fileName = document.getElementById('fileName');
  var MAX_SIZE = 5 * 1024 * 1024; // 5MB

  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) {
        fileChip.classList.remove('show');
        fileName.textContent = '';
        return;
      }

      if (file.size > MAX_SIZE) {
        showToast('File too large', 'Please choose an image under 5MB.', 5000);
        fileInput.value = '';
        fileChip.classList.remove('show');
        fileName.textContent = '';
        return;
      }

      if (file.type.indexOf('image') !== 0) {
        showToast('Invalid file', 'Please upload a JPG or PNG image.', 5000);
        fileInput.value = '';
        fileChip.classList.remove('show');
        fileName.textContent = '';
        return;
      }

      fileName.textContent = file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
      fileChip.classList.add('show');
    });
  }

  /* ============================================================
     5. Date input: minimum = today, default = tomorrow
     ============================================================ */
  var dateInput = document.getElementById('date');
  if (dateInput) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var minDate = yyyy + '-' + mm + '-' + dd;
    dateInput.min = minDate;

    var tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    var tY = tomorrow.getFullYear();
    var tM = String(tomorrow.getMonth() + 1).padStart(2, '0');
    var tD = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.value = tY + '-' + tM + '-' + tD;
  }

  /* ============================================================
     6. Booking form validation + submission feedback
     ============================================================ */
  var form = document.getElementById('bookingForm');
  if (form) {
    var submitting = false;

    form.addEventListener('submit', function (e) {
      if (submitting) {
        e.preventDefault();
        return;
      }

      if (!form.checkValidity()) {
        e.preventDefault();
        var firstInvalid = form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        showToast('Missing information', 'Please fill in all required fields marked with *', 5000);
        return;
      }

      e.preventDefault();
      submitting = true;

      showToast(
        'Sending your booking',
        'Please wait while we submit your request...',
        8000
      );

      window.setTimeout(function () {
        form.submit();
      }, 400);
    });

    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        submitting = false;
      }
    });
  }

  /* ============================================================
     7. Smooth scroll for in-page anchors (with sticky header offset)
     ============================================================ */
  var headerOffset = 80;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     8. Scroll reveal animations
     ============================================================ */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('in');
    });
  }

  /* ============================================================
     9. Add file size to hidden field (optional enhancement)
     ============================================================ */
  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (file) {
        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'file_size_kb';
        hidden.value = String(Math.round(file.size / 1024));
        form.appendChild(hidden);
      }
    });
  }
})();