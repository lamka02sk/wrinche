CREATE TABLE IF NOT EXISTS tokens (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  remember_token VARCHAR(1024) DEFAULT NULL,
  forgot_token VARCHAR(1024) DEFAULT NULL,
  action_token VARCHAR(512) DEFAULT NULL,
  control_token VARCHAR(512) DEFAULT NULL,
  created TIMESTAMP DEFAULT current_timestamp,
  updated TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp,
  expiration INT(1) DEFAULT 0,

  FOREIGN KEY (user_id) REFERENCES users(id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;