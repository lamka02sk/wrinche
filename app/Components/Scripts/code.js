componentsModule.modules.code = {

    programmingLanguages: [],
    select: false,
    data: {},

    create: function(identifier, element) {

        // Load programming languages
        if(componentsModule.modules.code.programmingLanguages.length === 0)
            componentsModule.modules.code.programmingLanguages = getJson('app/Config/programming_languages.json');

        // Create language selector
        if(componentsModule.modules.code.select === false) {
            let select = document.createElement('select');
            select.setAttribute('id', 'select-relative');
            select.setAttribute('data-type', 'search-selector');
            componentsModule.modules.code.programmingLanguages.forEach(function(language, key) {
                let option = document.createElement('option');
                option.setAttribute('value', key.toString());
                if(language === 'JavaScript') option.setAttribute('selected', 'true');
                option.innerText = language;
                select.appendChild(option);
            });
            componentsModule.modules.code.select = select;
        }

        let contentElement = element.querySelector('div.component-element-content');

        // Add select to template
        let select = componentsModule.modules.code.select.cloneNode(true);
        select.setAttribute('name', 'component-inline-code-programming_languages-select_' + identifier);
        contentElement.appendChild(select);

        // Initialize data object
        componentsModule.modules.code.data[identifier] = {
            title: '',
            code: '',
            code_language: -1,
            disabled: 0
        };

        // Initialize Selector and events
        setTimeout(function() {
            new Selector({
                selector: 'select[name=component-inline-code-programming_languages-select_' + identifier + ']',
                onSelect: function(instance, option) {
                    componentsModule.modules.code.data[identifier].code_language = +option.getAttribute('data-item').trim();
                }
            });
        });

        // Initialize events
        componentsModule.initializeEvents([

            {
                // Serialize textarea
                event: 'change keyup',
                element: contentElement.querySelector('textarea'),
                content: function(event) {
                    componentsModule.modules.code.data[identifier].code = event.target.value.trim();
                }
            },

            {
                // Tab in textarea
                event: 'keydown',
                element: contentElement.querySelector('textarea'),
                content: function(event) {
                    let keyCode = event.keyCode || event.which;
                    if(keyCode === 9) {
                        event.preventDefault();
                        let start = this.selectionStart;
                        let end = this.selectionEnd;
                        let val = this.value;
                        let selected = val.substring(start, end);
                        let re = /^/gm;
                        let count = selected.match(re).length * 4;
                        this.value = val.substring(0, start) + selected.replace(re, '    ') + val.substring(end);
                        if(start === end) this.selectionStart = end + count;
                        else this.selectionStart = start;
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