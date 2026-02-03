<?php
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set('display_startup_errors', 1);
require_once('function.php');
$con = connect();   

function renderContact($con, $lang)
{
    if ($lang === "no")
    {
?>  

<section class="form cid-suiuROxcQi" id="formbuilder-2n">
    
    
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto mbr-form" data-form-type="formoid">
<!--Formbuilder Form-->
<form action="https://mobirise.eu/" method="POST" class="mbr-form form-with-styler" data-form-title="Message to Pirate Husky"><input type="hidden" name="email" data-form-email="true" value="riz/jfnmf/qF48fjigxdgT8ABoBZkIGsUMXDGqog1bD9+cG0s6AFpU+XCO6JHMYmUq919UuJlZUiG90l14w9BZMACHllezdZBb2a7quif9PWqjE/q76FqRo9FyqPBqCT.yDrKyaDlyd+++HbPRjv+3FT7uh3Wrb/2p8AZLJK3zpFzZbdGG9gwyqRCDtpeTL0f8/TPRNm9Gse5ZnvmQjumIiFKh2H7HWT+H2wS3e1MyJe0l6UIyeca+lqIm2Snak/a">
<div class="form-row">
<div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Takk for at du tar kontakt, vi svarer vanligvis i løpet av en virkedag.</div>
<div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">Oops...! some problem!</div>
</div>
<div class="dragArea form-row">
<div class="col-lg-12 col-md-12 col-sm-12">
<h4 class="mbr-fonts-style display-5">Send oss en melding</h4>
</div>
<div class="col-lg-12 col-md-12 col-sm-12">
<hr>
</div>
<div data-for="name" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="text" name="name" placeholder="Navn" data-form-field="name" class="form-control display-7" required="required" value="" id="name-formbuilder-2n">
</div>
<div data-for="email" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="email" name="email" placeholder="E-post" data-form-field="email" class="form-control display-7" required="required" value="" id="email-formbuilder-2n">
</div>
<div data-for="phone" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="tel" name="phone" placeholder="Telefon" data-form-field="phone" class="form-control display-7" value="" id="phone-formbuilder-2n">
</div>
<div data-for="message" class="col-lg-12 col-md-12 col-sm-12 form-group">
<textarea name="message" placeholder="Melding" data-form-field="message" class="form-control display-7" style="margin-top: 0px; margin-bottom: 0px; height: 230px;" required="required" id="message-formbuilder-2n"></textarea>
</div>
<div class="col-auto"><button type="submit" class="btn btn-primary display-7">Send</button></div>
</div>
</form><!--Formbuilder Form-->
</div>
        </div>
    </div>
</section>

<?php
}
else
{
?>
<section class="form cid-suiuROxcQi" id="contact">
    
    
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto mbr-form" data-form-type="formoid">
<!--Formbuilder Form-->
<form action="https://mobirise.eu/" method="POST" class="mbr-form form-with-styler" data-form-title="Message to Pirate Husky"><input type="hidden" name="email" data-form-email="true" value="nScVoCCg8vDPasdDYg2ww3mvpm4bvWWL7DOHol6Sv17tHIQN9ImLWJ5SqhwqBC1dwoQ0YtPtHitRZ5f0ER148JQwMRcO3xcPPyG3PTUmJeZF/x58IYQY1MGsEUDcKnnM">
<div class="form-row">
<div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Thanks for filling out the form!</div>
<div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">Oops...! some problem!</div>
</div>
<div class="dragArea form-row">
<div class="col-lg-12 col-md-12 col-sm-12">
<h4 class="mbr-fonts-style display-5">Send us a message</h4>
</div>
<div class="col-lg-12 col-md-12 col-sm-12">
<hr>
</div>
<div data-for="name" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="text" name="name" placeholder="Name" data-form-field="name" class="form-control display-7" required="required" value="" id="name-formbuilder-2n">
</div>
<div data-for="email" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="email" name="email" placeholder="Email" data-form-field="email" class="form-control display-7" required="required" value="" id="email-formbuilder-2n">
</div>
<div data-for="phone" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="tel" name="phone" placeholder="Phone" data-form-field="phone" class="form-control display-7" value="" id="phone-formbuilder-2n">
</div>
<div data-for="message" class="col-lg-12 col-md-12 col-sm-12 form-group">
<textarea name="message" placeholder="Message" data-form-field="message" class="form-control display-7" style="margin-top: 0px; margin-bottom: 0px; height: 230px;" required="required" id="message-formbuilder-2n"></textarea>
</div>
<div class="col-auto">
<button type="submit" class="btn btn-primary display-7">Submit</button>
</div>
</div>
</form><!--Formbuilder Form-->
</div>
        </div>
    </div>
</section>


<?php
}

}


