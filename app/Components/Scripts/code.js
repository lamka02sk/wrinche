componentsModule.modules.code = {

    programmingLanguages: [],
    select              : false,
    data                : {},

    resumeInline: function(identifier, element, resumeData) {

        componentsModule.modules.code.create(identifier, element, resumeData);

    },

    createSelector: function(identifier, current) {

        setTimeout(function() {

            new Selector({

                selector: 'select[name=component-inline-code-programming_languages-select_' + identifier + ']',

                onSelect: function(instance, option) {

                    current.data[identifier].code_language = +option.getAttribute('data-item').trim();

                }

            });

        });

    },

    create: function(identifier, element, resumeData) {

        let current = componentsModule.modules.code;

        // Load programming languages
        if(current.programmingLanguages.length === 0)
            current.programmingLanguages = getJson('app/Config/programming_languages.json');

        // Create language selector
        if(current.select === false) {

            let select = document.createElement('select');

            select.setAttribute('id', 'select-relative');
            select.setAttribute('data-type', 'search-selector');

            current.programmingLanguages.forEach(function(language, key) {

                let option = document.createElement('option');
                option.setAttribute('value', key.toString());

                if(language === 'JavaScript')
                    option.setAttribute('selected', 'true');

                option.innerText = language;
                select.appendChild(option);

            });

            current.select = select;

        }

        let contentElement = element.querySelector('div.component-element-content');
        let textarea       = contentElement.querySelector('textarea');
        let select         = current.select.cloneNode(true);

        // Initialize data object
        current.data[identifier] = {
            title        : '',
            code         : '',
            code_language: 299,
            disabled     : 0
        };

        if(resumeData) {

            if(resumeData.code)
                current.data[identifier].code = textarea.value = resumeData.code.trim();

            if(resumeData.code_language) {

                let selected                           = select.querySelector('[selected]');
                current.data[identifier].code_language = resumeData.code_language;

                selected.removeAttribute('selected');
                select.children[resumeData.code_language].setAttribute('selected', 'true');

            }

        }

        select.setAttribute('name', 'component-inline-code-programming_languages-select_' + identifier);
        contentElement.appendChild(select);

        current.createSelector(identifier, current);

        // Initialize events
        componentsModule.initializeEvents([

            {
                // Serialize textarea
                event  : 'change keyup',
                element: textarea,
                content: function(event) {
                    current.data[identifier].code = event.target.value.trim();
                }
            },

            {
                // Tab in textarea
                event  : 'keydown',
                element: textarea,
                content: function(event) {

                    let keyCode = event.keyCode || event.which;

                    if(keyCode === 9) {

                        event.preventDefault();

                        let start    = this.selectionStart;
                        let end      = this.selectionEnd;
                        let val      = this.value;
                        let selected = val.substring(start, end);
                        let re       = /^/gm;
                        let count    = selected.match(re).length * 4;

                        this.value = val.substring(0, start) + selected.replace(re, '    ') + val.substring(end);

                        if(start === end)
                            this.selectionStart = end + count;
                        else
                            this.selectionStart = start;

                        this.selectionEnd = end + count;

                    }

                }
            }

        ]);

    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.code.data;
    }

};