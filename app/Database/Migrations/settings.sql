CREATE TABLE IF NOT EXISTS user_settings (

  id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT(11) NOT NULL,
  language INT(4) DEFAULT 0 NOT NULL,
  theme INT(4) DEFAULT 0 NOT NULL,
  first_day INT(2) DEFAULT 0 NOT NULL,
  date_format INT(2) DEFAULT 0 NULL,
  time_format INT(2) DEFAULT 0 NULL,
  number_format INT(2) DEFAULT 0 NULL,
  timezone INT(6) DEFAULT 0 NOT NULL,
  custom_settings JSON NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id)

) AUTO_INCREMENT 1
  DEFAULT CHARACTER SET utf8
  DEFAULT COLLATE utf8_general_ci;