function renderBanner($con, $lang)
{
?> 
<section data-bs-version="5.1" class="slider1 cid-tXhwKKVJ9e" id="slider1-3b">
    
    <div class="carousel slide carousel-fade" id="tXhZs2nrki" data-ride="carousel" data-bs-ride="carousel" data-interval="5000" data-bs-interval="5000">
        <ol class="carousel-indicators">
            <li data-slide-to="0" data-bs-slide-to="0" class="active" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li>
            <li data-slide-to="1" data-bs-slide-to="1" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li><li data-slide-to="2" data-bs-slide-to="2" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li>
            <li data-slide-to="3" data-bs-slide-to="3" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li><li data-slide-to="4" data-bs-slide-to="4" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li><li data-slide-to="5" data-bs-slide-to="5" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li><li data-slide-to="6" data-bs-slide-to="6" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li><li data-slide-to="7" data-bs-slide-to="7" data-target="#tXhZs2nrki" data-bs-target="#tXhZs2nrki"></li>
        </ol>
        <div class="carousel-inner">
            <div class="carousel-item slider-image item active">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-3-1900x1425.jpg" alt="" data-slide-to="0" data-bs-slide-to="0">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5">
                            <strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div><div class="carousel-item slider-image item">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-1-1900x1425.jpg" alt="" data-slide-to="1" data-bs-slide-to="1">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5"><strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div>
            <div class="carousel-item slider-image item">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-4-1500x873.jpg" alt="" data-slide-to="2" data-bs-slide-to="2">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5"><strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div>
            <div class="carousel-item slider-image item">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-2-1900x1425.jpg" alt="" data-slide-to="3" data-bs-slide-to="3">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5"><strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div><div class="carousel-item slider-image item">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-5-1500x1000.jpg" alt="" data-slide-to="4" data-bs-slide-to="4">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5"><strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div><div class="carousel-item slider-image item">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-6-1500x1125.jpg" alt="" data-slide-to="5" data-bs-slide-to="5">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5"><strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div><div class="carousel-item slider-image item">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-7-1500x1052.jpg" alt="" data-slide-to="6" data-bs-slide-to="6">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5"><strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div><div class="carousel-item slider-image item">
                <div class="item-wrapper">
                    <img class="d-block w-100" src="assets/images/banner-8-1500x1125.jpg" alt="" data-slide-to="7" data-bs-slide-to="7">
                    
                    <div class="carousel-caption">
                        <h5 class="mbr-section-subtitle mbr-fonts-style display-5"><strong>Pirate Husky</strong></h5>
                        <p class="mbr-section-text mbr-fonts-style display-7">Porsanger Hammerfest Finnmark Norway</p>
                    </div>
                </div>
            </div>
        </div>
        <a class="carousel-control carousel-control-prev" role="button" data-slide="prev" data-bs-slide="prev" href="#tXhZs2nrki">
            <span class="mobi-mbri mobi-mbri-arrow-prev" aria-hidden="true"></span>
            <span class="sr-only visually-hidden">Previous</span>
        </a>
        <a class="carousel-control carousel-control-next" role="button" data-slide="next" data-bs-slide="next" href="#tXhZs2nrki">
            <span class="mobi-mbri mobi-mbri-arrow-next" aria-hidden="true"></span>
            <span class="sr-only visually-hidden">Next</span>
        </a>
    </div>
</section>

<?php
}
function renderAbout($con, $lang)
{
    if ($lang === "no")
    {
?>       
<section data-bs-version="5.1" class="features18 cid-st4OPKJMl0" id="welcome">
    <div class="container">
        <div class="row justify-content-center">
            <div class="card col-12 col-lg">
                <div class="card-wrapper">
                    <h6 class="card-title mbr-fonts-style mb-4 display-2"><strong>Velkommen</strong></h6>
                    <p class="mbr-text mbr-fonts-style display-7">
Har du drømt om å bo slik at du ikke trenger å dra på ferie? Velkommen til oss. Her i vårt lille paradis har vi gleden av å få ta med dere på tur, være seg med hundespann, kajakk eller til fots, vi har aktiviteter som passer for de fleste, både i Børselv i Porsanger, og i Hammerfest. 
<br><br>
I midnattssolen og nordlysets rike lever vi tett på naturen, med sterke kulturer og ikke minst med våre 30 hunder av rasen Siberian Husky. 
<br><br>
Våre turer er også godt tilpasset for barn og barnefamilier, og vi har egne fritidsaktiviteter for lokale barn på ukentlig basis. 
<br><br>
Midt i smørøyet er vi omringet av perler som Porsangerfjorden, Silfar Canyon, Reinøya og Nordkapp, for ikke å glemme Hammerfest med sin unike og gamle historie, Isbjørnklubben, Seiland og Sørøya, den historiske Finnmarkskysten. 
</p>
    
                    
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="image-wrapper">
                    <!-- <img src="assets/images/luluabout.jpg" alt=""> -->
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="features18 cid-st4OPKJMl0" id="about">
    <div class="container">
        <div class="row justify-content-center">
            <div class="card col-12 col-lg">
                <div class="card-wrapper">
                    <h6 class="card-title mbr-fonts-style mb-4 display-2"><strong>Om oss</strong></h6>
                    <p class="mbr-text mbr-fonts-style display-7">
Pirate Husky er en familiebedrift, vi bor, jobber og lever med dette på vårt gårdsbruk i Børselv, Porsanger. Og vi, det er meg Mali, hundekjører og med bred erfaring innen reiseliv rundt om i landet, drifter prosjektet Porsangerfjorden Lodge og jobber med salg av reiselivsopplevelser. Ektemannen min Gøran, altmulig mannen som kjører maskin, bygger sleder, guider, fikser og reparerer, engasjerer seg og jobber med sikkerhet og opplevelsesutvikling. Vi har også tre barn i familien, tøffingen Ruth som har kjørt hundespann siden ho var 5 år gammel, sparker fotball, spiller fløyte og er verdens beste storesøster. Ronja, Røverdattera vår, med energi herifra til månen, null frykt og ett stort smil. Minst i flokken er lille Sigrid som følger sine søstre tett i hælene og plukker opp hvert minste lille tips og triks. 
<br><br>
Vi er alle klare til å ønske dere velkommen hit til oss – på Pirate Husky 



<br><br>
<a href="https://givn.no/shop/piratehusky"><img alt="Kjøp gavekort fra Pirate Husky med Givn" src="https://cdn.givn.no/badges/v1/landscape_yellow.svg" style="width: 256px"></a>
</p>
                    <div class="mbr-section-btn"><a class="btn btn-primary display-4" href="mailto:info@piratehusky.no">Send e-post</a></div>
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="image-wrapper">
                    <img src="assets/images/aboutus.jpeg" alt="">
                </div>
            </div>
        </div>
    </div>
</section>


<section data-bs-version="5.1" class="content4 cid-sChKn6IedU" id="content4-32">
    
    
    <div class="container">
        <div class="row justify-content-center">
            <div class="title col-md-12 col-lg-10">
                
                <h4 class="mbr-section-subtitle align-center mbr-fonts-style mb-4 display-5"><strong>Vi gleder oss alle til å ønske dere velkommen <br>til Pirate Husky!</strong></h4>
                
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="contacts3 map1 cid-st4K2tCokz" id="contacts3-4">

    
    
    <div class="container">
        <div class="mbr-section-head">
            <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                <strong>Kontakt</strong></h3>
            <h4 class="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">Ikke nøl med å kontakte oss hvis det er noe dere lurer på?</h4>
        </div>
        <div class="row justify-content-center mt-4">
            <div class="card col-12 col-md-6">
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont fa-phone-square fa"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5">
                            <strong>Telefon</strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7">+47 453 80 189</p>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont socicon-mail socicon"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5">
                            <strong>E-post</strong></h6>
                        <p class="mbr-text mbr-fonts-style display-7">info@piratehusky.no</p><p><br><a href="mailto:info@piratehusky.no" class="text-primary"></a></p><p></p>
                    </div>
                </div>
            </div>
            <div class="map-wrapper col-12 col-md-6">
                <div class="google-map"><iframe frameborder="0" style="border:0" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5372.747743090645!2d25.5858051!3d70.3268725!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x284a106525184e03!2sPirate%20Husky%20AS!5e0!3m2!1sno!2s!4v1625485234257!5m2!1sno!2s" allowfullscreen=""></iframe></div>
            </div>
        </div>
    </div>
</section>


<?php
}
else
{

?>
<section data-bs-version="5.1" class="features18 cid-st4OPKJMl0" id="welcome">
    <div class="container">
        <div class="row justify-content-center">
            <div class="card col-12 col-lg">
                <div class="card-wrapper">
                    <h6 class="card-title mbr-fonts-style mb-4 display-2"><strong>Welcome</strong></h6>
                    <p class="mbr-text mbr-fonts-style display-7">
Have you ever dreamt about living in a place making leaving for holiday unnecessary? Welcome to us! Here in our little paradise we are happy to bring you on an activity, be it by dog sled, kayak or hiking. We have all sort of activities suitable for most people, both in Børselv in Porsanger, and in Hammerfest. 
<br><br>
In the land of the midnight sun and northern lights, we are living close to nature, surrounded by strong cultures, and together with our pack of 30 Siberian Huskies. 
<br><br>
Our activities is also well adapted to kids and kid families, and we have after school activities for the local children. 
<br><br>
Nature surronds us, but also must-see locations as the Porsangerfjord, Silfar Canyon, Reinøya (island) and North Cape, not to forget Hammerfest and it’s unique and ancient history, the Royal Polar Bear Club, Seiland and Sørøya, the historical Finnmark Coast. 
</p>         
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="image-wrapper">
                    <!-- <img src="assets/images/luluabout.jpg" alt=""> -->
                </div>
            </div>
        </div>
    </div>
</section>

<section class="features18 cid-st4OPKJMl0" id="about">   
    <div class="container">
        <div class="row justify-content-center">
            <div class="card col-12 col-lg">
                <div class="card-wrapper">
                    <h6 class="card-title mbr-fonts-style mb-4 display-2"><strong>About us</strong></h6>
                    <p class="mbr-text mbr-fonts-style display-7">Pirate Husky is a family business. We live and work here in our farm In Børselv, Porsanger. Us, that is me Mali, the musher with wide
experience in the travel industry on different locations in Norway. I’m not only the manager of Pirate Husky, but also work with selling
travel experiences for all of Finnmark. My husband, Gøran, the handyman, operating the excavator, building sleds, guiding, fixing and
repairing, engaged in rescue and security, and product development. We also have four kids in the family, toughest Ruth has been mushing
since she was 5 years old, she plays football, plays the flute, and is the very best big sister. Ronja, our bolt of energy, loves to talk to
absolutely everyone no matter if the speak Norwegian or not. Sigrid, the little strong rebel absolutely loves the dogs, and the youngest
Wilma, watching her sisters every move to learn every little trick.
<br><br>
We are all here to welcome you to Pirate Husky.
<br><br>
<a href="https://givn.no/shop/piratehusky"><img alt="Kjøp gavekort fra Pirate Husky med Givn" src="https://cdn.givn.no/badges/v1/landscape_yellow.svg" style="width: 256px"></a>
</p>
                    <div class="mbr-section-btn"><a class="btn btn-primary display-4" href="mailto:info@piratehusky.no">Send e-mail</a></div>
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="image-wrapper">
                    <img src="assets/images/aboutus.jpeg" alt="">
                </div>
            </div>
        </div>
    </div>
</section>


<section class="contacts3 map1 cid-st4K2tCokz" id="contact"> 
    <div class="container">
        <div class="mbr-section-head">
            <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                <strong>Contact</strong></h3>
            <h4 class="mbr-section-subtitle mbr-fonts-style align-center mb-0 mt-2 display-5">
                Please don't hesitate to reach out for more information <br>or if you have any questions.</h4>
        </div>
        <div class="row justify-content-center mt-4">
            <div class="card col-12 col-md-6">
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont mobi-mbri-globe mobi-mbri"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5">
                            <strong>Phone</strong>
                        </h6>
                        <p class="mbr-text mbr-fonts-style display-7">+47 453 80 189</p>
                    </div>
                </div>
                <div class="card-wrapper">
                    <div class="image-wrapper">
                        <span class="mbr-iconfont mobi-mbri-globe mobi-mbri"></span>
                    </div>
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style mb-1 display-5">
                            <strong>Email</strong>
                        </h6>
                        <p class="mbr-text mbr-fonts-style display-7"></p><p>info@piratehusky.no<a href="mailto:info@piratehusky.no" class="text-primary"></a></p><p></p>
                    </div>
                </div>
            </div>
            <div class="map-wrapper col-12 col-md-6">
                <div class="google-map"><iframe frameborder="0" style="border:0" src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5372.747743090645!2d25.5858051!3d70.3268725!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x284a106525184e03!2sPirate%20Husky%20AS!5e0!3m2!1sno!2s!4v1625485234257!5m2!1sno!2s" allowfullscreen=""></iframe></div>
</div>
        </div>
    </div>
</section>


<?php
}
}


