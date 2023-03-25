<?php
session_start();
$hashedkey = '$2y$10$wU/dioEUrWu/8sNxo.HZ9.mDQorz59hSsPHOE/fgpFEltTEDI5Gc2';

if (isset($_SESSION["verified"]) && $_SESSION["verified"]) {
  header("Location: www.andrevanrensburg.co.za");
  # Check if a user has been previously verified first, in order to redirect them as quickly as possible.
}

if (isset($_POST["key"])) {
  $key = trim($_POST["key"]);
  $verifiedpassword = password_verify(
    base64_encode(
      hash("sha256", $key, true)
    ),
    $hashedkey
  );
  # Sanitized input to make it easier the enter in the password; it is very easy to strengthen these restrictions, or lessen them.
  if ($verifiedpassword) {
    $_SESSION["verified"] = true;
    $whitelist = ["/index.php"];
    # Add any other pages you wish to be accessible through the continue param.
    $nextpage = $_GET["continue"];
    if (isset($nextpage) && in_array($nextpage, $whitelist)) {
      header("Location: $nextpage");
    } else {
      header("Location: /");
    }
  } else {
    $error = "Bad command or file name";
  }
}
?>
<!DOCTYPE HTML>
<html>
  <head>
    <title>Andre van Rensburg | Portfolio</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <link href='http://fonts.googleapis.com/css?family=Consolas:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="verification.css">
  </head>
  <body id="console">
<div class="container-fluid">
  <div class="row">
    <div class="col-8">
      <p>System Configuration (c) 1998 - 2023 WebDos (Web Disk Operating System [Version 19.87]), <br/>
 Andre van Rensburg. All rights reserved.</p>
<br/>
<p>Intel 80386SX CPU at 40MHz<br/>
Memory Test : 2048KB<br/>
Detecting IDE Primary Master : None<br/>
Detecting IDE Primary Slave : None<br/>
Detecting IDE Secondary Master : None<br/>
Detecting IDE Secondary Slave : None</p>
    </div>
    <div class="col-4">
      <img src="img/es.png" class="float-right" data-credit="Property of ENERGY STAR&#174;" style="filter: invert(100%);" width="70%" height="auto">
    </div>
  </div>
</div>
  <div>
  <div class="row align-items-end"">
    <div class="col-12">
<p class="footer">Press Del to enter setup.<br/>
15/04/87-dsakd32r.43834ksa.134931</p></div>
</div>
</div>


<script>
var i = 0;
var txt = 'start site';
var speed = 150;
function typeWriter() {
  if (i < txt.length) {
    document.getElementById("key").value += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
      setTimeout(function() {
document.getElementById("go").click(); 
}, 1500);
}

      setTimeout(function() {
     document.getElementById("console").innerHTML = `
<div class="container-fluid">
  <div class="row">
    <div class="col-12">
<table class="table table-sm table-bordered">
<tr>
<th colspan="2">System Configuration (c) 1998 - 2023 WebDos (Web disk Operating System [Version 19.87]), Andre van Rensburg. All rights reserved.</th>
</tr>
<tr>
<td>Main Processor: 80386SX</td><td>Base Memory Size: 640KB</td>
</tr>
<tr rowspan="2">
<td>Numeric Processor: 80387SX</td><td>Extended Memory Size: 1408KB</td>
</tr>
<tr rowspan="2">
<td>Cache Size: 64KB</td><td>Hard Disk Type: Local Storage</td>
</tr>
<tr rowspan="2">
<td>BIOS Date: 15/04/87</td><td>Display Type: VGA</td>
</tr>
</table>
<div>
      <p>Type "start site" and hit enter to load the GUI.</p>
        <form action="Wos.php<?php if (isset($_GET["continue"])) echo "?continue=" . htmlentities($_GET["continue"]); ?>" method="post" autocomplete="off">
          <p>Portfolio:\\><input type="text" name="key" id="key" onfocus="typeWriter()" autofocus></p>
          <input type="submit" value="Verify" id="go" hidden>
        </form>
        <?php if (isset($error)) echo "    <p>$error</p>\n"; ?>
    </div>
</div>
</div>
</div>
`;
       }, 3000);

typeWriter();

   </script>

<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  </body>
</html>
