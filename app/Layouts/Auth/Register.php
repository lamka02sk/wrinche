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

            <form class="login-form register-form" method="post" action="">

                <h1 data-locale="REGISTER"></h1>

                <div class="form-input">
                    <label for="username" data-locale="USERNAME"></label>
                    <input id="username" type="text" name="username" placeholder="" data-placeholder="USERNAME">
                    <p class="message error"></p>
                </div>

                <div class="form-input">
                    <label for="email" data-locale="EMAIL"></label>
                    <input id="email" type="email" name="email" placeholder="" data-placeholder="EMAIL">
                    <p class="message"></p>
                </div>

                <div class="form-input">
                    <label for="password" data-locale="PASSWORD"></label>
                    <input id="password" type="password" name="password" placeholder="" data-placeholder="PASSWORD">
                    <p class="message"></p>
                </div>

                <div class="form-input">
                    <label for="password-repeat" data-locale="PASSWORD_REPEAT"></label>
                    <input id="password-repeat" type="password" name="password_repeat" placeholder="" data-placeholder="PASSWORD_REPEAT">
                    <p class="message"></p>
                </div>

                <a class="register login-button" data-locale="LOGIN"></a>

                <button class="login register-button" data-locale="REGISTER"></button>

            </form>

        </div>

    </div>

</div>

<?php
require_once ROOT . '/app/Layouts/Auth/BottomActions.php';
require_once ROOT . '/app/Layouts/Auth/Controls.php';