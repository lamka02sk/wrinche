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

                <h1 data-locale="RESET_PASSWORD"></h1>

                <div class="form-input">
                    <label class="readonly" for="hash" data-locale="HASH"></label>
                    <input id="hash" type="text" readonly name="hash" placeholder="" value="<?= \App\Requests\Request::$url[2] ?>" data-placeholder="HASH">
                </div>

                <div class="form-input">
                    <label for="new_password" data-locale="NEW_PASSWORD"></label>
                    <input id="new_password" type="password" name="password" placeholder="" data-placeholder="NEW_PASSWORD">
                    <p class="message"></p>
                </div>

                <div class="form-input">
                    <label for="new_password_repeat" data-locale="NEW_PASSWORD_REPEAT"></label>
                    <input id="new_password_repeat" type="password" name="password_repeat" placeholder="" data-placeholder="NEW_PASSWORD_REPEAT">
                    <p class="message"></p>
                </div>

                <a class="register login-button" data-locale="LOGIN"></a>

                <button class="login reset-button" data-locale="CHANGE_PASSWORD"></button>

            </form>

        </div>

    </div>

</div>

<?php
require_once ROOT . '/app/Layouts/Auth/BottomActions.php';
require_once ROOT . '/app/Layouts/Auth/Controls.php';