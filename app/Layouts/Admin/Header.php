<?php

require_once ROOT . '/app/Layouts/Admin/Splash.php';

?>

<div class="anchor-hover"></div>

<div class="fullscreen-wrapper confirmation-menu">
    <div class="va-wrapper">

        <div class="fullscreen-popup confirmation-box">

            <div class="popup-header">

                <span class="header-icon"></span>
                <p class="header-text" data-locale="ACTION_CONFIRM"></p>

            </div>

            <div class="popup-content">

                <p class="confirmation-action-message"></p>

                <div class="popup-content-actions">

                    <span class="confirmation-action-proceed" data-locale="ACTION_CONFIRM_PROCEED"></span>
                    <span class="confirmation-action-dismiss" data-locale="ACTION_CONFIRM_DISMISS"></span>

                </div>

            </div>

        </div>

    </div>
</div>

<div class="fullscreen-wrapper write-menu">
    <div class="va-wrapper">

        <div class="fullscreen-popup write-actions">

            <div class="popup-header">

                <span class="header-icon"></span>
                <p class="header-text" data-locale="WRITE_NEW"></p>
                <span class="header-close"></span>

            </div>

            <div class="popup-content">

                <div class="popup-tails two-width">

                    <?php

                    $layouts = App\Models\TemplateModel::$template['layouts'];
                    $i = 0;
                    $length = sizeof($layouts);
                    foreach($layouts as $item):

                        $noBorderBottom = '';

                        if($length % 2 == 0) {
                            if($i == ($length - 1) || $i == ($length - 2))
                                $noBorderBottom = ' no-bottom';
                        } else {
                            if($i == ($length - 1))
                                $noBorderBottom = ' no-bottom';
                        }

                        ++$i;

                    ?>

                        <div class="tails-tail<?= $noBorderBottom ?>"
                             data-target="content"
                             data-link="write/<?= strtolower($item['name']) ?>">
                            <span class="tail-icon <?= strtolower($item['name']) ?>"></span>
                            <p class="tail-text" data-locale="WRITE_<?= strtoupper($item['name']) ?>"></p>
                        </div>

                    <?php

                    endforeach;

                    ?>

                </div>

            </div>

        </div>

    </div>
</div>

<header>

    <div class="header-logo" data-link="dashboard" data-target="content">

        <img class="logo-light" src="assets/system/wrinche-logo-charcoal-mini.png" alt="wrinche. Logo">
        <img class="logo-dark" src="assets/system/wrinche-logo-mustard-mini.png" alt="wrinche. Logo">

    </div>

    <div class="header-search">

        <input type="search" name="search" data-placeholder="HEADER_SEARCH" placeholder="">

    </div>

    <div class="header-quick">

        <p class="quick-heading" data-locale="HEADER_QUICK"></p>

        <span class="quick-item empty"></span>
        <span class="quick-item empty"></span>
        <span class="quick-item empty"></span>
        <span class="quick-item empty"></span>
        <span class="quick-item empty"></span>

    </div>

    <div class="header-team"></div>

    <div class="header-write">

        <span class="write-text" data-locale="HEADER_WRITE"></span>
        <span class="write-icon"></span>

    </div>

    <div class="header-account">

        <span class="write-text"><?= htmlspecialchars(App\Models\UserModel::$user['username']) ?></span>
        <span class="write-icon"></span>

        <div class="account-dropdown">

            <span class="dropdown-item" data-locale="HEADER_PROFILE"></span>
            <span class="dropdown-item" data-locale="HEADER_SETTINGS" data-link="settings/account" data-target="content"></span>
            <span class="dropdown-item logout" data-locale="HEADER_LOGOUT"></span>

        </div>

    </div>

</header>

<div class="response-message">

    <span class="loading-icon"></span>
    <span class="message-content"></span>

</div>