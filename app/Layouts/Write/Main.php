<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

?>

<div class="content-wrapper" data-locales="system admin_write admin_write/<?= strtolower($controller->subcategory) ?> components">

    <div class="content-header">

        <div class="header-mainline">

            <h2 class="mainline-heading" data-locale="WRITE_TITLE"></h2>

            <div class="mainline-search">

                <div class="input-box">
                    <input type="search" name="dashboard-search" data-placeholder="WRITE_SEARCH">
                </div>

            </div>

        </div>

        <p class="header-description" data-locale="WRITE_DESCRIPTION"></p>

    </div>

    <div class="content-content">

        <div class="content-settings">

            <?php

            $layoutsList = App\Models\TemplateModel::$template['layouts'][$controller->subcategory];
            foreach($layoutsList['components'] as $layout):

            ?>

                <?= $controller->componentsModel->displayComponent($layout) ?>

            <?php

            endforeach;

            ?>

            <div class="collapse-bar">

                <span class="collapse-trigger">
                    <span class="text-open" data-locale="BUTTON_COLLAPSE_OPEN"></span>
                    <span class="text-close" data-locale="BUTTON_COLLAPSE_CLOSE"></span>
                </span>

            </div>

        </div>

        <div class="divider"></div>

        <?php if(isset($layoutsList['_content_'])): ?>
        <div class="content-builder">

            <p class="builder-heading" data-locale="CONTENT_BUILDER_HEADING"></p>
            <select class="selector-search-select" name="write_current_language">
                <option value="-1" selected data-locale="LANGUAGES_ALL"></option>
            </select>

            <div class="builder-tools">

            <?php

            foreach($layoutsList['_content_'] as $component):

            ?>

                <button class="icon-<?= $component ?> button add-content" data-content="<?= $component ?>" data-locale="ADD_<?= strtoupper($component) ?>"></button>

            <?php

            endforeach;

            ?>

            </div>

            <div class="content-builder-content" data-language="-1">

                <p class="empty" data-locale="EMPTY_CONTENT"></p>

            </div>

            <div class="builder-tools">

                <?php

                foreach($layoutsList['_content_'] as $component):

                    ?>

                    <button class="icon-<?= $component ?> button add-content" data-content="<?= $component ?>" data-locale="ADD_<?= strtoupper($component) ?>"></button>

                    <?php

                endforeach;

                ?>

            </div>

        </div>
        <?php endif; ?>

    </div>

</div>