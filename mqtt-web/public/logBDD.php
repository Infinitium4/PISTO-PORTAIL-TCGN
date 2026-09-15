<?php
$pdo = new PDO(
    "mysql:host=172.16.89.44;dbname=univers_videos;charset=utf8mb4",
    "web_app",
    "root"
);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
?>