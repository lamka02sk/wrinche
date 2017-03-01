<?php

if(!App\Requests\Request::$ajax) {

    require ROOT . '/app/Layouts/Admin/Header.php';
    require ROOT . '/app/Layouts/Admin/Menu.php';

}

?>

<div class="content-wrapper">

    <div class="content-header">

        <div class="header-mainline">

            <h2 class="mainline-heading" data-locale="DASHBOARD_TITLE"></h2>

            <div class="mainline-search">

                <span class="mainline-edit" data-locale="DASHBOARD_EDIT"></span>

                <div class="input-box">
                    <input type="search" name="dashboard-search" data-placeholder="DASHBOARD_SEARCH">
                </div>

            </div>

        </div>

        <p class="header-description" data-locale="DASHBOARD_DESCRIPTION"></p>

    </div>

</div>