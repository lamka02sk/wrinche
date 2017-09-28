import Utils from "../../../scripts/Modules/Utils";

let note = {

    data: {},

    resumeInline(identifier, element, resumeData) {

        note.create(identifier, element, resumeData);

    },

    validate() {
        return true;
    },

    serialize() {
        return note.data;
    },

    create(identifier, element, resumeData) {

        let positionItems = element.querySelectorAll('span.position-item');
        let textarea      = element.querySelector('textarea[name=component_inline_note]');

        note.data[identifier] = {
            title        : '',
            note         : '',
            note_position: 1,
            disabled     : 0
        };

        Utils.registerEvents([

            {
                // Serialize textarea
                event  : 'change keyup',
                element: textarea,
                content(event) {
                    note.data[identifier].note = event.target.value.trim();
                }
            },

            {
                // Serialize position
                event  : 'click',
                element: positionItems,
                content(event) {
                    note.data[identifier].note_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        if(resumeData) {

            if(resumeData.note) {

                textarea.value = resumeData.note.trim();
                Utils.triggerEvent(textarea, 'change');

            }

            if(resumeData.note_position !== undefined)
                positionItems[resumeData.note_position].click();

        }

    }

};

module.exports = note;