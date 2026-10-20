/* Clinic Pharmacy — site interactions */
(function () {
  "use strict";

  var doc = document;
  var body = doc.body;

  /* ---------------------------------------------------------------- Header */
  var header = doc.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --------------------------------------------------------- Mobile nav */
  var toggle = doc.querySelector(".nav__toggle");
  var menu = doc.getElementById("primary-nav");
  var scrim = doc.querySelector(".nav__scrim");

  function closeNav() {
    if (!menu || !toggle) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    body.classList.remove("nav-open");
    if (scrim) scrim.classList.remove("is-open");
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) {
        closeNav();
      } else {
        menu.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
        body.classList.add("nav-open");
        if (scrim) scrim.classList.add("is-open");
      }
    });

    if (scrim) scrim.addEventListener("click", closeNav);

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080) closeNav();
    });
  }

  /* ------------------------------------------------------------- Tabs */
  doc.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll("[role='tab']"));
    var panels = Array.prototype.slice.call(group.querySelectorAll("[role='tabpanel']"));

    function activate(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", selected ? "true" : "false");
        t.setAttribute("tabindex", selected ? "0" : "-1");
      });
      panels.forEach(function (p) {
        var match = p.id === tab.getAttribute("aria-controls");
        p.hidden = !match;
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activate(tab); });
      tab.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = tabs[(i + dir + tabs.length) % tabs.length];
        next.focus();
        activate(next);
      });
    });

    var initial = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    if (initial) activate(initial);
  });

  /* ------------------------------------------------- Accordion (one open) */
  doc.querySelectorAll("[data-accordion]").forEach(function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll("details"));
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (!item.open) return;
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      });
    });
  });

  /* -------------------------------------------------- Reveal on scroll */
  var reveals = doc.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------- Current year */
  doc.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --------------------------------------------------------- Appointment form */
  doc.querySelectorAll("[data-appointment-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));
      var missing = required.filter(function (el) { return !el.value.trim(); });

      if (missing.length) {
        missing[0].focus();
        if (status) {
          status.className = "form-status is-visible form-status--err";
          status.textContent = "Please complete the highlighted required fields so we can prepare your appointment request.";
        }
        return;
      }

      var nameField = form.querySelector("[name='name']");
      var serviceField = form.querySelector("[name='service']");
      var name = nameField ? nameField.value.trim() : "";
      var service = serviceField ? serviceField.value : "your request";
      var subject = encodeURIComponent(
        "Appointment request — " + service + (name ? " — " + name : "")
      );
      var bodyText = encodeURIComponent(
        "Name: " + name + "\n" +
        "Service required: " + service + "\n" +
        "Preferred date: " + ((form.querySelector("[name='date']") || {}).value || "-") + "\n" +
        "Contact: " + ((form.querySelector("[name='phone']") || {}).value || "-") + "\n" +
        "Email: " + ((form.querySelector("[name='email']") || {}).value || "-") + "\n\n" +
        "Message:\n" + (((form.querySelector("[name='message']") || {}).value) || "-")
      );

      if (status) {
        status.className = "form-status is-visible form-status--ok";
        status.textContent =
          "Thank you — your request for \"" + service + "\" has been prepared. " +
          "Your email app will open with the details so you can send them to our clinic team. " +
          "For urgent matters please call or WhatsApp us directly.";
      }

      var mailto = "mailto:info@birajimedicine.com.np?subject=" + subject + "&body=" + bodyText;
      window.location.href = mailto;
      form.reset();
    });
  });

  /* --------------------------------------------- Newsletter / simple forms */
  doc.querySelectorAll("[data-simple-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      var input = form.querySelector("input[type='email']");
      if (!input || !input.value.trim()) {
        if (status) {
          status.className = "form-status is-visible form-status--err";
          status.textContent = "Please enter your email address.";
        }
        return;
      }
      if (status) {
        status.className = "form-status is-visible form-status--ok";
        status.textContent = "Thank you. We will contact you shortly.";
      }
      form.reset();
    });
  });
})();
