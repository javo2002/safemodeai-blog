<?php
// File: netlify/functions/api.php

// This handler function is the entry point for the serverless function.
exports.handler = function($event, $context) {
    // --- Database Connection using Transaction Pooler ---
    $host = 'aws-0-us-east-1.pooler.supabase.com';
    $port = 6543;
    $dbname = 'postgres';
    $user = 'postgres.ykspcijpivpodlehqohc';
    $password = getenv('SUPABASE_DB_PASSWORD'); // IMPORTANT: Store your password as an environment variable in Netlify

    $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};user={$user};password={$password}";

    try {
        $pdo = new PDO($dsn);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // --- Fetch published posts ---
        $stmt = $pdo->query("SELECT id, title, category, created_at FROM posts WHERE published = true ORDER BY created_at DESC");
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // --- Return a JSON response ---
        return [
            'statusCode' => 200,
            'headers' => [
                'Content-Type' => 'application/json',
                'Access-Control-Allow-Origin' => '*', // Allow requests from your Next.js app
            ],
            'body' => json_encode($posts)
        ];

    } catch (PDOException $e) {
        // --- Handle errors ---
        return [
            'statusCode' => 500,
            'headers' => [ 'Content-Type' => 'application/json' ],
            'body' => json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])
        ];
    }
};
