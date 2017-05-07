// Add current script
previousScripts.push('edit');

// Init counters
$('div.counter').each(function() {
    let maxLen = +$(this).attr('data-maxLength');
    let current = $(this);
    let type = $(this).attr('data-input');
    if(type === 'input') {
        let element = $(this).parent().find('input');
        let len = element.val().length;
        $(this).text(maxLen - len);
        element.on('change keyup click focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    } else {
        let element = $(this).parent().find('textarea');
        let len = element.val().length;
        $(this).text(maxLen - len);
        element.on('change keyup click focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    }
});

// Init packery
packery = $('div.content-content').packery({
    itemSelector: 'div.settings-component',
    gutter: 22
});

// Remove Splash screen
$('div.splash').addClass('done');