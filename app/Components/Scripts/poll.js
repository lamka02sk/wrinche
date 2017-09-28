import Utils from "../../../scripts/Modules/Utils";
import Sortable from 'sortablejs';

let poll = {

    data: {},
    itemClone: false,

    validate: function() {
        return true;
    },

    serialize: function() {
        return poll.data;
    },

    resumeInline: function(identifier, element, resumeData) {

        let listElement = poll.create(identifier, element, resumeData);

        resumeData.poll.forEach(function(pollItem) {

            if(pollItem === '')
                return true;

            poll.createItem(identifier, listElement, undefined, false, pollItem);

        });

        if(poll.data[identifier].poll.length < 1)
            poll.createItem(identifier, listElement);

    },

    reloadItems: function(identifier, listElement) {

        let newOrder = [];
        let newContent = [];

        listElement.querySelectorAll('.poll-item').forEach(function(item) {
            newOrder.push(parseFloat(item.getAttribute('data-item')));
            let text = item.querySelector('p').innerText.trim();
            if(text === poll.itemClone.querySelector('p').innerText.trim())
                text = '';
            newContent.push(text);
        });

        poll.data[identifier].poll = newContent;
        poll.data[identifier].order = newOrder;

    },

    createItem: function(identifier, listElement, after, focus, pollItem) {

        if(!pollItem)
            pollItem = '';

        let itemID = Math.random() * (99999 - 10000) + 10000;
        let index;

        // Create item data
        if(!after) {

            poll.data[identifier].poll.push(pollItem);
            poll.data[identifier].order.push(itemID);
            index = +poll.data[identifier].order.indexOf(itemID);

        } else {

            index = +poll.data[identifier].order.indexOf(after);

            if(index === -1)
                return false;

            index += 1;
            poll.data[identifier].poll.splice(index, 0, pollItem);
            poll.data[identifier].order.splice(index, 0, itemID);

        }

        // Create item clone
        let itemElement = poll.itemClone.cloneNode(true);
        let itemText = itemElement.querySelector('p');

        itemElement.setAttribute('data-item', itemID.toString());

        // Create item events
        Utils.registerEvents([

            {
                // Focus hide placeholder
                event: 'focus',
                element: itemText,
                content: function(event) {

                    let target = event.target;

                    if(target.innerText.trim() !== poll.itemClone.querySelector('p').innerText)
                        return false;

                    target.classList.remove('item-text-placeholder');
                    target.innerText = '';

                }
            },

            {
                // Blur add placeholder
                event: 'blur',
                element: itemText,
                content: function(event) {

                    let target = event.target;
                    let nextItem = target.parentNode.nextSibling;

                    if(target.innerText.trim() !== '' && nextItem === null)
                        poll.createItem(identifier, listElement, itemID, true);

                    if(target.innerText.trim() !== '')
                        return false;

                    target.classList.add('item-text-placeholder');
                    target.innerText = poll.itemClone.querySelector('p').innerText;

                }
            },

            {
                // Add item after
                event: 'keydown',
                element: itemText,
                content: function(event) {

                    if(event.keyCode !== 13)
                        return false;

                    let currentItem = event.target.parentNode;
                    let nextItem    = currentItem.nextSibling;

                    if(nextItem !== null)
                        nextItem.querySelector('p').focus();
                    else
                        event.target.blur();

                    event.preventDefault();

                }
            },

            {
                // Serialize item
                event: 'keyup change',
                element: itemText,
                content: function(event) {

                    poll.data[identifier].poll[index] = event.target.innerText.trim();

                }
            },

            {
                // Delete item
                event: 'click',
                element: itemElement.querySelector('.poll-item-delete'),
                content: function() {

                    if(listElement.children.length < 2)
                        return false;

                    let index = poll.data[identifier].order.indexOf(itemID);

                    if(index === -1)
                        return false;

                    poll.data[identifier].poll.splice(index, 1);
                    poll.data[identifier].order.splice(index, 1);

                    listElement.removeChild(itemElement);
                    poll.reloadItems(identifier, listElement);

                }
            }

        ]);

        // Show item
        if(!after)
            listElement.appendChild(itemElement);

        else {

            if(!poll.data[identifier].order[index + 1])
                listElement.appendChild(itemElement);
            else
                listElement.insertBefore(itemElement, listElement.children[index + 1]);

        }

        // Resume data
        itemText.innerText = (pollItem) ? pollItem : itemText.innerText;

        if(pollItem)
            itemText.classList.remove('item-text-placeholder');

        // Focus
        if(focus) itemText.focus();

    },

    create: function(identifier, element, resumeData) {

        let contentElement = element.querySelector('.component-element-content');
        let listElement = contentElement.querySelector('.component-inline-poll-content');
        let listItem = listElement.querySelector('.poll-item');

        if(!poll.itemClone)
            poll.itemClone = listItem.cloneNode(true);
        listElement.removeChild(listItem);

        // Data
        poll.data[identifier] = {
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
                poll.reloadItems(identifier, listElement);
            }
        });

        // Events
        let typeItems = contentElement.querySelectorAll('.component-poll_type .position-item');
        let positionItems = contentElement.querySelectorAll('.component-poll_align .position-item');
        let nameInput = contentElement.querySelector('input[name=component_inline_poll_name]');

        Utils.registerEvents([

            {
                // Serialize poll title
                event: 'change keyup',
                element: nameInput,
                content: function(event) {
                    poll.data[identifier].poll_title = event.target.value.trim();
                }
            },

            {
                // Serialize poll type
                event: 'click',
                element: typeItems,
                content: function(event) {
                    listElement.setAttribute(
                        'data-type',
                        poll.data[identifier].poll_type = event.target.getAttribute('data-position')
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
                    poll.data[identifier].poll_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        if(resumeData !== undefined) {

            nameInput.value = resumeData.poll_title.trim();
            Utils.triggerEvent(nameInput, 'change');

            typeItems[+resumeData.poll_type].click();
            positionItems[+resumeData.poll_position].click();

        }

        // First item
        if(!resumeData)
            poll.createItem(identifier, listElement);

        return listElement;

    }

};

module.exports = poll;