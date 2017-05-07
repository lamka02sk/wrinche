<?php

if(!App\Requests\Request::$ajax):

?>

    <!DOCTYPE html>
    <html id="html" lang="<?= $LANG ?>" data-lang="LOCALE">

    <head>
        <?php

        require ROOT . '/app/Layouts/Layout/Head.php';

        ?>
    </head>

    <body>
        <?php

        require ROOT . '/app/Layouts/Layout/Body.php';

        ?>
    </body>

    </html>

<?php

else:

    require ROOT . '/app/Layouts/Layout/Body.php';

endif;

?>