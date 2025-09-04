<?php
// Database setup script for ASD Robot PECS system
// This script creates the necessary tables for data management

$host = 'localhost';
$dbname = 'asd_robot_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE $dbname");
    
    // Users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            age INT,
            diagnosis_level VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    // Conversation history table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS conversation_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            message_text TEXT NOT NULL,
            message_type ENUM('user', 'robot') NOT NULL,
            category VARCHAR(50),
            card_id VARCHAR(50),
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
    
    // User progress table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS user_progress (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            total_interactions INT DEFAULT 0,
            categories_used JSON,
            favorite_cards JSON,
            learning_goals JSON,
            last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
    
    // Custom content table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS custom_content (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content_type ENUM('story', 'card', 'activity') NOT NULL,
            title VARCHAR(200) NOT NULL,
            content_data JSON NOT NULL,
            created_by VARCHAR(100),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    ");
    
    // Learning analytics table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS learning_analytics (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            session_date DATE,
            interactions_count INT DEFAULT 0,
            categories_explored JSON,
            time_spent_minutes INT DEFAULT 0,
            achievements JSON,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ");
    
    // Insert sample data
    $pdo->exec("
        INSERT IGNORE INTO users (id, username, full_name, age, diagnosis_level) VALUES 
        (1, 'sample_child', 'নমুনা শিশু', 6, 'Level 1'),
        (2, 'test_user', 'পরীক্ষা ব্যবহারকারী', 7, 'Level 1')
    ");
    
    $pdo->exec("
        INSERT IGNORE INTO custom_content (content_type, title, content_data, created_by) VALUES 
        ('story', 'আমার দৈনন্দিন রুটিন', '{\"slides\": [{\"text\": \"সকালে ঘুম থেকে উঠি\", \"image\": \"/morning-routine.jpg\"}, {\"text\": \"দাঁত ব্রাশ করি\", \"image\": \"/brushing-teeth.jpg\"}, {\"text\": \"নাস্তা খাই\", \"image\": \"/breakfast.jpg\"}], \"voiceText\": [\"সকালে ঘুম থেকে উঠি\", \"দাঁত ব্রাশ করি\", \"নাস্তা খাই\"]}', 'therapist')
    ");
    
    echo "Database and tables created successfully!\n";
    echo "Sample data inserted.\n";
    
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
