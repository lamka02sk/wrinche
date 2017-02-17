<div class="outer-container">

    <div class="inner-container">

        <div class="content-wrapper">

            <span class="response-box"></span>

            <div class="logo-box">

                <img class="logo-heading-charcoal"
                     src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-charcoal-small.png"
                     alt="<?= $this->CONFIG['system']['name'] ?>">

                <img class="logo-heading-mustard"
                     src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-mustard-small.png"
                     alt="<?= $this->CONFIG['system']['name'] ?>">

            </div>

            <form class="login-form register-form forgot-form" method="post" action="">

                <h1 data-locale="FORGOT_PASSWORD"></h1>

                <div class="form-input">
                    <label for="email" data-locale="EMAIL"></label>
                    <input id="email" type="email" name="email" placeholder="" data-placeholder="EMAIL">
                    <p class="message"></p>
                </div>

                <a class="register login-button" data-locale="LOGIN"></a>

                <button class="login forgot-button" data-locale="SEND_RESET"></button>

            </form>

        </div>

    </div>

</div>

<?php
require_once ROOT . '/app/Layouts/Auth/BottomActions.php';
require_once ROOT . '/app/Layouts/Auth/Controls.php';