<div class="outer-container">

<div class="inner-container">

<div class="content-wrapper">

    <span class="response-box">Error Message Test</span>

    <div class="logo-box">

        <img class="logo-heading-charcoal"
             src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-charcoal-small.png"
             alt="<?= $this->CONFIG['system']['name'] ?>">

        <img class="logo-heading-mustard"
             src="<?= $this->CONFIG['system']['paths']['assets'] ?>/system/wrinche-logo-mustard-small.png"
             alt="<?= $this->CONFIG['system']['name'] ?>">

    </div>

    <form class="login-form" method="post" action="">

        <h1 data-locale="LOGIN"></h1>

        <input type="text" name="username" placeholder="" data-placeholder="USERNAME">

        <input type="password" name="password" placeholder="" data-placeholder="PASSWORD">

        <a href="" class="register" data-locale="REGISTER"></a>

        <button class="login" data-locale="LOGIN"></button>

    </form>

</div>

</div>

</div>

<div class="more-actions">

    <span class="more-trigger">

        <svg version="1.1" id="plus-sign" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
             viewBox="0 0 42 42" xml:space="preserve">
            <polygon points="42,18 24,18 24,0 18,0 18,18 0,18 0,24 18,24 18,42 24,42 24,24 42,24">
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
            <g>
            </g>
        </svg>

    </span>

    <div class="more-content">

        <span class="more-item password"><a href="/reset-password" data-locale="RESET_PASSWORD"></a></span>

        <span class="more-item wiki"><a href="http://wrinche.samuelillo.com/wiki" data-locale="SYSTEM_WIKI"></a></span>

        <span class="more-item credits">&copy; wrinche, <?= date('Y') ?>, v<?= $this->CONFIG['system']['version'] ?></span>

    </div>

</div>

<?php
require_once ROOT . '/app/Layouts/Auth/Controls.php';