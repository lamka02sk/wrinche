import Utils from "../../../scripts/Modules/Utils";
import Sortable from 'sortablejs';

let list = {

    data     : {},
    itemClone: false,

    validate() {
        return true;
    },

    serialize() {
        return list.data;
    },

    resumeInline(identifier, element, resumeData) {

        let listElement = list.create(identifier, element, resumeData);

        resumeData.list.forEach(function(listItem, index) {

            if(listItem === '')
                return true;

            const checked = resumeData.list_checked[index] || 0;

            list.createItem(identifier, listElement, undefined, false, [
                listItem.trim(),
                checked
            ]);

        });

        if(list.data[identifier].list.length < 1)
            list.createItem(identifier, listElement);

    },

    reloadItems(identifier, listElement) {

        let newOrder   = [];
        let newContent = [];
        let newChecked = [];

        listElement.querySelectorAll('.list-item').forEach(function(item, key) {

            newOrder.push(parseFloat(item.getAttribute('data-item')));
            item.querySelector('.item-number').innerText = +key + 1 + '.';

            let text = item.querySelector('p').innerText.trim();

            if(text === list.itemClone.querySelector('p').innerText.trim())
                text = '';

            newContent.push(text);
            newChecked.push(item.querySelector('.item-check').classList.contains('checked'));

        });

        list.data[identifier].list         = newContent;
        list.data[identifier].list_checked = newChecked;
        list.data[identifier].order        = newOrder;

    },

    createItem(identifier, listElement, after, focus, data) {

        if(!data)
            data = [];

        let itemID  = Math.random() * (99999 - 10000) + 10000;

        // Create item data
        let index;
        const checked = data[1] || false;
        const value   = data[0] || '';

        if(!after) {

            list.data[identifier].list.push(value);
            list.data[identifier].list_checked.push(checked);
            list.data[identifier].order.push(itemID);
            index = +list.data[identifier].order.indexOf(itemID);

        } else {

            index = +list.data[identifier].order.indexOf(after);

            if(index === -1)
                return false;

            index += 1;
            list.data[identifier].list.splice(index, 0, value);
            list.data[identifier].list_checked.splice(index, 0, checked);
            list.data[identifier].order.splice(index, 0, itemID);

        }

        // Create item clone
        let itemElement = list.itemClone.cloneNode(true);
        itemElement.setAttribute('data-item', itemID.toString());
        itemElement.querySelector('.item-number').innerText = +index + 1 + '.';

        let itemText  = itemElement.querySelector('p');
        let itemCheck = itemElement.querySelector('.item-check');

        // Create item events
        Utils.registerEvents([

            {
                // Check item
                event  : 'click',
                element: itemCheck,
                content(event) {
                    event.target.classList.toggle('checked');
                    let index = list.data[identifier].order.indexOf(itemID);
                    list.data[identifier].list_checked[index] = event.target.classList.contains('checked');
                }
            },

            {
                // Focus hide placeholder
                event  : 'focus',
                element: itemText,
                content(event) {

                    let target = event.target;

                    if(target.innerText.trim() !== list.itemClone.querySelector('p').innerText)
                        return false;

                    target.classList.remove('item-text-placeholder');
                    target.innerText = '';

                }
            },

            {
                // Blur add placeholder
                event  : 'blur',
                element: itemText,
                content(event) {

                    let target = event.target;
                    let nextItem = target.parentNode.nextSibling;

                    if(target.innerText.trim() !== '' && nextItem === null)
                        list.createItem(identifier, listElement, itemID, true);

                    if(target.innerText.trim() !== '')
                        return false;

                    target.classList.add('item-text-placeholder');
                    target.innerText = list.itemClone.querySelector('p').innerText;

                }
            },

            {
                // Add item after
                event  : 'keydown',
                element: itemText,
                content(event) {

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
                event  : 'keyup change',
                element: itemText,
                content(event) {

                    list.data[identifier].list[index] = event.target.innerText.trim();

                }
            },

            {
                // Delete item
                event  : 'click',
                element: itemElement.querySelector('.list-item-delete'),
                content() {

                    if(listElement.children.length < 2)
                        return false;

                    let index = list.data[identifier].order.indexOf(itemID);

                    if(index === -1)
                        return false;

                    list.data[identifier].list.splice(index, 1);
                    list.data[identifier].order.splice(index, 1);
                    list.data[identifier].list_checked.splice(index, 1);

                    listElement.removeChild(itemElement);
                    list.reloadItems(identifier, listElement);

                }
            }

        ]);

        // Show item
        if(!after)
            listElement.appendChild(itemElement);

        else {

            if(!list.data[identifier].order[index + 1])
                listElement.appendChild(itemElement);
            else
                listElement.insertBefore(itemElement, listElement.children[index + 1]);

        }

        // Resume data
        itemText.innerText = data[0] || itemText.innerText;

        if(data[0] !== undefined)
            itemText.classList.remove('item-text-placeholder');

        if(data[1] === 1)
            itemCheck.click();

        // Focus
        if(focus) itemText.focus();

    },

    create(identifier, element, resumeData) {

        let contentElement = element.querySelector('.component-element-content');
        let listElement    = contentElement.querySelector('.component-inline-list-content');
        let listItem       = listElement.querySelector('.list-item');

        if(!list.itemClone)
            list.itemClone = listItem.cloneNode(true);

        listElement.removeChild(listItem);

        // Data
        list.data[identifier] = {
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
            onStart  (event) {
                event.item.classList.add('chosen');
            },
            onEnd    (event) {
                event.item.classList.remove('chosen');
                list.reloadItems(identifier, listElement);
            }
        });

        // Events
        let typeItems     = contentElement.querySelectorAll('.component-list_type .position-item');
        let positionItems = contentElement.querySelectorAll('.component-list_align .position-item');
        let nameInput     = contentElement.querySelector('input[name=component_inline_list_name]');

        Utils.registerEvents([

            {
                // Serialize list title
                event  : 'change keyup',
                element: nameInput,
                content(event) {
                    list.data[identifier].list_title = event.target.value.trim();
                }
            },

            {
                // Serialize list type
                event  : 'click',
                element: typeItems,
                content(event) {
                    listElement.setAttribute(
                        'data-type',
                        list.data[identifier].list_type = event.target.getAttribute('data-position')
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
                content(event) {
                    list.data[identifier].list_position = event.target.getAttribute('data-position');
                    positionItems.forEach(function(item) {
                        item.classList.remove('active');
                    });
                    event.target.classList.add('active');
                }
            }

        ]);

        if(resumeData !== undefined) {

            nameInput.value = resumeData.list_title.trim();
            Utils.triggerEvent(nameInput, 'change');

            typeItems[+resumeData.list_type].click();
            positionItems[+resumeData.list_position].click();

        }

        // First item
        if(!resumeData)
            list.createItem(identifier, listElement);

        return listElement;

    }

};

module.exports = list;