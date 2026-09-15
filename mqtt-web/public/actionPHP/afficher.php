<?php

require_once 'logBDD.php';

$stmt = $pdo->query("SELECT * FROM univers");

$univers = $stmt->fetchAll(PDO::FETCH_ASSOC)
?>