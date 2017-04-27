// Add current script
previousScripts.push('new');

// Init counters
$('div.counter').each(function() {
    let maxLen = $(this).attr('data-maxLength');
    $(this).text(maxLen);
    let current = $(this);
    let type = $(this).attr('data-input');
    if(type === 'input') {
        let element = $(this).parent().find('input');
        element.on('change keydown keyup click focusout focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    } else {
        let element = $(this).parent().find('textarea');
        element.on('change keydown keyup click focusout focusin', function() {
            let left = maxLen - element.val().trim().length;
            if(left < 0)
                current.addClass('minus');
            else if(current.hasClass('minus'))
                current.removeClass('minus');
            current.text(left);
        });
    }
});

// Init Selector
new Selector();

// Init packery
packery = $('div.content-content').packery({
    itemSelector: 'div.settings-component',
    gutter: 22
});

// Remove Splash screen
$('div.splash').addClass('done');