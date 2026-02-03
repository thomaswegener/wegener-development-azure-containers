<?php
ob_start();
$con = connect(); 
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set('display_startup_errors', 1);
if (!isset($_GET['lang']))
{
    $lang = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    switch($lang) 
    {
        case "no-NO":
            $language = "no";
            break;
        default:
            $language = "eng";
            break;
    }
}
else
{
        $language = $_GET['lang'];
}
if (!isset($_GET['type']))
{
    $type = "all";
}
else
{
        $type = $_GET['type'];
}
?>

<!DOCTYPE html>
<html>
<head>
  
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
  <link rel="shortcut icon" href="assets/images/logo-96x96.png" type="image/x-icon">
  <meta name="description" content="">
  
  
  <title>Pirate Husky</title>
  <link rel="stylesheet" href="assets/web/assets/mobirise-icons2/mobirise2.css">
  <link rel="stylesheet" href="assets/tether/tether.min.css">
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-grid.min.css">
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-reboot.min.css">
  <link rel="stylesheet" href="assets/dropdown/css/style.css">
  <link rel="stylesheet" href="assets/formstyler/jquery.formstyler.css">
  <link rel="stylesheet" href="assets/formstyler/jquery.formstyler.theme.css">
  <link rel="stylesheet" href="assets/datepicker/jquery.datetimepicker.min.css">
  <link rel="stylesheet" href="assets/socicon/css/styles.css">
  <link rel="stylesheet" href="assets/theme/css/style.css">
  <link rel="stylesheet" href="assets/recaptcha.css">
  <link rel="preload" as="style" href="assets/mobirise/css/mbr-additional.css"><link rel="stylesheet" href="assets/mobirise/css/mbr-additional.css" type="text/css">

</head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-44MD1NFB5G"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-44MD1NFB5G');

  document.addEventListener('DOMContentLoaded', function () {
  if (window.innerWidth <= 768) {
    document.querySelectorAll('.dropdown').forEach(function (dropdown) {
      dropdown.classList.add('show');
      var menu = dropdown.querySelector('.dropdown-menu');
      if (menu) {
        menu.classList.add('show');
      }
    });
  }
});
</script>

<script>
  var APP_ID = "be2fe3c25c47b2840d1b6615f60c2f0ad77e3074e0480632ef2b8d67350c41b3";
  var WIDGET_ID = "rAmxnqK3jlhQF2Y";

  if (typeof window.outventuresSettings === "undefined") {
    window.outventuresSettings = [];
  }

  // Floating button configuration
  window.outventuresSettings.push({
    base_url: "https://app.outventures.se/widget/",
    app_id: APP_ID,
    widget_id: WIDGET_ID,
    floating: true, // Keep this as true for the floating button
    btn_text: { "en": "Book Now" },
    btn_style: { "size": "large", "bg": "#0B0911", "color": "#ffffff" },
    list_view: "calendar",
    product_types: ["products", "vouchers"],
  });
</script>

<!-- Load the widget script only once -->
<script id="ovbs-scriptrAmxnqK3jlhQF2Y">
  var w = window;
  var d = document;
  var l = function () {
    var s = d.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "https://app.outventures.se/widget/widget.js";
    if (document.querySelectorAll('[src="' + s.src + '"]').length == 0) {
      var x = d.getElementsByTagName("script")[0];
      x.parentNode.insertBefore(s, x);
    }
  };
  if (w.attachEvent) {
    w.attachEvent("onload", l);
  } else {
    w.addEventListener("load", l, false);
  }
</script>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    // Function to find the floating button by its ID
    function findFloatingButton() {
      return document.getElementById('ovbs-btnrAmxnqK3jlhQF2Y');
    }

    // Add click event listener to the "Book Now" menu item
    document.getElementById('menu-book-item').addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default anchor behavior (no page reload)

      // Attempt to find the floating button when the menu item is clicked
      var floatingButton = findFloatingButton();
      
      // Check if the floating button exists
      if (floatingButton) {
        // Simulate a click on the floating button
        floatingButton.click();
      } else {
        console.log("Floating button not found");
      }
    });
  });
</script>



<body>
  
  <section class="menu menu3 cid-st4JIdC9pW" once="menu" id="menu3-1">
    
    <nav class="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
        <div class="container">
            <div class="navbar-brand">
                <span class="navbar-logo">
                    <a href="https://piratehusky.no/<?php if (isset($_GET['lang'])) {echo 'index.php?&lang='. $_GET['lang'];} ?>">
                        <img src="assets/images/logo.png" alt="" style="height: 4rem;">
                    </a>
                </span>
                <span class="navbar-caption-wrap"><a class="navbar-caption text-black text-primary display-7" href="https://piratehusky.no">PIRATE <span style="font-weight:400">HUSKY</span></a></span>
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            <?php

