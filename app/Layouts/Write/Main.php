<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

?>

<script type="text/javascript">
    if (!window['YT']) {var YT = {loading: 0,loaded: 0};}if (!window['YTConfig']) {var YTConfig = {'host': 'http://www.youtube.com'};}if (!YT.loading) {YT.loading = 1;(function(){var l = [];YT.ready = function(f) {if (YT.loaded) {f();} else {l.push(f);}};window.onYTReady = function() {YT.loaded = 1;for (var i = 0; i < l.length; i++) {try {l[i]();} catch (e) {}}};YT.setConfig = function(c) {for (var k in c) {if (c.hasOwnProperty(k)) {YTConfig[k] = c[k];}}};var a = document.createElement('script');a.type = 'text/javascript';a.id = 'www-widgetapi-script';a.src = 'https://s.ytimg.com/yts/jsbin/www-widgetapi-vflWkV39n/www-widgetapi.js';a.async = true;var b = document.getElementsByTagName('script')[0];b.parentNode.insertBefore(a, b);})();}
</script>

<div class="content-wrapper" data-locales="system admin_write admin_write/<?= strtolower($controller->subcategory) ?> components" data-type="<?= strtolower($controller->subcategory) ?>">

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

        <div class="content-tools">

            <button class="publish-content tool-button button" data-locale="WRITE_TOOLS_PUBLISH"></button>
            <button class="save-content tool-button button" data-locale="WRITE_TOOLS_SAVE"></button>
            <button class="preview-content tool-button button" data-locale="WRITE_TOOLS_PREVIEW"></button>

        </div>

        <div class="sticky-shadow"></div>

        <?php if(isset($layoutsList['_content_'])): ?>
        <div class="content-builder">

            <p class="builder-heading" data-locale="CONTENT_BUILDER_HEADING"></p>
            <!--<select class="selector-search-select" name="write_current_language">
                <option value="-1" selected data-locale="LANGUAGES_ALL"></option>
            </select>-->

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

</div>