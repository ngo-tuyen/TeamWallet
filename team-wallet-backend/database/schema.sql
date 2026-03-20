-- Team Wallet Database Schema
-- Run this file to initialize the database

CREATE DATABASE IF NOT EXISTS team_wallet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE team_wallet;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'ユーザーID',
    username VARCHAR(255) UNIQUE NOT NULL COMMENT 'ユーザー名',
    password_hash VARCHAR(255) NOT NULL COMMENT 'bcryptパスワードハッシュ',
    full_name VARCHAR(255) NOT NULL COMMENT '姓名',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
    
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Teams Table
CREATE TABLE IF NOT EXISTS teams (
    team_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Team ID',
    team_name VARCHAR(255) NOT NULL COMMENT 'Team name',
    admin_id INT NOT NULL COMMENT 'Admin user ID',
    description TEXT COMMENT 'Team description',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
    
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    member_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Member ID',
    user_id INT NOT NULL COMMENT 'User ID',
    team_id INT NOT NULL COMMENT 'Team ID',
    role ENUM('admin', 'manager', 'user') DEFAULT 'user' COMMENT 'Role',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Joined at',
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    UNIQUE KEY unique_member (user_id, team_id),
    INDEX idx_team_id (team_id),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Expense Categories Table
CREATE TABLE IF NOT EXISTS expense_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Category ID',
    team_id INT NOT NULL COMMENT 'Team ID',
    category_name VARCHAR(255) NOT NULL COMMENT 'Category name',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    UNIQUE KEY unique_category (team_id, category_name),
    INDEX idx_team_id (team_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Incomes Table
CREATE TABLE IF NOT EXISTS incomes (
    income_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Income ID',
    team_id INT NOT NULL COMMENT 'Team ID',
    user_id INT NOT NULL COMMENT 'Recorder user ID',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Amount',
    income_date DATE NOT NULL COMMENT 'Income date',
    notes TEXT COMMENT 'Notes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_team_id (team_id),
    INDEX idx_income_date (income_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    expense_id INT PRIMARY KEY AUTO_INCREMENT COMMENT 'Expense ID',
    team_id INT NOT NULL COMMENT 'Team ID',
    user_id INT NOT NULL COMMENT 'Recorder user ID',
    category_id INT NOT NULL COMMENT 'Category ID',
    amount DECIMAL(10, 2) NOT NULL COMMENT 'Amount',
    expense_date DATE NOT NULL COMMENT 'Expense date',
    notes TEXT COMMENT 'Notes',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(category_id) ON DELETE RESTRICT,
    INDEX idx_team_id (team_id),
    INDEX idx_category_id (category_id),
    INDEX idx_expense_date (expense_date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Invitations Table (チーム参加招待)
CREATE TABLE IF NOT EXISTS invitations (
    invitation_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '招待ID',
    team_id INT NOT NULL COMMENT 'チームID',
    user_id INT NOT NULL COMMENT '招待されたユーザーID',
    invited_by INT NOT NULL COMMENT '招待したユーザーID',
    role ENUM('admin', 'manager', 'user') DEFAULT 'user' COMMENT 'ロール',
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending' COMMENT 'ステータス',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '作成日時',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新日時',
    
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (invited_by) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_pending_invitation (team_id, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_team_id (team_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;