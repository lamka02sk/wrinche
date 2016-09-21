<div class="install-form" data-id="4">
    <h3><?= $LANG['INSTALL_WEBSITE'] ?></h3>
    <div class="form">
        <form id="website" method="post">
            <div class="form-input form-input-name">
                <label class="input" for="name"><?= $LANG['WEBSITE_NAME'] ?></label>
                <input id="name" type="text" name="name" placeholder="<?= $LANG['WEBSITE_NAME'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input form-input-description">
                <label class="input" for="description"><?= $LANG['WEBSITE_DESCRIPTION'] ?></label>
                <input id="description" type="text" name="description" placeholder="<?= $LANG['WEBSITE_DESCRIPTION'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input form-select">
                <label class="input" for="category"><?= $LANG['WEBSITE_CATEGORY'] ?></label>
                <select id="category" name="category">
                    <?php foreach($_SESSION['CONFIG']['system']['support']['categories'] as $code => $category): ?>
                        <option value="<?= $code ?>"><?= $LANG[$category] ?></option>
                    <?php endforeach ?>
                </select>
            </div>
            <?php

            $eulaLink = '<a href="https://raw.githubusercontent.com/lamka02sk/wrinche/dev/LICENSE" target="_blank">MIT LICENSE</a>';

            ?>
            <div class="form-input checkbox-first">
                <input type="checkbox" id="eula" name="eula" required>
                <label class="checkbox" for="eula">
                    <span class="ui"></span><?= sprintf($LANG['EULA_AGREE'], $eulaLink) ?>
                </label>
                <p class="message checkbox-message"></p>
            </div>
            <div class="form-input">
                <input type="checkbox" id="stats" name="stats">
                <label class="checkbox" for="stats">
                    <span class="ui"></span><?= $LANG['SEND_STATS'] ?>
                </label>
            </div>
        </form>
        <button class="next-step"><?= $LANG['INSTALL'] ?></button>
    </div>
</div>