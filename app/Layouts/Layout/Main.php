<?php

if(!App\Requests\Request::$ajax):

?>

    <!DOCTYPE html>
    <html id="html" lang="<?= $LANG ?>" data-lang="LOCALE">

    <head>
        <?php

        require_once ROOT . '/app/Layouts/Layout/Head.php';

        ?>
    </head>

    <body>
        <?php

        require_once ROOT . '/app/Layouts/Layout/Body.php';

        ?>
    </body>

    </html>

<?php

else:

    require_once ROOT . '/app/Layouts/Layout/Body.php';

endif;

?>