<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

?>

<div class="content-wrapper" data-locales="system admin_new admin_new/<?= strtolower($controller->subcategory) ?>">

    <div class="content-header">

        <div class="header-mainline">

            <h2 class="mainline-heading" data-locale="NEW_<?= strtoupper($controller->subcategory) ?>_TITLE"></h2>

            <div class="mainline-search">

                <div class="input-box">
                    <input type="search" name="settings-search" data-placeholder="NEW_<?= strtoupper($controller->subcategory) ?>_SEARCH">
                </div>

            </div>

        </div>

        <p class="header-description" data-locale="NEW_<?= strtoupper($controller->subcategory) ?>_DESCRIPTION"></p>

    </div>

    <div class="content-content">

        <?php

        require ROOT . '/app/Layouts/New/' . ucfirst($controller->subcategory) . '.php';

        ?>

    </div>

</div>