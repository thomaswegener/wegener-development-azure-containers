<?php
session_start();
require_once('render.php');
require_once('header.php');
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set('display_startup_errors', 1);


if (isset($_GET['video']))
{
    renderVideo(strip_tags($_GET['video'])); 
render_footer();
}



elseif (isset($_GET['contact']))
{


?>
<section class="form cid-tBWDj6XqtS" id="contact">
    
    
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto mbr-form" data-form-type="formoid">
<!--Formbuilder Form-->
<form action="https://mobirise.eu/" method="POST" class="mbr-form form-with-styler" data-form-title="Form Name"><input type="hidden" name="email" data-form-email="true" value="7eNzgSq3MOgsFKBUo0PE2Z43dctnzkn25WyLKLfl5QDOheZdjfFVUWKdYLmLOJqgMLhOpd8DjPHm0PWJxUIIezUc5HQwBWtAowg/HjWTpXJ16SKkI48M0/sM9hN39j9B.mqZr6IfsdoaNxZaflpEr0TogFPjhMxliY7NTXV0o7f68kr3BgmT2Cw+bbx3ssyhVuLNpngAYMKe+8nR9Oyq7MjuLXMwnHykTBjoih6cconJjrDyj7wCazCbwnt2KOMr1">
<div class="form-row">
<div hidden="hidden" data-form-alert="" class="alert alert-success col-12">Thanks for filling out the form!</div>
<div hidden="hidden" data-form-alert-danger="" class="alert alert-danger col-12">Oops...! some problem!</div>
</div>
<div class="dragArea row">
<div class="col-lg-12 col-md-12 col-sm-12">
<h4 class="mbr-fonts-style display-5">Leave your contact information</h4>
</div>
<div class="col-lg-12 col-md-12 col-sm-12">
<hr>
</div>
<div data-for="name" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="text" name="name" placeholder="Your name/Company name:" data-form-field="name" class="form-control display-7" value="" id="name-formbuilder-3">
</div>
<div data-for="email" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="email" name="email" placeholder="E-mail adress:" data-form-field="email" class="form-control display-7" value="" id="email-formbuilder-3">
</div>
<div data-for="phone" class="col-lg-12 col-md-12 col-sm-12 form-group">
<input type="tel" name="phone" placeholder="Phone number:" pattern="*" data-form-field="phone" class="form-control display-7" value="" id="phone-formbuilder-3">
</div>
<div class="col-lg-12 col-md-12 col-sm-12 form-group">
<div class="form-control-label">
<label for="checkbox" class="mbr-fonts-style display-7">What do you want us to contact you about?</label>
</div>
<div data-for="Meetings &amp; Conferences" class="form-check ms-2">
<input type="checkbox" value="Yes" name="Meetings &amp; Conferences" data-form-field="Meetings &amp; Conferences" class="form-check-input display-7" id="Meetings &amp; Conferences-formbuilder-3">
<label for="Meetings &amp; Conferences-formbuilder-3" class="form-check-label display-7">Meetings &amp; Conferences</label>
</div>
<div data-for="Leisure &amp; Incentives" class="form-check ms-2">
<input type="checkbox" value="Yes" name="Leisure &amp; Incentives" data-form-field="Leisure &amp; Incentives" class="form-check-input display-7" id="Leisure &amp; Incentives-formbuilder-3">
<label for="Leisure &amp; Incentives-formbuilder-3" class="form-check-label display-7">Leisure &amp; Incentives</label>
</div>
<div data-for="Events" class="form-check ms-2">
<input type="checkbox" value="Yes" name="Events" data-form-field="Events" class="form-check-input display-7" id="Events-formbuilder-3">
<label for="Events-formbuilder-3" class="form-check-label display-7">Events</label>
</div>
<div data-for="General information about the area" class="form-check ms-2">
<input type="checkbox" value="Yes" name="General information about the area" data-form-field="General information about the area" class="form-check-input display-7" id="General information about the area-formbuilder-3">
<label for="General information about the area-formbuilder-3" class="form-check-label display-7">General information about the area</label>
</div>
</div>
<div class="col-lg-6 col-md-12 col-sm-12"><button type="submit" class="w-100 btn btn-primary display-7">Send</button></div>
</div>
</form><!--Formbuilder Form-->
</div>
        </div>
    </div>
</section>

    <?php
render_footer();
}
elseif (isset($_GET['pdf']))
{
    render_pdf($_GET['pdf']); 
}    
else
{
    renderVideo("1b"); 
    render_footer();
}

?>

