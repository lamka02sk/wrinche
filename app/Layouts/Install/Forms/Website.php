<div class="install-form" data-id="4">

    <h3 data-locale="INSTALL_WEBSITE"></h3>

    <div class="form">

        <form id="website" method="post">

            <div class="form-input form-input-name">

                <label class="input" for="name" data-locale="WEBSITE_NAME"></label>
                <input id="name" type="text" name="name" data-placeholder="WEBSITE_NAME" placeholder="" required>
                <p class="message"></p>

            </div>

            <div class="form-input form-input-description">

                <label class="input" for="description" data-locale="WEBSITE_DESCRIPTION"></label>
                <input id="description" type="text" name="description" data-placeholder="WEBSITE_DESCRIPTION" placeholder="" required>
                <p class="message"></p>

            </div>

            <div class="form-input form-select">

                <label class="input" for="category" data-locale="WEBSITE_CATEGORY"></label>

                <select id="category" name="selector_category" class="selector-demo">

                    <?php

                    foreach($this->CONFIG['system']['support']['categories'] as $code => $category): ?>

                        <option value="<?= $code ?>" data-locale="<?= $category ?>"></option>

                    <?php

                    endforeach;

                    ?>

                </select>

                <div id="selector_category" class="selector-element">

                    <?php

                    $i = 0;
                    foreach($this->CONFIG['system']['support']['categories'] as $code => $category):

                        if($i === 0): ?>

                            <button data-value="<?= $code ?>" data-locale="<?= $category ?>" class="selector-selected"></button>

                            <?php

                            $i++;

                        else:

                            break;

                        endif;

                    endforeach;

                    ?>

                    <div class="selector-options">

                        <?php

                        $i = 0;
                        foreach($this->CONFIG['system']['support']['categories'] as $code => $category): ?>

                            <button data-value="<?= $code ?>" data-locale="<?= $category ?>" class="selector-option
                            <?php if($i === 0): ?>
                                selector-option-selected
                            <?php endif ?>
                        "></button>

                            <?php

                            $i++;

                        endforeach;

                        ?>

                    </div>

                </div>

            </div>

            <div class="form-input checkbox-first">

                <input type="checkbox" id="eula" name="eula" required>

                <label class="checkbox" data-checkbox="eula" for="eula">
                    <span class="ui"></span><span data-locale="EULA_AGREE"></span>
                </label>

                <p class="message checkbox-message"></p>

            </div>

            <div class="form-input">

                <input type="checkbox" id="stats" name="stats">

                <label class="checkbox" data-checkbox="stats" for="stats">
                    <span class="ui"></span><span data-locale="SEND_STATS"></span>
                </label>

            </div>

        </form>

        <button class="next-step" data-locale="NEXT"></button>

    </div>

</div>