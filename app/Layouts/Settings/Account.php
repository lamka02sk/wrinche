<?php

$sanitize = new \App\Helpers\Sanitizer();

?>

<div class="subcontent-box input-box">

    <label for="username_input" class="settings-label" data-locale="SETTINGS_USERNAME"></label>
    <input type="text" id="username_input" name="username" data-placeholder="SETTINGS_USERNAME" value="<?= $sanitize->sanitizeOutput(\App\Models\UserModel::$user['username']) ?>">

</div>

<div class="subcontent-box input-box">

    <label for="nickname_input" class="settings-label" data-locale="SETTINGS_NICKNAME"></label>
    <input type="text" id="nickname_input" name="nickname" data-placeholder="SETTINGS_NICKNAME" value="">

</div>

<div class="subcontent-box input-box">

    <label class="settings-label clear-label" data-locale="SETTINGS_FULLNAME"></label>

    <div class="half-box input-box">
        <label for="first-name_input" class="settings-label-small" data-locale="SETTINGS_FIRST-NAME"></label>
        <input type="text" id="first-name_input" name="first_name" data-placeholder="SETTINGS_FIRST-NAME" value="">
    </div>

    <div class="half-box input-box">
        <label for="last-name_input" class="settings-label-small" data-locale="SETTINGS_LAST-NAME"></label>
        <input type="text" id="last-name_input" name="last_name" data-placeholder="SETTINGS_LAST-NAME" value="">
    </div>

</div>

<div class="subcontent-box input-box">

    <label for="email_input" class="settings-label" data-locale="SETTINGS_EMAIL"></label>
    <input type="text" id="email_input" name="e-mail" data-placeholder="SETTINGS_EMAIL" value="<?= $sanitize->sanitizeOutput(\App\Models\UserModel::$user['email']) ?>">

</div>

<div class="subcontent-box input-box">

    <label for="website_input" class="settings-label" data-locale="SETTINGS_WEBSITE"></label>
    <input type="text" id="website_input" name="website" data-placeholder="SETTINGS_WEBSITE_PLACEHOLDER" value="">

</div>

<div class="subcontent-box input-box">

    <label for="public-name_selector" class="settings-label" data-locale="SETTINGS_PUBLIC-NAME"></label>
    <select name="public_name" id="public-name_selector" class="selector-instance">

        <option value="0" data-sublocale="SETTINGS_USERNAME" selected></option>
        <option value="1" data-sublocale="SETTINGS_FULLNAME"></option>
        <option value="2" data-sublocale="SETTINGS_NICKNAME"></option>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for=bio_textarea" class="settings-label" data-locale="SETTINGS_BIO"></label>
    <textarea name="bio" id="bio_textarea" data-placeholder="SETTINGS_BIO"></textarea>

</div>

<div class="subcontent-box input-box">

    <label class="settings-label clear-label" data-locale="SETTINGS_SESSIONS"></label>

    <div class="table-content">

        <div class="table-header">

            <span class="header-column platform-column" data-locale="SETTINGS_ACCOUNT_PLATFORM"></span>
            <span class="header-column browser-column" data-locale="SETTINGS_ACCOUNT_BROWSER"></span>
            <span class="header-column ip-column"data-locale="SETTINGS_ACCOUNT_IP"></span>
            <span class="header-column last-column" data-locale="SETTINGS_ACCOUNT_LAST"></span>
            <span class="header-column views-column" data-locale="SETTINGS_ACCOUNT_VIEWS"></span>

        </div>

        <?php

        foreach($controller->returnSessions() as $session):

        ?>

            <div class="table-row">

                <span class="row-column platform-column"><?= $session['OS'] ?></span>
                <span class="row-column browser-column"><?= $session['browser'] ?></span>
                <span class="row-column ip-column"><?= $session['IP'] ?></span>
                <span class="row-column last-column"><?= $session['lastUpdate'] ?></span>
                <span class="row-column views-column"><?= $session['views'] ?></span>

            </div>

        <?php

        endforeach;

        ?>

    </div>

</div>

<?php

require_once 'action_bar.php';