function renderGuides($con, $lang)
{

        ?>
        <section data-bs-version="5.1" class="content5 cid-stCGZ1xXx6" id="guides">
                <div class="container">
                    <div class="mbr-section-head">
                        <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                            <strong><?php if ($lang === "no") {echo "Guidene"; }else{ echo "The Guides";} ?></strong></h3>
                    </div>    
                </div>
            </div>
        </section>  
        <?php

        $sql = "SELECT * FROM guides ORDER BY sex ASC, name";
        $result = $con->query($sql);
        if ($result->num_rows > 0) 
        {
                // output data of each row
                while($row = $result->fetch_assoc()) 
                {

                    if ($lang === "no")
                    {
                        $description = $row["ndescription"];
                    }
                    else
                    {
                        $description = $row["edescription"];
                    }
                    $name = $row["name"];
                    $date = $row["date"];
                    $image = $row['img'];
                        
                        
        ?>
                    <section class="features16 cid-sChDZwkmuG" id="features17-31">
                        <div class="container">
                            <div class="content-wrapper">
                                <div class="row align-items-center">
                                    <div class="col-12 col-lg-6">
                                        <div class="image-wrapper">
                                            <img src="<?php echo("assets/images/guides/" . $image);?>" alt="">
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg">
                                        <div class="text-wrapper">
                                        <p class="mbr-text mbr-fonts-style mb-4 display-4"><strong><?php echo($name);?></strong> <?php echo $date;?><br><br><?php echo($description);?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


<?php           }
        }  
}
function renderDogs($con, $lang)
{

        ?>
        <section data-bs-version="5.1" class="content5 cid-stCGZ1xXx6" id="dogs">
                <div class="container">
                    <div class="mbr-section-head">
                        <h3 class="mbr-section-title mbr-fonts-style align-center mb-0 display-2">
                            <strong><?php if ($lang === "no") {echo "Hundene våre"; }else{ echo "Our Dogs";} ?></strong></h3>
                    </div>    
                </div>
            </div>
        </section>  


        <?php


        $sql = "SELECT * FROM dogs ORDER BY sex ASC, name";
        $result = $con->query($sql);
        if ($result->num_rows > 0) 
        {
                // output data of each row
                while($row = $result->fetch_assoc()) 
                {

                    if ($lang === "no")
                    {
                        $description = $row["ndescription"];
                    }
                    else
                    {
                        $description = $row["edescription"];
                    }
                    $name = $row["name"];
                    $date = $row["date"];
                    $image = $row['img'];
                        
                        
        ?>
                    <section class="features16 cid-sChDZwkmuG" id="features17-31">
                        <div class="container">
                            <div class="content-wrapper">
                                <div class="row align-items-center">
                                    <div class="col-12 col-lg-6">
                                        <div class="image-wrapper">
                                            <img src="<?php echo("assets/images/dogs/" . $image . ".jpg");?>" alt="">
                                        </div>
                                    </div>
                                    <div class="col-12 col-lg">
                                        <div class="text-wrapper">
                                        <p class="mbr-text mbr-fonts-style mb-4 display-4"><strong><?php echo($name);?></strong> <?php echo $date;?><br><br><?php echo($description);?></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>


<?php           }
        }  
}
function renderAccommodation($con, $lang)
{
    if ($lang === "no")
    {
?>

<section class="features15 cid-suhktKzYqR" id="features16-2k">

    

    
    <div class="container">
        <div class="content-wrapper">
            <div class="row align-items-center">
                <div class="col-12 col-lg">
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style display-2">
                            <strong>Accommodation</strong></h6>
                        <p class="mbr-text mbr-fonts-style mb-4 display-4">
                            When visiting us in Børselv, we can soon also offer local accommodation. One of the most known and historical buildings here, is the boarding school, where we are now working to open this summer for guests to sleep, eat, and have a pleasant stay while testing the variety of activities we offer here in Børselv.</p>
                        <div class="mbr-section-btn mt-3"><a class="btn btn-warning display-4" href="accommodation.html#content5-2l">Learn more</a></div>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="image-wrapper">
                        <img src="assets/images/rom-980x735.jpg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="content5 cid-suhkvXgD5q" id="content5-2l">
    
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                
                <h4 class="mbr-section-subtitle mbr-fonts-style mb-4 display-5">
                    Overnatting</h4>
                <p class="mbr-text mbr-fonts-style display-7">Når du besøker oss i Børselv, kan vi snart også tilby lokal overnatting. 
<br><br>
Hotell: Et av de mest kjente og historiske byggene her, er internatet, hvor vi nå jobber med å åpne til neste sommer for gjester å sove, spise og ha et hyggelig opphold mens de prøver utvariasjonen av aktiviteter vi tilbyr her i Børselv. Vi har rom med eget bad, og rom med felles fasiliteter, hvis du vil bruke mer av budsjettet ditt på aktiviteter. Skolen, som nå kalles Porsangerfjorden Lodge, er sentralt i Børselv, med enkel tilgang til alle aktiviteter og fasiliteter. 
<br><br>
Leiligheter: Vi har to leiligheter til leie, korttidsutleie. En med 1 soverom, og en med 2 soverom. De er utstyrt for å kunne lage mat selv.
<br><br>  
Hvis du drømmer om en mer spesiell opplevelse, kan vi også tilby en natt eller to i en tradisjonell samisk gamme-telt. Vi har et telt med 2 enkeltsenger, oppvarming, kjøleskap og liten komfyr. Toalettfasiliteter i nærheten. Kontakt oss for mer informasjon, tilbud eller et skreddersydd program for deg og din gruppe.
</p>

<div class="mbr-section-btn mt-3"><a class="btn btn-warning display-4" href="https://www.airbnb.no/rooms/666413175357325277?preview_for_ml=true&source_impression_id=p3_1670491934_r12WQgCKoPg0k%2BL%2F">Lei liten leilighet</a></div>
<div class="mbr-section-btn mt-3"><a class="btn btn-warning display-4" href="https://www.airbnb.no/rooms/685477446555625323?preview_for_ml=true&source_impression_id=p3_1670491954_p0N50tdCbDfXDgL6">Lei stor leilighet</a></div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="gallery6 mbr-gallery cid-suu2QyyiW1" id="gallery6-3a">
    

    
    

    <div class="container">
        <div class="mbr-section-head">
            <h3 class="mbr-section-title mbr-fonts-style align-center m-0 display-2"></h3>
            
        </div>
        <div class="row mbr-gallery mt-4">
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-1-644x859.jpeg" alt="" data-slide-to="0" data-bs-slide-to="0" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-2-644x429.jpg" alt="" data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-3-644x429.jpg" alt="" data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-4-644x483.jpeg" alt="" data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="modal mbr-slider" tabindex="-1" role="dialog" aria-hidden="true" id="tqGzZPvYeB-modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="carousel slide" id="lb-tqGzZPvYeB" data-interval="5000" data-bs-interval="5000">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img class="d-block w-100" src="assets/images/gamme-1-644x859.jpeg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/gamme-2-644x429.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/gamme-3-644x429.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/gamme-4-644x483.jpeg" alt="">
                                </div>
                            </div>
                            <ol class="carousel-indicators">
                                <li data-slide-to="0" data-bs-slide-to="0" class="active" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                                <li data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                                <li data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                                <li data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                            </ol>
                            <a role="button" href="" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                            </a>
                            <a class="carousel-control-prev carousel-control" role="button" data-slide="prev" data-bs-slide="prev" href="#lb-tqGzZPvYeB">
                                <span class="mobi-mbri mobi-mbri-arrow-prev" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Previous</span>
                            </a>
                            <a class="carousel-control-next carousel-control" role="button" data-slide="next" data-bs-slide="next" href="#lb-tqGzZPvYeB">
                                <span class="mobi-mbri mobi-mbri-arrow-next" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="gallery6 mbr-gallery cid-suu2QyyiW1" id="gallery6-2o">
    

    

    <div class="container">
        
        <div class="row mbr-gallery mt-4">
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/leilighet-1-644x859.jpeg" alt="" data-slide-to="0" data-bs-slide-to="0" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/leilighet-3-640x480.jpg" alt="" data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/hotell-1-644x429.jpg" alt="" data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/hotell-2-644x429.jpg" alt="" data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="modal mbr-slider" tabindex="-1" role="dialog" aria-hidden="true" id="tqGzZQ3XVd-modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="carousel slide" id="lb-tqGzZQ3XVd" data-interval="5000" data-bs-interval="5000">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img class="d-block w-100" src="assets/images/leilighet-1-644x859.jpeg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/leilighet-3-640x480.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/hotell-1-644x429.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/hotell-2-644x429.jpg" alt="">
                                </div>
                            </div>
                            <ol class="carousel-indicators">
                                <li data-slide-to="0" data-bs-slide-to="0" class="active" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                                <li data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                                <li data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                                <li data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                            </ol>
                            <a role="button" href="" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                            </a>
                            <a class="carousel-control-prev carousel-control" role="button" data-slide="prev" data-bs-slide="prev" href="#lb-tqGzZQ3XVd">
                                <span class="mobi-mbri mobi-mbri-arrow-prev" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Previous</span>
                            </a>
                            <a class="carousel-control-next carousel-control" role="button" data-slide="next" data-bs-slide="next" href="#lb-tqGzZQ3XVd">
                                <span class="mobi-mbri mobi-mbri-arrow-next" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="form cid-suiu9gSDIi" id="formbuilder-2m">
    
    
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto mbr-form" data-form-type="formoid">
<!--Formbuilder Form-->
<form action="https://mobirise.eu/" method="POST" class="mbr-form form-with-styler" data-form-title="Message to Pirate Husky"><input type="hidden" name="email" data-form-email="true" value="kSSfvCrkCJ1tjuAni6PYamOSBFif+eknkg3qrygf5t3C6AZeu/WAlnz9u1YCVlFTr01YYOrAXPTopfR6WOEj6M8Rg/NIIbI3G/VfSsc9pXuXmiWMMgFufDdF96WL1wx6.Sl4PX8Y4QBaG5DkFiUk/rnuHcCHvrrFhDHvKhSsqyt8IawqBpFxR9bFYSuY3P/HaSvTY5r8LB1M7CM988LXWjNl7ZjF8bU6qyJVfGGJmaPENmp7PPkInUJj6fJYUt5MV">
<div class="form-row">
<div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Thanks for filling out the form!</div>
<div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">Oops...! some problem!</div>
</div>
<div class="dragArea form-row">
<div class="col-lg-12 col-md-12 col-sm-12">
<h4 class="mbr-fonts-style display-5">Send us a message</h4>
</div>
<div class="col-lg-12 col-md-12 col-sm-12">
<hr>
</div>
<div data-for="name" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="text" name="name" placeholder="Name" data-form-field="name" class="form-control display-7" required="required" value="" id="name-formbuilder-2m">
</div>
<div data-for="email" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="email" name="email" placeholder="Email" data-form-field="email" class="form-control display-7" required="required" value="" id="email-formbuilder-2m">
</div>
<div data-for="phone" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="tel" name="phone" placeholder="Phone" data-form-field="phone" class="form-control display-7" value="" id="phone-formbuilder-2m">
</div>
<div data-for="message" class="col-lg-12 col-md-12 col-sm-12 form-group">
<textarea name="message" placeholder="Message" data-form-field="message" class="form-control display-7" style="margin-top: 0px; margin-bottom: 0px; height: 230px;" required="required" id="message-formbuilder-2m"></textarea>
</div>
<div class="col-auto">
<button type="submit" class="btn btn-primary display-7">Submit</button>
</div>
</div>
</form><!--Formbuilder Form-->
</div>
        </div>
    </div>
</section>
<?php        
    }
    else
    {
?>  
<section class="features15 cid-suhktKzYqR" id="features16-2k">

    

    
    <div class="container">
        <div class="content-wrapper">
            <div class="row align-items-center">
                <div class="col-12 col-lg">
                    <div class="text-wrapper">
                        <h6 class="card-title mbr-fonts-style display-2">
                            <strong>Accommodation</strong></h6>
                        <p class="mbr-text mbr-fonts-style mb-4 display-4">
                            When visiting us in Børselv, we can soon also offer local accommodation. One of the most known and historical buildings here, is the boarding school, where we are now working to open this summer for guests to sleep, eat, and have a pleasant stay while testing the variety of activities we offer here in Børselv.</p>
                        <div class="mbr-section-btn mt-3"><a class="btn btn-warning display-4" href="accommodation.html#content5-2l">Learn more</a></div>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="image-wrapper">
                        <img src="assets/images/rom-980x735.jpg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="content5 cid-suhkvXgD5q" id="content5-2l">
    
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-12 col-lg-10">
                
                <h4 class="mbr-section-subtitle mbr-fonts-style mb-4 display-5">
                    Accommodation</h4>
                <p class="mbr-text mbr-fonts-style display-7"><p class="mbr-text mbr-fonts-style display-7">
When visiting us in Børselv, we can soon also offer local accommodation. 
<br><br>
Hotel: One of the most known and historical buildings here, is the boarding school, where we are now working to open next summer for guests to sleep, eat, and have a pleasant stay while testing the variety of activities we offer here in Børselv. We have rooms with private bathrooms, and rooms with shared facilities, if you want to spend more of your budget on activities. The school, now referred to as Porsangerfjorden Lodge, is central in Børselv, with easy access to all activities and facilities. 
<br><br>
Apartments: We have two apartments for rent, short term. One with 1 bedroom, and one with 2 bedrooms. They are equipped for self-catering.
<br><br>  
However, if you dream of a more special experience, we can also offer a night or two in a traditional Sami Gamme tent. We have one tent with 2 single beds, heat, fridge, and small stove. Toilet facilities close by.  
Contact us for more information, offer or a tailer made program for you and your group. 
</p>
<div class="mbr-section-btn mt-3"><a class="btn btn-warning display-4" href="https://www.airbnb.no/rooms/666413175357325277?preview_for_ml=true&source_impression_id=p3_1670491934_r12WQgCKoPg0k%2BL%2F">Rent small appartment</a></div>
<div class="mbr-section-btn mt-3"><a class="btn btn-warning display-4" href="https://www.airbnb.no/rooms/685477446555625323?preview_for_ml=true&source_impression_id=p3_1670491954_p0N50tdCbDfXDgL6">Rent big appartment</a></div>
            </div>
        </div>
    </div>
</section>
<section data-bs-version="5.1" class="gallery6 mbr-gallery cid-suu2QyyiW1" id="gallery6-3a">
    

    
    

    <div class="container">
        <div class="mbr-section-head">
            <h3 class="mbr-section-title mbr-fonts-style align-center m-0 display-2"></h3>
            
        </div>
        <div class="row mbr-gallery mt-4">
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-1-644x859.jpeg" alt="" data-slide-to="0" data-bs-slide-to="0" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-2-644x429.jpg" alt="" data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-3-644x429.jpg" alt="" data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZPvYeB-modal" data-bs-target="#tqGzZPvYeB-modal">
                    <img class="w-100" src="assets/images/gamme-4-644x483.jpeg" alt="" data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="modal mbr-slider" tabindex="-1" role="dialog" aria-hidden="true" id="tqGzZPvYeB-modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="carousel slide" id="lb-tqGzZPvYeB" data-interval="5000" data-bs-interval="5000">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img class="d-block w-100" src="assets/images/gamme-1-644x859.jpeg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/gamme-2-644x429.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/gamme-3-644x429.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/gamme-4-644x483.jpeg" alt="">
                                </div>
                            </div>
                            <ol class="carousel-indicators">
                                <li data-slide-to="0" data-bs-slide-to="0" class="active" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                                <li data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                                <li data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                                <li data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZPvYeB" data-bs-target="#lb-tqGzZPvYeB"></li>
                            </ol>
                            <a role="button" href="" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                            </a>
                            <a class="carousel-control-prev carousel-control" role="button" data-slide="prev" data-bs-slide="prev" href="#lb-tqGzZPvYeB">
                                <span class="mobi-mbri mobi-mbri-arrow-prev" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Previous</span>
                            </a>
                            <a class="carousel-control-next carousel-control" role="button" data-slide="next" data-bs-slide="next" href="#lb-tqGzZPvYeB">
                                <span class="mobi-mbri mobi-mbri-arrow-next" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section data-bs-version="5.1" class="gallery6 mbr-gallery cid-suu2QyyiW1" id="gallery6-2o">
    

    

    <div class="container">
        
        <div class="row mbr-gallery mt-4">
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/leilighet-1-644x859.jpeg" alt="" data-slide-to="0" data-bs-slide-to="0" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/leilighet-3-640x480.jpg" alt="" data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/hotell-1-644x429.jpg" alt="" data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
            <div class="col-12 col-md-6 col-lg-3 item gallery-image">
                <div class="item-wrapper" data-toggle="modal" data-bs-toggle="modal" data-target="#tqGzZQ3XVd-modal" data-bs-target="#tqGzZQ3XVd-modal">
                    <img class="w-100" src="assets/images/hotell-2-644x429.jpg" alt="" data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd">
                    <div class="icon-wrapper">
                        <span class="mobi-mbri mobi-mbri-search mbr-iconfont mbr-iconfont-btn"></span>
                    </div>
                </div>
                
            </div>
        </div>

        <div class="modal mbr-slider" tabindex="-1" role="dialog" aria-hidden="true" id="tqGzZQ3XVd-modal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        <div class="carousel slide" id="lb-tqGzZQ3XVd" data-interval="5000" data-bs-interval="5000">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img class="d-block w-100" src="assets/images/leilighet-1-644x859.jpeg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/leilighet-3-640x480.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/hotell-1-644x429.jpg" alt="">
                                </div>
                                <div class="carousel-item">
                                    <img class="d-block w-100" src="assets/images/hotell-2-644x429.jpg" alt="">
                                </div>
                            </div>
                            <ol class="carousel-indicators">
                                <li data-slide-to="0" data-bs-slide-to="0" class="active" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                                <li data-slide-to="1" data-bs-slide-to="1" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                                <li data-slide-to="2" data-bs-slide-to="2" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                                <li data-slide-to="3" data-bs-slide-to="3" data-target="#lb-tqGzZQ3XVd" data-bs-target="#lb-tqGzZQ3XVd"></li>
                            </ol>
                            <a role="button" href="" class="close" data-dismiss="modal" data-bs-dismiss="modal" aria-label="Close">
                            </a>
                            <a class="carousel-control-prev carousel-control" role="button" data-slide="prev" data-bs-slide="prev" href="#lb-tqGzZQ3XVd">
                                <span class="mobi-mbri mobi-mbri-arrow-prev" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Previous</span>
                            </a>
                            <a class="carousel-control-next carousel-control" role="button" data-slide="next" data-bs-slide="next" href="#lb-tqGzZQ3XVd">
                                <span class="mobi-mbri mobi-mbri-arrow-next" aria-hidden="true"></span>
                                <span class="sr-only visually-hidden">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<section class="form cid-suiu9gSDIi" id="formbuilder-2m">
    
    
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto mbr-form" data-form-type="formoid">
<!--Formbuilder Form-->
<form action="https://mobirise.eu/" method="POST" class="mbr-form form-with-styler" data-form-title="Message to Pirate Husky"><input type="hidden" name="email" data-form-email="true" value="dI1kwgAnfEG+H954BUqkDiZ/McP2scsE7peKPy7AOmR9smWd0LmuaYZjWhLOgfDa75an5Thgqn+VmhhfUqotmxmZn42yY9VgGGl5c/91kuYepUxr7HTKu5M/G1MMksH0">
<div class="form-row">
<div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Thanks for filling out the form!</div>
<div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">Oops...! some problem!</div>
</div>
<div class="dragArea form-row">
<div class="col-lg-12 col-md-12 col-sm-12">
<h4 class="mbr-fonts-style display-5">Send us a message</h4>
</div>
<div class="col-lg-12 col-md-12 col-sm-12">
<hr>
</div>
<div data-for="name" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="text" name="name" placeholder="Name" data-form-field="name" class="form-control display-7" required="required" value="" id="name-formbuilder-2m">
</div>
<div data-for="email" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="email" name="email" placeholder="Email" data-form-field="email" class="form-control display-7" required="required" value="" id="email-formbuilder-2m">
</div>
<div data-for="phone" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="tel" name="phone" placeholder="Phone" data-form-field="phone" class="form-control display-7" value="" id="phone-formbuilder-2m">
</div>
<div data-for="message" class="col-lg-12 col-md-12 col-sm-12 form-group">
<textarea name="message" placeholder="Message" data-form-field="message" class="form-control display-7" style="margin-top: 0px; margin-bottom: 0px; height: 230px;" required="required" id="message-formbuilder-2m"></textarea>
</div>
<div class="col-auto">
<button type="submit" class="btn btn-primary display-7">Submit</button>
</div>
</div>
</form><!--Formbuilder Form-->
</div>
        </div>
    </div>
</section>

<?php 
}
}


