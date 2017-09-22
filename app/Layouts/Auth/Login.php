<div class="outer-container">

<div class="inner-container">

<div class="content-wrapper">

    <span class="response-box"></span>

    <div class="logo-box">

        <img class="logo-heading-charcoal"
             src="<?= $this->CONFIG['system']['paths']['assets'] ?>system/wrinche-logo-charcoal-small.png"
             alt="<?= $this->CONFIG['system']['name'] ?>">

        <img class="logo-heading-mustard"
             src="<?= $this->CONFIG['system']['paths']['assets'] ?>system/wrinche-logo-mustard-small.png"
             alt="<?= $this->CONFIG['system']['name'] ?>">

    </div>

    <form class="login-form" method="post" action="">

        <h1 data-locale="LOGIN"></h1>

        <div class="form-input">
            <input type="text" name="username" placeholder="" data-placeholder="USERNAME">
        </div>

        <div class="form-input">
            <input type="password" name="password" placeholder="" data-placeholder="PASSWORD">
        </div>

        <div class="password-question">
            <span class="question-content reset-password" data-locale="FORGOT_PASSWORD*"></span>
        </div>

        <a class="register" data-locale="REGISTER"></a>

        <button class="login" data-locale="LOGIN"></button>

    </form>

</div>

</div>

</div>

<?php
require_once ROOT . '/app/Layouts/Auth/BottomActions.php';
require_once ROOT . '/app/Layouts/Auth/Controls.php';