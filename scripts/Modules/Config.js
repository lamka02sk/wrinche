import Global from '../Modules/Global';

export default {

    // CKEditor config
    editor: {
        language: Global.html.attr('lang'),
        uiColor: '#ffffff',
        extraPlugins: 'autogrow',
        autoGrow_minHeight: 150,
        autoGrow_maxHeight: 700,
        autoGrow_onStartup: true,
        toolbar: [
            {
                name: 'history',
                items: [
                    'Undo', 'Redo'
                ]
            },
            {
                name: 'clipboard',
                items: [
                    'Cut', 'Copy', 'Paste', 'PasteFromWord'
                ]
            },
            {
                name: 'basic',
                items: [
                    'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'
                ]
            },
            {
                name: 'lists',
                items: [
                    'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'
                ]
            },
            {
                name: 'justify',
                items: [
                    'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'
                ]
            },
            {
                name: 'links',
                items: [
                    'Link', 'Unlink'
                ]
            },
            {
                name: 'advanced',
                items: [
                    'HorizontalRule', 'Symbol', 'EqnEditor'
                ]
            },
            {
                name: 'color',
                items: [
                    'TextColor', 'BGColor'
                ]
            }
        ]
    }

};