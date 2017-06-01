/*function ComponentController(components) {

    this.components = components;

    // Serializers
    function serializeText(element) {
        return element.value.trim();
    }

    function serializeTextarea(element) {
        return element.innerText.trim();
    }

    function serializeCheckBox(element) {
        return (element.checked);
    }

    // Title component
    this.title = {

        validate: function() {
            return (this.serialize().length <= 100);
        },

        serialize: function() {
            return serializeText(document.querySelector('input[name=write_title]'));
        }

    };

    // Excerpt component
    this.excerpt = {

        validate: function() {
            return (this.serialize().length <= 360);
        },

        serialize: function() {
            return serializeTextarea(document.querySelector('textarea[name=write_excerpt]'));
        }

    };

    // URL component
    this.url = {

        validate: function() {
            let serialize = this.serialize();
            return (serialize.length <= 120 && /[a-zA-Z0-9-]/.test(serialize));
        },

        serialize: function() {
            return serializeText(document.querySelector('input[name=write_url]'));
        }

    };

    // Pin component
    this.pin = {

        serialize: function() {
            return serializeCheckBox(document.querySelector('input[name=write_pin]'));
        }

    };

    // Thumbnail component
    this.thumbnail = {

        addThumbnail: function(image, custom) {

            let parent = document.querySelector('label[for=thumbnail]').parentNode;

            // Current image remove
            if(parent.querySelector('div.thumbnail-image.thumbnail-component-instance'))
                parent.removeChild(parent.querySelector('div.thumbnail-image.thumbnail-component-instance'));

            // Create source link
            let source;
            if(!custom)
                source = 'app/Data/Files/Images/' + image;
            else
                source = image;

            // Create new image box from template
            let template = parent.querySelector('#template_write_thumbnail_image').childNodes[0].cloneNode(true);
            template.setAttribute('data-path', image);
            template.classList.add('thumbnail-component-instance');
            template.childNodes[0].setAttribute('src', source);
            template.childNodes[0].setAttribute('alt', image);
            template.childNodes[1].innerText = image;
            parent.appendChild(template);

            // Hide menu, manager and reload packery
            template.childNodes[0].addEventListener('load', function() {
                parent.querySelector('div.input-box').classList.add('hide');
                $('div.media-manager span.close-manager').click();
                packery.packery().reloadItems();
            });

            // Remove event
            document.querySelector('div.thumbnail-image.thumbnail-component-instance span.thumbnail-remove').addEventListener('click', function() {
                let instance = parent.querySelector('div.thumbnail-component-instance');
                parent.querySelector('div.input-box').classList.remove('hide');
                parent.removeChild(instance);
                packery.packery().reloadItems();
            });

        },

        events: [

            {
                event: "click",
                element: document.querySelector('label[for=thumbnail]').parentNode.querySelector('button.image_manager'),
                content: function() {

                    // Open manager
                    managerActiveInstance = new MediaManager({
                        onSelect: function(image) {

                            this.thumbnail.addThumbnail(image, false);

                        }.bind(this)
                    });

                }.bind(this)
            },

            {~~
                // Validate
                event: "change click keyup",
                element: document.querySelector('input[name=write_thumbnail]'),
                content: function(event) {

                    let input = event.target;
                    let value = input.value;

                    // Validate URL
                    if(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)) {

                        showValidationResult(input, "", true, function() {
                            packery.packery().reloadItems();
                        });

                        // Check ENTER key
                        if(event.keyCode && event.keyCode === 13) {

                            // Check if image exists
                            let testImage = new Image;
                            testImage.onload = function() {
                                this.thumbnail.addThumbnail(value, true);
                            }.bind(this);
                            testImage.onerror = function() {
                                showValidationResult(input, "VALIDATION_URL_UNRESOLVED", false, function() {
                                    packery.packery().reloadItems();
                                });
                            }.bind(this);
                            testImage.src = value;

                        }

                    } else
                        showValidationResult(input, "VALIDATION_URL_INVALID", false, function() {
                            packery.packery().reloadItems();
                        });

                }.bind(this)
            }

        ],

        serialize: function() {

            if(document.querySelector('div.thumbnail-image.thumbnail-component-instance'))
                return document.querySelector('div.thumbnail-image.thumbnail-component-instance').getAttribute('data-path');
            else
                return false;

        }

    };

    // Perex component
    this.perex = {

        validate: function() {

            let serialize = this.serialize();
            return (serialize.location.length <= 120);

        },

        serialize: function() {

            return {
                date: serializeText(document.querySelector('input[name=write_perex_date]')),
                location: serializeText(document.querySelector('input[name=write_perex_location'))
            };

        }

    };

    // Header image component
    this.header_image = {

        addHeaderImage: function(image, custom) {

            let parent = document.querySelector('label[for=header_image]').parentNode;

            // Current image remove
            if(parent.querySelector('div.header_image-image.header_image-component-instance'))
                parent.removeChild(parent.querySelector('div.header_image-image.header_image-component-instance'));

            // Create source link
            let source;
            if(!custom)
                source = 'app/Data/Files/Images/' + image;
            else
                source = image;

            // Create new image box from template
            let template = parent.querySelector('#template_write_header-image_image').childNodes[0].cloneNode(true);
            template.setAttribute('data-path', image);
            template.classList.add('header_image-component-instance');
            template.childNodes[0].setAttribute('src', source);
            template.childNodes[0].setAttribute('alt', image);
            template.childNodes[1].innerText = image;
            parent.appendChild(template);

            // Hide menu, manager and reload packery
            template.childNodes[0].addEventListener('load', function() {
                parent.querySelector('div.input-box').classList.add('hide');
                $('div.media-manager span.close-manager').click();
                packery.packery().reloadItems();
            });

            // Remove event
            document.querySelector('div.header_image-image.header_image-component-instance span.header_image-remove').addEventListener('click', function() {
                let instance = parent.querySelector('div.header_image-component-instance');
                parent.querySelector('div.input-box').classList.remove('hide');
                parent.removeChild(instance);
                packery.packery().reloadItems();
            });

        },

        events: [

            {
                event: "click",
                element: document.querySelector('label[for=header_image]').parentNode.querySelector('button.image_manager'),
                content: function() {

                    // Open manager
                    managerActiveInstance = new MediaManager({
                        onSelect: function(image) {

                            this.header_image.addHeaderImage(image, false);

                        }.bind(this)
                    });

                }.bind(this)
            },

            {
                // Validate
                event: "change click keyup",
                element: document.querySelector('input[name=write_header-image]'),
                content: function(event) {

                    let input = event.target;
                    let value = input.value;

                    // Validate URL
                    if(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(value)) {

                        showValidationResult(input, "", true, function() {
                            packery.packery().reloadItems();
                        });

                        // Check ENTER key
                        if(event.keyCode && event.keyCode === 13) {

                            // Check if image exists
                            let testImage = new Image;
                            testImage.onload = function() {
                                this.header_image.addHeaderImage(value, true);
                            }.bind(this);
                            testImage.onerror = function() {
                                showValidationResult(input, "VALIDATION_URL_UNRESOLVED", false, function() {
                                    packery.packery().reloadItems();
                                });
                            }.bind(this);
                            testImage.src = value;

                        }

                    } else
                        showValidationResult(input, "VALIDATION_URL_INVALID", false, function() {
                            packery.packery().reloadItems();
                        });

                }.bind(this)
            }

        ],

        serialize: function() {

            if(document.querySelector('div.header_image-image.header_image-component-instance'))
                return document.querySelector('div.header_image-image.header_image-component-instance').getAttribute('data-path');
            else
                return false;

        }

    };

    // Languages component
    this.languages = {

        start: function() {

            // Load languages list and render from template
            languages = getJson('app/Config/languages.json');
            let listElement = document.querySelector('div.languages-list');
            for(let abbr in languages) {

                let targetSelect = document.querySelector('select[name=write_current_language]');
                let template = document.querySelector('#template_write_languages_item').childNodes[0].cloneNode(true);
                let localeString = 'LANGUAGE_' + languages[abbr].toUpperCase().split(';')[0];
                template.setAttribute('data-language', abbr);
                template.childNodes[0].setAttribute('data-locale', localeString);
                template.childNodes[0].innerText = languages[abbr];
                listElement.appendChild(template);

                // Add event
                template.childNodes[1].addEventListener('click', function() {
                    // Check if option is new
                    let currentOptions = targetSelect.children;
                    for(let i = 0; i < currentOptions.length; ++i) {
                        let currentOption = currentOptions[i];
                        if(currentOption.getAttribute('data-locale') === localeString) return false;
                    }
                    let option = document.createElement('option');
                    option.setAttribute('value', abbr);
                    option.setAttribute('data-locale', localeString);
                    option.innerText = translate.locale.system[localeString];
                    targetSelect.appendChild(option);
                    selector.destroy();
                    selector = new Selector({
                        selector: 'select.selector-search-select'
                    });
                    template.childNodes[1].classList.add('hide');
                    template.childNodes[2].classList.remove('hide');
                    // Create locale content clone
                });

                // Remove event
                template.childNodes[2].addEventListener('click', function() {
                    let actionText = translate.locale.response['ACTION_CONFIRM_REMOVE_LANGUAGE'].replace('%language%', translate.locale.system[localeString]);
                    confirmAction(actionText, function() {
                        let option = targetSelect.querySelector('option[data-locale=' + localeString + ']');
                        targetSelect.removeChild(option);
                        selector.destroy();
                        selector = new Selector({
                            selector: 'select.selector-search-select'
                        });
                        template.childNodes[2].classList.add('hide');
                        template.childNodes[1].classList.remove('hide');
                        // Remove locale content clone
                    });
                });

            }

            // Translate
            translate.addTranslation(['system']);

        },

        events: [

            {
                event: "keyup click change",
                element: document.querySelector('input[name=write_language_search]'),
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

    // Attachments component
    this.attachments = {

        addAttachment: function(file, managerType) {

            let parent = document.querySelector('label[for=attachments]').parentNode;
            let attachmentsList = parent.querySelector('div.attachments-list');

            // Parse manager types
            let path = 'app/Data/Files/';
            let type;
            if(managerType === 'images') {
                path += 'Images/';
                type = 'image';
            } else if(managerType === 'videos') {
                path += 'Videos/';
                type = 'video';
            } else if(managerType === 'sounds') {
                path += 'Sounds/';
                type = 'audio';
            } else {
                path += 'Files/';
                type = 'file';
            }
            path += file;

            // Create template
            let template = document.querySelector('#template_write_attachments_added').childNodes[0].cloneNode(true);
            template.classList.add('attachments-component-instance');
            template.setAttribute('data-path', path);
            template.classList.add('icon-' + type);
            template.childNodes[1].innerText = file;
            attachmentsList.insertBefore(template, attachmentsList.childNodes[0]);

            // Remove event
            template.querySelector('span.attachment-remove').addEventListener('click', function(event) {
                let instance = event.target.parentNode;
                instance.parentNode.removeChild(instance);
                packery.packery().reloadItems();
            });

            // Hide menu, manager and reload packery
            $('div.media-manager span.close-manager').click();
            packery.packery().reloadItems();

        },

        events: [

            {
                event: "click",
                element: document.querySelector('label[for=attachments]').parentNode.querySelectorAll('button.add-attachment'),
                content: function(event) {

                    let managerType = event.target.getAttribute('data-content');

                    // Open manager
                    managerActiveInstance = new MediaManager({
                        manager: managerType,
                        onSelect: function(file) {

                            this.attachments.addAttachment(file, managerType);

                        }.bind(this)
                    });

                }.bind(this)
            }

        ],

        serialize: function() {

            let attachmentsElements = document.querySelector('div.attachments-list').childNodes;
            let resultList = [];
            for(let i = 0; i < attachmentsElements.length; ++i)
                resultList.push(attachmentsElements[i].getAttribute('data-path'));
            return resultList;

        }

    };

    // Custom fields component
    this.custom_fields = {

        data: [], // [[name, value], ...]

        validateNew: function() {

            let parent = document.querySelector('div.custom_fields-add-box');
            let identifier = parent.querySelector('#custom_fields-add-name').value.trim();
            let value = parent.querySelector('#custom_fields-add-value').value.trim();
            let inData = false;
            for(let i = 0; i < this.custom_fields.data.length; ++i) {
                if(this.custom_fields.data[i][0] === identifier) {
                    inData = true;
                    break;
                }
            }
            return !(identifier === '' || value === '' || inData);

        }.bind(this),

        validate: function() {

            let identifiers = [];
            for(let i = 0; i < this.custom_fields.data.length; ++i) {
                let item = this.custom_fields.data[i];
                if(identifiers.indexOf(item[0]) !== -1) return false;
                identifiers.push(item[0]);
                if(item[0] === '' || item[1] === '') return false;
            }
            
            return true;

        }.bind(this),

        serialize: function() {

            if(!this.custom_fields.validate()) return false;
            return this.custom_fields.data;

        }.bind(this),

        edit: function(element) {

            let identifier = element.childNodes[0].innerText;
            let value = element.childNodes[1].innerText;
            element.childNodes[2].click();

            let addBox = document.querySelector('div.custom_fields-add-box');
            addBox.querySelector('#custom_fields-add-name').value = identifier;
            addBox.querySelector('#custom_fields-add-value').value = value;
            addBox.querySelector('#custom_fields-add-name').focus();

        },

        events: [

            {
                event: "click",
                element: document.querySelector('span.add-custom_field'),
                content: function() {

                    if(!this.custom_fields.validateNew()) return false;
                    let parent = document.querySelector('div.custom_fields-add-box');
                    let identifier = parent.querySelector('#custom_fields-add-name');
                    let value = parent.querySelector('#custom_fields-add-value');
                    let identifierValue = identifier.value.trim();
                    let valueValue = value.value.trim();

                    let data = [identifierValue, valueValue];
                    this.custom_fields.data.push(data);

                    let template = document.querySelector('#template_write_custom-fields_field').childNodes[0].cloneNode(true);
                    template.childNodes[0].innerText = identifierValue;
                    template.childNodes[1].innerText = valueValue;

                    // Edit event
                    template.childNodes[3].addEventListener('click', function(event) {
                        let element = event.target.parentNode;
                        this.custom_fields.edit(element);
                    }.bind(this));

                    // Remove event
                    template.childNodes[2].addEventListener('click', function(event) {
                        let element = event.target.parentNode;
                        element.parentNode.removeChild(element);
                        for(let i = 0; i < this.custom_fields.data.length; ++i) {
                            if(this.custom_fields.data[i][0] === identifierValue) {
                                this.custom_fields.data.splice(i, 1);
                                break;
                            }
                        }
                        packery.packery().reloadItems();
                    }.bind(this));

                    let list = parent.parentNode.querySelector('div.custom_fields-list');
                    list.insertBefore(template, list.childNodes[0]);
                    identifier.value = '';
                    value.value = '';
                    identifier.focus();
                    packery.packery().reloadItems();

                }.bind(this)
            },

            {
                event: "keyup",
                element: document.querySelector('input#custom_fields-add-value'),
                content: function(event) {

                    if(event.keyCode && event.keyCode === 13)
                            document.querySelector('span.add-custom_field').click();

                }
            }

        ]

    };

    // Tags component
    this.tags = {

        data: [], // [tag, tag, ...]

        validate: function() {

            let value = document.querySelector('input[name=write_tags_add]').value.trim();
            return (/^[a-zA-Z][a-zA-Z0-9_\s,]+[a-zA-Z0-9]$/g.test(value) && value !== '');

        },

        events: [

            {
                event: "keyup",
                element: document.querySelector('input[name=write_tags_add]'),
                content: function(event) {

                    if(event.keyCode && event.keyCode === 13) {
                        let value = event.target.value.trim();
                        if(value === '') return false;
                        if(!this.tags.validate()) return false;
                        let tags = value.split(',');
                        for(let i = 0; i < tags.length; ++i) {
                            let tag = tags[i].trim();
                            if(this.tags.data.indexOf(tag) !== -1) continue;
                            if(!this.tags.validate()) continue;
                            let template = document.querySelector('#template_write_tags_item').childNodes[0].cloneNode(true);
                            template.innerHTML = '#' + tag + template.innerHTML;
                            document.querySelector('div.tags-list').appendChild(template);
                            this.tags.data.push(tag);
                            // Remove event
                            template.childNodes[1].addEventListener('click', function() {
                                let index = this.tags.data.indexOf(tag);
                                this.tags.data.splice(index, 1);
                                template.parentNode.removeChild(template);
                                packery.packery().reloadItems();
                            }.bind(this));
                        }
                        event.target.value = '';
                        packery.packery().reloadItems();
                    }

                }.bind(this)
            }

        ]

    };

    // Revision component
    this.revisions = {

    };

    // Initialize components
    for(let i = 0; i < this.components.length; ++i) {
        if(!(this.components[i] in this)) continue;
        if(this[this.components[i]].start)
            this[this.components[i]].start();
        if(!this[this.components[i]]['events']) continue;
        // Initialize events
        for(let j = 0; j < this[this.components[i]]['events'].length; ++j) {
            let eventTemplate = this[this.components[i]]['events'][j];
            let eventList = eventTemplate.event.trim().split(' ');
            if(eventTemplate.element[0] !== undefined) {
                for(let k = 0; k < eventTemplate.element.length; ++k) {
                    let element = eventTemplate.element[k];
                    for(let l = 0; l < eventList.length; ++l)
                        element.addEventListener(eventList[l], eventTemplate.content);
                }
            } else {
                for(let k = 0; k < eventList.length; ++k)
                    eventTemplate.element.addEventListener(eventList[k], eventTemplate.content);
            }
        }
    }

}*/

