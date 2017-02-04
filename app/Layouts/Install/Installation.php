<div class="intro">

    <div class="table-wrapper">

        <div class="logo-wrapper">

            <img class="logo-heading-charcoal"
                 src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-charcoal-small.png"
                 alt="<?= $this->CONFIG['system']['name'] ?>">

            <img class="logo-heading-mustard"
                 src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-mustard-small.png"
                 alt="<?= $this->CONFIG['system']['name'] ?>">

            <button class="proceed-install" data-locale="INSTALL"></button>

        </div>

    </div>

</div>

<?php

require_once ROOT . '/app/Layouts/Install/Done.php';

?>

<link rel="stylesheet" href="vendor/selector.min.css" type="text/css">

<div class="installer">

    <div class="installer-wrapper">

        <div class="content-wrapper">

            <aside class="menu-panel">

                <div class="logo-box">

                    <img class="logo-heading-charcoal"
                         src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-charcoal-small.png"
                         alt="<?= $this->CONFIG['system']['name'] ?>">

                    <img class="logo-heading-mustard"
                         src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-mustard-small.png"
                         alt="<?= $this->CONFIG['system']['name'] ?>">

                    <h2 data-locale="INSTALLATION"></h2>

                </div>

                <div class="menu-box">

                    <ol>
                        <li data-id="1" class="active" data-locale="INSTALL_LOOK"></li>
                        <li data-id="2" data-locale="INSTALL_ACCOUNT"></li>
                        <li data-id="3" data-locale="INSTALL_DATABASE"></li>
                        <li data-id="4" data-locale="INSTALL_WEBSITE"></li>
                    </ol>

                </div>

            </aside>

            <?php require_once 'app/Layouts/Install/Forms.php' ?>

        </div>

    </div>

</div>