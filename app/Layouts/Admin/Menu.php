<nav>

    <ul>

        <li <?php if($layout === 'Dashboard'): ?>class="active"<?php endif; ?> data-link="dashboard" data-target="content">

            <span class="item-icon icon-dashboard"></span>
            <span class="item-text" data-locale="MENU_DASHBOARD"></span>
            <span class="item-active"></span>
            <span class="item-value"></span>

        </li>

        <li <?php if($layout === 'Articles'): ?>class="active"<?php endif; ?> data-link="articles" data-target="content">

            <span class="item-icon icon-articles"></span>
            <span class="item-text" data-locale="MENU_ARTICLES"></span>
            <span class="item-active"></span>
            <span class="item-value item-value-count nothing">0</span>

        </li>

        <li <?php if($layout === 'Sections'): ?>class="active"<?php endif; ?> data-link="sections" data-target="content">

            <span class="item-icon icon-sections"></span>
            <span class="item-text" data-locale="MENU_SECTIONS"></span>
            <span class="item-active"></span>

        </li>

        <li <?php if($layout === 'Comments'): ?>class="active"<?php endif; ?> data-link="comments" data-target="content">

            <span class="item-icon icon-comments"></span>
            <span class="item-text" data-locale="MENU_COMMENTS"></span>
            <span class="item-active"></span>
            <span class="item-value item-value-count">18</span>

        </li>

        <li <?php if($layout === 'Mistakes'): ?>class="active"<?php endif; ?> data-link="mistakes" data-target="content">

            <span class="item-icon icon-mistakes"></span>
            <span class="item-text" data-locale="MENU_MISTAKES"></span>
            <span class="item-active"></span>
            <span class="item-value item-value-check item-value-checked"></span>

        </li>

        <li <?php if($layout === 'Multimedia'): ?>class="active"<?php endif; ?> data-link="multimedia" data-target="content">

            <span class="item-icon icon-multimedia"></span>
            <span class="item-text" data-locale="MENU_MULTIMEDIA"></span>
            <span class="item-active"></span>
            <span class="item-value item-value-count nothing">0</span>

        </li>

        <li <?php if($layout === 'Sorting'): ?>class="active"<?php endif; ?> data-link="sorting" data-target="content">

            <span class="item-icon icon-sorting"></span>
            <span class="item-text" data-locale="MENU_SORTING"></span>
            <span class="item-active"></span>

        </li>

        <li <?php if($layout === 'Calendar'): ?>class="active"<?php endif; ?> data-link="calendar" data-target="content">

            <span class="item-icon icon-calendar"></span>
            <span class="item-text" data-locale="MENU_CALENDAR"></span>
            <span class="item-active"></span>
            <span class="item-value item-value-count">2</span>

        </li>

        <li <?php if($layout === 'Components'): ?>class="active"<?php endif; ?> data-link="components" data-target="content">

            <span class="item-icon icon-components"></span>
            <span class="item-text" data-locale="MENU_COMPONENTS"></span>
            <span class="item-active"></span>

        </li>

        <li <?php if($layout === 'Analytics'): ?>class="active"<?php endif; ?> data-link="analytics" data-target="content">

            <span class="item-icon icon-analytics"></span>
            <span class="item-text" data-locale="MENU_ANALYTICS"></span>
            <span class="item-active"></span>
            <span class="item-value item-value-plus"></span>

        </li>

        <li <?php if($layout === 'Websites'): ?>class="active"<?php endif; ?> data-link="websites" data-target="content">

            <span class="item-icon icon-websites"></span>
            <span class="item-text" data-locale="MENU_WEBSITES"></span>
            <span class="item-active"></span>

        </li>

        <li <?php if($layout === 'Settings'): ?>class="active"<?php endif; ?> data-link="settings" data-target="content">

            <span class="item-icon icon-settings"></span>
            <span class="item-text" data-locale="MENU_SETTINGS"></span>
            <span class="item-active"></span>

        </li>

    </ul>

</nav>

<footer>

    <span class="footer-credits">&copy; wrinche, <?= date('Y') ?>, v<?= $this->CONFIG['system']['version'] ?></span>

    <span class="footer-more"></span>

    <div class="more-content">

        <span class="content-item help"></span>
        <span class="content-item settings"></span>
        <span class="content-item eula"></span>
        <span class="content-item pro"></span>
        <span class="content-item update"></span>
        <span class="content-item logout logout-action"></span>

    </div>

</footer>