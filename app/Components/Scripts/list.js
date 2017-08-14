componentsModule.modules.list = {

    data     : {},
    itemClone: false,

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.list.data;
    },

    resumeInline: function(identifier, element, resumeData) {

        let current     = componentsModule.modules.list;
        let listElement = current.create(identifier, element, resumeData);

        resumeData.list.forEach(function(listItem, index) {

            if(listItem === '')
                return true;

            const checked = resumeData.list_checked[index] || 0;

            current.createItem(identifier, listElement, undefined, false, [
                listItem.trim(),
                checked
            ]);

        });

    },

    reloadItems: function(identifier, listElement) {

        let newOrder   = [];
        let newContent = [];
        let newChecked = [];
        let current    = componentsModule.modules.list;

        listElement.querySelectorAll('.list-item').forEach(function(item, key) {
            newOrder.push(parseFloat(item.getAttribute('data-item')));
            item.querySelector('.item-number').innerText = +key + 1 + '.';
            let text                                     = item.querySelector('p').innerText.trim();
            if(text === current.itemClone.querySelector('p').innerText.trim())
                text = '';
            newContent.push(text);
            newChecked.push(item.querySelector('.item-check').classList.contains('checked'));
        });

        current.data[identifier].list         = newContent;
        current.data[identifier].list_checked = newChecked;
        current.data[identifier].order        = newOrder;

    },

    createItem: function(identifier, listElement, after, focus, data) {

        if(!data)
            data = [];

        let current = componentsModule.modules.list;
        let itemID  = Math.random() * (99999 - 10000) + 10000;

        // Create item data
        let index;
        const checked = data[1] || false;
        const value   = data[0] || '';

        if(!after) {

            current.data[identifier].list.push(value);
            current.data[identifier].list_checked.push(checked);
            current.data[identifier].order.push(itemID);
            index = +current.data[identifier].order.indexOf(itemID);

        } else {

            index = +current.data[identifier].order.indexOf(after);

            if(index === -1)

                return false;
            index += 1;
            current.data[identifier].list.splice(index, 0, value);
            current.data[identifier].list_checked.splice(index, 0, checked);
            current.data[identifier].order.splice(index, 0, itemID);

        }

        // Create item clone
        let itemElement = current.itemClone.cloneNode(true);
        itemElement.setAttribute('data-item', itemID.toString());
        itemElement.querySelector('.item-number').innerText = +index + 1 + '.';
        let itemText                                        = itemElement.querySelector('p');
        let itemCheck                                       = itemElement.querySelector('.item-check');

        // Create item events
        componentsModule.initializeEvents([

            {
                // Check item
                event  : 'click',
                element: itemCheck,
                content: function(event) {
                    event.target.classList.toggle('checked');
                    let index                                    = current.data[identifier].order.indexOf(itemID);
                    current.data[identifier].list_checked[index] = event.target.classList.contains('checked');
                }
            },

            {
                // Focus hide placeholder
                event  : 'focus',
                element: itemText,
                content: function(event) {
                    if(event.target.innerText.trim() !== current.itemClone.querySelector('p').innerText) return false;
                    event.target.classList.remove('item-text-placeholder');
                    event.target.innerText = '';
                }
            },

            {
                // Blur add placeholder
                event  : 'blur',
                element: itemText,
                content: function(event) {
                    if(!current.data[identifier].order[index + 1] && event.target.innerText.trim() !== '')
                        current.createItem(identifier, listElement, itemID);
                    if(event.target.innerText.trim() !== '') return false;
                    event.target.classList.add('item-text-placeholder');
                    event.target.innerText = current.itemClone.querySelector('p').innerText;
                }
            },

            {
                // Add item after
                event  : 'keydown',
                element: itemText,
                content: function(event) {
                    if(event.keyCode !== 13) return false;
                    if(!current.data[identifier].order[index + 1] && event.target.innerText.trim() !== '')
                        current.createItem(identifier, listElement, itemID, true);
                    else if(event.shiftKey) {
                        if(!(!itemElement.previousSibling))
                            itemElement.previousSibling.querySelector('p').focus();
                    } else {
                        if(!(!itemElement.nextSibling))
                            itemElement.nextSibling.querySelector('p').focus();
                    }
                    event.preventDefault();
                }
            },

            {
                // Serialize item
                event  : 'keyup change',
                element: itemText,
                content: function(event) {
                    current.data[identifier].list[index] = event.target.innerText.trim();
                }
            },

            {
                // Delete item
                event  : 'click',
                element: itemElement.querySelector('.list-item-delete'),
                content: function() {
                    if(listElement.children.length < 2) return false;
                    let index = current.data[identifier].order.indexOf(itemID);
                    if(index === -1) return false;
                    current.data[identifier].list.splice(index, 1);
                    current.data[identifier].order.splice(index, 1);
                    current.data[identifier].list_checked.splice(index, 1);
                    listElement.removeChild(itemElement);
                    current.reloadItems(identifier, listElement);
                }
            }

        ]);

        // Show item
        if(!after)
            listElement.appendChild(itemElement);
        else {
            if(!current.data[identifier].order[index + 1]) listElement.appendChild(itemElement);
            else listElement.insertBefore(itemElement, listElement.children[index + 1]);
        }

        // Resume data
        itemText.innerText = data[0] || '';

        if(itemText.innerText !== '')
            itemText.classList.remove('item-text-placeholder');

        if(data[1] === 1)
            itemCheck.click();

        // Focus
        if(focus) itemText.focus();

    },

    create: function(identifier, element, resumeData) {

        let current        = componentsModule.modules.list;
        let contentElement = element.querySelector('.component-element-content');
        let listElement    = contentElement.querySelector('.component-inline-list-content');
        let listItem       = listElement.querySelector('.list-item');

        if(!current.itemClone)
            current.itemClone = listItem.cloneNode(true);
        listElement.removeChild(listItem);

        // Data
        current.data[identifier] = {
            title        : '',
            disabled     : 0,
            list         : [],
            order        : [],
            list_checked : [],
            list_title   : '',
            list_type    : 0,
            list_position: 1
        };

        // Drag & Drop
        Sortable.create(listElement, {
            sort     : true,
            animation: 200,
            scroll   : false,
            draggable: '.list-item',
            handle   : '.list-item-move',
            onStart  : function(event) {
                event.item.classList.add('chosen');
            },
            onEnd    : function(event) {
                event.item.classList.remove('chosen');
                current.reloadItems(identifier, listElement);
            }
        });

        // Events
        let typeItems     = contentElement.querySelectorAll('.component-list_type .position-item');
        let positionItems = contentElement.querySelectorAll('.component-list_align .position-item');
        let nameInput     = contentElement.querySelector('input[name=component_inline_list_name]');

        componentsModule.initializeEvents([

            {
                // Serialize list title
                event  : 'change keyup',
                element: nameInput,
                content: function(event) {
                    current.data[identifier].list_title = event.target.value.trim();
                }
            },

            {
                // Serialize list type
                event  : 'click',
                element: typeItems,
                content: function(event) {
                    listElement.setAttribute(
                        'data-type',
                        current.data[identifier].list_type = event.target.getAttribute('data-position')
                    );
                    typeItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            },

            {
                // Serialize list align
                event  : 'click',
                element: positionItems,
                content: function(event) {
                    current.data[identifier].list_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        if(resumeData !== undefined) {

            nameInput.value = resumeData.list_title.trim();
            triggerEvent(nameInput, 'change');

            typeItems[+resumeData.list_type].click();
            positionItems[+resumeData.list_position].click();

        }

        // First item
        if(!resumeData)
            current.createItem(identifier, listElement);

        return listElement;

    }

};