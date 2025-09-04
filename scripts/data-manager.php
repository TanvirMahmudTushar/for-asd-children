<?php
// Data management functions for ASD Robot system

class ASDRobotDataManager {
    private $pdo;
    
    public function __construct($host, $dbname, $username, $password) {
        try {
            $this->pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            throw new Exception("Database connection failed: " . $e->getMessage());
        }
    }
    
    // User management
    public function createUser($username, $fullName, $age, $diagnosisLevel) {
        $stmt = $this->pdo->prepare("
            INSERT INTO users (username, full_name, age, diagnosis_level) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$username, $fullName, $age, $diagnosisLevel]);
        return $this->pdo->lastInsertId();
    }
    
    public function getUserProgress($userId) {
        $stmt = $this->pdo->prepare("
            SELECT * FROM user_progress WHERE user_id = ?
        ");
        $stmt->execute([$userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    // Conversation management
    public function saveConversation($userId, $messageText, $messageType, $category = null, $cardId = null) {
        $stmt = $this->pdo->prepare("
            INSERT INTO conversation_history (user_id, message_text, message_type, category, card_id) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$userId, $messageText, $messageType, $category, $cardId]);
        
        // Update user progress
        $this->updateUserProgress($userId, $category, $cardId);
        
        return $this->pdo->lastInsertId();
    }
    
    public function getConversationHistory($userId, $limit = 50) {
        $stmt = $this->pdo->prepare("
            SELECT * FROM conversation_history 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        ");
        $stmt->execute([$userId, $limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Progress tracking
    private function updateUserProgress($userId, $category, $cardId) {
        // Get current progress
        $progress = $this->getUserProgress($userId);
        
        if (!$progress) {
            // Create new progress record
            $stmt = $this->pdo->prepare("
                INSERT INTO user_progress (user_id, total_interactions, categories_used, favorite_cards, learning_goals) 
                VALUES (?, 1, ?, ?, ?)
            ");
            $categories = $category ? [$category] : [];
            $cards = $cardId ? [$cardId] : [];
            $stmt->execute([$userId, json_encode($categories), json_encode($cards), json_encode([])]);
        } else {
            // Update existing progress
            $categories = json_decode($progress['categories_used'], true) ?: [];
            $cards = json_decode($progress['favorite_cards'], true) ?: [];
            
            if ($category && !in_array($category, $categories)) {
                $categories[] = $category;
            }
            
            if ($cardId && !in_array($cardId, $cards)) {
                $cards[] = $cardId;
                // Keep only last 10 favorite cards
                if (count($cards) > 10) {
                    $cards = array_slice($cards, -10);
                }
            }
            
            $stmt = $this->pdo->prepare("
                UPDATE user_progress 
                SET total_interactions = total_interactions + 1,
                    categories_used = ?,
                    favorite_cards = ?,
                    last_active = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ");
            $stmt->execute([json_encode($categories), json_encode($cards), $userId]);
        }
    }
    
    // Analytics
    public function generateAnalytics($userId) {
        $progress = $this->getUserProgress($userId);
        if (!$progress) return null;
        
        // Get conversation stats
        $stmt = $this->pdo->prepare("
            SELECT category, COUNT(*) as count 
            FROM conversation_history 
            WHERE user_id = ? AND category IS NOT NULL 
            GROUP BY category
        ");
        $stmt->execute([$userId]);
        $categoryStats = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        // Get daily activity
        $stmt = $this->pdo->prepare("
            SELECT DATE(timestamp) as date, COUNT(*) as count 
            FROM conversation_history 
            WHERE user_id = ? 
            GROUP BY DATE(timestamp) 
            ORDER BY date DESC 
            LIMIT 30
        ");
        $stmt->execute([$userId]);
        $dailyActivity = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        
        return [
            'totalInteractions' => $progress['total_interactions'],
            'categoriesUsed' => json_decode($progress['categories_used'], true),
            'favoriteCards' => json_decode($progress['favorite_cards'], true),
            'categoryStats' => $categoryStats,
            'dailyActivity' => $dailyActivity,
            'learningGoals' => json_decode($progress['learning_goals'], true),
            'lastActive' => $progress['last_active']
        ];
    }
    
    // Custom content management
    public function createCustomContent($type, $title, $contentData, $createdBy) {
        $stmt = $this->pdo->prepare("
            INSERT INTO custom_content (content_type, title, content_data, created_by) 
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([$type, $title, json_encode($contentData), $createdBy]);
        return $this->pdo->lastInsertId();
    }
    
    public function getCustomContent($type = null, $createdBy = null) {
        $sql = "SELECT * FROM custom_content WHERE is_active = TRUE";
        $params = [];
        
        if ($type) {
            $sql .= " AND content_type = ?";
            $params[] = $type;
        }
        
        if ($createdBy) {
            $sql .= " AND created_by = ?";
            $params[] = $createdBy;
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Export data for reports
    public function exportUserData($userId) {
        $user = $this->pdo->prepare("SELECT * FROM users WHERE id = ?");
        $user->execute([$userId]);
        $userData = $user->fetch(PDO::FETCH_ASSOC);
        
        $conversations = $this->getConversationHistory($userId, 1000);
        $progress = $this->getUserProgress($userId);
        $analytics = $this->generateAnalytics($userId);
        
        return [
            'user' => $userData,
            'conversations' => $conversations,
            'progress' => $progress,
            'analytics' => $analytics,
            'exportDate' => date('Y-m-d H:i:s')
        ];
    }
}

// Usage example
if (php_sapi_name() === 'cli') {
    try {
        $dataManager = new ASDRobotDataManager('localhost', 'asd_robot_db', 'root', '');
        
        // Example: Save a conversation
        $conversationId = $dataManager->saveConversation(1, 'আমি খেতে চাই', 'user', 'basic-needs', 'eat');
        echo "Conversation saved with ID: $conversationId\n";
        
        // Example: Get analytics
        $analytics = $dataManager->generateAnalytics(1);
        echo "User analytics: " . json_encode($analytics, JSON_UNESCAPED_UNICODE) . "\n";
        
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
