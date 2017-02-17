CREATE TABLE IF NOT EXISTS passwords_old (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  password VARCHAR(512) NOT NULL,
  created TIMESTAMP DEFAULT current_timestamp,
  updated TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp,

  FOREIGN KEY (user_id) REFERENCES users (id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;