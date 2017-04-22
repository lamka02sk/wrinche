CREATE TABLE IF NOT EXISTS revisions (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  article_id INT(11) NOT NULL,
  description VARCHAR(256) NOT NULL,
  number INT(11) NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,

  FOREIGN KEY (article_id) REFERENCES articles(id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;