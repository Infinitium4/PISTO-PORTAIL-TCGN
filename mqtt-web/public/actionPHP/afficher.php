<?php

require_once 'logbdd.php';

$stmt = $pdo->query("SELECT * FROM univers");

$univers = $stmt->fetchAll(PDO::FETCH_ASSOC)?>