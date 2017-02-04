<div class="control-panel">
    <p class="controls-title" data-locale="CONTROLS_TITLE"></p>
    <div class="panel-content">
        <div class="theme-controls">
            <p class="group-title" data-locale="THEME"></p>
            <?php

            foreach($this->CONFIG['system']['support']['themes'] as $code => $theme): ?>

                <span data-value="<?= $code ?>" data-locale="<?= $theme ?>" class="theme-option
                    <?php if($code === 'light'): ?>
                        active
                    <?php endif ?>
                "></span>

                <?php

            endforeach;

            ?>
        </div>
        <div class="language-controls">
            <p class="group-title" data-locale="LANGUAGE"></p>
            <div class="selector selector-part">

                <select name="language" id="language-select" class="selector-part selector-demo">
                    <?php

                    foreach($this->CONFIG['system']['support']['languages'] as $code => $language):
                        ?>
                        <option value="<?= $code ?>" data-locale="<?= $language ?>" selected></option>
                        <?php
                    endforeach;

                    ?>
                </select>

                <div id="language" class="selector-element selector-part">

                    <?php

                    foreach($this->CONFIG['system']['support']['languages'] as $code => $language):

                        if($code === $LANG):
                            ?>
                            <button class="selector-selected" data-locale="<?= $language ?>" data-value="<?= $code ?>"></button>
                            <?php
                        endif;

                    endforeach;

                    ?>

                    <div class="selector-options selector-part">

                        <?php

                        foreach($this->CONFIG['system']['support']['languages'] as $code => $language):

                            $active = '';
                            if($code === $LANG)
                                $active = ' selector-option-selected';

                            ?>
                            <button class="selector-option<?= $active ?>" data-value="<?= $code ?>" data-locale="<?= $language ?>"></button>
                            <?php
                        endforeach;

                        ?>
                    </div>

                </div>

            </div>
        </div>
    </div>
</div>