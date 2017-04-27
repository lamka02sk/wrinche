<div class="settings-component">
    <label class="big-label" for="category-name" data-locale="NEW_CATEGORY_NAME_LABEL"></label>
    <div class="info-box tall-info">
        <span class="info-hover"></span>
        <span class="info-text" data-locale="NEW_CATEGORY_NAME_INFO"></span>
    </div>
    <div class="counter name-counter big-counter" data-input="input" data-maxlength="100"></div>
    <input class="big-input" data-placeholder="NEW_CATEGORY_NAME_PLACEHOLDER" name="new_category_name"
           id="category-name" type="text">
</div>

<div class="settings-component">
    <label class="label" for="category-url" data-locale="NEW_CATEGORY_URL_LABEL"></label>
    <div class="info-box">
        <span class="info-hover"></span>
        <span class="info-text" data-locale="NEW_CATEGORY_URL_INFO"></span>
    </div>
    <div class="counter url-counter" data-input="input" data-maxlength="120"></div>
    <input class="input" data-placeholder="NEW_CATEGORY_URL_PLACEHOLDER" name="new_category_url" id="category-url" type="url">
</div>

<?php

use App\Models\CategoriesModel;

$categories = new CategoriesModel;
$categories->prepareAllCategories();

?>

<div class="settings-component">
    <label class="label" for="category-parent" data-locale="NEW_CATEGORY_PARENT_LABEL"></label>
    <div class="info-box">
        <span class="info-hover"></span>
        <span class="info-text" data-locale="NEW_CATEGORY_PARENT_INFO"></span>
    </div>
    <select name="new_category_parent" class="selector-instance" data-type="search-selector" id="category-parent">

        <option value="-1" data-locale="NEW_CATEGORY_PARENT_NONE" selected></option>

        <?php

        foreach(CategoriesModel::$categories as $category):

        ?>

            <option value="<?= $category['id'] ?>"><?= $category['name'] ?></option>

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
    <textarea class="small-textarea" name="new_category_description" data-placeholder="NEW_CATEGORY_DESCRIPTION_PLACEHOLDER" id="category-description"></textarea>
</div>

<div class="settings-component">
    <label class="label" for="category-thumbnail" data-locale="NEW_CATEGORY_THUMBNAIL_LABEL"></label>
    <div class="info-box">
        <span class="info-hover"></span>
        <span class="info-text" data-locale="NEW_CATEGORY_THUMBNAIL_INFO"></span>
    </div>
    <div class="input-box">
        <button class="button image_manager" data-locale="NEW_CATEGORY_THUMBNAIL_MANAGER" data-manager="images"></button>
        <span class="or" data-locale="NEW_OR"></span>
        <input data-placeholder="NEW_CATEGORY_THUMBNAIL_INPUT" class="input" name="new_category_thumbnail_input" type="url">
        <span class="validate-message" data-locale=""></span>
        <span class="info-text-outside" data-locale="NEW_CATEGORY_THUMBNAIL_URL_INFO"></span>
    </div>
    <component-template id="template_new_category_thumbnail_image">
        <div class="header_image-image" data-path="">
            <img class="header_image-image-content" src="" alt="">
            <p class="header_image-name"></p>
            <span class="header_image-remove"></span></div>
    </component-template>
</div>

<div class="settings-component">
    <label class="label checkbox-click" for="category-visible" data-locale="NEW_CATEGORY_VISIBILITY_LABEL"></label>
    <input class="input" value="visible" name="new_category_visibility" id="category-visible" type="checkbox" checked>
    <span class="info-text-outside" data-locale="NEW_CATEGORY_VISIBILITY_INFO"></span>
</div>