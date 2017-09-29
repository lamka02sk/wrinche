import Utils from "./Utils";

export default {

    initialize() {

        let counterElements = document.querySelectorAll('.counter');

        counterElements.forEach(counterElement => {

            const maxLength = counterElement.getAttribute('data-length') || 0;
            const target = counterElement.getAttribute('data-input') || 'input';
            let inputElement = counterElement.parentNode.querySelector(target);

            counterElement.innerText = maxLength;
            inputElement.addEventListener('input', () => {

                const charactersLeft = +maxLength - inputElement.value.trim().length;
                counterElement.innerText = charactersLeft;

                if(charactersLeft < 0)
                    counterElement.classList.add('minus');
                else
                    counterElement.classList.remove('minus');

            });

            Utils.triggerEvent(inputElement, 'input');

        });

    }

};