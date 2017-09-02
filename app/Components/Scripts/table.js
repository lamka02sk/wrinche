componentsModule.modules.table = {

    data: {},

    template: false,
    clones  : {

        clone: false,

        actionRow: false,
        headerRow: false,
        tableRow : false,

        headerActionFirst: false,
        headerAction     : false,

        asideActionFirst: false,
        asideAction     : false,

        headerCell : false,
        contentCell: false,

        emptyCell: false

    },

    resumeInline: function(identifier, element, resumeData) {

        let current = componentsModule.modules.table;
        current.create(identifier, element, resumeData);

    },

    validate: function() {
        return true;
    },

    serialize: function() {
        return componentsModule.modules.table.data;
    },

    addRow: function(table, identifier, before, resumeData) {

        let current    = componentsModule.modules.table;
        let clones     = current.clones;
        let data       = current.data[identifier];
        let tableRow   = clones.tableRow.cloneNode(true);
        let actionCell = clones.asideAction.cloneNode(true);
        let columnID   = data.table.order.columns[0];
        let headerCell = clones.headerCell.cloneNode(true);

        let rowID = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;

        tableRow.appendChild(actionCell);
        headerCell.setAttribute('data-column', data.table.order.columns[0]);
        tableRow.appendChild(headerCell);

        // Serialize row header cell
        data.table.rows[rowID] = {};
        tableRow.setAttribute('data-row', rowID);

        if(before === undefined)
            data.table.order.rows.push(rowID);

        else {

            let beforeID    = parseFloat(before.getAttribute('data-row'));
            let beforeIndex = data.table.order.rows.indexOf(beforeID);

            if(beforeIndex === -1)
                return false;

            data.table.order.rows.splice(beforeIndex, 0, rowID);

        }

        if(data.table.hidden)
            if(data.table.hidden.columns.indexOf(columnID) !== -1)
                headerCell.classList.add('hidden');

        for(let i = 0; i < data.dimensions[0]; ++i) {

            let contentCell = clones.contentCell.cloneNode(true);
            let columnID    = data.table.order.columns[+i + 1];

            contentCell.setAttribute('data-column', columnID);
            tableRow.appendChild(contentCell);

        }

        if(!before)
            table.appendChild(tableRow);
        else
            table.insertBefore(tableRow, before);

        if(resumeData !== undefined) {

            if(resumeData.hidden)
                triggerEvent(actionCell.children[0], 'click');

            if(resumeData.header) {
                headerCell.innerText = resumeData.header;
                triggerEvent(headerCell, 'input');
            }

        }

        ++data.dimensions[1];
        return table;

    },

    addColumn: function(table, identifier, afterID, resumeData) {

        let current = componentsModule.modules.table;
        let data = current.data[identifier];
        let clones = current.clones;

        let columnID = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        let actionRow  = table.querySelector('.table-action-row');
        let actionCell = clones.headerAction.cloneNode(true);

        let headerRow  = table.querySelector('.table-header-row');
        let headerCell = clones.headerCell.cloneNode(true);

        let contentRows = table.querySelectorAll('.table-row');
        let contentCell = clones.contentCell.cloneNode(true);

        if(afterID !== undefined) {

            let afterIndex = data.table.order.columns.indexOf(parseInt(afterID));
            data.table.order.columns.splice(++afterIndex, 0, columnID);

        } else
            data.table.order.columns.push(columnID);

        actionCell.setAttribute('data-column', columnID.toString());
        headerCell.setAttribute('data-column', columnID.toString());
        contentCell.setAttribute('data-column', columnID.toString());

        if(afterID === undefined) {

            actionRow.appendChild(actionCell);
            headerRow.appendChild(headerCell);

            if(resumeData !== undefined) {

                if(resumeData.header) {
                    headerCell.innerText = resumeData.header;
                    triggerEvent(headerCell, 'input');
                }

            }

            contentRows.forEach(function(row, index) {

                let currentCell = contentCell.cloneNode(true);
                row.appendChild(currentCell);
                
                if(resumeData !== undefined) {

                    if(resumeData.data[index] !== undefined) {
                        currentCell.innerText = resumeData.data[index];
                        triggerEvent(currentCell, 'input');
                    }

                    // If hidden row
                    let rowID = row.getAttribute('data-row');
                    if(data.table.hidden)
                        if(data.table.hidden.rows.indexOf(rowID) !== -1)
                            currentCell.classList.add('hidden');

                }

            });

        } else {

            let afterAction = actionRow.querySelector('[data-column="' + afterID + '"]');
            let afterHeader = headerRow.querySelector('[data-column="' + afterID + '"]');
            let done = false;

            actionRow.insertBefore(actionCell, afterAction.nextSibling);
            headerRow.insertBefore(headerCell, afterHeader.nextSibling);

            contentRows.forEach(function(row) {

                if(done)
                    return false;

                let afterCell = row.querySelector('[data-column="' + afterID + '"]');
                let clone = contentCell.cloneNode(true);

                row.insertBefore(clone, afterCell.nextSibling);

            });
        }

        if(resumeData !== undefined) {

            // If column is hidden
            if(resumeData.hidden !== undefined)
                triggerEvent(actionCell.children[0], 'click');

        }

        ++componentsModule.modules.table.data[identifier].dimensions[0];
        return table;

    },

    allowHorizontalScrolling: function(contentElement) {

        componentsModule.initializeEvent({

            event  : 'wheel',
            element: contentElement,

            content: function(event) {

                this.scrollLeft -= -(event.deltaY * 20);
                event.preventDefault();

            }

        });

    },

    createTemplateClones: function(element) {

        let current  = componentsModule.modules.table;
        let template = current.template;
        let clones   = current.clones;

        // Save parent template
        if(template === false)
            current.template = template = element.querySelector('#template_inline_table_components').cloneNode(true).children[0];

        // Other clones
        if(clones.actionRow === false)
            clones.actionRow = template.querySelector('.table-action-row').cloneNode(true);

        if(clones.headerActionFirst === false)
            clones.headerActionFirst = template.querySelector('.table-header-action-first').cloneNode(true);

        if(clones.headerAction === false)
            clones.headerAction = template.querySelector('.table-header-action').cloneNode(true);

        if(clones.emptyCell === false)
            clones.emptyCell = document.createElement('td');

        if(clones.headerRow === false)
            clones.headerRow = template.querySelector('.table-header-row').cloneNode(true);

        if(clones.asideActionFirst === false)
            clones.asideActionFirst = template.querySelector('.table-aside-action-first').cloneNode(true);

        if(clones.headerCell === false)
            clones.headerCell = template.querySelector('th[contenteditable=true]').cloneNode(true);

        if(clones.asideAction === false)
            clones.asideAction = template.querySelector('.table-aside-action').cloneNode(true);

        if(clones.contentCell === false)
            clones.contentCell = template.querySelector('td[contenteditable=true]').cloneNode(true);

        if(clones.tableRow === false)
            clones.tableRow = template.querySelector('.table-row').cloneNode(true);

    },

    create: function(identifier, element, resumeData) {

        let current        = componentsModule.modules.table;
        let contentElement = element.querySelector('div.table-box');
        let nameInput      = element.querySelector('input[name=component_inline_table_name]');
        let clones         = current.clones;
        let data           = current.data;

        // Create template clones
        current.createTemplateClones(element);

        let table = document.createElement('table');
        let actionRow = clones.actionRow.cloneNode(true);
        let headerRow = clones.headerRow.cloneNode(true);
        let firstColumnID = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        let firstRowID = Math.floor(Math.random() * (9999999 - 1000000)) + 1000000;
        let addRowElement = contentElement.querySelector('.table-add-button');

        current.allowHorizontalScrolling(contentElement);

        // Create table data
        data[identifier] = {

            title: '',
            table: {

                hidden: {
                    columns: [],
                    rows   : []
                },

                header: {},
                rows  : {},
                name  : '',

                order: {
                    rows   : [],
                    columns: []
                }

            },

            dimensions: [0, 0],
            disabled  : 0

        };

        // Create events
        componentsModule.initializeEvents([

            {
                // Serialize table name
                event  : 'input',
                element: nameInput,
                content: function(event) {
                    data[identifier].table.name = event.target.value.trim();
                }
            },

            {
                // Delegate click events
                event: 'click',
                element: table,
                content: function(event) {

                    let target = event.target;

                    // Hide column
                    if(target.matches('.table-hide-column')) {

                        let columnID = target.parentNode.getAttribute('data-column');

                        let hiddenIndex;
                        let isHidden = ~(
                            hiddenIndex = data[identifier].table.hidden.columns.indexOf(columnID)
                        );

                        let rowsList = table.querySelectorAll('tr');
                        let rowSelector = '[data-column="' + columnID + '"]';

                        if(isHidden) {

                            rowsList.forEach(function(row) {

                                let rowID = row.getAttribute('data-row');
                                let rowColumn = row.querySelector(rowSelector);
                                let isHiddenRow = ~data[identifier].table.hidden.rows.indexOf(rowID);

                                if(isHiddenRow)
                                    return true;

                                if(rowColumn)
                                    rowColumn.classList.remove('hidden');

                            });

                            data[identifier].table.hidden.columns.splice(hiddenIndex, 1);

                        } else {

                            rowsList.forEach(function(row) {

                                let rowColumn = row.querySelector(rowSelector);

                                if(rowColumn)
                                    rowColumn.classList.add('hidden');

                            });

                            data[identifier].table.hidden.columns.push(columnID);

                        }

                    }

                    // Hide row
                    else if(target.matches('.table-hide-row')) {

                        let rowID = target.parentNode.parentNode.getAttribute('data-row');

                        let hiddenIndex;
                        let isHidden = ~(
                            hiddenIndex = data[identifier].table.hidden.rows.indexOf(rowID)
                        );

                        let row = table.querySelector('[data-row="' + rowID + '"]');

                        if(isHidden) {

                            let columnsList = row.querySelectorAll('[data-column]');
                            row.children[0].classList.remove('hidden');

                            columnsList.forEach(function(column) {

                                let columnID = column.getAttribute('data-column');
                                let isHiddenColumn = ~data[identifier].table.hidden.columns.indexOf(columnID);

                                if(isHiddenColumn)
                                    return true;

                                column.classList.remove('hidden');

                            });

                            data[identifier].table.hidden.rows.splice(hiddenIndex, 1);

                        } else {

                            Array.from(row.children).forEach(function(column) {

                                column.classList.add('hidden');

                            });

                            data[identifier].table.hidden.rows.push(rowID);

                        }

                    }

                    // Add column
                    else if(target.matches('.table-new-column')) {

                        let columnID = target.parentNode.getAttribute('data-column');
                        current.addColumn(table, identifier, columnID);

                    }

                    // Delete column
                    else if(target.matches('.table-delete-column')) {

                        let columnID = target.parentNode.getAttribute('data-column');
                        let rowsList = Array.from(table.querySelectorAll('tr'));
                        let columnCells = table.querySelectorAll('[data-column="' + columnID + '"');
                        let rowID = rowsList[1].getAttribute('data-row');
                        let headerIdentifier = columnID + '.' + rowID;

                        Array.from(columnCells).forEach(function(cell, index) {

                            rowsList[index].removeChild(cell);

                        });

                        --data[identifier].dimensions[0];
                        delete data[identifier].table.header[headerIdentifier];

                        let hiddenIndex = data[identifier].table.hidden.columns.indexOf(columnID);
                        if(~hiddenIndex)
                            data[identifier].table.hidden.columns.splice(hiddenIndex, 1);

                        let orderIndex = data[identifier].table.order.columns.indexOf(parseInt(columnID));
                        if(~orderIndex)
                            data[identifier].table.order.columns.splice(orderIndex, 1);

                        Object.keys(data[identifier].table.rows).forEach(function(rowID) {

                            delete data[identifier].table.rows[rowID][columnID];

                        });

                    }

                    // Add row
                    else if(target.matches('.table-new-row')) {

                        let eventRow = target.parentNode.parentNode;
                        current.addRow(table, identifier, eventRow);

                    }

                    // Delete row
                    else if(target.matches('.table-delete-row')) {

                        let parent = target.parentNode.parentNode;
                        let rowID = parent.getAttribute('data-row');
                        let columnID = parent.children[1].getAttribute('data-column');
                        let headerIdentifier = columnID + '.' + rowID;
                        let hiddenIndex = data[identifier].table.hidden.rows.indexOf(rowID.toString());
                        let orderIndex = data[identifier].table.order.rows.indexOf(parseInt(rowID));

                        if(~hiddenIndex)
                            data[identifier].table.hidden.rows.splice(hiddenIndex, 1);

                        if(~orderIndex)
                            data[identifier].table.order.rows.splice(orderIndex, 1);

                        delete data[identifier].table.rows[rowID];
                        delete data[identifier].table.header[headerIdentifier];
                        --data[identifier].dimensions[1];

                        parent.parentNode.removeChild(parent);

                    }

                }
            },

            {
                // Add new row at the end
                event: 'click',
                element: addRowElement,
                content: function() {

                    current.addRow(table, identifier);

                }
            },

            {
                // Delegate input events
                event: 'input',
                element: table,
                content: function(event) {

                    let target = event.target;

                    // Serialize table headers
                    if(target.matches('th[contenteditable]')) {

                        let columnID = target.getAttribute('data-column');
                        let rowID = target.parentNode.getAttribute('data-row');
                        let headerIdentifier = columnID + '.' + rowID;

                        data[identifier].table.header[headerIdentifier] = target.innerText.trim();

                    }

                    // Serialize table cells
                    else if(target.matches('td[contenteditable]')) {

                        let columnID = target.getAttribute('data-column');
                        let rowID = target.parentNode.getAttribute('data-row');

                        data[identifier].table.rows[rowID][columnID] = target.innerText.trim();

                    }

                }
            }

        ]);

        // Render action row ___________________________________________________________________________________________
        // ACTION ROW PROTOTYPE: | empty cell | header action cell first |
        let emptyClone = clones.emptyCell.cloneNode(true);
        emptyClone.classList.add('table-aside-action');

        actionRow.appendChild(emptyClone);
        actionRow.appendChild(clones.headerActionFirst.cloneNode(true));

        // Save row identifier
        data[identifier].table.order.columns.push(firstColumnID);
        actionRow.children[1].setAttribute('data-column', firstColumnID.toString());

        // Render header row ___________________________________________________________________________________________
        // HEADER ROW PROTOTYPE: | aside action cell first | header cell |
        headerRow.appendChild(clones.asideActionFirst.cloneNode(true));
        headerRow.appendChild(clones.headerCell.cloneNode(true));

        // Save row identifier and data
        data[identifier].table.rows[firstRowID] = {};
        data[identifier].table.order.rows.push(firstRowID);
        headerRow.setAttribute('data-row', firstRowID.toString());
        headerRow.children[1].setAttribute('data-column', firstColumnID.toString());

        // Show complete table
        table.appendChild(actionRow);
        table.appendChild(headerRow);

        // Resume data
        if(resumeData !== undefined) {

            // Initialize table name
            nameInput.value = resumeData.table.name.trim();
            triggerEvent(nameInput, 'input');

            // Change table global header
            const firstRow         = resumeData.table.order.rows[0];
            const firstColumn      = resumeData.table.order.columns[0];
            const headerIdentifier = firstColumn + '.' + firstRow;

            if(resumeData.table.header) {
                headerRow.children[1].innerText = resumeData.table.header[headerIdentifier];
                triggerEvent(headerRow.children[1], 'input');
            }

            // Show / Hide first row and column
            if(resumeData.table.hidden) {

                if(resumeData.table.hidden.columns) {

                    if(resumeData.table.hidden.columns.indexOf(firstColumn) !== -1)
                        triggerEvent(actionRow.children[1].children[0], 'click');

                }

                if(resumeData.table.hidden.rows) {

                    if(resumeData.table.hidden.rows.indexOf(firstRow) !== -1)
                        triggerEvent(headerRow.children[0].children[0], 'click');

                }

            }


            // Render rest of the table
            // Create table rows
            for(let i = 0; i < resumeData.dimensions[1]; ++i) {

                const rowID = resumeData.table.order.rows[i + 1];
                let headerID = firstColumn + '.' + rowID;
                let rowData = {};

                if(resumeData.table.hidden)
                    if(resumeData.table.hidden.rows)
                        rowData.hidden = resumeData.table.hidden.rows.indexOf(rowID) !== -1;

                if(resumeData.table.header)
                    rowData.header = resumeData.table.header[headerID];

                current.addRow(table, identifier, undefined, rowData);

            }

            // Create table columns
            for(let i = 0; i < resumeData.dimensions[0]; ++i) {

                const columnID = resumeData.table.order.columns[i + 1];
                let headerID = columnID + '.' + firstRow;
                let columnData = {};

                if(resumeData.table.hidden)
                    if(resumeData.table.hidden.columns)
                        columnData.hidden = resumeData.table.hidden.columns.indexOf(columnID) !== -1;

                if(resumeData.table.header)
                    columnData.header = resumeData.table.header[headerID];

                columnData.data = [];

                if(resumeData.table.rows)
                    resumeData.table.order.rows.forEach(function(row) {

                        if(resumeData.table.rows[row] === undefined)
                            return false;

                        if(resumeData.table.rows[row][columnID])
                            columnData.data.push(resumeData.table.rows[row][columnID]);

                    });

                current.addColumn(table, identifier, undefined, columnData);

            }

        } else {

            // Create table rows
            for(let i = 0; i < 4; ++i)
                current.addRow(table, identifier);

            // Create table columns
            for(let i = 0; i < 3; ++i)
                current.addColumn(table, identifier);

        }

        contentElement.appendChild(table);

    }

};