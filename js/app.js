$(function () {
  var timers = [];
  var booted = false;

  $(".year").text(new Date().getFullYear());

  // ---- Boot sequence -------------------------------------------------------
  timers.push(
    setTimeout(function () {
      $("#boot").hide();
      typeWriter();
    }, 4000)
  );

  timers.push(
    setTimeout(function () {
      $("#prompt").hide();
    }, 7000)
  );

  timers.push(setTimeout(finishBoot, 10000));

  function finishBoot() {
    if (booted) return;
    booted = true;
    timers.forEach(clearTimeout);
    $("#boot, #prompt, #loading").hide();
    playWelcome();
  }

  // Browsers block autoplay until the visitor interacts, so retry on first input
  function playWelcome() {
    var audio = $("#welcome")[0];
    var p = audio.play();
    if (p && p.catch) {
      p.catch(function () {
        $(document).one("pointerdown keydown", function () {
          audio.play().catch(function () {});
        });
      });
    }
  }

  // ---- BIOS setup (Del during boot) ----------------------------------------
  var inBios = false;
  var biosScreen = "warning";
  var biosSel = 0;
  var biosClock;
  var hints = [
    "Standard CMOS setup for changing time, date, hard disk type, etc.",
    "Advanced CMOS setup for typematic rate, boot sequence, shadow RAM, etc.",
    "Advanced chipset setup for wait states, cache and memory timing.",
    "Load BIOS defaults. (Locked)",
    "Load power-on defaults. (Locked)",
    "Change the setup password. (There isn't one. There never was.)",
    "Format, verify and set interleave on hard disks. (Absolutely not.)",
    "Save settings to CMOS and reboot.",
    "Leave setup without saving and continue booting."
  ];
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function showBiosScreen(name) {
    biosScreen = name;
    $(".bios-screen").removeClass("on");
    $("#bios-" + name).addClass("on");
    $("#bios-dialog").hide();
    $("#bios-screen-name").text(
      name === "standard" ? "STANDARD CMOS SETUP" :
      name === "warning" ? "WARNING INFORMATION" : "WEBBIOS SETUP UTILITIES"
    );
  }

  function selectBiosItem(n) {
    var $items = $(".bios-menu li");
    biosSel = (n + $items.length) % $items.length;
    $items.removeClass("sel").eq(biosSel).addClass("sel");
    $("#bios-hint").text(hints[biosSel]);
  }

  function curious() {
    $("#bios-dialog").show();
  }

  function enterBios() {
    inBios = true;
    timers.forEach(clearTimeout);
    timers = [];
    $("#bios").css("display", "flex");
    showBiosScreen("warning");
    selectBiosItem(0);
    var tick = function () {
      var d = new Date();
      $("#bios-time").text([d.getHours(), d.getMinutes(), d.getSeconds()].map(checkTime).join(" : "));
      $("#bios-date").text(days[d.getDay()] + ", " + months[d.getMonth()] + " " + checkTime(d.getDate()) + " " + d.getFullYear());
    };
    tick();
    biosClock = setInterval(tick, 1000);
  }

  function exitBios() {
    inBios = false;
    clearInterval(biosClock);
    $("#bios").hide();
    // Carry on from the WebDos prompt
    $("#boot").hide();
    $("#prompt").show();
    i = 0;
    typeWriter();
    timers.push(setTimeout(function () { $("#prompt").hide(); }, 3000));
    timers.push(setTimeout(finishBoot, 6000));
  }

  $(document).on("keydown", function (e) {
    if (!inBios) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var k = e.key;

    // Once the joke has landed, Esc carries on booting
    if ($("#bios-dialog").is(":visible")) {
      if (k === "Escape") exitBios();
      return;
    }

    if (biosScreen === "warning") {
      if (k === "Escape") exitBios();
      else showBiosScreen("main");
    } else if (biosScreen === "main") {
      if (k === "ArrowDown") selectBiosItem(biosSel + 1);
      else if (k === "ArrowUp") selectBiosItem(biosSel - 1);
      else if (k === "Escape") exitBios();
      else if (k === "F10") curious();
      else if (k === "Enter") runBiosItem();
    } else if (biosScreen === "standard") {
      if (k === "Escape") showBiosScreen("main");
      else if (["PageUp", "PageDown", "+", "-", "Enter"].indexOf(k) > -1) curious();
    }
  });

  function runBiosItem() {
    var act = $(".bios-menu li").eq(biosSel).data("act");
    if (act === "standard") showBiosScreen("standard");
    else if (act === "exit") exitBios();
    else curious();
  }

  // Mouse and touch support for visitors without a keyboard
  $(document).on("click", ".bios-menu li", function (e) {
    e.stopPropagation();
    selectBiosItem($(this).index());
    runBiosItem();
  });
  $("#bios").on("click", function () {
    if (biosScreen === "warning") showBiosScreen("main");
    else if ($("#bios-dialog").is(":visible")) exitBios();
    else curious();
  });

  // Phones have no Del key: tapping the "Press Del" line does the same
  $("#boot .footer").on("click", function () {
    if (!booted && !inBios) enterBios();
  });

  // Del enters setup while the machine is still booting
  // Esc skips the boot sequence; typing "start" + Enter jumps straight in
  $(document).on("keydown", function (e) {
    if (inBios) return;
    if (!booted && $("#boot").is(":visible") && (e.key === "Delete" || e.key === "Del")) {
      e.preventDefault();
      enterBios();
      return;
    }
    if (!booted && e.key === "Escape") finishBoot();
  });

  $("#key").on("keydown", function (e) {
    if (e.key === "Enter" && $(this).val().trim().toLowerCase() === "start") {
      $("#boot, #prompt").hide();
      timers.forEach(clearTimeout);
      timers = [setTimeout(finishBoot, 3000)];
    }
  });

  // Typing start
  var i = 0;
  var txt = "start";
  var speed = 150;

  function typeWriter() {
    var key = document.getElementById("key");
    if (i === 0) key.value = "";
    if (i < txt.length) {
      key.value += txt.charAt(i);
      i++;
      timers.push(setTimeout(typeWriter, speed));
    }
  }

  // ---- Clock ---------------------------------------------------------------
  document
    .getElementById("timetip")
    .setAttribute("title", new Date().toLocaleDateString());

  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = checkTime(today.getMinutes());
    var hd = h % 12 === 0 ? 12 : h % 12;
    $("#timetip").html(hd + ":" + m + " " + (h < 12 ? "AM" : "PM"));
    setTimeout(startTime, 1000);
  }

  function checkTime(n) {
    return n < 10 ? "0" + n : n;
  }

  startTime();

  // ---- Start menu ----------------------------------------------------------
  $(".start-button").on("click", function (e) {
    e.stopPropagation();
    $(".start-menu").css(
      "display",
      $(".start-menu").css("display") === "none" ? "grid" : "none"
    );
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".start-menu").length) {
      $(".start-menu").css("display", "none");
    }
  });

  $(".start-menu-items ul a:not(#shutdown)").on("click", function (e) {
    e.preventDefault();
    $(".start-menu").css("display", "none");
    openApp($(this).data("app"));
  });

  // Shutdown (Reload)
  $(".shutdown").on("click", function (e) {
    e.preventDefault();
    location.reload();
  });

  // ---- Desktop icons -------------------------------------------------------
  $(".icon-content").draggable({ handle: "img" });

  $(".icon-content").on("dblclick", function () {
    openApp($(this).data("app"));
  });

  // Enter opens a focused icon; single tap opens on touch screens
  $(".icon-content").on("keydown", function (e) {
    if (e.key === "Enter") openApp($(this).data("app"));
  });

  var isTouch = window.matchMedia("(pointer: coarse)").matches;
  if (isTouch) {
    $(".icon-content").on("click", function () {
      openApp($(this).data("app"));
    });
  }

  // ---- Windows -------------------------------------------------------------
  var zTop = 100;
  var cascade = 0;
  var isSmall = function () {
    return window.innerWidth < 700;
  };

  function openApp(app) {
    var $existing = $('.window[data-app="' + app + '"]');
    if ($existing.length) {
      $existing.css("display", "flex");
      focusWindow($existing);
      return;
    }

    var $tpl = $("#app-" + app);
    if (!$tpl.length) return;
    var title = $tpl.data("title");

    var $win = $($("#tpl-window").html());
    $win.attr("data-app", app).attr("aria-label", title);
    $win.find(".title").text(title);
    $win.find(".content").html($tpl.html());

    var offset = (cascade++ % 5) * 28;
    $win.css({ top: 20 + offset + "px", left: 40 + offset + "px" });
    if (app === "app") $win.addClass("small");
    if (isSmall()) $win.addClass("maximize");

    $(".taskbar").before($win);
    $win.draggable({ handle: ".titlebar", containment: "body" });
    $win.css("display", "flex");

    var $task = $('<div class="task button"></div>')
      .attr("data-app", app)
      .text(title);
    $("#tasks").append($task);

    focusWindow($win);
  }

  function focusWindow($win) {
    $(".window").removeClass("active");
    $win.addClass("active").css("z-index", ++zTop);
    $("#tasks .task").removeClass("pressed");
    $('#tasks .task[data-app="' + $win.data("app") + '"]').addClass("pressed");
  }

  function closeWindow($win) {
    $('#tasks .task[data-app="' + $win.data("app") + '"]').remove();
    $win.remove();
  }

  $(document).on("mousedown touchstart", ".window", function () {
    focusWindow($(this));
  });

  $(document).on("click", ".window .close, .window .ok", function (e) {
    e.stopPropagation();
    closeWindow($(this).closest(".window"));
  });

  $(document).on("click", ".window .min", function (e) {
    e.stopPropagation();
    var $win = $(this).closest(".window");
    $win.hide();
    $('#tasks .task[data-app="' + $win.data("app") + '"]').removeClass("pressed");
  });

  $(document).on("click", ".window .max", function (e) {
    e.stopPropagation();
    $(this).closest(".window").toggleClass("maximize");
  });

  $(document).on("dblclick", ".window .titlebar", function () {
    $(this).closest(".window").toggleClass("maximize");
  });

  // Taskbar buttons: restore, focus, or minimise the window they belong to
  $(document).on("click", "#tasks .task", function () {
    var $win = $('.window[data-app="' + $(this).data("app") + '"]');
    if (!$win.is(":visible")) {
      $win.css("display", "flex");
      focusWindow($win);
    } else if ($win.hasClass("active") && $(this).hasClass("pressed")) {
      $win.hide();
      $(this).removeClass("pressed");
    } else {
      focusWindow($win);
    }
  });
});
