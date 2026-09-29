<?php

// Génère une question de calcul simple et stocke la réponse en session
header('Content-Type: application/json');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

session_start();

$a = random_int(1, 9);
$b = random_int(1, 9);

$_SESSION['captcha'] = [
    'answer' => $a + $b,
    'created' => time()
];

echo json_encode([
    'success' => true,
    'question' => "Combien font $a + $b ?"
]);
