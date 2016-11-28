<meta charset="<?= $this->CONFIG['system']['charset'] ?>">
<meta name="viewport" content="width=device-width, user-scalable=none, initial-scale=1, maximum-scale=1">
<meta name="author" content="<?= $this->CONFIG['system']['name'] ?>">
<meta name="description" content="<?= $this->CONFIG['system']['description'] ?>">
<meta name="csrf_token" content="<?= $_SESSION['auth']['csrf_token'] ?>">

<?php

foreach($this->ASSETS['styles'] as $asset) {
    echo $asset;
}

require_once ROOT . '/app/Layouts/Layout/Title.php';