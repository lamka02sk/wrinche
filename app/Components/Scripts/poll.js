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

        listElement.querySelectorAll('.poll-item').forEach(function(item) {
            newOrder.push(parseFloat(item.getAttribute('data-item')));
            let text = item.querySelector('p').innerText.trim();
            if(text === componentsModule.modules.poll.itemClone.querySelector('p').innerText.trim())
                text = '';
            newContent.push(text);
        });

        componentsModule.modules.poll.data[identifier].poll = newContent;
        componentsModule.modules.poll.data[identifier].order = newOrder;

    },

    createItem: function(identifier, listElement, after, focus) {

        // Create item ID
        let itemID = Math.random() * (99999 - 10000) + 10000;

        // Create item data
        let index;
        if(!after) {
            componentsModule.modules.poll.data[identifier].poll.push('');
            componentsModule.modules.poll.data[identifier].order.push(itemID);
            index = +componentsModule.modules.poll.data[identifier].order.indexOf(itemID);
        } else {
            index = +componentsModule.modules.poll.data[identifier].order.indexOf(after);
            if(index === -1) return false;
            index += 1;
            componentsModule.modules.poll.data[identifier].poll.splice(index, 0, '');
            componentsModule.modules.poll.data[identifier].order.splice(index, 0, itemID);
        }

        // Create item clone
        let itemElement = componentsModule.modules.poll.itemClone.cloneNode(true);
        itemElement.setAttribute('data-item', itemID.toString());
        let itemText = itemElement.querySelector('p');

        // Create item events
        componentsModule.initializeEvents([

            {
                // Focus hide placeholder
                event: 'focus',
                element: itemText,
                content: function(event) {
                    if(event.target.innerText.trim() !== componentsModule.modules.poll.itemClone.querySelector('p').innerText) return false;
                    event.target.classList.remove('item-text-placeholder');
                    event.target.innerText = '';
                }
            },

            {
                // Blur add placeholder
                event: 'blur',
                element: itemText,
                content: function(event) {
                    if(!componentsModule.modules.poll.data[identifier].order[index + 1] && event.target.innerText.trim() !== '')
                        componentsModule.modules.poll.createItem(identifier, listElement, itemID);
                    if(event.target.innerText.trim() !== '') return false;
                    event.target.classList.add('item-text-placeholder');
                    event.target.innerText = componentsModule.modules.poll.itemClone.querySelector('p').innerText;
                }
            },

            {
                // Add item after
                event: 'keydown',
                element: itemText,
                content: function(event) {
                    if(event.keyCode !== 13) return false;
                    if(!componentsModule.modules.poll.data[identifier].order[index + 1] && event.target.innerText.trim() !== '')
                        componentsModule.modules.poll.createItem(identifier, listElement, itemID, true);
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
                    componentsModule.modules.poll.data[identifier].poll[index] = event.target.innerText.trim();
                }
            },

            {
                // Delete item
                event: 'click',
                element: itemElement.querySelector('.poll-item-delete'),
                content: function() {
                    if(listElement.children.length < 2) return false;
                    let index = componentsModule.modules.poll.data[identifier].order.indexOf(itemID);
                    if(index === -1) return false;
                    componentsModule.modules.poll.data[identifier].poll.splice(index, 1);
                    componentsModule.modules.poll.data[identifier].order.splice(index, 1);
                    listElement.removeChild(itemElement);
                    componentsModule.modules.poll.reloadItems(identifier, listElement);
                }
            }

        ]);

        // Show item
        if(!after)
            listElement.appendChild(itemElement);
        else {
            if(!componentsModule.modules.poll.data[identifier].order[index + 1]) listElement.appendChild(itemElement);
            else listElement.insertBefore(itemElement, listElement.children[index + 1]);
        }

        // Focus
        if(focus) itemText.focus();

    },

    create: function(identifier, element) {

        let contentElement = element.querySelector('.component-element-content');
        let listElement = contentElement.querySelector('.component-inline-poll-content');
        let listItem = listElement.querySelector('.poll-item');

        if(!componentsModule.modules.poll.itemClone)
            componentsModule.modules.poll.itemClone = listItem.cloneNode(true);
        listElement.removeChild(listItem);

        // Data
        componentsModule.modules.poll.data[identifier] = {
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
                componentsModule.modules.poll.reloadItems(identifier, listElement);
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
                    componentsModule.modules.poll.data[identifier].poll_title = event.target.value.trim();
                }
            },

            {
                // Serialize poll type
                event: 'click',
                element: typeItems,
                content: function(event) {
                    listElement.setAttribute(
                        'data-type',
                        componentsModule.modules.poll.data[identifier].poll_type = event.target.getAttribute('data-position')
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
                    componentsModule.modules.poll.data[identifier].poll_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        // First item
        componentsModule.modules.poll.createItem(identifier, listElement);

    }

};