CREATE TABLE IF NOT EXISTS users (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(25) NOT NULL,
  email VARCHAR(256) NOT NULL,
  password VARCHAR(512) NOT NULL,
  picture VARCHAR(512) DEFAULT NULL,
  admin INT(1) NOT NULL DEFAULT 0,
  active BOOLEAN DEFAULT FALSE,
  created TIMESTAMP DEFAULT current_timestamp,
  updated TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;

CREATE INDEX user_names
  ON users (username) USING HASH;

CREATE INDEX user_emails
  ON users (email) USING HASH;