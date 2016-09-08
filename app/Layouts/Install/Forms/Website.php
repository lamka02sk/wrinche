<div class="install-form" data-id="4">
    <h3><?= $LANG['INSTALL_WEBSITE'] ?></h3>
    <div class="form">
        <form id="website">
            <div class="form-input">
                <label for="sitename"><?= $LANG['WEBSITE_NAME'] ?></label>
                <input id="sitename" type="text" name="sitename" placeholder="<?= $LANG['WEBSITE_NAME'] ?>" required>
            </div>
            <div class="form-input">
                <label for="sitedesc"><?= $LANG['WEBSITE_DESCRIPTION'] ?></label>
                <input id="sitedesc" type="text" name="sitedesc" placeholder="<?= $LANG['WEBSITE_DESCRIPTION'] ?>" required>
            </div>

        </form>
        <button class="next-step"><?= $LANG['INSTALL'] ?></button>
    </div>
</div>