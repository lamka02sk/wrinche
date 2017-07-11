componentsModule.modules.list = {

    data: {},
    itemClone: false,

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.list.data;
    },

    reloadItems: function(identifier, listElement) {

        let newOrder = [];
        let newContent = [];
        let newChecked = [];

        listElement.querySelectorAll('.list-item').forEach(function(item, key) {
           newOrder.push(parseFloat(item.getAttribute('data-item')));
           item.querySelector('.item-number').innerText = +key + 1 + '.';
           let text = item.querySelector('p').innerText.trim();
           if(text === componentsModule.modules.list.itemClone.querySelector('p').innerText.trim())
               text = '';
           newContent.push(text);
           newChecked.push(item.querySelector('.item-check').classList.contains('checked'));
        });

        componentsModule.modules.list.data[identifier].list = newContent;
        componentsModule.modules.list.data[identifier].list_checked = newChecked;
        componentsModule.modules.list.data[identifier].order = newOrder;

    },

    createItem: function(identifier, listElement, after, focus) {

        // Create item ID
        let itemID = Math.random() * (99999 - 10000) + 10000;

        // Create item data
        let index;
        if(!after) {
            componentsModule.modules.list.data[identifier].list.push('');
            componentsModule.modules.list.data[identifier].list_checked.push(false);
            componentsModule.modules.list.data[identifier].order.push(itemID);
            index = +componentsModule.modules.list.data[identifier].order.indexOf(itemID);
        } else {
            index = +componentsModule.modules.list.data[identifier].order.indexOf(after);
            if(index === -1) return false;
            index += 1;
            componentsModule.modules.list.data[identifier].list.splice(index, 0, '');
            componentsModule.modules.list.data[identifier].list_checked.splice(index, 0, false);
            componentsModule.modules.list.data[identifier].order.splice(index, 0, itemID);
        }

        // Create item clone
        let itemElement = componentsModule.modules.list.itemClone.cloneNode(true);
        itemElement.setAttribute('data-item', itemID.toString());
        itemElement.querySelector('.item-number').innerText = +index + 1 + '.';
        let itemText = itemElement.querySelector('p');

        // Create item events
        componentsModule.initializeEvents([

            {
                // Check item
                event: 'click',
                element: itemElement.querySelector('.item-check'),
                content: function(event) {
                    event.target.classList.toggle('checked');
                    let index = componentsModule.modules.list.data[identifier].order.indexOf(itemID);
                    componentsModule.modules.list.data[identifier].list_checked[index] = event.target.classList.contains('checked');
                }
            },

            {
                // Focus hide placeholder
                event: 'focus',
                element: itemText,
                content: function(event) {
                    if(event.target.innerText.trim() !== componentsModule.modules.list.itemClone.querySelector('p').innerText) return false;
                    event.target.classList.remove('item-text-placeholder');
                    event.target.innerText = '';
                }
            },

            {
                // Blur add placeholder
                event: 'blur',
                element: itemText,
                content: function(event) {
                    if(!componentsModule.modules.list.data[identifier].order[index + 1] && event.target.innerText.trim() !== '')
                        componentsModule.modules.list.createItem(identifier, listElement, itemID);
                    if(event.target.innerText.trim() !== '') return false;
                    event.target.classList.add('item-text-placeholder');
                    event.target.innerText = componentsModule.modules.list.itemClone.querySelector('p').innerText;
                }
            },

            {
                // Add item after
                event: 'keydown',
                element: itemText,
                content: function(event) {
                    if(event.keyCode !== 13) return false;
                    if(!componentsModule.modules.list.data[identifier].order[index + 1] && event.target.innerText.trim() !== '')
                        componentsModule.modules.list.createItem(identifier, listElement, itemID, true);
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
                event: 'keyup change',
                element: itemText,
                content: function(event) {
                    componentsModule.modules.list.data[identifier].list[index] = event.target.innerText.trim();
                }
            },

            {
                // Delete item
                event: 'click',
                element: itemElement.querySelector('.list-item-delete'),
                content: function() {
                    if(listElement.children.length < 2) return false;
                    let index = componentsModule.modules.list.data[identifier].order.indexOf(itemID);
                    if(index === -1) return false;
                    componentsModule.modules.list.data[identifier].list.splice(index, 1);
                    componentsModule.modules.list.data[identifier].order.splice(index, 1);
                    componentsModule.modules.list.data[identifier].list_checked.splice(index, 1);
                    listElement.removeChild(itemElement);
                    componentsModule.modules.list.reloadItems(identifier, listElement);
                }
            }

        ]);
        
        // Show item
        if(!after)
            listElement.appendChild(itemElement);
        else {
            if(!componentsModule.modules.list.data[identifier].order[index + 1]) listElement.appendChild(itemElement);
            else listElement.insertBefore(itemElement, listElement.children[index + 1]);
        }

        // Focus
        if(focus) itemText.focus();

    },

    create: function(identifier, element) {

        let contentElement = element.querySelector('.component-element-content');
        let listElement = contentElement.querySelector('.component-inline-list-content');
        let listItem = listElement.querySelector('.list-item');

        if(!componentsModule.modules.list.itemClone)
            componentsModule.modules.list.itemClone = listItem.cloneNode(true);
        listElement.removeChild(listItem);

        // Data
        componentsModule.modules.list.data[identifier] = {
            title: '',
            disabled: 0,
            list: [],
            order: [],
            list_checked: [],
            list_title: '',
            list_type: 0,
            list_position: 1
        };

        // Drag & Drop
        Sortable.create(listElement, {
            sort: true,
            animation: 200,
            scroll: false,
            draggable: '.list-item',
            handle: '.list-item-move',
            onStart: function(event) {
                event.item.classList.add('chosen');
            },
            onEnd: function(event) {
                event.item.classList.remove('chosen');
                componentsModule.modules.list.reloadItems(identifier, listElement);
            }
        });

        // Events
        let typeItems = contentElement.querySelectorAll('.component-list_type .position-item');
        let positionItems = contentElement.querySelectorAll('.component-list_align .position-item');
        componentsModule.initializeEvents([

            {
                // Serialize list title
                event: 'change keyup',
                element: contentElement.querySelector('input[name=component_inline_list_name]'),
                content: function(event) {
                    componentsModule.modules.list.data[identifier].list_title = event.target.value.trim();
                }
            },

            {
                // Serialize list type
                event: 'click',
                element: typeItems,
                content: function(event) {
                    listElement.setAttribute(
                        'data-type',
                        componentsModule.modules.list.data[identifier].list_type = event.target.getAttribute('data-position')
                    );
                    typeItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            },

            {
                // Serialize list align
                event: 'click',
                element: positionItems,
                content: function(event) {
                    componentsModule.modules.list.data[identifier].list_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        // First item
        componentsModule.modules.list.createItem(identifier, listElement);

    }

};