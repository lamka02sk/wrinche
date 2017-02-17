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

        <?php

        if($page === 'Login'):

        ?>

            <span class="more-item password"><a class="reset-password" data-locale="RESET_PASSWORD"></a></span>

        <?php

        endif;

        ?>

        <span class="more-item wiki"><a href="http://wrinche.samuelillo.com/wiki" data-locale="SYSTEM_WIKI"></a></span>

        <span class="more-item credits">&copy; wrinche, <?= date('Y') ?>, v<?= $this->CONFIG['system']['version'] ?></span>

    </div>

</div>