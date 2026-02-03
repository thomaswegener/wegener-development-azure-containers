<!-- Messenger Chat Code -->
    <div id="fb-root"></div>

    <!-- Your Chat code -->
    <div id="fb-customer-chat" class="fb-customerchat">
    </div>


    

    
<script>
  var video = document.getElementById("visithammerfest");
  if (video) {
    video.onended = function() {
      video.style.display = "none";
    };

    // Function to request fullscreen for mobile devices
    function requestFullscreen(elem) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    }

    // Check if the video is playing on a mobile device
    function isMobileDevice() {
      return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    }

    // Autoplay and request fullscreen on mobile devices
    if (isMobileDevice()) {
      video.play();
      requestFullscreen(video);
    }
  }
</script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js"></script>
<script>
  $(document).ready(function() {
    // Function to initialize Select2 dropdowns
    function initSelect2() {
      $(".multi-select").select2();
    }

    // Call the function to initialize Select2 dropdowns after the document is ready
    initSelect2();

    // If using other libraries that might conflict with Select2, initialize Select2 when they are loaded
    // For example, if using Bootstrap, you can initialize Select2 after Bootstrap's JavaScript components are loaded
    // Make sure the order of initialization is correct based on your dependencies
    // Example:
    // $(document).on("load", function() {
    //   initSelect2();
    // });
  });
</script>

<script>
    function applyPartnerFilters() {
        var lang = getURLParameter('lang');
        var page = getURLParameter('page');
        var category = $('#partner_category').val();
        var location = $('#partner_location').val();
        var target = $('#partner_target').val();
        window.location.href = "index.php?page=" + page + "&lang=" + lang + "&category=" + category + "&location=" + location + "&target=" + target;
    }

    function getURLParameter(name) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Set selected options in the dropdowns after page reloads
    window.addEventListener('DOMContentLoaded', function () {
        var category = getURLParameter('category');
        var location = getURLParameter('location');
        var target = getURLParameter('target');
        $('#partner_category').val(category ? category.split(',') : []).trigger('change');
        $('#partner_location').val(location ? location.split(',') : []).trigger('change');
        $('#partner_target').val(target ? target.split(',') : []).trigger('change');
    });
</script>
<script>
    function applyActivityFilters() {
        var lang = getURLParameter('lang');
        var page = getURLParameter('page');
        var category = $('#activity_category').val();
        var location = $('#activity_location').val();
        var season = $('#activity_season').val(); // Corrected variable name from 'target' to 'season'
        window.location.href = "index.php?page=" + page + "&lang=" + lang + "&category=" + category + "&location=" + location + "&season=" + season;
    }

    // No need for another getURLParameter function, as it's already declared in the first script.

    // Set selected options in the dropdowns after page reloads
    window.addEventListener('DOMContentLoaded', function () {
        var category = getURLParameter('category');
        var location = getURLParameter('location');
        var season = getURLParameter('season'); // Add this line to fetch the selected season
        $('#activity_category').val(category ? category.split(',') : []).trigger('change');
        $('#activity_location').val(location ? location.split(',') : []).trigger('change');
        $('#activity_season').val(season ? season.split(',') : []).trigger('change');
    });
