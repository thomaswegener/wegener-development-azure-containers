<?php
ob_start();
$con = connect(); 
error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);
if (!isset($_GET['lang']))
{
    $lang = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
    switch($lang) 
    {
        case "no-NO":
            $lang = "no";
            break;
        default:
            $lang = "en";
            break;
    }
}
else
{
        $lang = $_GET['lang'];
}

?>

<!DOCTYPE html>
<html  >
<head>
  
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1">
  <link rel="shortcut icon" href="assets/images/logo.png" type="image/x-icon">
  <meta name="description" content="">
  
  
  <title>Visit Hammerfest</title>
  <!-- Google tag (gtag.js) – loaded after consent -->
  <script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  </script>


  <link rel="stylesheet" href="assets/web/assets/mobirise-icons2/mobirise2.css">
  <link rel="stylesheet" href="assets/web/assets/mobirise-icons/mobirise-icons.css">
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-grid.min.css">
  <link rel="stylesheet" href="assets/bootstrap/css/bootstrap-reboot.min.css">
  <link rel="stylesheet" href="assets/popup-overlay-plugin/style.css">
  <link rel="stylesheet" href="assets/datatables/vanilla-dataTables.min.css">
  <link rel="stylesheet" href="assets/dropdown/css/style.css">
  <link rel="stylesheet" href="assets/socicon/css/styles.css">
  <link rel="stylesheet" href="assets/theme/css/style.css">
  <link rel="stylesheet" href="assets/theme/css/wdev.css">
  <link rel="stylesheet" href="assets/theme/css/select2.min.css">
  <link rel="stylesheet" href="assets/recaptcha.css">
  <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css">
  <link rel="preload" href="https://fonts.googleapis.com/css?family=Jost:100,200,300,400,500,600,700,800,900,100i,200i,300i,400i,500i,600i,700i,800i,900i&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Jost:100,200,300,400,500,600,700,800,900,100i,200i,300i,400i,500i,600i,700i,800i,900i&display=swap"></noscript>
  <link rel="preload" as="style" href="assets/mobirise/css/mbr-additional.css">
  <link rel="stylesheet" href="assets/mobirise/css/mbr-additional.css" type="text/css">

  


  
  
  

</head>
<body>
  
  <section data-bs-version="5.1" class="menu menu3 cid-tHBrXZiEaj" once="menu" id="menu3-0">
    
    <nav class="navbar navbar-dropdown navbar-fixed-top navbar-expand-lg">
        <div class="container">
            <div class="navbar-brand">
                <span class="navbar-logo">
                    <a href="#">
                        <img src="assets/images/logo.png" alt="" style="height: 3rem;">
                    </a>
                </span>
                <span class="navbar-caption-wrap"><a class="navbar-caption text-black display-7" href="index.php">Visit Hammerfest</a></span>
            </div>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-bs-toggle="collapse" data-target="#navbarSupportedContent" data-bs-target="#navbarSupportedContent" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>

            <?php
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) 
{   
    ?>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav nav-dropdown nav-right" data-app-modern-menu="true">

                    <li class="nav-item"><a class="nav-link link text-black display-4" href="admin.php?page=activities">Edit Activities</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="admin.php?page=partners">Edit Partners</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="admin.php?page=stores">Edit Stores</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="admin.php?page=articles">Edit Articles</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="admin.php?page=information">Edit Information</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="admin.php?page=faqs">Edit FAQ</a></li>

                </ul>








                <!-- <div class="icons-menu">
                    <a class="iconfont-wrapper" href="https://www.facebook.com/visithammerfest/" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-facebook socicon"></span>
                    </a>
                    <a class="iconfont-wrapper" href="https://www.instagram.com/visithammerfest/" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-instagram socicon"></span>
                    </a>
                    
                    
                </div> -->
                
            </div>
        </div>
    </nav>
</section>
<?php 
}

else
{
    if (isset($_GET['lang']) && $_GET['lang'] === "no") 
{
?>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav nav-dropdown nav-right" data-app-modern-menu="true">

                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=activities&lang=no">Aktiviteter</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=partners&lang=no">Aktører</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=stores&lang=no">Butikker</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=inspirations&lang=no">Inspirasjon</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=information&lang=no">Informasjon</a></li>
                <!--<li class="nav-item"><a class="nav-link link text-black display-4" href="https://booking.visithammerfest.no/no/se-og-gjore">Bestilling</a></li>-->
                </ul>

                <div class="icons-menu">
                    

                    <?php 
                    if(isset($_GET['page']) && $_GET['page'] === "headerfooter") 
                    {
                        $page = "redirect";
                    }
                    elseif(isset($_GET['page']))
                    {
                        $page = $_GET['page'];
                    } ?>


                    <a href="index.php?<?php if (isset($page)) {echo 'page=' . $page;}else{}?>&lang=en<?php if (isset($_GET['id'])) {echo "&id=".$_GET['id'];}else{}?>" aria-expanded="false">
                            <img class="flag-img" style="width: auto !important" width="30" height="20" src="assets/images/flags/gb.svg" alt="Flag of Norway">
                    </a>
                    



                    <a class="iconfont-wrapper" href="https://www.facebook.com/visithammerfest/" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-facebook socicon"></span>
                    </a>
                    <a class="iconfont-wrapper" href="https://www.instagram.com/visithammerfest/" target="_blank">
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

                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=activities&lang=en">Activities</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=partners&lang=en">Partners</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=stores&lang=en">Shopping</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=inspirations&lang=en">Inspiration</a></li>
                    <li class="nav-item"><a class="nav-link link text-black display-4" href="index.php?page=information&lang=en">Information</a></li>
                    <!--<li class="nav-item"><a class="nav-link link text-black display-4" href="https://booking.visithammerfest.no/en/todo">Booking</a></li>-->
                    

                </ul>

                <div class="icons-menu">
                    


                    <?php 
                    if(isset($_GET['page']) && $_GET['page'] === "headerfooter") 
                    {
                        $page = "redirect";
                    }
                    elseif(isset($_GET['page']))
                    {
                        $page = $_GET['page'];
                    } ?>


                    <a href="index.php?<?php if (isset($page)) {echo 'page=' . $page;}else{}?>&lang=no<?php if (isset($_GET['id'])) {echo "&id=".$_GET['id'];}else{}?>" aria-expanded="false">
                            <img class="flag-img" style="width: auto !important" width="30" height="20" src="assets/images/flags/no.svg" alt="Flag of Norway">
                    </a>

                    <a class="iconfont-wrapper" href="https://www.facebook.com/visithammerfest/" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-facebook socicon"></span>
                    </a>
                    <a class="iconfont-wrapper" href="https://www.instagram.com/visithammerfest/" target="_blank">
                        <span class="p-2 mbr-iconfont socicon-instagram socicon"></span>
                    </a>
                    
                    
                </div>
                
            </div>
        </div>
    </nav>
</section>
<?php 
}
}


?>

