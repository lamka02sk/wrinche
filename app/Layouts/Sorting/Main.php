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

                <!--<span class="mainline-edit" data-locale="SORTING_EDIT"></span>-->

                <div class="input-box">
                    <input type="search" name="dashboard-search" data-placeholder="SORTING_SEARCH">
                </div>

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