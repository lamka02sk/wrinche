import Global from '../../../scripts/Modules/Global';
import Config from '../../../scripts/Modules/Config';

let editor = {

    data: {},
    elements: {},

    resumeInline(identifier, element, resumeData) {

        editor.create(identifier, element, function() {

            editor.data[identifier].value = resumeData.value.trim();

        });

    },

    reload(identifier) {

        editor.onCreate(identifier);
        CKEDITOR.instances['editor_' + identifier].setData(editor.data[identifier].value);

    },

    create(identifier, element, callback) {

        editor.data[identifier] = {
            title: '',
            value: '',
            disabled: 0
        };

        element.querySelector('textarea').setAttribute('id', 'editor_' + identifier);

        if(callback)
            callback();

    },

    onCreate(identifier) {


        CKEDITOR.replace('editor_' + identifier, Config.editor);

        CKEDITOR.instances['editor_' + identifier].on('change', function() {
            editor.data[identifier].value = CKEDITOR.instances['editor_' + identifier].getData().trim();
        });

        if(editor.data[identifier].value !== '')
           CKEDITOR.instances['editor_' + identifier].setData(editor.data[identifier].value);

    },

    validate() {

        return true;

    },

    serialize() {

        return editor.data;

    }

};

module.exports = editor;