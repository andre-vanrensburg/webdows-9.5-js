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
  var biosScreen = "main";
  var biosSel = 0;
  var biosClock;
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function showBiosScreen(name) {
    biosScreen = name;
    $(".bios-screen").removeClass("on");
    $("#bios-" + name).addClass("on");
    $("#bios-dialog").hide();
    $("#bios-screen-name").text(name === "standard" ? "STANDARD CMOS SETUP" : "CMOS SETUP UTILITY");
  }

  function selectBiosItem(n) {
    var $items = $(".bios-menu li");
    biosSel = (n + $items.length) % $items.length;
    $items.removeClass("sel").eq(biosSel).addClass("sel");
    $("#bios-hint").text($items.eq(biosSel).data("hint"));
  }

  function curious() {
    $("#bios-dialog").show();
  }

  function enterBios() {
    inBios = true;
    timers.forEach(clearTimeout);
    timers = [];
    $("#bios").css("display", "flex");
    showBiosScreen("main");
    selectBiosItem(0);
    var tick = function () {
      var d = new Date();
      $("#bios-time").text([d.getHours(), d.getMinutes(), d.getSeconds()].map(checkTime).join(" : "));
      $("#bios-date").text(days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear());
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

  function runBiosItem() {
    var act = $(".bios-menu li").eq(biosSel).data("act");
    if (act === "standard") showBiosScreen("standard");
    else if (act === "exit") exitBios();
    else curious();
  }

  $(document).on("keydown", function (e) {
    if (!inBios) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    var k = e.key;
    var perCol = 6;

    // Once the joke has landed, Esc carries on booting
    if ($("#bios-dialog").is(":visible")) {
      if (k === "Escape") exitBios();
      return;
    }

    if (biosScreen === "main") {
      if (k === "ArrowDown") selectBiosItem(biosSel + 1);
      else if (k === "ArrowUp") selectBiosItem(biosSel - 1);
      else if (k === "ArrowRight" || k === "ArrowLeft") selectBiosItem((biosSel + perCol) % (perCol * 2));
      else if (k === "Escape") exitBios();
      else if (k === "Enter") runBiosItem();
      else if (k === "F10" || k === "F2") curious();
    } else if (biosScreen === "standard") {
      if (k === "Escape") showBiosScreen("main");
      else if (["PageUp", "PageDown", "+", "-", "Enter"].indexOf(k) > -1) curious();
    }
  });

  // Mouse and touch support for visitors without a keyboard
  $(document).on("click", ".bios-menu li", function (e) {
    e.stopPropagation();
    selectBiosItem($(".bios-menu li").index(this));
    runBiosItem();
  });
  $("#bios").on("click", function () {
    if ($("#bios-dialog").is(":visible")) exitBios();
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
    if (!booted && ($("#boot").is(":visible") || $("#prompt").is(":visible")) && (e.key === "Delete" || e.key === "Del")) {
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
    if (!$(e.target).closest(".start-menu").length) closeStartMenu();
  });

  // Start menu items: real apps open, everything else gets the curious-mind treatment
  $(".start-menu").on("click", "li", function (e) {
    e.stopPropagation();
    var $li = $(this);
    if ($li.hasClass("has-sub")) {
      // Touch screens can't hover, so a tap toggles the flyout
      $(".start-menu li.has-sub").not($li).removeClass("sub-open");
      $li.toggleClass("sub-open");
      return;
    }
    if ($li.is("#shutdown")) {
      location.reload();
      return;
    }
    closeStartMenu();
    if ($li.data("app")) openApp($li.data("app"));
    else if ($li.data("curious")) curiousWindow($li.find("p").first().text().trim());
  });

  function closeStartMenu() {
    $(".start-menu").css("display", "none");
    $(".start-menu li.has-sub").removeClass("sub-open");
  }

  function curiousWindow(name) {
    openApp("curious", {
      title: "Webdows",
      html:
        '<div class="curious"><i class="fa-solid fa-circle-info"></i><div>' +
        "<p><strong>" + $("<span>").text(name).html() + "</strong></p>" +
        "<p>You curious mind, you.</p>" +
        "<p>I never set out to rebuild all of Windows. Webdows runs About Me, Minesweeper and this message, and that's the whole operating system.</p>" +
        "</div></div>"
    });
  }

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

  // ---- Framework editions (tray icons) --------------------------------------
  // Flip ready to true as each edition is deployed to /<edition>/
  var EDITIONS = {
    react: { name: "React", ready: false },
    vue: { name: "Vue", ready: false },
    angular: { name: "Angular", ready: false },
    svelte: { name: "Svelte", ready: false }
  };

  $(".tray-edition").on("click", function () {
    var key = $(this).data("edition");
    var ed = EDITIONS[key];
    if (!ed) return;
    if (!ed.ready) {
      openApp("soon", {
        title: "Webdows " + ed.name + " Edition",
        html:
          '<p><strong>Webdows 9.5 ' + ed.name + ' Edition</strong></p><hr>' +
          '<p>This machine will soon reboot into a version of Webdows rebuilt in ' + ed.name +
          '. Same PC, same BIOS, different engine under the hood. Check back soon.</p>'
      });
      return;
    }
    $(".window").remove();
    $("#tasks").empty();
    $("#reboot-text").text("Shutting down Webdows... Rebooting into the " + ed.name + " Edition.");
    $("#reboot").show();
    setTimeout(function () {
      location.href = "/" + key + "/";
    }, 1500);
  });

  // ---- Windows -------------------------------------------------------------
  var zTop = 100;
  var cascade = 0;
  var isSmall = function () {
    return window.innerWidth < 700;
  };

  function openApp(app, custom) {
    var $existing = $('.window[data-app="' + app + '"]');
    if ($existing.length) {
      if (custom) $existing.find(".title").text(custom.title).end().find(".content").html(custom.html);
      $existing.css("display", "flex");
      focusWindow($existing);
      return;
    }

    var $tpl = $("#app-" + app);
    if (!$tpl.length && !custom) return;
    var title = custom ? custom.title : $tpl.data("title");

    var $win = $($("#tpl-window").html());
    $win.attr("data-app", app).attr("aria-label", title);
    $win.find(".title").text(title);
    $win.find(".content").html(custom ? custom.html : $tpl.html());

    var offset = (cascade++ % 5) * 28;
    $win.css({ top: 20 + offset + "px", left: 40 + offset + "px" });
    if (app === "app" || app === "soon" || app === "curious") $win.addClass("small");
    if (app === "minesweeper") {
      $win.addClass("fit");
      $win.find(".max").remove();
      $win.find(".footer-buttons").remove();
      $win.find(".content").empty();
      var game = window.Minesweeper.mount($win.find(".content")[0], {
        onExit: function () { closeWindow($win); }
      });
      $win.data("game", game);
    }
    if (isSmall() && app !== "minesweeper") $win.addClass("maximize");

    $(".taskbar").before($win);
    // Small, fixed-size windows open centred rather than under the pointer
    if ($win.hasClass("fit") || $win.hasClass("small")) {
      $win.css({
        left: Math.max(0, (window.innerWidth - $win.outerWidth()) / 2) + "px",
        top: Math.max(0, (window.innerHeight - 40 - $win.outerHeight()) / 3) + "px"
      });
    }
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
    if ($win.data("game")) $win.data("game").destroy();
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
