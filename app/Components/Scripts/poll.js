componentsModule.modules.poll = {

    data: {},
    itemClone: false,

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.poll.data;
    },

    reloadItems: function(identifier, listElement) {

        let newOrder = [];
        let newContent = [];
        let current = componentsModule.modules.poll;

        listElement.querySelectorAll('.poll-item').forEach(function(item) {
            newOrder.push(parseFloat(item.getAttribute('data-item')));
            let text = item.querySelector('p').innerText.trim();
            if(text === current.itemClone.querySelector('p').innerText.trim())
                text = '';
            newContent.push(text);
        });

        current.data[identifier].poll = newContent;
        current.data[identifier].order = newOrder;

    },

    createItem: function(identifier, listElement, after, focus) {

        let current = componentsModule.modules.poll;

        // Create item ID
        let itemID = Math.random() * (99999 - 10000) + 10000;

        // Create item data
        let index;
        if(!after) {
            current.data[identifier].poll.push('');
            current.data[identifier].order.push(itemID);
            index = +current.data[identifier].order.indexOf(itemID);
        } else {
            index = +current.data[identifier].order.indexOf(after);
            if(index === -1) return false;
            index += 1;
            current.data[identifier].poll.splice(index, 0, '');
            current.data[identifier].order.splice(index, 0, itemID);
        }

        // Create item clone
        let itemElement = current.itemClone.cloneNode(true);
        itemElement.setAttribute('data-item', itemID.toString());
        let itemText = itemElement.querySelector('p');

        // Create item events
        componentsModule.initializeEvents([

            {
                // Focus hide placeholder
                event: 'focus',
                element: itemText,
                content: function(event) {
                    if(event.target.innerText.trim() !== current.itemClone.querySelector('p').innerText) return false;
                    event.target.classList.remove('item-text-placeholder');
                    event.target.innerText = '';
                }
            },

            {
                // Blur add placeholder
                event: 'blur',
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
                event: 'keydown',
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
                event: 'keyup change',
                element: itemText,
                content: function(event) {
                    current.data[identifier].poll[index] = event.target.innerText.trim();
                }
            },

            {
                // Delete item
                event: 'click',
                element: itemElement.querySelector('.poll-item-delete'),
                content: function() {
                    if(listElement.children.length < 2) return false;
                    let index = current.data[identifier].order.indexOf(itemID);
                    if(index === -1) return false;
                    current.data[identifier].poll.splice(index, 1);
                    current.data[identifier].order.splice(index, 1);
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

        // Focus
        if(focus) itemText.focus();

    },

    create: function(identifier, element) {

        let current = componentsModule.modules.poll;
        let contentElement = element.querySelector('.component-element-content');
        let listElement = contentElement.querySelector('.component-inline-poll-content');
        let listItem = listElement.querySelector('.poll-item');

        if(!current.itemClone)
            current.itemClone = listItem.cloneNode(true);
        listElement.removeChild(listItem);

        // Data
        current.data[identifier] = {
            title: '',
            disabled: 0,
            poll: [],
            order: [],
            poll_title: '',
            poll_type: 0,
            poll_position: 1
        };

        // Drag & Drop
        Sortable.create(listElement, {
            sort: true,
            animation: 200,
            scroll: false,
            draggable: '.poll-item',
            handle: '.poll-item-move',
            onStart: function(event) {
                event.item.classList.add('chosen');
            },
            onEnd: function(event) {
                event.item.classList.remove('chosen');
                current.reloadItems(identifier, listElement);
            }
        });

        // Events
        let typeItems = contentElement.querySelectorAll('.component-poll_type .position-item');
        let positionItems = contentElement.querySelectorAll('.component-poll_align .position-item');
        componentsModule.initializeEvents([

            {
                // Serialize poll title
                event: 'change keyup',
                element: contentElement.querySelector('input[name=component_inline_poll_name]'),
                content: function(event) {
                    current.data[identifier].poll_title = event.target.value.trim();
                }
            },

            {
                // Serialize poll type
                event: 'click',
                element: typeItems,
                content: function(event) {
                    listElement.setAttribute(
                        'data-type',
                        current.data[identifier].poll_type = event.target.getAttribute('data-position')
                    );
                    typeItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            },

            {
                // Serialize poll align
                event: 'click',
                element: positionItems,
                content: function(event) {
                    current.data[identifier].poll_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        // First item
        current.createItem(identifier, listElement);

    }

};