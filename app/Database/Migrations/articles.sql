CREATE TABLE IF NOT EXISTS articles (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  author INT(11) NOT NULL,
  layout INT(3) NOT NULL DEFAULT 0,
  pin INT(1) DEFAULT 0 NOT NULL,
  thumbnail VARCHAR(512) DEFAULT NULL,
  title_picture VARCHAR(512) DEFAULT NULL,
  attachments JSON DEFAULT NULL,
  meta INT(1) DEFAULT 0 NOT NULL,
  meta_index INT(1) NOT NULL DEFAULT 0,
  status INT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT current_timestamp,
  edited_at TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp,
  copyright INT(1) NOT NULL DEFAULT 0,
  comments INT(1) NOT NULL DEFAULT 0,
  accessibility INT(1) NOT NULL DEFAULT 0,
  password VARCHAR(72) DEFAULT NULL,
  mistakes INT(1) NOT NULL DEFAULT 0,
  analytics INT(1) NOT NULL DEFAULT 0,
  planner_auto INT(1) NOT NULL DEFAULT 0,
  planner_publish TIMESTAMP NULL DEFAULT NULL,
  planner_expiry TIMESTAMP NULL DEFAULT NULL,
  planner_notify INT(1) NOT NULL DEFAULT 0,
  preview VARCHAR(32) NOT NULL UNIQUE,

  FOREIGN KEY (author) REFERENCES users(id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;