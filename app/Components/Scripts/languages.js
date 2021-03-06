componentsModule.modules.languages = {
    
    start: function() {

        // Load languages
        languages = getJson('app/Config/languages.json');
        let listElement = document.querySelector('div.languages-list');
        let targetSelect = document.querySelector('select[name=write_current_language]');

        for(let abbr in languages) {
            let template = document.querySelector('#template_component_languages_item').childNodes[0].cloneNode(true);
            let localeString = 'LANGUAGE_' + languages[abbr].toUpperCase().split(';')[0];
            template.setAttribute('data-language', abbr);
            template.childNodes[0].setAttribute('data-locale', localeString);
            template.childNodes[0].innerText = languages[abbr];
            listElement.appendChild(template);

            // Add language
            template.childNodes[1].addEventListener('click', function() {
                let currentOptions = targetSelect.children;
                for(let i = 0; i < currentOptions.length; ++i)
                    if(currentOptions[i].getAttribute('data-locale') === localeString) return false;
                let newOption = document.createElement('option');
                newOption.setAttribute('value', abbr);
                newOption.setAttribute('data-locale', localeString);
                newOption.innerText = languages[abbr];
                targetSelect.appendChild(newOption);
                selector.destroy();
                selector = new Selector({
                    selector: 'select.selector-search-select'
                });
                template.childNodes[1].classList.add('hide');
                template.childNodes[2].classList.remove('hide');
                if(componentsModule.modules.languages.data.languages.indexOf(abbr) === -1)
                    componentsModule.modules.languages.data.languages.push(abbr);
                // ...
            });

            // Remove language
            template.childNodes[2].addEventListener('click', function() {
                let actionTextLocale = translate.locale.system[localeString];
                if(typeof actionTextLocale === 'undefined')
                    actionTextLocale = languages[abbr];
                let actionText = translate.locale.response['ACTION_CONFIRM_REMOVE_LANGUAGE'].replace('%language%', actionTextLocale);
                confirmAction(actionText, function() {
                    let option = targetSelect.querySelector('option[data-locale=' + localeString + ']');
                    if(option.getAttribute('selected'))
                        targetSelect.children[0].setAttribute('selected', 'true');
                    targetSelect.removeChild(option);
                    selector.destroy();
                    selector = new Selector({
                        selector: 'select.selector-search-select'
                    });
                    template.childNodes[2].classList.add('hide');
                    template.childNodes[1].classList.remove('hide');
                    if(componentsModule.modules.languages.data.languages.indexOf(abbr) !== -1)
                        componentsModule.modules.languages.data.languages.splice(componentsModule.modules.languages.data.languages.indexOf(abbr), 1);
                    // ...
                });
            });
        }

        translate.addTranslation(['system']);

    },

    data: {
        languages: []
    },

    validate: function() {

    },

    serialize: function() {
        return componentsModule.modules.languages.data.languages;
    },

    events: [

        {
            // Search in languages list
            event: "change keyup",
            element: document.querySelector('input[name=component_language_search]'),
            content: function(event) {
                let searchPhrase = event.target.value.toLowerCase();
                let searchPhraseLength = searchPhrase.length;
                let listElements = document.querySelector('div.languages-list').childNodes;
                let listElementsLength = listElements.length;
                // Search by abbr
                if(searchPhraseLength < 3) {
                    for(let i = 0; i < listElementsLength; ++i) {
                        let abbr = listElements[i].getAttribute('data-language').substring(0, searchPhraseLength).toLowerCase();
                        if(abbr === searchPhrase)
                            listElements[i].classList.remove('hide');
                        else
                            listElements[i].classList.add('hide');
                    }
                    packery.packery().reloadItems();
                    return true;
                }
                // Search by name
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