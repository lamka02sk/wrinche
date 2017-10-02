<?php

use App\Helpers\Sanitizer;
use App\Models\UserModel;
use App\Models\UserSettingsModel;
use App\Privileges\PrivilegesManager;

$sanitize = new Sanitizer();

// User data
$username = $sanitize->sanitizeOutput(UserModel::$user['username']);
$email = $sanitize->sanitizeOutput(UserModel::$user['email']);
$nickname = $sanitize->sanitizeOutput(UserSettingsModel::$settings['nickname']);
$firstName = $sanitize->sanitizeOutput(UserSettingsModel::$settings['first_name']);
$lastName = $sanitize->sanitizeOutput(UserSettingsModel::$settings['last_name']);
$website = $sanitize->sanitizeOutput(UserSettingsModel::$settings['website']);
$bio = $sanitize->sanitizeOutput(UserSettingsModel::$settings['bio']);
$publicName = UserSettingsModel::$settings['public_name'];

// Privileges
$privilegesManager = new PrivilegesManager();
$privileges = $privilegesManager->getPrivilegesType();
$privilegesText = $privilegesManager->getPrivilegesName();

// User profile picture
$profilePicture = UserModel::$user['picture'] ?? 'assets/icons/profile_picture.svg';

?>

<div class="profile-box">
    <div class="profile-picture-box">
        <div class="profile-picture-wrapper">
            <img src="<?= $profilePicture ?>" alt="<?= $username ?>'s Profile Picture">
            <span class="profile-picture-edit icon-edit"></span>
        </div>
    </div>
    <div class="profile-info-wrapper">
        <span class="username">
            <span class="username-value"><?= $username ?></span>
            <span class="username-edit icon-edit"></span>
        </span>
        <span class="privileges">
            <span class="privileges-label" data-locale="SETTINGS_PRIVILEGES"></span>
            <span class="privilege-badge<?= ' ' . $privileges ?>"><?= $privileges ?></span>
            <span class="privilege-name"><?= $privilegesText ?></span>
        </span>
        <span class="email">
            <span class="email-label" data-locale="SETTINGS_EMAIL"></span>
            <span class="email-value"><?= $email ?></span>
            <span class="email-edit icon-edit"></span>
        </span>
        <span class="nickname">
            <span class="email-label" data-locale="SETTINGS_NICKNAME"></span>
            <span class="email-value"><?= $nickname ?></span>
            <span class="email-edit icon-edit"></span>
        </span>
    </div>
</div>

<!-----------------***************************************************************--------------------->
<!-----------------***************************************************************--------------------->
<!-----------------***************************************************************--------------------->

<div class="subcontent-box input-box">

    <label class="settings-label clear-label" data-locale="SETTINGS_FULLNAME"></label>

    <div class="half-box input-box">
        <label for="first-name_input" class="settings-label-small" data-locale="SETTINGS_FIRST-NAME"></label>
        <input type="text" id="first-name_input" name="first_name" data-placeholder="SETTINGS_FIRST-NAME" value="<?= $firstName ?>">
    </div>

    <div class="half-box input-box">
        <label for="last-name_input" class="settings-label-small" data-locale="SETTINGS_LAST-NAME"></label>
        <input type="text" id="last-name_input" name="last_name" data-placeholder="SETTINGS_LAST-NAME" value="<?= $lastName ?>">
    </div>

</div>

<div class="subcontent-box input-box">

    <label for="website_input" class="settings-label" data-locale="SETTINGS_WEBSITE"></label>
    <input type="text" id="website_input" name="website" data-placeholder="SETTINGS_WEBSITE_PLACEHOLDER" value="<?= $website ?>">

</div>

<div class="subcontent-box input-box">

    <label for="public-name_selector" class="settings-label" data-locale="SETTINGS_PUBLIC-NAME"></label>
    <select name="public_name" id="public-name_selector" class="selector-instance">

        <option value="0" data-sublocale="SETTINGS_USERNAME"<?= $publicName === 0 ? ' selected' : '' ?>></option>
        <option value="1" data-sublocale="SETTINGS_FULLNAME"<?= $publicName === 1 ? ' selected' : '' ?>></option>
        <option value="2" data-sublocale="SETTINGS_NICKNAME"<?= $publicName === 2 ? ' selected' : '' ?>></option>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for=bio_textarea" class="settings-label" data-locale="SETTINGS_BIO"></label>
    <textarea name="bio" id="bio_textarea" data-placeholder="SETTINGS_BIO" value="<?= $bio ?>"></textarea>

</div>

<div class="subcontent-box input-box">

    <label class="settings-label clear-label" data-locale="SETTINGS_SESSIONS"></label>

    <table class="table-content">

        <tr class="table-header">

            <td class="row-column checkbox-cell select-all"><input type="checkbox"></td>
            <th class="header-column platform-column" data-locale="SETTINGS_ACCOUNT_PLATFORM"></th>
            <th class="header-column browser-column" data-locale="SETTINGS_ACCOUNT_BROWSER"></th>
            <th class="header-column ip-column"data-locale="SETTINGS_ACCOUNT_IP"></th>
            <th class="header-column last-column" data-locale="SETTINGS_ACCOUNT_LAST"></th>
            <th class="header-column views-column" data-locale="SETTINGS_ACCOUNT_VIEWS"></th>

        </tr>

        <?php

        foreach($controller->returnSessions() as $session):

        ?>

            <tr class="table-row">

                <td class="row-column checkbox-cell select-row"><input type="checkbox"></td>
                <td class="row-column platform-column"><?= $session['OS'] ?></td>
                <td class="row-column browser-column"><?= $session['browser'] ?></td>
                <td class="row-column ip-column"><?= $session['IP'] ?></td>
                <td class="row-column last-column"><?= $session['lastUpdate'] ?></td>
                <td class="row-column views-column"><?= $session['views'] ?></td>

            </tr>

        <?php

        endforeach;

        ?>

    </table>

</div>

<?php

require_once 'action_bar.php';