<div class="install-form" data-id="3">
    <h3><?= $LANG['INSTALL_DATABASE'] ?></h3>
    <div class="form">
        <form id="database">
            <div class="form-input">
                <label for="dbhost"><?= $LANG['DATABASE_HOST'] ?></label>
                <input id="dbhost" type="text" name="dbhost" placeholder="<?= $LANG['DATABASE_HOST'] ?>" required>
            </div>
            <div class="form-input">
                <label for="dbname"><?= $LANG['DATABASE_NAME'] ?></label>
                <input id="dbname" type="text" name="dbname" placeholder="<?= $LANG['DATABASE_NAME'] ?>" required>
            </div>
            <div class="form-input">
                <label for="dbuser"><?= $LANG['ADMIN_USERNAME'] ?></label>
                <input id="dbuser" type="text" name="dbuser" placeholder="<?= $LANG['ADMIN_USERNAME'] ?>" required>
            </div>
            <div class="form-input">
                <label for="dbpass"><?= $LANG['ADMIN_PASSWORD'] ?></label>
                <input id="dbpass" type="password" name="dbpass" placeholder="<?= $LANG['ADMIN_PASSWORD'] ?>" required>
            </div>
        </form>
        <button class="next-step"><?= $LANG['NEXT'] ?></button>
        <button class="test-connection"><?= $LANG['TEST_CONNECTION'] ?></button>
    </div>
</div>