<div class="intro">
    <div class="table-wrapper">
        <div class="logo-wrapper">
            <img
                src="<?= $_SESSION['CONFIG']['system']['paths']['assets'] ?>/system/wrinche-logo-charcoal-small.png"
                alt="<?= $_SESSION['CONFIG']['system']['name'] ?>">
            <button class="proceed-install"><?= $LANG['INSTALL'] ?></button>
        </div>
    </div>
</div>
<div class="installer">
    <div class="installer-wrapper">
        <div class="content-wrapper">
            <aside class="menu-panel">
                <div class="logo-box">
                    <img
                        src="<?= $_SESSION['CONFIG']['system']['paths']['assets'] ?>/system/wrinche-logo-charcoal-small.png"
                        alt="<?= $_SESSION['CONFIG']['system']['name'] ?>">
                    <h2><?= $LANG['INSTALLATION'] ?></h2>
                </div>
                <div class="menu-box">
                    <ol>
                        <li data-id="1" class="active"><?= $LANG['INSTALL_LOOK'] ?></li>
                        <li data-id="2"><?= $LANG['INSTALL_ACCOUNT'] ?></li>
                        <li data-id="3"><?= $LANG['INSTALL_DATABASE'] ?></li>
                        <li data-id="4"><?= $LANG['INSTALL_WEBSITE'] ?></li>
                    </ol>
                </div>
            </aside>
            <?php require_once 'app/Layouts/Install/Forms.php' ?>
        </div>
    </div>
</div>