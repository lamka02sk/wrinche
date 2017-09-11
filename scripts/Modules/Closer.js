export default class {

    constructor() {

        this.stack = [];
        this.counter = 0;

    }

    addElement(element) {

        this.stack.push(element[0]);
        this.counter = 1;

    }

    closeElements(target) {

        if(this.counter > 0) {
            this.counter = 0;
            return false;
        }

        stack.forEach(element => {

            if(!($(element).find(target).length > 0 || $(element).is($(target)))) {
                $(element).removeClass('open');
                this.stack.splice(item, 1);
            }

        });

    }

}