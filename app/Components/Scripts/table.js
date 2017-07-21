componentsModule.modules.table = {

    data: {},

    template: false,
    clones: {
        clone: false,
        headerActionCellFirst: false,
        headerActionCell: false,
        emptyCell: false,
        asideActionCellFirst: false,
        asideActionCell: false,
        headerCell: false,
        contentCell: false
    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.table.data;
    },

    addRow: function(table, identifier, before) {

        let clone = componentsModule.modules.table.template;
        let tableRow = clone.querySelector('.table-row').cloneNode(true);

        let actionCell = componentsModule.modules.table.clones.asideActionCell.cloneNode(true);
        tableRow.appendChild(actionCell);

        let columnID = componentsModule.modules.table.data[identifier].table.order.columns[0];
        let headerCell = componentsModule.modules.table.clones.headerCell.cloneNode(true);
        headerCell.setAttribute('data-column', componentsModule.modules.table.data[identifier].table.order.columns[0]);
        tableRow.appendChild(headerCell);

        // Serialize row header cell
        let rowID = Math.random() * (9999999 - 1000000) + 1000000;
        componentsModule.modules.table.data[identifier].table.rows[rowID] = {};
        tableRow.setAttribute('data-row', rowID);

        if(before === undefined)
            componentsModule.modules.table.data[identifier].table.order.rows.push(rowID);
        else {
            let beforeID = parseFloat(before.getAttribute('data-row'));
            let beforeIndex = componentsModule.modules.table.data[identifier].table.order.rows.indexOf(beforeID);
            if(beforeIndex === -1) return false;
            componentsModule.modules.table.data[identifier].table.order.rows.splice(beforeIndex, 0, rowID);
        }

        tableRow.setAttribute('data-row', rowID);
        if(componentsModule.modules.table.data[identifier].table.hidden.columns.indexOf(columnID) !== -1)
            headerCell.classList.add('hidden');

        for(let i = 0; i < componentsModule.modules.table.data[identifier].dimensions[0]; ++i) {
            let contentCell = componentsModule.modules.table.clones.contentCell.cloneNode(true);
            let columnID = componentsModule.modules.table.data[identifier].table.order.columns[+i + 1];
            contentCell.setAttribute('data-column', columnID);
            componentsModule.initializeEvents([{
                event: 'change keyup',
                element: contentCell,
                content: function(event) {
                    componentsModule.modules.table.data[identifier].table.rows[rowID][columnID] = event.target.innerText.trim();
                }
            }]);
            tableRow.appendChild(contentCell);
        }

        // Events
        componentsModule.initializeEvents([

            {
                // Serialize header cell
                event: 'change keyup',
                element: headerCell,
                content: function(event) {
                    componentsModule.modules.table.data[identifier].table.header[rowID] = event.target.innerText.trim();
                }
            },

            {
                // Hide / Show row
                event: 'click',
                element: actionCell.querySelector('.table-hide-row'),
                content: function() {
                    let index = componentsModule.modules.table.data[identifier].table.hidden.rows.indexOf(rowID);
                    let isHidden = (index !== -1);
                    let cells = this.parentNode.parentNode.children;
                    let length = cells.length;
                    for(let i = 0; i < length; ++i) {
                        if(isHidden) cells[i].classList.remove('hidden');
                        else cells[i].classList.add('hidden');
                    }
                    if(isHidden) componentsModule.modules.table.data[identifier].table.hidden.rows.splice(index, 1);
                    else componentsModule.modules.table.data[identifier].table.hidden.rows.push(rowID);
                }
            },

            {
                // Delete row
                event: 'click',
                element: actionCell.querySelector('.table-delete-row'),
                content: function() {
                    this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
                    delete componentsModule.modules.table.data[identifier].table.rows[rowID];
                    --componentsModule.modules.table.data[identifier].dimensions[1];
                    delete componentsModule.modules.table.data[identifier].table.header[rowID];
                    let hiddenIndex = componentsModule.modules.table.data[identifier].table.hidden.rows.indexOf(rowID);
                    if(hiddenIndex !== -1) componentsModule.modules.table.data[identifier].table.hidden.rows.splice(hiddenIndex, 1);
                }
            },

            {
                // Add row before
                event: 'click',
                element: actionCell.querySelector('.table-new-row'),
                content: function() {
                    componentsModule.modules.table.addRow(table, identifier, tableRow);
                }
            }

        ]);

        if(!before)
            table.appendChild(tableRow);
        else
            table.insertBefore(tableRow, before);

        ++componentsModule.modules.table.data[identifier].dimensions[1];
        return table;

    },

    addColumn: function(table, identifier, afterID) {

        let columnID = Math.random() * (999999 - 100000) + 100000;
        if(afterID) {
            let afterIndex = componentsModule.modules.table.data[identifier].table.order.columns.indexOf(parseFloat(afterID));
            componentsModule.modules.table.data[identifier].table.order.columns.splice(afterIndex - 1, 0, columnID);
        } else
            componentsModule.modules.table.data[identifier].table.order.columns.push(columnID);

        let actionRow = table.querySelector('.table-action-row');
        let actionCell = componentsModule.modules.table.clones.headerActionCell.cloneNode(true);
        actionCell.setAttribute('data-column', columnID.toString());

        // Hide / Show column
        actionCell.querySelector('.table-hide-column').addEventListener('click', function() {
            this.parentNode.classList.toggle('hidden');
            let status = componentsModule.modules.table.data[identifier].table.hidden.columns.indexOf(columnID);
            if(status !== -1) componentsModule.modules.table.data[identifier].table.hidden.columns.splice(status, 1);
            else componentsModule.modules.table.data[identifier].table.hidden.columns.push(columnID);
            table.querySelectorAll('tr.table-row, tr.table-header-row').forEach(function(row) {
                if(row.querySelector('[data-column="' + columnID + '"]'))
                    row.querySelector('[data-column="' + columnID + '"]').classList.toggle('hidden');
            });
        });

        // Delete column
        actionCell.querySelector('.table-delete-column').addEventListener('click', function(event) {
            event.target.parentNode.parentNode.parentNode.querySelectorAll('tr.table-row, tr.table-header-row').forEach(function(row) {
                let cell = row.querySelector('td[data-column="' + columnID + '"], th[data-column="' + columnID + '"]');
                row.removeChild(cell);
            });
            event.target.parentNode.parentNode.removeChild(event.target.parentNode);
            --componentsModule.modules.table.data[identifier].dimensions[0];
            delete componentsModule.modules.table.data[identifier].table.header[columnID];
            let hiddenIndex = componentsModule.modules.table.data[identifier].table.hidden.columns.indexOf(columnID);
            if(hiddenIndex !== -1) componentsModule.modules.table.data[identifier].table.hidden.columns.splice(hiddenIndex, 1);
            let orderIndex = componentsModule.modules.table.data[identifier].table.order.columns.indexOf(columnID);
            if(orderIndex !== -1) componentsModule.modules.table.data[identifier].table.order.columns.splice(orderIndex, 1);
            for(let rowID in componentsModule.modules.table.data[identifier].table.rows)
                delete componentsModule.modules.table.data[identifier].table.rows[rowID][columnID];
        });

        // New column after
        actionCell.querySelector('.table-new-column').addEventListener('click', function() {
             componentsModule.modules.table.addColumn(table, identifier, columnID);
        });

        let headerRow = table.querySelector('.table-header-row');
        let headerCell = componentsModule.modules.table.clones.headerCell.cloneNode(true);
        headerCell.setAttribute('data-column', columnID.toString());

        let contentRows = table.querySelectorAll('.table-row');
        let contentCell = componentsModule.modules.table.clones.contentCell.cloneNode(true);
        contentCell.setAttribute('data-column', columnID.toString());

        componentsModule.initializeEvents([{
            event: 'change keyup',
            element: headerCell,
            content: function(event) {
                componentsModule.modules.table.data[identifier].table.header[columnID] = event.target.innerText.trim();
            }
        }]);

        function serializeContent(identifier, rowID, clone) {

            componentsModule.initializeEvents([{
                event: 'change keyup',
                element: clone,
                content: function(event) {
                    componentsModule.modules.table.data[identifier].table
                        .rows[rowID][columnID] = event.target.innerText.trim();
                }
            }]);

        }

        if(!afterID) {
            actionRow.appendChild(actionCell);
            headerRow.appendChild(headerCell);
            contentRows.forEach(function(row) {
                let clone = contentCell.cloneNode(true);
                let rowID = parseFloat(row.getAttribute('data-row'));
                row.appendChild(clone);
                serializeContent(identifier, rowID, clone);
            });
        } else {
            let afterAction = actionRow.querySelector('[data-column="' + afterID + '"]');
            let afterHeader = headerRow.querySelector('[data-column="' + afterID + '"]');
            if(!afterAction || !afterHeader || !afterAction.nextSibling || !afterHeader.nextSibling) {
                componentsModule.modules.table.addColumn(table, identifier);
                return false;
            }
            actionRow.insertBefore(actionCell, afterAction.nextSibling);
            headerRow.insertBefore(headerCell, afterHeader.nextSibling);
            let done = false;
            contentRows.forEach(function(row) {
                if(done) return false;
                let afterCell = row.querySelector('[data-column="' + afterID + '"]');
                if(!afterCell || !afterCell.nextSibling) {
                    componentsModule.modules.table.addColumn(table, identifier);
                    done = true;
                    return false;
                }
                let clone = contentCell.cloneNode(true);
                let rowID = parseFloat(row.getAttribute('data-row'));
                row.insertBefore(clone, afterCell.nextSibling);
                serializeContent(identifier, rowID, clone);
            });
        }

        ++componentsModule.modules.table.data[identifier].dimensions[0];
        return table;

    },

    create: function(identifier, element) {

        let contentElement = element.querySelector('div.table-box');
        componentsModule.initializeEvents([{
            event: 'wheel',
            element: contentElement,
            content: function(event) {
                this.scrollLeft -= -(event.deltaY * 20);
                event.preventDefault();
            }
        }]);

        // Create table data
        componentsModule.modules.table.data[identifier] = {
            title: '',
            table: {
                hidden: {
                    columns: [],
                    rows: []
                },
                header: {},
                //aside: {},
                rows: {},
                name: '',
                order: {
                    rows: [],
                    columns: []
                }
            },
            dimensions: [0, 0],
            disabled: 0
        };

        // Table name serialize
        componentsModule.initializeEvents([
            {
                event: 'change click',
                element: element.querySelector('input[name=component_inline_table_name]'),
                content: function(event) {
                    componentsModule.modules.table.data[identifier].table.name = event.target.value.trim();
                }
            }
        ]);

        // Clone template
        let clone = componentsModule.modules.table.template;
        if(!clone)
            componentsModule.modules.table.template = clone = element.querySelector('#template_inline_table_components').cloneNode(true).children[0];

        // Create basic table and register events
        let table = document.createElement('table');

        /*
         * ACTION ROW   **********
         */
        let actionRow = clone.querySelector('.table-action-row').cloneNode(true);

        if(!componentsModule.modules.table.clones.headerActionCellFirst)
            componentsModule.modules.table.clones.headerActionCellFirst = clone.querySelector('.table-header-action-first').cloneNode(true);

        if(!componentsModule.modules.table.clones.headerActionCell)
            componentsModule.modules.table.clones.headerActionCell = clone.querySelector('.table-header-action').cloneNode(true);

        if(!componentsModule.modules.table.clones.emptyCell)
            componentsModule.modules.table.clones.emptyCell = document.createElement('td');

        componentsModule.modules.table.clones.emptyCell.classList.add('table-aside-action');
        actionRow.appendChild(componentsModule.modules.table.clones.emptyCell.cloneNode(true));
        actionRow.appendChild(componentsModule.modules.table.clones.headerActionCellFirst.cloneNode(true));

        // Create first column id
        let firstColumnID = Math.random() * (999999 - 100000) + 100000;
        componentsModule.modules.table.data[identifier].table.order.columns.push(firstColumnID);
        actionRow.children[1].setAttribute('data-column', firstColumnID.toString());

        // Register hide event
        actionRow.children[1].children[0].addEventListener('click', function() {
            this.parentNode.classList.toggle('hidden');
            let status = componentsModule.modules.table.data[identifier].table.hidden.columns.indexOf(firstColumnID);
            if(status !== -1) componentsModule.modules.table.data[identifier].table.hidden.columns.splice(status, 1);
            else componentsModule.modules.table.data[identifier].table.hidden.columns.push(firstColumnID);
            table.querySelectorAll('tr.table-row, tr.table-header-row').forEach(function(row) {
                if(row.querySelector('[data-column="' + firstColumnID + '"]'))
                    row.querySelector('[data-column="' + firstColumnID + '"]').classList.toggle('hidden');
            });
        });

        // Register add new column event
        actionRow.querySelector('.table-new-column').addEventListener('click', function() {
            componentsModule.modules.table.addColumn(table, identifier, firstColumnID);
        });

        // ----------   **********

        /*
         * HEADER ROW   **********
         */

        let headerRow = clone.querySelector('.table-header-row').cloneNode(true);

        if(!componentsModule.modules.table.clones.asideActionCellFirst)
            componentsModule.modules.table.clones.asideActionCellFirst = clone.querySelector('.table-aside-action-first').cloneNode(true);

        if(!componentsModule.modules.table.clones.headerCell)
            componentsModule.modules.table.clones.headerCell = clone.querySelector('th[contenteditable=true]').cloneNode(true);

        // Create first row id
        let firstRowID = Math.random() * (9999999 - 1000000) + 1000000;
        componentsModule.modules.table.data[identifier].table.rows[firstRowID] = {};
        componentsModule.modules.table.data[identifier].table.order.rows.push(firstRowID);

        let headerCell = componentsModule.modules.table.clones.headerCell.cloneNode(true);
        let actionCellFirst = componentsModule.modules.table.clones.asideActionCellFirst.cloneNode(true);
        let actionCellFirst_hide = actionCellFirst.querySelector('.table-hide-row');
        headerRow.appendChild(actionCellFirst);
        headerRow.appendChild(headerCell);

        if(!componentsModule.modules.table.clones.asideActionCell)
            componentsModule.modules.table.clones.asideActionCell = clone.querySelector('.table-aside-action').cloneNode(true);

        if(!componentsModule.modules.table.clones.contentCell)
            componentsModule.modules.table.clones.contentCell = clone.querySelector('td[contenteditable=true]').cloneNode(true);

        headerRow.setAttribute('data-row', firstRowID);

        // Add column id
        headerCell.setAttribute('data-column', firstColumnID);

        // Serialize header name, hide row
        componentsModule.initializeEvents([

            {
                // Serialize header name
                event: 'change keyup',
                element: headerCell,
                content: function(event) {
                    componentsModule.modules.table.data[identifier].table.header[firstColumnID] = event.target.innerText.trim();
                }
            },

            {
                // Hide / Show row
                event: 'click',
                element: actionCellFirst_hide,
                content: function() {
                    let index = componentsModule.modules.table.data[identifier].table.hidden.rows.indexOf(firstRowID);
                    let isHidden = (index !== -1);
                    let cells = this.parentNode.parentNode.children;
                    let length = cells.length;
                    for(let i = 0; i < length; ++i) {
                        if(isHidden) cells[i].classList.remove('hidden');
                        else cells[i].classList.add('hidden');
                    }
                    if(isHidden) componentsModule.modules.table.data[identifier].table.hidden.rows.splice(index, 1);
                    else componentsModule.modules.table.data[identifier].table.hidden.rows.push(firstRowID);
                }
            }

        ]);

        // ----------   **********

        // Show complete table
        table.appendChild(actionRow);
        table.appendChild(headerRow);

        // Create table rows
        for(let i = 0; i < 4; ++i)
            table = componentsModule.modules.table.addRow(table, identifier);

        // Create table columns
        for(let i = 0; i < 3; ++i)
            table = componentsModule.modules.table.addColumn(table, identifier);

        // Register new row event
        contentElement.querySelector('.table-add-button').addEventListener('click', function() {
            table = componentsModule.modules.table.addRow(table, identifier);
        });

        contentElement.appendChild(table);

    }

};