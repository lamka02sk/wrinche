import flatpickr from 'flatpickr';
import Global from '../Modules/Global';
W
export default {

    locale: Global.translate.language,

    initialize() {

        this.dateTimePicker();
        this.dateTimePickerMin();
        this.dateTimePickerMax();
        this.datePicker();
        this.datePickerMax();
        this.datePickerMin();

    },

    dateTimePicker() {

        flatpickr(".datetime-picker", {
            altFormat    : true,
            dateFormat   : 'd.m.Y H:i:s',
            enableTime   : true,
            enableSeconds: true,
            locale       : locale,
            disableMobile: true,
            time_24hr    : true
        });

    },

    dateTimePickerMin() {

        flatpickr(".datetime-picker-min", {
            altFormat    : true,
            dateFormat   : 'd.m.Y H:i:s',
            enableTime   : true,
            enableSeconds: true,
            minDate      : 'today',
            locale       : locale,
            disableMobile: true,
            time_24hr    : true
        });

    },

    dateTimePickerMax() {

        flatpickr(".datetime-picker-max", {
            altFormat    : true,
            dateFormat   : 'd.m.Y H:i:s',
            enableTime   : true,
            enableSeconds: true,
            maxDate      : 'today',
            locale       : locale,
            disableMobile: true,
            time_24hr    : true
        });

    },

    datePicker() {

        flatpickr(".date-picker", {
            altFormat    : true,
            dateFormat   : 'd.m.Y',
            locale       : locale,
            disableMobile: true
        });

    },

    datePickerMax() {

        flatpickr(".date-picker-max", {
            altFormat    : true,
            dateFormat   : 'd.m.Y',
            maxDate      : 'today',
            locale       : locale,
            disableMobile: true
        });

    },

    datePickerMin() {

        flatpickr(".date-picker-min", {
            altFormat    : true,
            dateFormat   : 'd.m.Y',
            minDate      : 'today',
            locale       : locale,
            disableMobile: true
        });

    }

};