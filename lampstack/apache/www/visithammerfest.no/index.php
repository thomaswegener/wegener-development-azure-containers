<?php
session_start();
require_once('render.php');
require_once('function.php');
require_once('header.php');
error_reporting(E_ALL);
ini_set('display_errors', 'Off');
ini_set('display_startup_errors', 0);
$con = connect();  
writeLog($con, "Page loading", "Refresh test");
if (isset($_POST['sendContact']))
{
writeLog($con, "Email script", "Running");
require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require '../vendor/phpmailer/phpmailer/src/SMTP.php';
require '../vendor/phpmailer/phpmailer/src/Exception.php';


// Replace 'YOUR_AUTH_TOKENS' with an array of website IDs and their respective tokens.
$authTokens = array(
    'visithammerfest.no' => 'iKk/zKnQ0a0FKk4dC0PhIygddUthscK1kpu/Bfni1BBSm9x81D0/Gi/uWqIZmDaHZ9h9Asi88RwA+roGm0jgunqzboV14GIDdmW1EvrJ6xSF0EJV9ZWIdgQGsVfjiQlB.mbEUzwCzaFZtnZyYH70izeKJ10VvWj5QfyRjq4JP6L2dG8gCa6PiD6P/aqk/FgOfuHsn5iw3Gi1iYct/84CeysZaZj/NeOyW29zNl59nP9EN4yUoXm37iKF4YE2wOawJ',
    'wegener.no' => 'iKk/zKnQ0a0FKk4dC0PhIygddUthscK1kpu/Bfni1BBSm9x81D0/Gi/uWqIZmDaHZ9h9Asi88RwA+roGm0jgunqzboV14GIDdmW1EvrJ6xSF0EJV9ZWIdgQGsVfjiQlB.mbEUzwCzaFZtnZyYH70izeKJ10VvWj5QfyRjq4JP6L2dG8gCa6PiD6P/aqk/FgOfuHsn5iw3Gi1iYct/84CeysZaZj/NeOyW29zNl59nP9EN4yUoXm37iKF4YE2wOawJ',
    // Add more websites and tokens as needed.
);
// Replace 'YOUR_EMAIL_ADDRESSES' with an array of website IDs and their respective email addresses.
$emailAddresses = array(
    'visithammerfest.no' => 'post@visithammerfest.no',
    'wegener.no' => 'post@wegener.no',
    // Add more websites and email addresses as needed.
);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Form data (same as before)
    $email = $_POST["email"];
    $name = $_POST["name"];
    $phone = $_POST["phone"];
    $message = $_POST["message"];
    $website = $_POST["website"];
    $tokenId = $_POST["tokenId"];

    // Sanitize the inputs (same as before)
    $email = filter_var($email, FILTER_SANITIZE_EMAIL);
    $name = filter_var($name, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $phone = filter_var($phone, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $message = filter_var($message, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $website = filter_var($website, FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $tokenId = filter_var($tokenId, FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Email configuration (same as before)
    $mail = new PHPMailer\PHPMailer\PHPMailer();
    $mail->isSMTP();
    $smtpHost = getenv('SMTP_HOST') ?: 'send.one.com';
    $smtpUser = getenv('SMTP_USER') ?: 'noreply@wegener.no';
    $smtpPass = getenv('SMTP_PASS') ?: '';
    $smtpPort = getenv('SMTP_PORT') ?: '465';
    $smtpSecure = getenv('SMTP_SECURE') ?: 'ssl';

    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->SMTPSecure = $smtpSecure;
    $mail->Port = (int) $smtpPort;

    // Verify the authentication token for the website (same as before)
    if (isset($authTokens[$website]) && $authTokens[$website] === $tokenId) {
    	writeLog($con, "Email script", "Auth ok");
        // Email configuration (same as before)
        $mail->setFrom($smtpUser, 'Do not reply'); // 'From' address shown to the recipient
        $mail->addAddress($emailAddresses[$website], $website); // Recipient's email address based on the website


        // Email content
        $mail->Subject = 'Message from ' . $website;
        $mail->Body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage: $message";

        try {
            // Send the email (same as before)
            $mail->send();
            writeLog($con, "Email script", "Message has been sent successfully!");
        } catch (Exception $e) {
            writeLog($con, "Email script", "Message could not be sent.");
            writeLog($con, "Email script", 'Mailer Error: ' . $mail->ErrorInfo);
        }
    } else {
        // Invalid authentication token, reject the form submission
        writeLog($con, "Email script", "Invalid authentication token");
    }
} else {
    // If the page is accessed directly without form submission, display an error message.
    echo "Error: This page cannot be accessed directly.";
}

}

if (isset($_GET['page']) && $_GET['page'] === "activities") 
{
	renderActivities($con, $lang);
}
elseif (isset($_GET['page']) && $_GET['page'] === "activity")  
{
	if (isset($_GET['id']) && $_GET['id'] != null)
	{
		$id = $_GET['id'];
	}
	else
	{
		$id = 1;
	}
	renderActivity($con, $lang, $id);
}
elseif (isset($_GET['page']) && $_GET['page'] === "partners")  
{
	renderPartners($con, $lang);
}
elseif (isset($_GET['page']) && $_GET['page'] === "partner")  
{
	if (isset($_GET['id']) && $_GET['id'] != null)
	{
		$id = $_GET['id'];
	}
	else
	{
		$id = 1;
	}
	renderPartner($con, $lang, $id);
}
elseif (isset($_GET['page']) && $_GET['page'] === "stores")  
{
	renderStores($con, $lang);
}
elseif (isset($_GET['page']) && $_GET['page'] === "store")  
{
	if (isset($_GET['id']) && $_GET['id'] != null)
	{
		$id = $_GET['id'];
	}
	else
	{
		$id = 1;
	}
	renderStore($con, $lang, $id);
}
elseif (isset($_GET['page']) && $_GET['page'] === "inspirations")  
{
	renderArticles($con, $lang, "inspiration");
}
elseif (isset($_GET['page']) && $_GET['page'] === "article")  
{
	if (isset($_GET['id']) && $_GET['id'] != null)
	{
		$id = $_GET['id'];
	}
	else
	{
		$id = 1;
	}
	renderArticle($con, $lang, $id);
}
elseif (isset($_GET['page']) && $_GET['page'] === "employee")  
{
	renderEmployees($con, $lang);
}
elseif (isset($_GET['page']) && $_GET['page'] === "legal")  
{
	renderLegal($con, $lang);
}
elseif (isset($_GET['page']) && $_GET['page'] === "information")  
{
	renderInformationBanner($con, $lang);
	renderFAQ($con, $lang);
	renderArticles($con, $lang, "information");
	renderBigmap();
	renderContact($con, $lang);
}
elseif (isset($_GET['page']) && $_GET['page'] === "booking")  
{
	renderBooking($con, $lang);
}
elseif (isset($_GET['page']) && $_GET['page'] === "redirect" && $_GET['lang'] === "no")  
{
	header("Location: https://booking.visithammerfest.no/no/se-og-gjore");
}
elseif (isset($_GET['page']) && $_GET['page'] === "redirect" && $_GET['lang'] === "en")  
{
	header("Location: https://booking.visithammerfest.no/en/todo");
}
elseif (isset($_GET['page']) && $_GET['page'] === "headerfooter")  
{
	renderBooking($con, $lang);
}
else
{
	renderHome($con, $lang);
	renderFAQ($con, $lang);
	renderInformationBanner($con, $lang);
	renderArticles($con, $lang, "information");
	renderBigmap();
	renderContact($con, $lang);
	renderCookieConsent();
}

require_once('footer.php');
?>
