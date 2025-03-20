<?php
// permitir requisições de qualquer origem 
header("Access-Control-Allow-Origin: *"); // substituir por http://127.0.0.1:5501, para produção
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Responder requisições OPTIONS (usada por CORS para verificar permissões)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['message'])) {
    $message = trim($data['message']);

    if (empty($message) || strlen($message) < 3) {
        echo json_encode(["response" => "Messagemust be at least 3 characters long."]);
        exit();
    }

    $mysqli = new mysqli("localhost", "root", "123", "bot_db", 3306);
    $mysqli->query("SET SESSION wait_timeout = 28800;"); // Prevent timeouts

    if ($mysqli->connect_error) {
        die(json_encode(["response" => "Database connection failed!", "error" => $mysqli->connect_error]));
    }


    // prevenção contra xss e sql injection
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');


    $stmt = $mysqli->prepare("INSERT INTO messages (message) VALUES (?)");
    $stmt->bind_param("s", $message);
    
    if ($stmt->execute()) {
        echo json_encode(["response" => "Message received!"]);
    } else {
        echo json_encode(["response" => "Failed to save message", "error" => $stmt->error]);
    }
    
    $stmt->close();
    $mysqli->close();
} else {
    echo json_encode(["response" => "No message provided."]);
}
