$(function () {
  // Handle bootscreen
  setTimeout(function () {
    $("#boot").hide();
    typeWriter();
  }, 2000);

  setTimeout(function () {
    $("#prompt").hide();
    $("#prompt").dblclick();
  }, 5000);

  setTimeout(function () {
    $("#loading").hide();
    $("#welcome")[0].play();
  }, 8000);

  // Typing start
  var i = 0;
  var txt = "start";
  var speed = 150;

  function typeWriter() {
    if (i < txt.length) {
      document.getElementById("key").value += txt.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  // Time tooltip
  var timeTip = new Date().toLocaleDateString();
  document.getElementById("timetip").setAttribute("title", timeTip);

  // Clock
  function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    var hd = h;
    $("#timetip").html(
      (hd = 0 ? "12" : hd > 12 ? hd - 12 : hd) +
        ":" +
        m +
        " " +
        (h < 12 ? "AM" : "PM")
    );
    t = setTimeout(function () {
      startTime();
    }, 500);
  }

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  startTime();

  // Start menu
  $(".start-button").click(function () {
    if ($(".start-menu").css("display") == "none") {
      $(".start-menu").css("display", "grid");
    } else {
      $(".start-menu").css("display", "none");
    }
  });

  // Active window
  $(".task").click(function () {
    if ($("#mainModal").css("display") == "flex") {
      $("#mainModal").css("display", "none");
      $(".task").css({
        border: "outset 2px",
        borderTop: "2px solid #deebf3",
        borderLeft: "2px solid #deebf3",
        borderRight: "2px solid black",
        borderBottom: "2px solid black",
      });
    } else {
      $("#mainModal").css("display", "flex");
      $(".task").css("border", "inset 2px");
    }
  });

  // Minimize window
  $(".min").click(function () {
    $("#mainModal").toggle();
    $(".task").css({
      border: "outset 2px",
      borderTop: "2px solid #deebf3",
      borderLeft: "2px solid #deebf3",
      borderRight: "2px solid black",
      borderBottom: "2px solid black",
    });
  });

  // Maximize window
  $(".max").click(function () {
    $(".window").toggleClass("maximize");
  });

  // Close window
  $(".close, .ok").click(function () {
    $(".start-menu").css("display", "none");
    $("#mainModal").css("display", "none");
    $(".task").css("display", "none");
  });

  // Make the desktop icons and modal window draggable
  $(".icon-content").draggable({
    handle: "img",
  });

  $("#mainModal").draggable({
    handle: ".titlebar",
  });

  // Shutdown (Reload)
  $(".shutdown").click(function () {
    location.reload();
  });

  // Open window
  $(".icon-content").dblclick(function () {
    let myVal = $(this).data("title");
    openModal(myVal);
  });

  $(".start-menu-items ul a:not(#shutdown)").click(function () {
    let myVal = $(this).data("title");
    openModal(myVal);
  });

  // Handle window content
  function openModal(myVal) {
    $(".start-menu").css("display", "none");
    $("#mainModal").find(".title").text(myVal);
    $(".task").text(myVal);

    if (myVal === "About me") {
      $(".content").html(`
      <div class="banner"></div>
      <hr>
  <p>I have been fascinated by computers since I was 10 years old. My first experience with programming was using QBASIC on a 386 MS-DOS machine, and by the age of 11, I had written my first program.</p>
  
  <p>I have over two decades of experience in the IT field, including hardware repair, software development, end-user support, graphic design, and management. I am currently employed by the South African Government as an IT Engineer and Web Developer, and also work as a freelance developer part-time.</p>
  
  <p>In my free time, I enjoy spending time with my family, playing guitar, watching professional skateboarding, or feeding my addiction to playing chess 😄</p>
  </p>
  `);
    }

    if (myVal === "My CV") {
      $(".content").html("");
    }

    if (myVal === "My Portfolio") {
      $(".content").html("");
    }

    if (myVal === "App") {
      $(".content").html(`
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="30%" height="auto" />
      <p>Webdows 9.5 V.29.02</p>
      <hr>
      <p>JavaScript version (no frameworks). To view this app in framework versions (React, Vue, Angular and Svelte), simply click on Start, Shut down and select the preferred boot method. (Coming soon)</p>
      <p>By Andre van Rensburg</p>
      <hr>
     `);
    }

    $("#mainModal").css("display", "flex");
    $(".task").css("display", "block");
  }
});
