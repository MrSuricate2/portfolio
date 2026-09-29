<?php

// Configuration CORS (si nécessaire)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// Protection rate limiting
session_start();
$max_attempts = 3;
$time_window = 3600; // 1 heure

if (!isset($_SESSION['form_attempts'])) {
    $_SESSION['form_attempts'] = ['count' => 0, 'first_attempt' => time()];
}

$attempts = $_SESSION['form_attempts'];
if ($attempts['count'] >= $max_attempts && (time() - $attempts['first_attempt']) < $time_window) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Trop de tentatives. Réessayez dans 1 heure.']);
    exit;
}

// Récupération des données du formulaire
$nom = $_POST['fullname'] ?? '';
$email = $_POST['email'] ?? '';
$message = $_POST['message'] ?? '';
$consent = $_POST['consent'] ?? '';

// Validation des données
if (empty($nom) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Tous les champs obligatoires doivent être remplis']);
    exit;
}

// Validation du consentement RGPD
if ($consent !== 'on' && $consent !== 'true') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Vous devez accepter la politique de confidentialité']);
    exit;
}

// Validation de l'email
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !checkdnsrr(substr(strrchr($email, "@"), 1), "MX")) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

// Protection anti-spam (honeypot)
if (!empty($_POST['_gotcha'])) {
    // C'est probablement un bot
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message reçu']);
    exit;
}

// Vérification du captcha (usage unique, valide 10 minutes)
$captcha = $_SESSION['captcha'] ?? null;
unset($_SESSION['captcha']);
$captcha_reponse = trim($_POST['captcha'] ?? '');

if (
    !$captcha
    || (time() - $captcha['created']) > 600
    || !ctype_digit($captcha_reponse)
    || (int) $captcha_reponse !== $captcha['answer']
) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Réponse au captcha incorrecte. Veuillez réessayer.']);
    exit;
}

// Sanitisation des données
$nom = htmlspecialchars(strip_tags($nom));
$email = htmlspecialchars(strip_tags($email));
$message = htmlspecialchars(strip_tags($message));

// Configuration de l'email
$destinataire = 'ferraretto.kev@gmail.com'; // Ton email
$sujet_email = 'Nouveau message depuis kevin-ferraretto.fr - ' . $nom;

// Corps de l'email en HTML
$message_safe = htmlspecialchars(nl2br($message), ENT_QUOTES, 'UTF-8');
$corps_html = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: 'Poppins', Arial, sans-serif; 
            line-height: 1.6; 
            color: #e4e6eb;
            background-color: #0d0d0d;
            margin: 0;
            padding: 0;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #1e1e1f;
        }
        .header { 
            background: linear-gradient(to right, hsl(45, 100%, 72%), hsl(35, 100%, 68%));
            padding: 30px 20px; 
            text-align: center;
        }
        .header h2 {
            margin: 0;
            color: #0d0d0d;
            font-size: 24px;
            font-weight: 600;
        }
        .content { 
            padding: 30px 20px;
        }
        .info-row { 
            margin: 15px 0; 
            padding: 15px; 
            background-color: #2b2b2c;
            border-radius: 14px;
            border: 1px solid #383838;
        }
        .label { 
            font-weight: 600; 
            color: hsl(45, 100%, 72%);
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .value {
            color: #e4e6eb;
            font-size: 16px;
        }
        .message-box { 
            background-color: #2b2b2c;
            padding: 20px; 
            margin-top: 20px; 
            border-left: 4px solid hsl(45, 100%, 72%);
            border-radius: 14px;
        }
        .message-box .label {
            margin-bottom: 15px;
        }
        .footer {
            background-color: #1a1a1b;
            padding: 20px;
            text-align: center;
            color: #868b94;
            font-size: 13px;
            border-top: 1px solid #383838;
        }
        a {
            color: hsl(45, 100%, 72%);
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📬 Nouveau Message de Contact</h2>
        </div>
        <div class='content'>
            <div class='info-row'>
                <span class='label'>👤 Nom complet</span>
                <span class='value'>{$nom}</span>
            </div>
            <div class='info-row'>
                <span class='label'>📧 Email</span>
                <span class='value'><a href='mailto:{$email}'>{$email}</a></span>
            </div>
            <div class='message-box'>
                <span class='label'>💬 Message</span>
                <div class='value'>" . $message_safe . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Ce message a été envoyé depuis le formulaire de contact de <strong>kevin-ferraretto.fr</strong></p>
            <p>Portfolio Kevin Ferraretto - Développeur fullstack</p>
        </div>
    </div>
</body>
</html>
";

// Headers de l'email
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Portfolio Kevin Ferraretto <noreply@kevin-ferraretto.fr>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion()
];

// Envoi de l'email
$envoi_reussi = mail($destinataire, $sujet_email, $corps_html, implode("\r\n", $headers));

// Réponse JSON
if ($envoi_reussi) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.'
    ]);

    // Log optionnel (décommenter si besoin)
    // $log = date('Y-m-d H:i:s') . " - Message envoyé de {$email} ({$nom})\n";
    // file_put_contents('contact_logs.txt', $log, FILE_APPEND);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'envoi du message. Veuillez réessayer ou me contacter directement par email.'
    ]);
}
