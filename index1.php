<?php
session_start();
if ($_SESSION["verified"]) {
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="Portfolio of Andre van Rensburg">
    <meta name="author" content="Andre van Rensburg">
    <title>Portfolio | Andre van Renburg</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/themes/base/jquery-ui.min.css">
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

<style>

#loading {
  z-index: 1;
  overflow: hidden;
  background: url("img/loading.png") no-repeat center center fixed; 
  background-size: cover;
  display: flex;
  height: 100vh;
  justify-content: center;
}

a {
         color: #000000;
         text-decoration: none !important;
}

 .underline {
	 text-decoration: underline;
}
.button {
    background: #c3c6cd;
    border: outset 2px; 
    position: relative;
    border-top: 2px solid #deebf3;
    border-left: 2px solid #deebf3;
    border-right: 2px solid black;
    border-bottom: 2px solid black;
    text-align: center;
    margin: 3px;
    padding: 4px;
    font-size: 14px;
    font-weight: bold;
}
.button:active {
  border: inset 2px;
}
.task {
  display: none;
  position:absolute;
  left: 50px;
  border: inset 2px;
  background: #c3c6cd;
	 margin: 3px;
	 text-align: center;
         padding: 4px;
	 font-size: 14px;
	 font-weight: bold;
}

.monitor {
	 position: relative;
	 width: 100%;
	 height: 100%;
	 background: #008080;
	 margin: auto;
         font-family: tahoma;
         display: flex;
         flex-direction: column;
        
}
.icon-content {
        padding: 10px;
        position: absolute;
        height: 150px;
        width: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
}
.icon-content a {
	 color: white;
	 font-size: 15px;
	 margin-top: 5px;
	 margin-bottom: 0;
         text-align: center;
}
.about {
        top: 10px;
}
.cv {
        top: 110px;
}
.portfolio {
        top: 210px;
}

 .taskbar {
	 position: fixed;
	 bottom: 0;
	 width: 100%;
	 height: 35px;
	 background: #c3c6cd;
	 border-top: 3px solid #deebf3;
	 display: flex;
	 justify-content: space-between;
}
 .taskbar-time {
	 height: 72%;
	 background: #c3c6cd;
	 border-top: 2px solid #85888f;
	 border-left: 2px solid #85888f;
	 border-right: 2px solid #deebf3;
	 border-bottom: 2px solid #deebf3;
	 margin: 3px;
	 display: flex;
	 align-items: center;
}
.taskbar-time i {
         padding: 3px;
}
 .taskbar-time-text {
	 margin: auto;
	 font-size: 12px;
         padding: 3px;
}
 .start-button {
	 background: #c3c6cd;
	 margin: 3px;
	 text-align: center;
         padding: 4px;
	 font-size: 14px;
	 font-weight: bold;
}
 .start-menu {
	 background: #c3c6cd;
	 border-top: 2px solid #deebf3;
	 border-left: 2px solid #deebf3;
	 border-right: 2px solid black;
	 border-bottom: 2px solid black;
	 display: none; 
	 position: fixed;
	 bottom: 35px;
  grid-template-areas:
    'menuside menuitems';
  grid-template-columns: 15% 85%;
  width: 50%;
}
 .start-menu-side {
	 background: #85888f;
         grid-area: menuside;
}
 .start-menu-side-text {
	 position: relative;
}
 .start-menu-side-text .windows {
	 font-weight: bold;
	 color: #c3c6cd;
	 transform: rotate(270deg);
}
 .start-menu-side-text .ninefive {
	 font-weight: bold;
         color: white;
	 transform: rotate(270deg);
	 margin-bottom: 60px;
}
 .start-menu-items {
	 padding: 0;
         grid-area: menuitems;
}
 .start-menu-items .icon {
	 width: 30px;
	 height: 30px;
	 padding-left: 5px;
	 padding-right: 5px;
}
 .start-menu-items-item {
	 font-size: 12px;
	 padding-top: 3px;
	 padding-bottom: 3px;
	 width: 100%;
	 height: 100%;
	 display: flex;
	 align-items: center;
}
 .start-menu-items-item:hover {
	 background: #00207d;
         color: #ffffff;
}
 .start-menu-items-list1 {
	 margin: 0;
	 padding: 0;
	 border-bottom: 1px solid #85888f;
}
 .start-menu-items-list2 {
	 margin: 0;
	 padding: 0;
	 border-top: 1px solid #deebf3;
}
.window {
  display: none;
  position: absolute;
  background: #c0c0c0;
  width: 80%;
  min-height: 200px;
  border: outset 2px;
  flex-direction: column;
}
.window .titlebar {
  background: #000080;
  height: 26px;
  border: none;
  color: #fff;
  font-size: 14px;
  line-height: 22px;
  padding-left: 5px;
  display: flex;
  justify-content: space-between;
}
.titlebar-buttons {
    display: flex;
}
.footer-buttons {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px;
}
.titlebar-button {
    background: #c0c0c0;
    position: relative;
    height: 16px;
    width: 16px;
    border-width: 1px;
    border-style: solid;
    border-color: #fff #000 #000 #fff;
    margin-right: 1px;
    margin-top: 2px;
}
.titlebar-button:active {
  border: inset 1px;
}
.min:after {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M5 10h6v2H5z'/%3E%3C/svg%3E") no-repeat center center;
  }

