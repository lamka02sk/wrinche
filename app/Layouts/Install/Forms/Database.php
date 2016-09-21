<div class="install-form" data-id="3">
    <h3><?= $LANG['INSTALL_DATABASE'] ?></h3>
    <div class="form">
        <form id="database" method="post">
            <div class="form-input">
                <label class="input" for="dbhost"><?= $LANG['DATABASE_HOST'] ?></label>
                <input id="dbhost" type="text" name="dbhost" placeholder="<?= $LANG['DATABASE_HOST'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input">
                <label class="input" for="dbname"><?= $LANG['DATABASE_NAME'] ?></label>
                <input id="dbname" type="text" name="dbname" placeholder="<?= $LANG['DATABASE_NAME'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input">
                <label class="input" for="dbuser"><?= $LANG['ADMIN_USERNAME'] ?></label>
                <input id="dbuser" type="text" name="dbuser" placeholder="<?= $LANG['ADMIN_USERNAME'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input">
                <label class="input" for="dbpass"><?= $LANG['ADMIN_PASSWORD'] ?></label>
                <input id="dbpass" type="password" name="dbpass" placeholder="<?= $LANG['ADMIN_PASSWORD'] ?>" required>
                <p class="message"></p>
            </div>
        </form>
        <button class="next-step"><?= $LANG['NEXT'] ?></button>
        <button class="test-connection"><?= $LANG['TEST_CONNECTION'] ?></button>
        <p class="connection-message"></p>
    </div>
</div>