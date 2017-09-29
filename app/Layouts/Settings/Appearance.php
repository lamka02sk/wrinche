<div class="subcontent-box input-box">

    <label for="theme_selector" class="settings-label" data-locale="THEME"></label>
    <select name="theme" id="theme_selector" class="selector-instance">

        <?php

        $i = 0;
        foreach($this->CONFIG['system']['support']['themes'] as $key => $theme):

            $selected = '';
            if(\App\Models\UserSettingsModel::$settings['theme'] == $i)
                $selected = ' selected';

        ?>

            <option value="<?= $key ?>" data-sublocale="<?= $theme ?>"<?= $selected ?>></option>

        <?php

            ++$i;
        endforeach;

        ?>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for="language_selector" class="settings-label" data-locale="LANGUAGE"></label>
    <select name="language" id="language_selector" class="selector-instance">

        <?php

        $i = 0;
        foreach($this->CONFIG['system']['support']['languages'] as $key => $language):

            $selected = '';
            if(\App\Models\UserSettingsModel::$settings['language'] == $i)
                $selected = ' selected';

            ?>

            <option value="<?= $key ?>" data-sublocale="<?= $language ?>"<?= $selected ?>></option>

            <?php

            ++$i;
        endforeach;

        ?>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for="timezone_selector" class="settings-label" data-locale="TIMEZONE"></label>
    <select name="timezone" id="timezone_selector" class="selector-instance" data-type="find">

        <?php

        $i = 0;
        require ROOT . '/app/Config/timezones.php';
        foreach($timezones as $key => $timezone):

            $selected = '';
            if($i == \App\Models\UserSettingsModel::$settings['timezone'])
                $selected = ' selected';

            ?>

            <option value="<?= $key ?>"<?= $selected ?>><?= $timezone ?></option>

            <?php

            ++$i;
        endforeach;

        ?>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for="first-day_selector" class="settings-label" data-locale="SETTINGS_APPEARANCE_FIRST-DAY"></label>
    <select name="first_day" id="first-day_selector" class="selector-instance">

        <?=

        $firstDaySelected = \App\Models\UserSettingsModel::$settings['first_day'];
        function isFirstDay($current, $first) {
            if($current == $first)
                return ' selected';
            else
                return '';
        }

        ?>

        <option value="0" data-sublocale="MONDAY"<?= isFirstDay(0, $firstDaySelected) ?>></option>
        <option value="1" data-sublocale="TUESDAY"<?= isFirstDay(1, $firstDaySelected) ?>></option>
        <option value="2" data-sublocale="WEDNESDAY"<?= isFirstDay(2, $firstDaySelected) ?>></option>
        <option value="3" data-sublocale="THURSDAY"<?= isFirstDay(3, $firstDaySelected) ?>></option>
        <option value="4" data-sublocale="FRIDAY"<?= isFirstDay(4, $firstDaySelected) ?>></option>
        <option value="5" data-sublocale="SATURDAY"<?= isFirstDay(5, $firstDaySelected) ?>></option>
        <option value="6" data-sublocale="SUNDAY"<?= isFirstDay(6, $firstDaySelected) ?>></option>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for="date-format_selector" class="settings-label" data-locale="SETTINGS_APPEARANCE_DATE"></label>
    <select name="date_format" id="date-format_selector" class="selector-instance">

        <?php

        $i = 0;
        foreach($this->CONFIG['system']['support']['date_formats'] as $key => $format):

            $selected = '';
            if(\App\Models\UserSettingsModel::$settings['date_format'] == $i)
                $selected = ' selected';

            ?>

            <option value="<?= $key ?>"<?= $selected ?>><?= date($format) ?></option>

            <?php

            ++$i;
        endforeach;

        ?>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for="time-format_selector" class="settings-label" data-locale="SETTINGS_APPEARANCE_TIME"></label>
    <select name="time_format" id="time-format_selector" class="selector-instance">

        <?php

        $i = 0;
        foreach($this->CONFIG['system']['support']['time_formats'] as $key => $format):

            $selected = '';
            if(\App\Models\UserSettingsModel::$settings['time_format'] == $i)
                $selected = ' selected';

            ?>

            <option value="<?= $key ?>"<?= $selected ?>><?= date($format) ?></option>

            <?php

            ++$i;
        endforeach;

        ?>

    </select>

</div>

<div class="subcontent-box input-box">

    <label for="number-format_selector" class="settings-label" data-locale="SETTINGS_APPEARANCE_NUMBER"></label>
    <select name="number_format" id="number-format_selector" class="selector-instance">

        <?php

        $i = 0;
        foreach($this->CONFIG['system']['support']['number_formats'] as $key => $format):

            $selected = '';
            if(\App\Models\UserSettingsModel::$settings['number_format'] == $i)
                $selected = ' selected';

            ?>

            <option value="<?= $key ?>"<?= $selected ?>><?= number_format(1285645.86, $format[0], $format[1], $format[2]) ?></option>

            <?php

            ++$i;
        endforeach;

        ?>

    </select>

</div>

<?php

require_once 'action_bar.php';