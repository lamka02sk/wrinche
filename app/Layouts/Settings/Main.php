<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

?>

<div class="content-wrapper" data-locales="system admin_settings admin_settings/<?= strtolower($controller->subcategory    ) ?>">

    <div class="content-header">

        <div class="header-mainline">

            <h2 class="mainline-heading" data-locale="SETTINGS_TITLE"></h2>

            <div class="mainline-search">

                <div class="input-box">
                    <input type="search" name="settings-search" data-placeholder="SETTINGS_SEARCH">
                </div>

            </div>

        </div>

        <p class="header-description" data-locale="SETTINGS_DESCRIPTION"></p>

    </div>

    <div class="content-content">

        <?php

        function isActive($subcategory, $controller) {
            if($subcategory === $controller->subcategory)
                return ' active';
            return '';
        }

        ?>

        <div class="menu-tabs">
            <span class="tabs-tab tab-appearance<?= isActive('appearance', $controller) ?>" data-target="content" data-link="settings/appearance" data-locale="SETTINGS_APPEARANCE"></span>
            <span class="tabs-tab tab-account<?= isActive('account', $controller) ?>" data-target="content" data-link="settings/account" data-locale="SETTINGS_ACCOUNT"></span>
        </div>

        <div class="content-subcontent">

            <?php

            require ROOT . '/app/Layouts/Settings/' . ucfirst($controller->subcategory) . '.php';

            ?>

        </div>

    </div>

</div>