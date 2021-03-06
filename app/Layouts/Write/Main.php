<?php

use App\Models\ArticlesModel;

if(!App\Requests\Request::$ajax) :

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

else :

?>

<div class="content-header">

    <div class="header-mainline">
        
        <?php
        
        // Create title
        $title = false;
        if(isset(ArticlesModel::$article['articles_content']['title']))
            $title = true;
        
        ?>

        <h2 class="mainline-heading"<?php if(!$title) : ?>  data-locale="WRITE_TITLE"<?php endif ?>>
            <?= ArticlesModel::$article['articles_content']['title'] ?? '' ?>
        </h2>

        <div class="mainline-search">

            <div class="input-box">
                <input type="search" name="dashboard-search" data-placeholder="WRITE_SEARCH">
            </div>

        </div>

    </div>

    <?php

    // Create excerpt description
    $excerpt = false;
    if(isset(ArticlesModel::$article['articles_content']['excerpt']))
        $excerpt = true;
    
    $excerptContent = ArticlesModel::$article['articles_content']['excerpt'] ?? '';
    $excerptLength = strlen($excerptContent);
    
    $excerptResult = strip_tags($excerptContent);
    if($excerptLength > 36) {
        $excerptResult = substr($excerptResult, 0, 36);
        $excerptResult .= '...';
    }

    ?>

    <p class="header-description"<?php if(!$excerpt) : ?> data-locale="WRITE_DESCRIPTION"<?php endif ?>>
        <?= $excerptResult ?>
    </p>

</div>

<div
    class="content-content"
    data-type="<?= strtolower($controller->subcategory) ?>"
    data-id="<?= ArticlesModel::$article['articles']['id'] ?? '' ?>">

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

    <div class="content-tools">

        <button class="publish-content tool-button button" data-locale="WRITE_TOOLS_PUBLISH"></button>
        <button class="save-content tool-button button" data-locale="WRITE_TOOLS_SAVE"></button>
        <button class="preview-content tool-button button" data-locale="WRITE_TOOLS_PREVIEW"></button>

    </div>

    <div class="sticky-shadow"></div>

    <?php if(isset($layoutsList['_content_'])): ?>
    <div class="content-builder">

        <p class="builder-heading" data-locale="CONTENT_BUILDER_HEADING"></p>

        <div class="builder-tools">

        <?php

        foreach($layoutsList['_content_'] as $component):

        ?>

            <button class="icon-<?= $component ?> button add-content" data-content="<?= $component ?>" data-locale="ADD_<?= strtoupper($component) ?>"></button>

        <?php

        endforeach;
        
        $order = \App\Models\ComponentsModel::$resumedData['_order_'] ?? '';

        ?>

        </div>

        <div class="content-builder-content"
             data-language="-1"
             data-order="<?= htmlentities($order) ?>">

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

        <component-template id="component_inline_templates">

            <?php

            foreach($layoutsList['_content_'] as $component):

                ?>

                <component-template id="component_<?= $component ?>_template">

                    <?= $controller->componentsModel->displayComponent($component) ?>

                </component-template>

                <?php

            endforeach;

            ?>

        </component-template>

    </div>
    <?php endif; ?>

</div>

<?php

endif;