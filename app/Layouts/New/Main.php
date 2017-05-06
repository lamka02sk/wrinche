<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

$SUBCATEGORY = strtoupper($controller->subcategory);

?>

<div class="content-wrapper" data-locales="system admin_new admin_new/<?= strtolower($controller->subcategory) ?>">

    <div class="content-header">

        <div class="header-mainline">

            <h2 class="mainline-heading" data-locale="NEW_<?= $SUBCATEGORY ?>_TITLE"></h2>

            <div class="mainline-search">

                <div class="input-box">
                    <input type="search" name="settings-search" data-placeholder="NEW_<?= $SUBCATEGORY ?>_SEARCH">
                </div>

            </div>

        </div>

        <p class="header-description" data-locale="NEW_<?= $SUBCATEGORY ?>_DESCRIPTION"></p>

    </div>

    <div class="content-content small-margin-bottom">

        <?php

        require ROOT . '/app/Layouts/New/' . ucfirst($controller->subcategory) . '.php';

        ?>

    </div>

    <div class="action-bar action-bar-new">

        <span class="result-message" data-locale=""></span>

        <button class="action-button save-button" data-locale="NEW_<?= $SUBCATEGORY ?>_CREATE"></button>

    </div>

</div>