componentsModule.modules.categories = {

    data: {
        categories: []
    },

    start: function() {
        ajax(
            baseURI + 'api/categories.all&csrf_token=' + csrf_token,
            'GET',
            false,
            '*',
            function (response) {
                // Success
                let categories = response.data;
                let parentElement = document.querySelector('label[for=component_categories]').parentNode;
                let categoriesListElement = parentElement.querySelector('div.categories-list');
                for(let category in categories) {
                    let data = categories[category];
                    let template = document.querySelector('#template_component_categories_item').childNodes[0].cloneNode(true);
                    template.setAttribute('data-category', data.id);
                    template.children[0].innerText = data.name;
                    template.children[1].addEventListener('click', function() {
                        if(componentsModule.modules.categories.data.categories.indexOf(data.id) === -1)
                            componentsModule.modules.categories.data.categories.push(data.id);
                        template.childNodes[1].classList.add('hide');
                        template.childNodes[2].classList.remove('hide');
                    });
                    template.children[2].addEventListener('click', function() {
                        if(componentsModule.modules.categories.data.categories.indexOf(data.id) !== -1)
                            componentsModule.modules.categories.data.categories.splice(componentsModule.modules.categories.data.categories.indexOf(data.id), 1);
                        template.childNodes[1].classList.remove('hide');
                        template.childNodes[2].classList.add('hide');
                    });
                    categoriesListElement.appendChild(template);
                }
            },
            function() {
                // Error
            }
        )
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.categories.data;
    },

    events: [

        {
            event: 'keyup change',
            element: document.querySelector('label[for=component_categories]').parentNode.querySelector('input[name=component_categories_search]'),
            content: function(event) {
                console.log(event);
                let searchPhrase = event.target.value.toLowerCase();
                let searchPhraseLength = searchPhrase.length;
                let listElements = event.target.parentNode.querySelector('div.categories-list').childNodes;
                let listElementsLength = listElements.length;
                for(let i = 0; i < listElementsLength; ++i) {
                    let abbr = listElements[i].childNodes[0].innerText.substring(0, searchPhraseLength).toLowerCase();
                    if(abbr === searchPhrase)
                        listElements[i].classList.remove('hide');
                    else
                        listElements[i].classList.add('hide');
                }
                packery.packery().reloadItems();
            }
        }

    ]

};