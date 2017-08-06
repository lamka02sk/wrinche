componentsModule.modules.categories = {

    start: function() {

        // Save elements
        let current             = componentsModule.modules.categories;
        current.parentElement   = document.querySelector('[data-component=categories]');
        current.listElement     = current.parentElement.querySelector('.categories-list');
        current.inputElement    = current.parentElement.querySelector('input');
        current.templateElement = current.parentElement.querySelector('#template_component_categories_item').childNodes[0];

        // Get and show categories
        const categories = getJson(URI + 'api/categories.all&csrf_token=' + csrf_token);

        if(!categories.success || categories.code !== 200)
            return true;

        Object.values(categories.data).forEach(function(category) {

            let template = current.templateElement.cloneNode(true);
            template.setAttribute('data-category', category.id);
            template.setAttribute('data-active', 'false');
            template.children[0].innerText = category.name;

            current.listElement.appendChild(template);

        });

        // Events
        componentsModule.initializeEvents([

            {
                // Delegate click events
                event  : 'click',
                element: current.parentElement,
                content: function(event) {

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
                content: function() {

                    const searchPhrase = current.inputElement.value.trim().toLowerCase();

                    Array.from(current.listElement.childNodes).forEach(function(categoryElement) {

                        let categoryName = categoryElement.childNodes[0].innerText.toLowerCase();

                        if(~categoryName.indexOf(searchPhrase))
                            categoryElement.classList.remove('hide');
                        else
                            categoryElement.classList.add('hide');

                    });

                    reloadPackery();

                }
            }

        ]);

        reloadPackery();

    },

    resume: function() {

        // Save current instance
        let current = componentsModule.modules.categories;
        const data  = current.parentElement.getAttribute('data-resume');

        if(data === '')
            return true;

        const categories = JSON.parse(data).categories;

        if(categories === null)
            return true;

        categories.forEach(function(category) {

            current.listElement.querySelector('[data-category="' + category + '"]').childNodes[1].click();

        });

    },

    validate: function() {

        return true;

    },

    serialize: function() {

        let categoriesElements = componentsModule.modules.categories.listElement.querySelectorAll('[data-active=true]');

        let activeCategories = Object.values(categoriesElements).map(function(categoryElement) {

            return categoryElement.getAttribute('data-category');

        });

        return {

            categories: activeCategories

        }

    }

};