.max:after {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14'%3E%3Cpath d='M4 4v8h9V4H4zm1 2h7v5H5V6z'/%3E%3C/svg%3E") no-repeat center center;
  }

.close:after {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 16' width='9' height='8'%3E%3Cpath d='M0 1l7 7-7 7h4l5-5 5 5h4l-7-7 7-7h-4L9 6 4 1z'/%3E%3C/svg%3E") no-repeat center center;
  }

.content-body {
  top: 22px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 15px;
  overflow-y: scroll;
}

.content {
  top: 22px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 10px;
  overflow: hidden;
  min-height: 250px;
}

.maximize {
  position: fixed;
  top: 0px !important;
  left: -1px !important;
  width: 100%;
  height: 100%;
}

@media only screen and (min-width: 600px) {
  .start-menu {
   width: 20%;
   }
}
</style>
</head>
<body class="monitor">

<div id="loading"></div>

<div class="icon-content about" title="About me" data-title="About me" data-modal="#mainModal">
<img src="img/aboutme.png" width="50px" height="50px" data-title="About me">
<a data-title="About me">About Me</a>
</div>

<div class="icon-content cv" title="My CV" data-title="My CV" data-modal="#mainModal">
<img src="img/cv.png" width="50px" height="50px" data-title="My CV">
<a data-title="My CV">My CV</a>
</div>

<div class="icon-content portfolio" title="My Portfolio" data-title="My Portfolio" data-modal="#mainModal">
<img src="img/portfolio.png" width="50px" height="50px" data-title="My Portfolio">
<a data-title="My Portfolio">My Portfolio</a>
</div>

<div class="window" id="mainModal">
   <div class="titlebar">
        <span class="title"></span>
       <div class="titlebar-buttons">
          <div class="titlebar-button min"></div>
          <div class="titlebar-button max"></div>
          <div class="titlebar-button close"></div>
      </div>
  </div>
  <div class="content-body">
     <div class="content">
     </div>
  </div>
  <div class="footer-buttons">
         <button class="button" id="ok">OK</button>
  </div>
</div>

 <div class="taskbar" title="Start">
      <div class="start-button button">
         Start
      </div>
      <div class="task" id="task">Modal title</div>
      <div class="taskbar-time">
        <i class="devicon-react-original" title="View in React"></i>
        <i class="devicon-vuejs-plain" title="View in Vue"></i>
        <i class="devicon-angularjs-plain" title="View in Angular"></i>
        <i class="devicon-svelte-plain" title="View in Svelte"></i>
        <p class="taskbar-time-text" id="timetip">
        </p>
      </div>
    </div>

       <div class="start-menu">
       <div class="start-menu-side">
         <div class="start-menu-side-text text">
           <p class="ninefive">9.5</p>
           <p class="windows">Webdows</p>
         <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="100%" height="auto" />
         </div>
       </div>

       <div class="start-menu-items">

         <ul class="start-menu-items-list1">
           <a class="start-menu-items-item-title" data-title="About Me" title="About Me">
            <li class="start-menu-items-item">
            <div class="icon"/><img src="img/aboutme.png" width="100%" height="auto" /></div>
             <p>About <span class="underline">M</span>e</p>
            </li>
            </a>
           <a class="start-menu-items-item-title" data-title="My CV" title="My CV">
            <li class="start-menu-items-item">
            <div class="icon"/><img src="img/cv.png" width="100%" height="auto" /></div>
             <p>My <span class="underline">C</span>V</p>
            </li>
            </a>
            <a class="start-menu-items-item-title" data-title="My Portfolio" title="My Portfolio">
            <li class="start-menu-items-item">
            <div class="icon"/><img src="img/portfolio.png" width="100%" height="auto" /></div>
             <p>My <span class="underline">P</span>ortfolio</p>
            </li>
            </a>
         </ul>

         <ul class="start-menu-items-list2">
           <a href="#" id="app" class="start-menu-items-item-title" title="App" data-title="App" data-modal="#mainModal">
            <li class="start-menu-items-item">
            <div class="icon"/><img src="img/about.png" width="100%" height="auto" /></div>
             <p><span class="underline">A</span>bout...</p>
            </li>
            </a>
           <a href="/reboot.php" class="start-menu-items-item-title" title="Shut down">
            <li class="start-menu-items-item">
            <div class="icon"/><img src="img/shutdown.png" width="100%" height="auto" /></div>
             <p>Sh<span class="underline">u</span>t Down... </p>
            </li>
            </a>
         </ul>

       </div>
    </div>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js"></script>
