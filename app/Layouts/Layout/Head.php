<meta charset="<?= $_SESSION['CONFIG']['system']['charset'] ?>">
<meta name="viewport" content="width=device-width, user-scalable=none, initial-scale=1, maximum-scale=1">
<meta name="author" content="<?= $_SESSION['CONFIG']['system']['name'] ?>">
<meta name="description" content="<?= $_SESSION['CONFIG']['system']['description'] ?>">
<meta name="csrf_token" content="<?= $_SESSION['auth']['csrf_token'] ?>">
<?php foreach($this->ASSETS as $asset) {
    echo $asset;
} ?>
<?php require_once 'app/Layouts/Layout/Title.php' ?>