<div class="install-form">
    <h3><?= $LANG['INSTALL_LOOK'] ?></h3>
    <div class="form">
        <div class="form-input">
            <label for="language"><?= $LANG['LANGUAGE'] ?></label>
            <select id="language">
                <option value="en">English</option>
                <option value="sk">Slovak</option>
            </select>
        </div>
        <div class="form-input">
            <label for="timezone"><?= $LANG['TIMEZONE'] ?></label>
            <select id="timezone">
                <?php foreach($TIMEZONES as $key => $timezone) : ?>
                    <option value="<?= $key ?>"><?= $timezone ?></option>
                <?php endforeach ?>
            </select>
        </div>
        <div class="form-input">
            <label for="theme"><?= $LANG['THEME'] ?></label>
            <select id="theme">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
            </select>
        </div>
        <button class="next-step"><?= $LANG['NEXT'] ?></button>
    </div>
</div>