// Create componentsList
componentList = [];
selectors  = document.querySelectorAll('div.component-element');
for(let i = 0; i < selectors.length; ++i)
    componentList.push(selectors[i].getAttribute('data-component'));

if(typeof componentsModule === 'undefined') {
    let element = document.createElement('script');
    element.setAttribute('type', 'text/javascript');
    element.setAttribute('src', 'app/Components/Components.min.js');
    element.onload = function() {
        componentsModule.start(componentList);
    };
    body.appendChild(element);
} else {
    componentsModule.start(componentList);
}

// Add current script
previousScripts.push('write');

// Init counters
initializeCounters();

// Init password toggles
initializePasswordToggle();

// Init packery
packery = $('div.content-settings').packery({
    itemSelector: 'div.component-element',
    gutter: 22
});

/* Init CKEditor
ckedit = CKEDITOR.replace('content-rich_text', {
    language: html.attr('lang'),
    uiColor: '#ffffff'
});

ckedit.on('instanceReady', function() {
    packery.packery().reloadItems();
});

*/

// Collapse / Show All Settings
$('span.collapse-trigger').click(function(event) {
    event.target.parentNode.parentNode.parentNode.classList.toggle('open');
    packery.packery().reloadItems();
});

// Init Selector
selector = new Selector({
    selector: 'select.selector-search-select'
});

// Init date picker
initDatePicker();

// Remove Splash screen
$('div.splash').addClass('done');