<div class="install-form" data-id="4">
    <h3><?= $LANG['INSTALL_WEBSITE'] ?></h3>
    <div class="form">
        <form id="website" method="post">
            <div class="form-input">
                <label for="sitename"><?= $LANG['WEBSITE_NAME'] ?></label>
                <input id="sitename" type="text" name="sitename" placeholder="<?= $LANG['WEBSITE_NAME'] ?>" required>
            </div>
            <div class="form-input">
                <label for="sitedesc"><?= $LANG['WEBSITE_DESCRIPTION'] ?></label>
                <input id="sitedesc" type="text" name="sitedesc" placeholder="<?= $LANG['WEBSITE_DESCRIPTION'] ?>" required>
            </div>
            <div class="form-input">
                <label for="category"><?= $LANG['WEBSITE_CATEGORY'] ?></label>
                <select id="category">
                    <?php foreach($_SESSION['CONFIG']['system']['support']['categories'] as $code => $category): ?>
                        <option value="<?= $code ?>"><?= $LANG[$category] ?></option>
                    <?php endforeach ?>
                </select>
            </div>
            <?php

            $eulaLink = '<a href="https://raw.githubusercontent.com/lamka02sk/wrinche/dev/LICENSE" target="_blank">MIT LICENSE</a>';

            ?>
            <div class="form-input checkbox-first">
                <p>
                    <input type="checkbox" id="eula" name="eula" required>
                    <label for="eula">
                        <span class="ui"></span><?= sprintf($LANG['EULA_AGREE'], $eulaLink) ?>
                    </label>
                </p>
            </div>
            <div class="form-input">
                <p>
                    <input type="checkbox" id="stats" name="stats">
                    <label for="stats">
                        <span class="ui"></span><?= $LANG['SEND_STATS'] ?>
                    </label>
                </p>
            </div>
        </form>
        <button class="next-step"><?= $LANG['INSTALL'] ?></button>
    </div>
</div>