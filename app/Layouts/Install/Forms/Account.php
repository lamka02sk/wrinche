<div class="install-form" data-id="2">
    <h3><?= $LANG['INSTALL_ACCOUNT'] ?></h3>
    <div class="form">
        <form id="account" method="post">
            <div class="form-input">
                <label for="username"><?= $LANG['USERNAME'] ?></label>
                <input id="username" type="text" name="username" placeholder="<?= $LANG['USERNAME'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input">
                <label for="e-mail"><?= $LANG['EMAIL'] ?></label>
                <input id="e-mail" type="email" name="mail" placeholder="<?= $LANG['EMAIL'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input">
                <label for="password"><?= $LANG['PASSWORD'] ?></label>
                <input id="password" type="password" name="password" placeholder="<?= $LANG['PASSWORD'] ?>" required>
                <p class="message"></p>
            </div>
            <div class="form-input">
                <label for="match"><?= $LANG['REPEAT'] . ' ' . $LANG['PASSWORD'] ?></label>
                <input id="match" type="password" name="match" placeholder="<?= $LANG['REPEAT'] . ' ' . $LANG['PASSWORD'] ?>" required>
                <p class="message"></p>
            </div>
        </form>
        <button class="next-step"><?= $LANG['NEXT'] ?></button>
    </div>
</div>