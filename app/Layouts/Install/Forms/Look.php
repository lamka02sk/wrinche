<div class="install-form active" data-id="1">
    <h3><?= $LANG['INSTALL_LOOK'] ?></h3>
    <div class="form">
        <form id="look" method="post">
        <div class="form-input">
            <label class="input" for="language"><?= $LANG['LANGUAGE'] ?></label>
            <select id="language" name="language">
                <?php foreach($_SESSION['CONFIG']['system']['support']['languages'] as $code => $language): ?>
                    <option value="<?= $code ?>"
                        <?php if($code === $LANG['LOCALE']): ?>
                            selected
                        <?php endif ?>
                    ><?= $LANG[$language] ?></option>
                <?php endforeach ?>
            </select>
        </div>
        <div class="form-input">
            <label class="input" for="timezone"><?= $LANG['TIMEZONE'] ?></label>
            <select id="timezone" name="timezone">
                <?php foreach($timezones as $key => $timezone) : ?>
                    <option value="<?= $key ?>"
                        <?php if($timezone === $_SESSION['CONFIG']['system']['locale']['timezone']): ?>
                            selected
                        <?php endif ?>
                    ><?= $timezone ?></option>
                <?php endforeach ?>
            </select>
        </div>
        <div class="form-input">
            <label class="input" for="theme"><?= $LANG['THEME'] ?></label>
            <select id="theme" name="theme">
                <?php foreach($_SESSION['CONFIG']['system']['support']['themes'] as $code => $theme): ?>
                    <option value="<?= $code ?>"
                        <?php if($code === 'light'): ?>
                            selected
                        <?php endif ?>
                    ><?= $LANG[$theme] ?></option>
                <?php endforeach ?>
            </select>
        </div>
        </form>
        <button class="next-step"><?= $LANG['NEXT'] ?></button>
    </div>
</div>