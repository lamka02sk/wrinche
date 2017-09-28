import Global from "../../../scripts/Modules/Global";
import Utils from "../../../scripts/Modules/Utils";

let link = {

    data: {},

    resumeInline(identifier, element, resumeData) {

        link.create(identifier, element, resumeData);

    },

    createSelector(identifier) {

        setTimeout(() => {

            new Global.Selector({

                element: 'select[name="' + identifier + '"]',
                selected(instance, option) {
                    link.data[identifier].link_target = +option.trim();
                }

            });

        });

    },

    create(identifier, element, resumeData) {

        // Initialize Data
        link.data[identifier] = {
            title        : '',
            link         : '',
            link_text    : '',
            link_position: 1,
            link_target  : 0,
            disabled     : 0
        };

        let select        = element.querySelector('select[name=component_inline_link_target]');
        let positionItems = element.querySelectorAll('span.position-item');
        let linkInput     = element.querySelector('input[name=component_inline_link_url]');
        let linkName      = element.querySelector('input[name=component_inline_link_name]');

        if(resumeData) {

            if(resumeData.link)
                link.data[identifier].link = linkInput.value = resumeData.link.trim();

            if(resumeData.link_text)
                link.data[identifier].link_text = linkName.value = resumeData.link_text.trim();

            if(resumeData.link_position !== undefined) {

                link.data[identifier].link_position = resumeData.link_position;

                positionItems.forEach(function(item) {

                    if(item.matches('[data-position="' + resumeData.link_position + '"]')) {

                        item.classList.add('active');
                        return true;

                    }

                    item.classList.remove('active');

                });

            }

            if(resumeData.link_target !== undefined) {

                let selected = select.querySelector('[selected]');

                selected.removeAttribute('selected');
                select.children[resumeData.link_target].setAttribute('selected', 'true');

            }

        }

        // Initialize target Selector
        select.setAttribute('name', identifier);
        link.createSelector(identifier);

        Utils.registerEvents([

            {
                // Serialize link
                event  : 'change keyup',
                element: linkInput,
                content(event) {
                    link.data[identifier].link = event.target.value.trim();
                }
            },

            {
                // Serialize link text
                event  : 'change keyup',
                element: linkName,
                content(event) {
                    link.data[identifier].link_text = event.target.value.trim();
                }
            },

            {
                // Serialize position component
                event  : 'click',
                element: positionItems,
                content(event) {

                    link.data[identifier].link_position = event.target.getAttribute('data-position');

                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });

                    event.target.classList.add('active');

                }
            }

        ]);
    },

    validate() {
        return true;
    },

    serialize() {
        return link.data;
    }

};

module.exports = link;