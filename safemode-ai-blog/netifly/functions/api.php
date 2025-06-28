<?php
// File: netlify/functions/api.php

exports.handler = function($event, $context) {
    $host = 'aws-0-us-east-1.pooler.supabase.com';
    $port = 6543;
    $dbname = 'postgres';
    $user = 'postgres.ykspcijpivpodlehqohc';
    $password = getenv('SUPABASE_DB_PASSWORD');

    $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};user={$user};password={$password}";

    try {
        $pdo = new PDO($dsn);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // --- CORRECTED QUERY: Added 'content' and 'image' to the SELECT statement ---
        $stmt = $pdo->query("SELECT id, title, content, category, image, created_at FROM posts WHERE published = true ORDER BY created_at DESC");
        
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            'statusCode' => 200,
            'headers' => [
                'Content-Type' => 'application/json',
                'Access-Control-Allow-Origin' => '*',
            ],
            'body' => json_encode($posts)
        ];

    } catch (PDOException $e) {
        return [
            'statusCode' => 500,
            'headers' => [ 'Content-Type' => 'application/json' ],
            'body' => json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])
        ];
    }
};