</script>
    <!-- <script>
      var chatbox = document.getElementById('fb-customer-chat');
      chatbox.setAttribute("page_id", "538150429971986");
      chatbox.setAttribute("attribution", "biz_inbox");
    </script>

     Your SDK code 
    <script>
      window.fbAsyncInit = function() {
        FB.init({
          xfbml            : true,
          version          : 'v15.0'
        });
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    </script> -->

        <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>
    <script>
      var editors = [];

function initializeEditor(id, contentFieldId) {
    var editorElement = document.getElementById(id);
    var contentField = document.getElementById(contentFieldId);
    var form = document.querySelector('form');
  
    // Check if elements exist before proceeding
    if (editorElement && contentField && form) {
        var quill = new Quill('#' + id, {
            theme: 'snow'
        });
      
        form.addEventListener('submit', function(event) {
            var html = quill.root.innerHTML;
            contentField.value = html;

            // If no changes were made in the editor, retrieve the content directly from the editor
            if (html === '') {
                contentField.value = JSON.stringify(quill.getContents());
            }
        });

        editors.push(quill);
    }
}

initializeEditor('editor1', 'content-field1');
initializeEditor('editor2', 'content-field2');
initializeEditor('editor3', 'content-field3');
initializeEditor('editor4', 'content-field4');


    </script>

<section data-bs-version="5.1" class="footer3 cid-tIZqwq8rIA" once="footers" id="footer3-18">
    <div class="container">
        <div class="media-container-row align-center mbr-white">
            <div class="row row-links">
                <ul class="foot-menu">                   
                    <li class="foot-menu-item mbr-fonts-style display-7">
                        <a class="text-primary" href="https://visithammefest.wpenginepowered.com/" target="_blank"><?php echo $lang === 'no' ? 'Mediabank' : 'Media bank'; ?></a>
                    </li>
                    <li class="foot-menu-item mbr-fonts-style display-7">
                        <a class="text-primary" href="index.php?page=employee&lang=<?php echo $lang === 'no' ? 'no' : 'en'; ?>" target="_blank"><?php echo $lang === 'no' ? 'Ansatte' : 'Employees'; ?></a>
                    </li>
                    <li class="foot-menu-item mbr-fonts-style display-7">
                        <a class="text-primary" href="index.php?page=information&lang=<?php echo $lang === 'no' ? 'no' : 'en'; ?>" target="_blank"><?php echo $lang === 'no' ? 'Om oss' : 'About'; ?></a>
                    </li>
                    <li class="foot-menu-item mbr-fonts-style display-7">
                        <a class="text-primary" href="index.php?page=legal&lang=<?php echo $lang === 'no' ? 'no' : 'en'; ?>" target="_blank"><?php echo $lang === 'no' ? 'Personvern' : 'Privacy'; ?></a>
                    </li>
                    <li class="foot-menu-item mbr-fonts-style display-7">
                        <a class="text-primary" href="index.php?page=legal&lang=<?php echo $lang === 'no' ? 'no' : 'en'; ?>" target="_blank"><?php echo $lang === 'no' ? 'Vilkår' : 'Terms'; ?></a>
                    </li>
                    <li class="foot-menu-item mbr-fonts-style display-7">
                        <a class="text-primary" href="index.php?page=legal&lang=<?php echo $lang === 'no' ? 'no' : 'en'; ?>" target="_blank"><?php echo $lang === 'no' ? 'Prisgaranti' : 'Price guarnatee'; ?></a>
                    </li>
                </ul>
            </div>
            <!-- <div class="row social-row">
                <div class="social-list align-right pb-2">
          
                <div class="soc-item">
                        <a href="https://www.facebook.com/visithammerfest/" target="_blank">
                            <span class="mbr-iconfont mbr-iconfont-social fa-facebook-square fa" style="color: rgb(180, 59, 7); fill: rgb(180, 59, 7);"></span>
                        </a>
                    </div><div class="soc-item">
                        <a href="https://www.instagram.com/visithammerfest/" target="_blank">
                            <span class="mbr-iconfont mbr-iconfont-social fa-instagram fa" style="color: rgb(180, 59, 7); fill: rgb(180, 59, 7);"></span>
                        </a>
                    </div><div class="soc-item">
                        <a href="https://www.youtube.com/c/visithammerfest" target="_blank">
                            <span class="mbr-iconfont mbr-iconfont-social fa-youtube fa" style="color: rgb(180, 59, 7); fill: rgb(180, 59, 7);"></span>
                        </a>
                    </div></div>
            </div> -->
            <div class="row row-copirayt">
                <p class="mbr-text mb-0 mbr-fonts-style mbr-white align-center display-7">
                    © Copyright 2023-2026 Visit Hammerfest. All Rights Reserved. Code and design by Wegener <a href="admin" >Development</a></p>
            </div>
        </div>
    </div>
</section>


<script src="assets/bootstrap/js/bootstrap.min.js"></script>
<script src="assets/bootstrap/js/bootstrap.bundle.min.js"></script>
<script src="assets/datatables/vanilla-dataTables.min.js"></script>
<script src="assets/datepicker/jquery.datetimepicker.full.js"></script>
<script src="assets/dropdown/js/nav-dropdown.js"></script>
<script src="assets/dropdown/js/navbar-dropdown.js"></script>
<!--<script src="assets/formoid.min.js"></script>-->
<script src="assets/formstyler/jquery.formstyler.js"></script>
<script src="assets/formstyler/jquery.formstyler.min.js"></script>
<script src="assets/mbr-switch-arrow/mbr-switch-arrow.js"></script>
<script src="assets/mbr-tabs/mbr-tabs.js"></script>
<script src="assets/parallax/jarallax.js"></script>
<script src="assets/popper/popper.min.js"></script>
<!-- <script src="assets/smoothscroll/smooth-scroll.js"></script>-->
<script src="assets/tether/tether.min.js"></script>
<script src="assets/theme/js/script.js"></script>
<script src="assets/theme/js/wdev.js"></script>
<script src="assets/touchswipe/jquery.touch-swipe.min.js"></script>
<script src="assets/web/assets/jquery/jquery.min.js"></script>
<script src="assets/ytplayer/index.js"></script>


</body>
</html>
