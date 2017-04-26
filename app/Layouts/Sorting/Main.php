<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

?>

<div class="content-wrapper" data-locales="system admin_sorting admin_sorting/<?= strtolower($controller->subcategory) ?>">

    <div class="content-header">

        <div class="header-mainline">

            <h2 class="mainline-heading" data-locale="SORTING_TITLE"></h2>

            <div class="mainline-search">

                <button class="new-tag mainline-button icon-add" data-locale="SORTING_NEW_TAG" data-link="new/tag" data-target="content"></button>
                <button class="new-category mainline-button icon-add" data-locale="SORTING_NEW_CATEGORY" data-link="new/category" data-target="content"></button>

                <span class="mainline-edit" data-link="settings/sorting" data-target="content"></span>

            </div>

        </div>

        <p class="header-description" data-locale="SORTING_DESCRIPTION"></p>

    </div>

    <div class="content-content">

        <?php

        function isActive($subcategory, $controller) {
            if($subcategory === $controller->subcategory)
                return ' active';
            return '';
        }

        ?>

        <div class="menu-tabs tabs_2">
            <span class="tabs-tab<?= isActive('categories', $controller) ?>" data-target="content" data-link="sorting/categories" data-locale="SORTING_CATEGORIES"></span>
            <span class="tabs-tab<?= isActive('tags', $controller) ?>" data-target="content" data-link="sorting/tags" data-locale="SORTING_TAGS"></span>
        </div>

        <div class="content-subcontent">

            <?php

            require ROOT . '/app/Layouts/Sorting/' . ucfirst($controller->subcategory) . '.php';

            ?>

        </div>


    </div>

</div>