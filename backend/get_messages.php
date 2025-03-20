<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$mysqli = new mysqli("localhost", "root", "password", "bot_db", 3306);
if ($mysqli->connect_error) {
    echo json_encode(["error" => "Database connection failed!"]);
    exit();
}

$query = "SELECT user, message, created_at FROM messages ORDER BY created_at DESC LIMIT 5";
$result = $mysqli->query($query);

$messages = [];
while ($row = $result->fetch_assoc()) {
    $messages[] = [
        "user" => $row["user"] ?? "Unknown",
        "message" => $row["message"],
        "created_at" => $row["created_at"]
    ];
}

echo json_encode($messages);

$mysqli->close();
