CREATE TABLE IF NOT EXISTS articles_content (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  article_id INT(11) NOT NULL,
  language INT(4) DEFAULT -1 NOT NULL,
  title VARCHAR(128) NOT NULL,
  excerpt VARCHAR(384) NOT NULL,
  url VARCHAR(128) NOT NULL,
  perex_date DATETIME DEFAULT NULL,
  perex_location VARCHAR(128) NOT NULL,
  tags JSON NOT NULL,
  categories JSON NOT NULL,
  custom_fields JSON NOT NULL,
  meta_keywords VARCHAR(1024) DEFAULT NULL,
  meta_description VARCHAR(1024) DEFAULT NULL,
  sources JSON NOT NULL,
  content JSON NOT NULL,
  prerender LONGTEXT DEFAULT NULL,

  FOREIGN KEY (article_id) REFERENCES articles(id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;