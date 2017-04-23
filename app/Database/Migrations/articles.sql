CREATE TABLE IF NOT EXISTS articles (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  author_id INT(11) NOT NULL,
  layout INT(3) NOT NULL DEFAULT 0,
  title VARCHAR(128) NOT NULL,
  excerpt VARCHAR(396) NOT NULL,
  url VARCHAR(128) NOT NULL,
  pin INT(1) DEFAULT 0 NOT NULL,
  perex_date DATE NOT NULL,
  perex_location VARCHAR(120) NOT NULL,
  thumbnail VARCHAR(512) NOT NULL,
  header_image VARCHAR(512) NOT NULL,
  attachments INT(1) NOT NULL DEFAULT 0,
  custom_fields JSON NOT NULL,
  revisions INT(1) NOT NULL DEFAULT 0,
  publish_date TIMESTAMP DEFAULT current_timestamp,
  expiration_date TIMESTAMP DEFAULT current_timestamp,
  notifications JSON NOT NULL,
  meta_keywords VARCHAR(512) NOT NULL,
  meta_description VARCHAR(512) NOT NULL,
  robots INT(1) NOT NULL DEFAULT 0,
  status INT(1) NOT NULL DEFAULT 0,
  authors JSON NOT NULL,
  created_at TIMESTAMP DEFAULT current_timestamp,
  updated_at TIMESTAMP DEFAULT current_timestamp ON UPDATE current_timestamp,
  copyright VARCHAR(128) NOT NULL,
  license INT(2) NOT NULL DEFAULT 0,
  comments INT(1) NOT NULL DEFAULT 1,
  comments_access INT(2) NOT NULL DEFAULT 0,
  comments_approval INT(1) NOT NULL DEFAULT 0,
  access INT(2) NOT NULL DEFAULT 0,
  sources JSON NOT NULL,
  prerender INT(1) NOT NULL DEFAULT 0,
  mistakes INT(1) NOT NULL DEFAULT 0,
  analytics INT(1) NOT NULL DEFAULT 0,
  language INT(4) NOT NULL DEFAULT 0,

  FOREIGN KEY (author_id) REFERENCES users(id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;