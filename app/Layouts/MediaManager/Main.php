<div class="media-manager">

    <div class="manager-header">

        <div class="system-logo">
            <img src="assets/system/wrinche-logo-charcoal-small.png" alt="wrinche. logo">
        </div>
        <p class="title" data-locale="MEDIA_MANAGER_TITLE"></p>
        <input type="search" name="manager-search" data-placeholder="HEADER_SEARCH">

        <span class="close-manager"></span>
        <button class="manager-upload-file icon-file" data-locale="MEDIA_MANAGER_UPLOAD_FILE_BUTTON"></button>
        <button class="manager-upload-audio icon-audio" data-locale="MEDIA_MANAGER_UPLOAD_AUDIO_BUTTON"></button>
        <button class="manager-upload-video icon-video" data-locale="MEDIA_MANAGER_UPLOAD_VIDEO_BUTTON"></button>
        <button class="manager-upload-image icon-image" data-locale="MEDIA_MANAGER_UPLOAD_IMAGE_BUTTON"></button>

    </div>

    <div class="manager-tree">

        <div class="tree-images tree-branch">

            <p class="tree-title icon-image" data-locale="IMAGES"></p>

        </div>

        <div class="tree-videos tree-branch">

            <p class="tree-title icon-video" data-locale="VIDEOS"></p>

        </div>

        <div class="tree-audios tree-branch">

            <p class="tree-title icon-audio" data-locale="AUDIOS"></p>

        </div>

        <div class="tree-files tree-branch">

            <p class="tree-title icon-file" data-locale="FILES"></p>

        </div>

    </div>

    <div class="manager-content">

        <?= ''//ini_get('upload_max_filesize') ?>
        <?= ''//ini_get('post_max_size') ?>

        <?php

        $files = scandir(ROOT . '/app/Data/Files');
        unset($files[0], $files[1]);
        $files = array_values($files);

        echo '<br><br><br>';

        foreach($files as $dirname) {

            echo '<b>' . $dirname . '</b><br>';

            $filelist = preg_grep('/^([^.])/', scandir(ROOT . '/app/Data/Files/' . $dirname));
            unset($filelist[0], $filelist[1]);
            $filelist = array_values($filelist);

            if(empty($filelist))
                echo '** empty **' . '<br>';

            foreach($filelist as $file) {
                echo '<li class="item-file" data-type="' . strtolower($dirname) . '" data-path="' . $file . '">' . $file . ' <input type="button" class="item-select" value="Select"></li><br>';
            }

            echo '<br>';

        }

        ?>

        <!--<div class="content-header">
            <h2 data-locale="MEDIA_MANAGER_DASHBOARD"></h2>
        </div>

        <div class="breadcrumbs">
            <span class="item" data-locale="MEDIA_MANAGER_DASHBOARD"></span>
        </div>

        <div class="content-content">

            <div class="quick-actions">
                <h3>Rýchle akcie</h3>
                <button class="manager-upload-image icon-image" data-locale="MEDIA_MANAGER_UPLOAD_IMAGE_BUTTON"></button>
                <button class="manager-upload-video icon-video" data-locale="MEDIA_MANAGER_UPLOAD_VIDEO_BUTTON"></button>
                <button class="manager-upload-audio icon-audio" data-locale="MEDIA_MANAGER_UPLOAD_AUDIO_BUTTON"></button>
                <button class="manager-upload-file icon-file" data-locale="MEDIA_MANAGER_UPLOAD_FILE_BUTTON"></button>
            </div>

            <div class="quick-navigation">
                <h3>Rýchla navigácia</h3>
                <button class="manager-images icon-image" data-locale="IMAGES"></button>
                <button class="manager-videos icon-video" data-locale="VIDEOS"></button>
                <button class="manager-audios icon-audio" data-locale="AUDIOS"></button>
                <button class="manager-files icon-file" data-locale="FILES"></button>
            </div>

        </div>-->

    </div>

    <div class="manager-queue">

        <div class="manager-queue-header">
            <p class="title" data-locale="MEDIA_MANAGER_QUEUE_TITLE"></p>
            <span class="loading"></span>
            <span class="minimize-queue"></span>
        </div>

        <div class="manager-queue-list">

            <!--<div class="queue-item">
                <div class="type-icon icon-file_white"></div>
                <p class="item-name">My_new_file.docx</p>
                <span class="remove-item icon-close_white"></span>
                <span class="upload-item" data-locale="UPLOAD"></span>
            </div>-->

        </div>

    </div>

    <div class="hidden-content">
        <input type="file" accept="image/*" name="media_manager_input_image">
        <input type="file" accept="video/*" name="media_manager_input_video">
        <input type="file" accept="audio/*" name="media_manager_input_audio">
        <input type="file" accept="application/*" name="media_manager_input_file">
    </div>

</div>