<script>

$(function(){
  
  setTimeout(function(){
    $("#loading").hide();
}, 5000);

// time tooltip
var timeTip = new Date().toLocaleDateString();
document.getElementById('timetip').setAttribute('title', timeTip );

// clock
function startTime() {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();
        // add a zero in front of numbers<10
        m = checkTime(m);
        s = checkTime(s);
        var hd = h;
        $('#timetip').html((hd = 0 ? "12" : hd > 12 ? hd - 12 : hd) + ":" + m + " " + (h < 12 ? "AM" : "PM"));
        t = setTimeout(function () { startTime() }, 500);
    }

    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

startTime();

// start menu
$('.start-button').click(function () {
         if ($(".start-menu").css("display") == "none"){
            $(".start-menu").css("display", "grid");
         } else {
            $(".start-menu").css('display','none');
         }
});

// active window
$('.task').click(function () {
         if ($("#mainModal").css("display") == "flex"){
         $("#mainModal").css("display", "none");
         $(".task").css({
         "border": "outset 2px",
         "borderTop": "2px solid #deebf3",
	       "borderLeft": "2px solid #deebf3",
	       "borderRight": "2px solid black",
	       "borderBottom": "2px solid black"
         });
         } else {
         $("#mainModal").css("display", "flex");
         $(".task").css("border", "inset 2px");
       }
});

$('.min').click(function () {
     $("#mainModal").toggle();
      $(".task").css({
         "border": "outset 2px",
         "borderTop": "2px solid #deebf3",
	       "borderLeft": "2px solid #deebf3",
	       "borderRight": "2px solid black",
	       "borderBottom": "2px solid black"
         });
});

$('.max').click(function () {
      $(".window").toggleClass("maximize");
});

$('.close').click(function () {
     $(".start-menu").css("display", "none");
     $("#mainModal").css("display", "none");
     $(".task").css("display", "none");
});

$('#ok').click(function () {
     $(".start-menu").css("display", "none");
     $("#mainModal").css("display", "none");
     $(".task").css("display", "none");
});

// Make the desktop icons and modal window draggable
$(".icon-content").draggable({
  handle: "img",
});

$('#mainModal')
  .resizable({
    handles: 'n, e, s, w, ne, sw, se, nw',
  })
  .draggable({
    handle: '.titlebar'
  });

$('.icon-content').dblclick(function() {
    let myVal = $(this).data('title');
    openModal(myVal);
    $("#shutdown").remove();
});

$('.start-menu-items ul a').click(function () {
    let myVal = $(this).data('title');
    openModal(myVal);
    $("#shutdown").remove();
});

$("#app").click(function(){
    $("#ok").prepend('<button id="shutdown" href="/reboot.php" class="button">Shut down</button>');
});

function openModal (myVal) {
    $(".start-menu").css("display", "none");
    $('#mainModal').find(".title").text(myVal);
    $('.task').text(myVal);

   if (myVal === "About me") {
     $(".content").html(`
<img src="img/pp.jpg">
<p>I have been fascinated by computers since I was 10 years old. My first experience with programming was using QBASIC on a 386 MS-DOS machine, and by the age of 11, I had written my first program.</p>

<p>I have over two decades of experience in the IT field, including hardware repair, software development, end-user support, graphic design, and management. I am currently employed by the South African Government as an IT Engineer and Web Developer, and also work as a freelance developer part-time. </p>

<p>In my free time, I enjoy spending time with my family, playing guitar, watching professional skateboarding, playing chess, and exploring new technologies such as graphic design, digital marketing, and block chain development. I am currently working on an NFT project to honour the late Nelson Mandela.</p>
</p>
`);
}

   if (myVal === "My CV") {
     $(".content").html(' <embed src="pdf/fullcv.pdf" width="100%" height="100%" />');
   }

   if (myVal === "My Portfolio") {
     $(".content").html(' <embed src="pdf/poe.pdf" width="100%" height="100%" />');
   } 

   if (myVal === "App") {
     $(".content").html(`
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="10%" height="auto" />
    <p>Webdows 9.5 V.29.02</p>
    <hr>
    <p>JavaScript version (no frameworks). To view this app in framework versions (React, Vue, Angular and Svelte), simply click on Start, Shut down and select the preferred boot method.</p>
    <p>By Andre van Rensburg</p>
    <hr>
   `);
   } 

$('#mainModal').css("display", "flex");
$(".task").css("display", "block");
}
   
});
</script>
</body>
</html>
<?php
} else {
  header("Location: /Wos.php?continue=" . $_SERVER["SCRIPT_NAME"]);
}
?>