CREATE TABLE IF NOT EXISTS articles_content (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  article_id INT(11) NOT NULL,
  content JSON NOT NULL,
  content_prerender TEXT NOT NULL,

  FOREIGN KEY (article_id) REFERENCES articles(id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;