function renderActivity($con, $lang)
{
    ?>

<!-- Embed external page using iframe -->
<iframe src="https://app.outventures.se/widget/v2/dialog/new-order?key=be2fe3c25c47b2840d1b6615f60c2f0ad77e3074e0480632ef2b8d67350c41b3&productTypes=products,vouchers&listView=products" 
        >
    Your browser does not support iframes.
</iframe>


    <?php
}


function renderExpedition($con, $lang, $type)
{
    $sql = "SELECT * FROM `expedition`";
    if ($type != "all") 
    {
        $sql .= " WHERE `type` = '$type'";
    }


    $result = $con->query($sql);
    
        if ($result->num_rows > 0) 
        {
            while($row = $result->fetch_assoc()) 
            {
                    if ($lang === "no")
                    {
                        $name = $row["no_name"];
                        $short = $row["no_short"];
                        $description = $row["no_description"];
                        $details = $row["no_details"];
                        $link = $row["no_link"];
                        $linkname = $row["no_linkname"];

                    }    
                    else
                    {
                        $name = $row["name"];
                        $short = $row["short"];
                        $description = $row["description"];
                        $details = $row["details"];
                        $link = $row["link"];
                        $linkname = $row["linkname"];
                    }
                    $id = $row["id"];
                    $image = $row["image"];
                    $image2 = $row["image2"];


                    ?>

                    <section class="features15 cid-stCLcmTxOc" id="<?php echo($id);?>">
                        <div class="container">
                            <div class="content-wrapper">
                                <div class="row align-items-center">
                                    <div class="col-12 col-lg">
                                        <div class="text-wrapper">
                                            <h6 class="card-title mbr-fonts-style display-2"><strong><?php echo($name);?></strong></h6>
                                            <p class="mbr-text mbr-fonts-style mb-4 display-4"><?php echo($description);?></p>
                                            
                                            <?php echo($link);?> 

                                        </div>
                                    </div>
                                    <div class="col-12 col-lg-6">
                                        <div class="image-wrapper">
                                            <img src="<?php echo($image);?>" alt="">
                                        </div>
                                        <p></p>
                                        <div class="image-wrapper">
                                            <img src="<?php echo($image2);?>" alt="">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            
                            </div>
                        </div>
                    </section>


                    <?php
            }
        } 
        else 
        {
             writeLog($con, $_SESSION["name"], "Error: " . $sql . "<br>" . mysqli_error($con));
        } 
}

