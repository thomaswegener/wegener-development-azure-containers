<?php
error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);
require_once('function.php');
$con = connect(); 


function renderLogin()
{
?>

<br><br><br><br>
<section class="form wd-short" id="formbuilder-6">
    
    
    <div class="container">
        <div class="col-lg-8 mx-auto mbr-form">
<!---Formbuilder Form--->
            <form action="login.php" method="post">
<div class="dragArea form-row">
<div class="col-lg-12">
<h4 class="mbr-fonts-style display-5">Logg inn med brukernavn og passord</h4>
</div>
<div class="col-lg-12">
<hr>
</div>
<div data-for="username" class="col-lg-6 form-group">
<input type="text" name="username" placeholder="Brukernavn" data-form-field="username" class="form-control display-7" value="
<?php if (isset($_COOKIE['user'])){echo $_COOKIE['user'];}?>


" id="username-formbuilder-6">
</div>
<div data-for="password" class="col-lg-6 form-group">
<input type="password" name="password" placeholder="Passord" data-form-field="password" class="form-control display-7" value="" id="password-formbuilder-6">
</div>
<div class="col-auto"><button type="submit" class="btn btn-black display-7">Logg inn</button></div>
</div>
</form><!---Formbuilder Form--->
</div>
    </div>
</section>
<br><br><br><br>

<?php
}
?>