import Ajax from "../../../scripts/Modules/Ajax";
import Utils from "../../../scripts/Modules/Utils";
import Global from "../../../scripts/Modules/Global";

let code = {

    programmingLanguages: [],
    select              : false,
    data                : {},

    resumeInline(identifier, element, resumeData) {

        code.create(identifier, element, resumeData);

    },

    createSelector(identifier) {

        setTimeout(() => {

            new Global.Selector({

                element: 'select[name=component-inline-code-programming_languages-select_' + identifier + ']',
                selected(instance, option) {
                    code.data[identifier].code_language = +option.trim();
                }

            });

        });

    },

    create(identifier, element, resumeData) {

        // Load programming languages
        if(code.programmingLanguages.length === 0)
            code.programmingLanguages = Ajax.getJSON('app/Config/programming_languages.json');

        // Create language selector
        if(code.select === false) {

            let select = document.createElement('select');

            select.setAttribute('id', 'select-relative');
            select.setAttribute('data-type', 'search-selector');

            code.programmingLanguages.forEach(function(language, key) {

                let option = document.createElement('option');
                option.setAttribute('value', key.toString());

                if(language === 'JavaScript')
                    option.setAttribute('selected', 'true');

                option.innerText = language;
                select.appendChild(option);

            });

            code.select = select;

        }

        let contentElement = element.querySelector('div.component-element-content');
        let textarea       = contentElement.querySelector('textarea');
        let select         = code.select.cloneNode(true);

        // Initialize data object
        code.data[identifier] = {
            title        : '',
            code         : '',
            code_language: 299,
            disabled     : 0
        };

        if(resumeData) {

            if(resumeData.code)
                code.data[identifier].code = textarea.value = resumeData.code.trim();

            if(resumeData.code_language) {

                let selected                        = select.querySelector('[selected]');
                code.data[identifier].code_language = resumeData.code_language;

                selected.removeAttribute('selected');
                select.children[resumeData.code_language].setAttribute('selected', 'true');

            }

        }

        select.setAttribute('name', 'component-inline-code-programming_languages-select_' + identifier);
        contentElement.appendChild(select);

        code.createSelector(identifier);

        // Initialize events
        Utils.registerEvents([

            {
                // Serialize textarea
                event  : 'change keyup',
                element: textarea,
                content(event) {
                    code.data[identifier].code = event.target.value.trim();
                }
            },

            {
                // Tab in textarea
                event  : 'keydown',
                element: textarea,
                content(event) {

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

    validate() {
        return true;
    },

    serialize() {
        return code.data;
    }

};

module.exports = code;