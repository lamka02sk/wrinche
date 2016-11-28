<div class="install-form active" data-id="1">

    <h3 data-locale="INSTALL_LOOK"></h3>

    <div class="form">

        <form id="look" method="post">

        <div class="form-input">

            <label class="input" for="language" data-locale="LANGUAGE"></label>

            <select id="language" name="selector_language" class="selector-demo">

                <?php

                foreach($this->CONFIG['system']['support']['languages'] as $code => $language): ?>

                    <option value="<?= $code ?>" data-locale="<?= $language ?>"
                        <?php if($code === $LANG): ?>
                            selected
                        <?php endif ?>
                    ></option>

                <?php

                endforeach;

                ?>

            </select>

            <div id="selector_language" class="selector-element">

                <?php

                foreach($this->CONFIG['system']['support']['languages'] as $code => $language):

                    if($code === $LANG): ?>

                        <button data-value="<?= $code ?>" data-locale="<?= $language ?>" class="selector-selected"></button>

                <?php

                    endif;

                endforeach;

                ?>

                <div class="selector-options">

                    <?php foreach($this->CONFIG['system']['support']['languages'] as $code => $language): ?>

                        <button data-value="<?= $code ?>" data-locale="<?= $language ?>" class="selector-option
                            <?php if($code === $LANG): ?>
                                selector-option-selected
                            <?php endif ?>
                        "></button>

                    <?php endforeach ?>

                </div>

            </div>

        </div>

        <div class="form-input">

            <label class="input" for="timezone" data-locale="TIMEZONE"></label>

            <select id="timezone" name="selector_timezone" class="selector-demo">

                <?php

                foreach($timezones as $key => $timezone) : ?>

                    <option value="<?= $key ?>"
                        <?php if($timezone === $_SESSION['CONFIG']['system']['locale']['timezone']): ?>
                            selected
                        <?php endif ?>
                    ><?= $timezone ?></option>

                <?php

                endforeach;

                ?>

            </select>

            <div id="selector_timezone" class="selector-element">

                <?php

                foreach($timezones as $key => $timezone):

                    if($timezone === $_SESSION['CONFIG']['system']['locale']['timezone']): ?>

                        <button data-value="<?= $key ?>" data-locale="<?= $timezone ?>" class="selector-selected">
                            <?= $timezone ?>
                        </button>

                        <?php

                    endif;

                endforeach;

                ?>

                <div class="selector-options">

                    <?php

                    foreach($timezones as $key => $timezone): ?>

                        <button data-value="<?= $key ?>" class="selector-option
                            <?php if($timezone === $_SESSION['CONFIG']['system']['locale']['timezone']): ?>
                                selector-option-selected
                            <?php endif ?>
                        "><?= $timezone ?></button>

                    <?php

                    endforeach;

                    ?>

                </div>

            </div>

        </div>

        <div class="form-input">

            <label class="input" for="theme" data-locale="THEME"></label>

            <select id="theme" name="selector_theme" class="selector-demo">

                <?php

                foreach($this->CONFIG['system']['support']['themes'] as $code => $theme): ?>

                    <option value="<?= $code ?>" data-locale="<?= $theme ?>"
                        <?php if($code === 'light'): ?>
                            selected
                        <?php endif ?>
                    ></option>

                <?php

                endforeach;

                ?>

            </select>

            <div id="selector_theme" class="selector-element">

                <?php

                foreach($this->CONFIG['system']['support']['themes'] as $code => $theme):

                    if($code === 'light'): ?>

                        <button data-value="<?= $code ?>" data-locale="<?= $theme ?>" class="selector-selected"></button>

                <?php

                    endif;

                endforeach;

                ?>

                <div class="selector-options">

                    <?php

                    foreach($this->CONFIG['system']['support']['themes'] as $code => $theme): ?>

                        <button data-value="<?= $code ?>" data-locale="<?= $theme ?>" class="selector-option
                            <?php if($code === 'light'): ?>
                                selector-option-selected
                            <?php endif ?>
                        "></button>

                    <?php

                    endforeach;

                    ?>

                </div>

            </div>

        </div>

        </form>

        <button class="next-step" data-locale="NEXT"></button>

    </div>

</div>