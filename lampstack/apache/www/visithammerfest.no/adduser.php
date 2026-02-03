<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["loggedin"] !== true) {
    header('Location: login.php');
    exit;
}
require_once('render.php');
require_once('header.php');
require_once('footer.php');
$con = connect();    

error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);



    if(isset($_POST['adduser']))
    { 
        if (!isset($_POST['username'], $_POST['password'], $_POST['email'])) 
        {
          // Could not get the data that should have been sent.
            die ('Please complete the registration form!');
        }
        // Make sure the submitted registration values are not empty.
        if (empty($_POST['username']) || empty($_POST['password']) || empty($_POST['email'])) {
          // One or more values are empty.
            die ('Please complete the registration form');
        }
        if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) 
        {
            die ('Email is not valid!');
        }
        if (preg_match('/[A-Za-z0-9]+/', $_POST['username']) == 0) 
        {
            die ('Username is not valid!');
        }
        if (strlen($_POST['password']) > 40 || strlen($_POST['password']) < 5) 
        {
          die ('Password must be between 5 and 40 characters long!');
        }
        if ($stmt = $con->prepare('SELECT id, password FROM accounts WHERE username = ?')) 
        {
          // Bind parameters (s = string, i = int, b = blob, etc), hash the password using the PHP password_hash function.
          $stmt->bind_param('s', $_POST['username']);
          $stmt->execute();
          $stmt->store_result();
          // Store the result so we can check if the account exists in the database.
          if ($stmt->num_rows > 0) {
            // Username already exists
            echo 'Username exists, please choose another..!';
        } 
        else 
        {
            // Username doesnt exists, insert new account
        if ($stmt = $con->prepare('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)')) 
        {
            // We do not want to expose passwords in our database, so hash the password and use password_verify when a user logs in.
            $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $stmt->bind_param('sss', $_POST['username'], $password, $_POST['email']);
            $stmt->execute();
            $user = $_POST["username"];
            $email = $_POST["email"];
          
          echo 'You have successfully registered, you can now login!';
        } else {
          // Something is wrong with the sql statement, check to make sure accounts table exists with all 3 fields.
          echo 'Could not prepare statement!';
        }
          }
          $stmt->close();
        } else {
          // Something is wrong with the sql statement, check to make sure accounts table exists with all 3 fields.
          echo 'Could not prepare statement!';
        }






    }
    else
    {
?>


    <section class="form wd-short" id="formbuilder-1e">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto mbr-form">
                    <!--Formbuilder Form-->
                    <form action="" method="POST" class="mbr-form form-with-styler" data-form-title="Form Name"><input type="hidden" name="email" data-form-email="true">
                    <div class="dragArea form-row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                    <h4 class="mbr-fonts-style display-5">Legg til bruker</h4>
                    </div>
                    <div class="col-lg-3 col-md-12 col-sm-12 form-group" data-for="text">
                    <label for="text-formbuilder-1e" class="form-control-label mbr-fonts-style display-7">Brukernavn</label>
                    <input type="text" name="username" placeholder="" data-form-field="text" class="form-control display-7" value="" id="text-formbuilder-1e">
                    </div>
                    <div class="col-lg-3 col-md-12 col-sm-12 form-group" data-for="password">
                    <label for="password-formbuilder-1e" class="form-control-label mbr-fonts-style display-7">Passord</label>
                    <input type="password" name="password" data-form-field="password" class="form-control display-7" value="" id="password-formbuilder-1e">
                    </div>
                    <div class="col-lg-6 col-md-12 col-sm-12 form-group" data-for="email">
                    <label for="email-formbuilder-1e" class="form-control-label mbr-fonts-style display-7">E-post</label>
                    <input type="email" name="email" placeholder="" data-form-field="email" class="form-control display-7" value="" id="email-formbuilder-1e">
                    </div>
                    <div class="col-auto">
                    <button type="submit" name="adduser" value="adduser" class="btn btn-primary display-7">Send inn</button>
                    </div>
                    </div>
                    </form><!--Formbuilder Form-->
                </div>
            </div>
        </div>
    </section>

<?php
}


?>
