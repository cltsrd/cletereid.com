<?php
// Contact form handler - forwards emails to hello@cletereid.com

// Check if form was submitted via POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html");
    exit;
}

// Get form data and sanitize
$name = isset($_POST["name"]) ? trim(htmlspecialchars($_POST["name"])) : "";
$email = isset($_POST["email"]) ? trim(htmlspecialchars($_POST["email"])) : "";
$message = isset($_POST["message"]) ? trim(htmlspecialchars($_POST["message"])) : "";

// Validate required fields
if (empty($name) || empty($email) || empty($message)) {
    header("Location: index.html?error=missing_fields");
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header("Location: index.html?error=invalid_email");
    exit;
}

// Prepare email
$to = "hello@cletereid.com";
$subject = "Contact Form Submission from " . $name;
$email_message = "Name: " . $name . "\n";
$email_message .= "Email: " . $email . "\n\n";
$email_message .= "Message:\n" . $message . "\n";

// Email headers
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_sent = mail($to, $subject, $email_message, $headers);

// Redirect to thank you page
if ($mail_sent) {
    header("Location: thanks.html");
} else {
    header("Location: index.html?error=send_failed");
}
exit;
?>

