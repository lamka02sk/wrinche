<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Controller for administration homepage.
 * Version: 0.1.2
 * Authors: lamka02sk
 */

namespace App\Controllers\Admin;

use App\Controllers\AdminController;
use App\Models\LocaleModel;
use App\Views\Admin as DashboardView;

class DashboardController extends AdminController {

    /**
     * DashboardController constructor.
     * Prepare Controller for Dashboard render
     * @param $subcategory
     */
    public function __construct($subcategory) {

        // Save subcategory
        $this->subcategory = $subcategory;

        // Execute the parent "constructor"
        $this->start();

        // Create data for View
        $this->renderDashboard();

    }

    public function renderDashboard() {

        // Create View
        $this->createView();

    }

    public function createView() {

        // Call View constructor
        new DashboardView($this, 'Dashboard');

    }

}