if (isset($_GET['lang']) && $_GET['lang'] === "no") 
{
?>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav nav-dropdown nav-right" data-app-modern-menu="true">
                    


                    <li class="nav-item"> 
                        <a id="menu-book-item" class="nav-link link text-black text-primary display-4" href="#" aria-expanded="false">Aktiviteter</a>
                    </li>


                    <li class="nav-item dropdown">
                        <a class="nav-link link text-black dropdown-toggle display-4" href="index.php?page=accommodation&lang=no" data-toggle="dropdown-submenu" aria-expanded="false">Overnatting</a>
                            <div class="dropdown-menu">
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=accommodation&lang=no#camp">Camp Husky</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=accommodation&lang=no#lodge">Lodgen</a>
                            </div>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link link text-black dropdown-toggle display-4" href="index.php?page=expedition&type=all&lang=no" data-toggle="dropdown-submenu" aria-expanded="false">Overnattingstur</a>
                            <div class="dropdown-menu">
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=expedition&type=dog&lang=no#">Hundekjøring</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=expedition&type=hike&lang=no#">Fotturer</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=expedition&type=kayakk&lang=no#">Kayakktur</a>
                            </div>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link link text-black dropdown-toggle display-4" href="index.php?page=about&lang=no" data-toggle="dropdown-submenu" aria-expanded="false">Om oss</a>
                            <div class="dropdown-menu">
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=no#about">Om oss</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=sustainability&lang=no">Bærekraft</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=no#guides">Guidene</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=no#dogs">Hundene våre</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=no#contact">Kontakt</a>
                            </div>
                    </li>
                    
                    <li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index.php?page=<?php if (isset($_GET['page'])) {echo $_GET['page'];}else{echo "about";}?>&lang=eng" aria-expanded="false"><img class="flag-img" width="20" height="15" src="assets/images/flags/gb.svg" alt="Flag of Norway"></a>
                    </li>



                </ul>
                                        
                <div class="icons-menu">
                    <a class="iconfont-wrapper" href="https://www.facebook.com/arcticpiratehusky" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-facebook socicon"></span>
                    </a>
                    <a class="iconfont-wrapper" href="https://www.instagram.com/piratehusky/" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-instagram socicon"></span>
                    </a>
                </div>   
            </div>
        </div>
    </nav>
</section>
<?php
}
else
{
?>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav nav-dropdown nav-right" data-app-modern-menu="true">
                    
                    <li class="nav-item"> 
                        <a id="menu-book-item" class="nav-link link text-black text-primary display-4" href="#" aria-expanded="false">Activities</a>
                    </li>



                    <li class="nav-item dropdown">
                        <a class="nav-link link text-black dropdown-toggle display-4" href="index.php?page=accommodation&lang=eng" data-toggle="dropdown-submenu" aria-expanded="false">Accommodation</a>
                            <div class="dropdown-menu">
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=accommodation&lang=eng#camp">Camp Husky</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=accommodation&lang=eng#lodge">The Lodge</a>
                            </div>
                    </li>




                    <li class="nav-item dropdown">
                        <a class="nav-link link text-black dropdown-toggle display-4" href="index.php?page=expedition&type=all&lang=eng" data-toggle="dropdown-submenu" aria-expanded="false">Over-Night Tours</a>
                            <div class="dropdown-menu">
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=expedition&type=dog&lang=eng#">Dog Sledding</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=expedition&type=hike&lang=eng#">Hiking</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=expedition&type=kayakk&lang=eng#">Kayakking</a>
                            </div>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link link text-black dropdown-toggle display-4" href="index.php?page=about&lang=eng" data-toggle="dropdown-submenu" aria-expanded="false">About</a>
                            <div class="dropdown-menu">
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=eng#about">About</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=sustainability&lang=eng">Sustainability</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=eng#guides">The guides</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=eng#dogs">Our dogs</a>
                                <a class="text-black dropdown-item text-primary display-4" href="index.php?page=about&lang=eng#contact">Contact</a>
                            </div>
                    </li>
                    
                    <li class="nav-item"><a class="nav-link link text-black text-primary display-4" href="index.php?<?php
                if (isset($_GET['page'])) {echo 'page=' . $_GET['page'];}else{}?>&lang=no" aria-expanded="false"><img class="flag-img" width="20" height="15" src="assets/images/flags/no.svg" alt="Flag of Norway"></a>
                    </li>
                </ul>
                                        
                <div class="icons-menu">
                    <a class="iconfont-wrapper" href="https://www.facebook.com/arcticpiratehusky" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-facebook socicon"></span>
                    </a>
                    <a class="iconfont-wrapper" href="https://www.instagram.com/piratehusky/" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-instagram socicon"></span>
                    </a>                   
                </div>   
            </div>
        </div>
    </nav>
</section>
<?php 
}
?>


