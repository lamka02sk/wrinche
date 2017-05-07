<?php

use App\Helpers\Locale;
use App\Models\CategoriesModel;

$categories = new CategoriesModel;
$categories->start(true);

$locale = new Locale;

if(empty(CategoriesModel::$categories)):

?>

    <p class="empty" data-locale="NO_CATEGORIES"></p>

<?php

else:

    foreach(CategoriesModel::$categories as $category):

    ?>

            <div class="content-tail fourth-tail category-tail" data-id="<?= $category['id'] ?>">

                <?php

                if($category['thumbnail'] === null)
                    $category['thumbnail'] = 'assets/backgrounds/desert.jpg';

                ?>

                <img src="<?= $category['thumbnail'] ?>" alt="<?= $category['name'] ?> Thumbnail">

                <?php

                $visibility = 'VISIBILITY_VISIBLE';
                if((int)$category['visibility'] === 0)
                    $visibility = 'VISIBILITY_HIDDEN';

                $parent = '';
                if($category['parent'] !== null):
                    $parent = ' subcategory';

                ?>

                    <span class="category-tail-parent"><?= CategoriesModel::$categories[$category['parent']]['name'] ?></span>

                <?php

                endif;

                ?>

                <p class="category-tail-name<?= $parent ?>"><?= $category['name'] ?></p>
                <span class="category-tail-remove"></span>
                <span class="category-tail-posts"><?= $category['count'] ?> <span class="post-text" data-locale="<?= $locale->decline($category['count'], 'POST') ?>"></span></span>

                <span class="category-tail-visibility" data-locale="<?= $visibility ?>"></span>
                <button data-link="category/<?= $category['url'] ?>" data-target="content" class="category-tail-edit" data-locale="BUTTON_EDIT"></button>

            </div>

    <?php

    endforeach;

endif;