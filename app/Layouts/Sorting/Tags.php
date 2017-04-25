<?php

use App\Models\TagsModel;

$tags = new TagsModel;
$tags->start(true);

if(empty(TagsModel::$tags)):

    ?>

    <p class="empty" data-locale="NO_TAGS"></p>

    <?php

else:

    foreach(TagsModel::$tags as $tag):

        ?>

        <div class="content-tail tag-tail" data-link="tag/<?= $tag['name'] ?>" data-content="content">

            <?php

            $visibility = 'VISIBILITY_VISIBLE';
            if($tag['visibility'] === 0)
                $visibility = 'VISIBILITY_HIDDEN';

            ?>

            <p class="tag-tail-name">#<?= $tag['name'] ?></p>
            <span class="tag-tail-remove"></span>
            <span class="tag-tail-posts"><?= $tag['count'] ?> <span class="post-text" data-locale="POSTS"></span></span>

            <span class="tag-tail-visibility" data-locale="<?= $visibility ?>"></span>
            <button class="tag-tail-edit" data-locale="BUTTON_EDIT"></button>

        </div>

        <?php

    endforeach;

endif;