function renderSustainability($con, $lang)
{
    if ($lang === "no")
    {
?>       

<section data-bs-version="5.1" class="features18 cid-st4OPKJMl0" id="welcome">

    

    
    <div class="container">
        <div class="row justify-content-center">
            <div class="card col-12 col-lg">
                <div class="card-wrapper">
                    <h6 class="card-title mbr-fonts-style mb-4 display-2"><strong>Bærekraft</strong></h6>
                    <p class="mbr-text mbr-fonts-style display-7">
I kjernen av bedriften vår er ett ønske om å kunne jobbe med bærekraft, miljø og selvforsyning. Helt fra vi startet bedriften har vi hatt fokus på langsiktige løsninger for å kunne ha ett positivt bidrag til miljøet og lokalsamfunnet, og i så stor grad som mulig være selvforsynt både privat og i bedriften.
<br><br>
Bedriften vår er sertifisert som Miljøfyrtårn, og interessenter kan kontakte oss for å få tilsendt vår klimarapport per epost. Vi jobber tett med miljøarbeidet både kontinuerlig i daglig drift, og i grunnleggende planlegging og strategiarbeid i bedriften
<br><br>
Vi har særlig hatt fokus på disse punktene av FN’s bærekraftsmål:
<br><br>
3. God helse og livskvalitet 
<br>5. Likestilling mellom kjønnene 
<br>8. Anstendig arbeid og økonomisk vekst 
<br>11. Bærekraftige byer og lokalsamfunn 
<br>12. Ansvarlig forbruk og produksjon

</p>
                    
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="image-wrapper">
                    <img src="assets/images/dogyard.jpg" alt="">
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row justify-content-center">
            <div class="card col-12 col-lg-12">
                <div class="card-wrapper">
                    <p class="mbr-text mbr-fonts-style display-7">
3. Ved å ha gode arbeidsvilkår for oss og våre ansatte tilrettelegger vi for god helse og livskvalitet. Vi involverer våre ansatte aktivt i å utforme arbeidsmiljøet vi sammen jobber i. 
<br>5. Likestilling mellom kjønnene, her får alle ansatte uavhengig av kjønn, like oppgaver, likt ansvar og lik lønn for likt arbeid. 
<br>8. Anstendig arbeid og økonomisk vekst, vi forsøker og tilby gode lønninger for bransjen og gi våre ansatte gode muligheter til en karriere, samtidig som vi investerer overskudd tilbake i bedriften for videre utvikling. I tillegg har vi stort fokus på samarbeid, både lokalt og regionalt, for å kunne skape bedre vilkår for alle, bedre opplevelser for gjestene, og bedre tilgang til ressurser både nå og i framtiden. 
<br>11. Vi involverer oss i lokalsamfunnet for å bygge opp en bærekraftig bygd, både ved å skape arbeidsplasser på flere arenaer, vi er medeiere i prosjektet «Porsangerfjorden Lodge», som har som mål å skape arbeidsplasser, sikre videre drift av skole og barnehage i bygda, og tilrettelegge for gründere i bygda. 
<br>12. Ansvarlig forbruk og produksjon, vi forsøker å være fornuftige i våre innkjøp, reparere det som kan repareres, og fôre hunda mest mulig rett slik at vi ikke har matsvinn. Vi har også tett samarbeid med Gøran sitt firma, sledespesialisten, og prøver å bruke det som er av restmaterialer i sledeproduksjonen, til nyttige ting i hundegården, for eksempel navneskilt til hundene.
<br><br>
Vi har over tid også sett på muligheten til å kunne produsere vår egen hundemat. Vi har god tilgang i dag til kjøtt fra elg, sau og fisk, som hundene nyter godt av. Og enda bedre kan det bli etter hvert som vi utvikler bedriften.
<br><br>
Vi har også stort fokus på sikkerhet og førstehjelp, både Mali og Gøran er utdannet i Røde Kors og Norges Redningshunder, Gøran har også jobbet som innsatsleder og har flere års erfaring fra forsvaret. Vi ønsker at alle våre guider skal ha minimum grunnleggende førstehjelp, og jobber deretter med videre kursing, fokus på sikkerhet, og øvelser gjerne i samarbeid med andre etater.
<br><br>
Ute i naturen bruker vi i hovedsak etablerte ferdselsårer. Scooter – og ATV løyper som vi hjelper å vedlikeholde, samt at vi jobber tett med sykkelklubben om å tråkke felles løyer for fat bike og hundespann.
<br><br>
Dyrevelferd er også svært viktig, vi har valgt å bygge vår hundegård i tilknytting til låven, slik at alle hundene har sine hundehus, inne i låven. De har også egne luftegårder på yttersiden slik at de fritt kan gå inn og ut som de selv ønsker. Alle hundegårder, og hundehus, er bygget på enda strengere krav enn det som stilles per i dag, for å kunne være rustet mot en framtid hvor også myndighetene stiller strengere krav til dyrevelferden. Hundene bor sammen to og to, og i tillegg til trening på spannet, har vi også en stor løpegård til frilek hvor de kan få løpt fra seg og nyte livet. De får masse kos og ros, oppmerksomhet og trening. Hundegården blir daglig rengjort flere ganger for dagen, og vi bruker hundemat av høy kvalitet, med god variasjon og personlig fôring for best mulig oppfølging av hver en hund i kennelen.
</p>                    
                </div>
            </div>
        </div>
    </div>
</section>


<?php
}
else
{

?>


<section data-bs-version="5.1" class="features18 cid-st4OPKJMl0" id="welcome">

    

    
    <div class="container">
        <div class="row justify-content-center">
            <div class="card col-12 col-lg">
                <div class="card-wrapper">
                    <h6 class="card-title mbr-fonts-style mb-4 display-2"><strong>Sustainability</strong></h6>
                    <p class="mbr-text mbr-fonts-style display-7">
At the core of our company is a desire to be able to work with sustainability, the environment and self-sufficiency. Ever since we started the company, we have focused on long-term solutions in order to make a positive contribution to the environment and the local community, and to the greatest extent possible be self-sufficient both privately and in the company.
<br><br>
Our company is certified as an Environmental Lighthouse, and stakeholders can contact us to receive our climate report by email. We work closely with environmental work both continuously in daily operations, and in fundamental planning and strategy work in the company.
<br><br>
We have particularly focused on these points of the UN's sustainability goals:
<br>
<br>3. Good health and well-being
<br>5. Gender equality
<br>8. Decent work and economic growth
<br>11. Sustainable cities and communities
<br>12. Responsible consumption and production
</p>
                    
                </div>
            </div>
            <div class="col-12 col-lg-6">
                <div class="image-wrapper">
                    <img src="assets/images/dogyard.jpg" alt="">
                </div>
            </div>
        </div>
    </div>
            <div class="container">
        <div class="row justify-content-center">
                        <div class="card col-12 col-lg-12">
                <div class="card-wrapper">
                    <p class="mbr-text mbr-fonts-style display-7">

3. By having good working conditions for us and our employees, we facilitate good health and quality of life. We actively involve our employees in shaping the working environment in which we work together.
<br>5. Equality between the genders, here all employees, regardless of gender, get equal tasks, equal responsibilities, and equal pay for equal work.
<br>8. Decent work and economic growth, we strive to offer good wages and give our employees good opportunities for a career, while at the same time we invest profits back into the company for further development. In addition, we have a strong focus on collaboration, both locally and regionally, in order to create better conditions for everyone, better experiences for guests, and better access to resources both now and in the future.
<br>11. We involve ourselves in the local community to build up a sustainable village, both by creating jobs in several arenas, we are co-owners of the project "Porsangerfjorden Lodge", which aims to create jobs, ensure continued operation of the school and kindergarten in the village, and facilitate entrepreneurs in the village.
<br>12. Responsible consumption and production, we try to be sensible in our purchases, repair what can be repaired, and feed the dog as correctly as possible so that we do not waste food. We also work closely with Gøran's company, Sledespesialisten, and try to use what is left over from sled production for useful things in the kennel, for example name tags for the dogs.
<br><br>
Over time, we have also looked at the possibility of being able to produce our own dog food. Today, we have good access to meat from moose, sheep, and fish, which the dogs enjoy. And it can get even better as we develop the company.
<br><br>
We also have a strong focus on safety and first aid, both Mali and Gøran are trained in the Red Cross and Norway's Rescue Dogs, Gøran has also worked as a response manager and has several years of experience from the armed forces. We want all our guides to have a minimum of basic first aid, and then work on further training, focus on safety, and exercises, preferably in collaboration with other agencies.
<br><br>
Out in nature, we mainly use established roads. Scooter and ATV trails that we help to maintain, and we work closely with the local cycling club to maintain common trails for fat bikes and dog teams.
<br><br>
Animal welfare is also very important, we have chosen to build our dog kennel in connection with the barn, so that all the dogs have their dog houses, inside the barn. They also have their own closed in yards on the outside so that they can freely go in and out as they wish. All dog yards, and dog houses, are built on even stricter requirements than what is set as of today, in order to be prepared for a future where the authorities also set stricter requirements for animal welfare. The dogs live together in pairs, and in addition to training on the team, we also have a large running yard for free play where they can run around and enjoy life. They get lots of cuddles and praise, attention, and training. The kennel is cleaned several times a day, and we use high-quality dog food, with a good variety and personal feeding for the best possible follow-up of each dog in the kennel.
<br><br>
<a href="https://rapportering.miljofyrtarn.no/stats/170393" target="_blank">
    <img src="assets/images/miljofyrtarn.png" alt="Miljøfyrtårn logo" style="max-width: 100px; height: auto;">
</a>
</p>                    
                </div>
            </div>

        </div>
    </div>
</section>






<?php
}
}


?>