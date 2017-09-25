import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";
import Ajax from "../../../scripts/Modules/Ajax";
import Router from "../../../scripts/Modules/Router";
import Csrf from "../../../scripts/Modules/Csrf";

let categories = {

    start() {

        // Save elements
        let current = this;
        current.parentElement   = document.querySelector('[data-component=categories]');
        current.listElement     = current.parentElement.querySelector('.categories-list');
        current.inputElement    = current.parentElement.querySelector('input');
        current.templateElement = current.parentElement.querySelector('#template_component_categories_item').childNodes[0];

        // Get and show categories
        const categories = Ajax.getJSON(Router.createLink('api/categories.all&csrf_token=' + Csrf.getToken()));

        if(!categories.success || categories.code !== 200)
            return true;

        Object.values(categories.data).forEach(category => {

            let template = current.templateElement.cloneNode(true);
            template.setAttribute('data-category', category.id);
            template.setAttribute('data-active', 'false');
            template.children[0].innerText = category.name;

            this.listElement.appendChild(template);

        });

        // Events
        Utils.registerEvents([

            {
                // Delegate click events
                event  : 'click',
                element: current.parentElement,
                content(event) {

                    let target = event.target;

                    // Add category
                    if(target.matches('.add-category')) {

                        target.parentNode.setAttribute('data-active', 'true');
                        target.classList.add('hide');
                        target.nextSibling.classList.remove('hide');

                    }

                    // Remove category
                    else if(target.matches('.remove-category')) {

                        target.parentNode.setAttribute('data-active', 'false');
                        target.previousSibling.classList.remove('hide');
                        target.classList.add('hide');

                    }

                }
            },

            {
                // Search in categories
                event  : 'change keyup',
                element: current.inputElement,
                content() {

                    const searchPhrase = current.inputElement.value.trim().toLowerCase();

                    Array.from(current.listElement.childNodes).forEach(function(categoryElement) {

                        let categoryName = categoryElement.childNodes[0].innerText.toLowerCase();

                        if(~categoryName.indexOf(searchPhrase))
                            categoryElement.classList.remove('hide');
                        else
                            categoryElement.classList.add('hide');

                    });

                    Global.packery.reloadItems();

                }
            }

        ]);

        Global.packery.reloadItems();

    },

    resume() {

        // Save current instance
        const data  = this.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const categories = JSON.parse(data).categories;

        if(categories === null)
            return true;

        categories.forEach(category => {

            this.listElement.querySelector('[data-category="' + category + '"]').childNodes[1].click();

        });

    },

    validate() {

        return true;

    },

    serialize() {

        let categoriesElements = categories.listElement.querySelectorAll('[data-active=true]');

        let activeCategories = Object.values(categoriesElements).map(function(categoryElement) {
            return categoryElement.getAttribute('data-category');
        });

        return {

            categories: activeCategories

        }

    }

};

module.exports = categories;