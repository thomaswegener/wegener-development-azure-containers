<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set('display_startup_errors', 1); 

function renderVideo($name)
{
?>
<center>
<video controls autoplay width="100%" margin-top="" name="go-north">
  <source src="assets/video/<?php echo $name; ?>.mp4">
</video>
</center>
<script>
var video = document.getElementById("go-north");
video.onended = function() {
    video.style.display = "none";
    video.hide();
};
</script>

<?php
}
function render_pdf($name) {
    if ($name === 'inspiration') {
        $url = '/products/inspiration/index.php';
    } elseif ($name === 'a_taste_of_arctic_winter') {
        $url = '/products/a_taste_of_arctic_winter/index.php';
    } elseif ($name === 'arctic_ski_expedition') {
        $url = '/products/arctic_ski_expedition/index.php';
    } elseif ($name === 'be_a_dog_sledding_polar_hero') {
        $url = '/products/be_a_dog_sledding_polar_hero/index.php';
    } elseif ($name === 'coolcation_nature_and_culture_in_arctic_norway') {
        $url = '/products/coolcation_nature_and_culture_in_arctic_norway/index.php';
    } elseif ($name === 'dogsledding_overnight_tour') {
        $url = '/products/dogsledding_overnight_tour/index.php';
    } elseif ($name === 'dogsledding_overnight_tour') {
        $url = '/products/dogsledding_overnight_tour/index.php';
    } elseif ($name === 'family_hiking_expedition') {
        $url = '/products/family_hiking_expedition/index.php';
    } elseif ($name === 'hiking_expedition') {
        $url = '/products/hiking_expedition/index.php';
    } elseif ($name === 'kayaking_adventure') {
        $url = '/products/kayaking_adventure/index.php';
    } elseif ($name === 'meet_the_locals_multi_day') {
        $url = '/products/meet_the_locals_multi_day/index.php';
    } elseif ($name === 'northern_lights_glamping_tour') {
        $url = '/products/northern_lights_glamping_tour/index.php';
    } elseif ($name === 'reindeer_herder_package') {
        $url = '/products/reindeer_herder_package/index.php';
    } elseif ($name === 'sami_reindeer_adventure_culture_and_connection') {
        $url = '/products/sami_reindeer_adventure_culture_and_connection/index.php';
    } elseif ($name === 'seiland_package') {
        $url = '/products/seiland_package/index.php';
    } elseif ($name === 'soroya_package') {
        $url = '/products/soroya_package/index.php';
    } elseif ($name === 'urban_finnmark_hammerfest') {
        $url = '/products/urban_finnmark_hammerfest/index.php';
    } else {
        $url = '/products/inspiration/index.php'; // fallback
    }

    echo <<<HTML
<main>
  <iframe src="$url" style="width:100%; height:100vh; border:none;"></iframe>
</main>
</html>
HTML;
}



function render_footer() {
    echo <<<HTML

<section data-bs-version="5.1" class="footer4 cid-tAr8YG4UlN" once="footers" id="footer4-2">

    

    
    
    <div class="container">
        <div class="row mbr-white">
            <div class="col-6 col-lg-3">
                <div class="media-wrap col-md-8 col-12">
                    <a href="https://go-north.no/">
                        <img src="assets/images/logo-gonorth-vertikal-rgb.png" alt="Go North"><br>
                        <img src="assets/images/miljofyrtarn.png" alt="Miljøfyrtårn">
                        
                    </a>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <h5 class="mbr-section-subtitle mbr-fonts-style mb-2 display-7">
                    <strong>E-mail</strong></h5>
                <p class="mbr-text mbr-fonts-style mb-4 display-4">
                    <a href="mailto:info@go-north.no" class="text-primary">info@go-north.no</a></p>

                
                
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <h5 class="mbr-section-subtitle mbr-fonts-style mb-2 display-7"><strong>Urban Finnmark</strong></h5>
                <ul class="list mbr-fonts-style display-4">
                    <li class="mbr-text item-wrap">
                        <a href="index.php?video=1a">Urbane Finnmark<br></a>
                        <a href="index.php?video=1b">Go-North<br></a>
                        <a href="index.php?video=1c">The Northernmost City<br></a>
                    </li>
                </ul>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <h5 class="mbr-section-subtitle mbr-fonts-style mb-2 display-7"><strong>The Historical Finnmark Coast</strong></h5>
                <ul class="list mbr-fonts-style display-4">
                    <li class="mbr-text item-wrap">
                        <a href="index.php?video=2a">The Historical Finnmark Coast<br></a>
                        <a href="index.php?video=2b">Akkarfjord (Sørøya)<br></a>
                        <a href="index.php?video=2c">Seiland<br></a>
                    </li>
                </ul>
            </div>
            <div class="col-12 mt-4">
                <p class="mbr-text mb-0 mbr-fonts-style copyright align-center display-7">
                    © Copyright 2025 Wegener Development - All Rights Reserved
                </p>
            </div>
        </div>
    </div>
</section>


<script src="assets/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="assets/parallax/jarallax.js"></script>
  <script src="assets/smoothscroll/smooth-scroll.js"></script>
  <script src="assets/ytplayer/index.js"></script>
  <script src="assets/dropdown/js/navbar-dropdown.js"></script>
  <script src="assets/playervimeo/vimeo_player.js"></script>
  <script src="assets/theme/js/script.js"></script>
  <script src="assets/formoid.min.js"></script>
  
  
  

</body>
</html>
HTML;
}


?>