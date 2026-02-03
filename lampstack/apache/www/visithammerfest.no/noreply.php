<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';
require '../vendor/phpmailer/phpmailer/src/SMTP.php';
require '../vendor/phpmailer/phpmailer/src/Exception.php';

// Email configuration
$smtpHost = getenv('SMTP_HOST') ?: 'send.one.com';
$smtpUser = getenv('SMTP_USER') ?: 'noreply@wegener.no';
$smtpPass = getenv('SMTP_PASS') ?: '';
$smtpPort = getenv('SMTP_PORT') ?: '465';
$smtpSecure = getenv('SMTP_SECURE') ?: 'ssl';

$mail = new PHPMailer();
$mail->isSMTP();
$mail->Host = $smtpHost;
$mail->SMTPAuth = true;
$mail->Username = $smtpUser;
$mail->Password = $smtpPass;
$mail->SMTPSecure = $smtpSecure;
$mail->Port = (int) $smtpPort;

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

    // Verify the authentication token for the website (same as before)
    if (isset($authTokens[$website]) && $authTokens[$website] === $tokenId) {
        // Email configuration (same as before)
        $mail->setFrom($smtpUser, 'Website Form'); // 'From' address shown to the recipient
        $mail->addAddress($emailAddresses[$website], 'Recipient'); // Recipient's email address based on the website


        // Email content
        $mail->Subject = 'Message from your website form';
        $mail->Body = "Name: $name\nEmail: $email\nPhone: $phone\nMessage: $message";

        try {
            // Send the email (same as before)
            $mail->send();
            echo 'Message has been sent successfully!';
        } catch (Exception $e) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        }
    } else {
        // Invalid authentication token, reject the form submission
        echo 'Invalid authentication token.';
    }
} else {
    // If the page is accessed directly without form submission, display an error message.
    echo "Error: This page cannot be accessed directly.";
}
?>
