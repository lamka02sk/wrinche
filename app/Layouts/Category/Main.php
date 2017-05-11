<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

$data = $controller->currentCategory();

?>

<div class="content-wrapper" data-locales="system admin_edit admin_edit/category admin_new admin_new/category" data-id="<?= $data['id'] ?>">

    <div class="content-header">

        <div class="header-mainline">

            <h2 class="mainline-heading"><?= $data['name'] ?></h2>

            <div class="mainline-search">

                <div class="input-box">
                    <input type="search" name="settings-search" data-placeholder="EDIT_CATEGORY_SEARCH">
                </div>

            </div>

        </div>

        <p class="header-description" data-locale="EDIT_CATEGORY_DESCRIPTION"></p>

    </div>

    <div class="content-content small-margin-bottom">

        <div class="left-column">

            <div class="settings-component">
                <label class="big-label" for="category-name" data-locale="NEW_CATEGORY_NAME_LABEL"></label>
                <div class="info-box tall-info">
                    <span class="info-hover"></span>
                    <span class="info-text" data-locale="NEW_CATEGORY_NAME_INFO"></span>
                </div>
                <div class="counter name-counter big-counter" data-input="input" data-maxlength="100"></div>
                <input class="big-input" data-placeholder="NEW_CATEGORY_NAME_PLACEHOLDER" name="new_category_name" id="category-name" type="text" value="<?= $data['name'] ?>">
            </div>

            <div class="settings-component">
                <label class="label" for="category-url" data-locale="NEW_CATEGORY_URL_LABEL"></label>
                <div class="info-box">
                    <span class="info-hover"></span>
                    <span class="info-text" data-locale="NEW_CATEGORY_URL_INFO"></span>
                </div>
                <div class="counter url-counter" data-input="input" data-maxlength="120"></div>
                <input class="input" data-placeholder="NEW_CATEGORY_URL_PLACEHOLDER" name="new_category_url" id="category-url" type="text" value="<?= $data['url'] ?>">
                <span class="validate-message" data-locale=""></span>
            </div>

            <div class="settings-component">
                <label class="label" for="category-parent" data-locale="NEW_CATEGORY_PARENT_LABEL"></label>
                <div class="info-box">
                    <span class="info-hover"></span>
                    <span class="info-text" data-locale="NEW_CATEGORY_PARENT_INFO"></span>
                </div>
                <select name="new_category_parent" class="selector-instance" data-type="search-selector" id="category-parent">

                    <?php

                    use App\Models\CategoriesModel;

                    $categories = new CategoriesModel;
                    $categories->prepareAllCategories();

                    ?>

                    <option value="-1" data-locale="NEW_CATEGORY_PARENT_NONE"<?php if($data['parent'] === -1) echo ' selected' ?>></option>

                    <?php

                    foreach(CategoriesModel::$categories as $category):

                        ?>

                        <option value="<?= $category['id'] ?>"<?php if($data['parent'] === $category['id']) echo ' selected' ?>><?= $category['name'] ?></option>

                        <?php

                    endforeach;

                    ?>

                </select>
            </div>

            <div class="settings-component">
                <label class="label" for="category-description" data-locale="NEW_CATEGORY_DESCRIPTION_LABEL"></label>
                <div class="info-box">
                    <span class="info-hover"></span>
                    <span class="info-text" data-locale="NEW_CATEGORY_DESCRIPTION_INFO"></span>
                </div>
                <div class="counter fuck-chrome description-counter" data-input="textarea" data-maxlength="200"></div>
                <textarea class="small-textarea" name="new_category_description" data-placeholder="NEW_CATEGORY_DESCRIPTION_PLACEHOLDER" id="category-description"><?= $data['description'] ?></textarea>
            </div>

            <div class="settings-component">
                <label class="label" for="category-thumbnail" data-locale="NEW_CATEGORY_THUMBNAIL_LABEL"></label>
                <div class="info-box">
                    <span class="info-hover"></span>
                    <span class="info-text" data-locale="NEW_CATEGORY_THUMBNAIL_INFO"></span>
                </div>
                <div class="input-box<?php if($data['thumbnail'] !== null) echo ' hide' ?>">
                    <button class="button image_manager" data-locale="NEW_CATEGORY_THUMBNAIL_MANAGER" data-manager="images"></button>
                    <span class="or" data-locale="NEW_OR"></span>
                    <input data-placeholder="NEW_CATEGORY_THUMBNAIL_INPUT" class="input" name="new_category_thumbnail_input" type="url">
                    <span class="validate-message" data-locale=""></span>
                    <span class="info-text-outside" data-locale="NEW_CATEGORY_THUMBNAIL_URL_INFO"></span>
                </div>
                <?php

                if($data['thumbnail'] !== null):

                    ?>

                    <div class="header_image-image category-image-instance" data-path="<?= $data['thumbnail'] ?>">
                        <img class="header_image-image-content" src="<?= $data['thumbnail'] ?>" alt="<?= $data['name'] ?> Thumbnail">
                        <p class="header_image-name"><?= basename($data['thumbnail']) ?></p>
                        <span class="header_image-remove"></span>
                    </div>

                    <?php

                endif;

                ?>
                <component-template id="template_new_category_thumbnail_image">
                    <div class="header_image-image" data-path="">
                        <img class="header_image-image-content" src="" alt="">
                        <p class="header_image-name"></p>
                        <span class="header_image-remove"></span>
                    </div>
                </component-template>
            </div>

            <div class="settings-component">
                <label class="label checkbox-click" for="category-visible" data-locale="NEW_CATEGORY_VISIBILITY_LABEL"></label>
                <input class="input" value="visible" name="new_category_visibility" id="category-visible" type="checkbox"<?php if($data['visibility'] === '1') echo ' checked'?>>
                <span class="info-text-outside" data-locale="NEW_CATEGORY_VISIBILITY_INFO"></span>
            </div>

        </div>

        <div class="right-column">

            <h3 data-locale="EDIT_CATEGORY_"></h3>

        </div>

    </div>

    <div class="action-bar action-bar-new">
        <span class="result-message" data-locale=""></span>

        <button class="action-button save-button" data-locale="BUTTON_EDIT_SAVE"></button>

    </div>

</div>