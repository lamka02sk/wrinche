// Routes while pretty URLs does not work
let baseURI = '?route='; // While pretty URL does not work
let route = $('meta[name=route]').attr('content');
let URI = baseURI + route + '/';
let locale;
let loader = new Loader('admin');

// Show response message or action message
function showMessage(content, type) {

    let code = content;

    if(content === 200)
        content = locale['register'][content];
    else
        content = locale['response'][content];

    let messageBox = $('div.response-message span.message-content');
    let responseBox = $('div.response-message');
    responseBox.dequeue();
    messageBox.attr('data-locale', code).html(content);
    responseBox.removeClass('success', 'error').removeClass('loading')
        .addClass(type).addClass('open').delay(5000)
        .queue(function() {
            $(this).removeClass('open').dequeue();
    });

}

// Translate website
let translations = ['response', 'admin_header', 'admin_menu'];

// Close opened elements on click outside
let closer = new Closer;
let doc = $(document);
doc.click(function(e) {
    closer.closeElements(e.target);
});

// Open / Close Footer
let footerMore = $('span.footer-more');
footerMore.click(function() {

    let footer = $('footer');
    if(!footer.hasClass('open')) {
        footer.addClass('open');
        closer.addElement(footer);
    } else
        footer.removeClass('open');

});

// Open / Close Account Dropdown
$('div.header-account').click(function() {

    let dropdown = $('div.account-dropdown');
    if(!dropdown.hasClass('open')) {
        dropdown.addClass('open');
        closer.addElement(dropdown);
    }

});

// If clicked on link element
doc.on('click', '[data-link]', function() {

    let link = $(this).attr('data-link');
    let type = $(this).attr('data-target');
    loader.redirect(link, type);

});

// Open write menu
$('div.header-write').click(function() {

    $('div.fullscreen-wrapper.write-menu').css({ display: 'table' })
        .animate({ opacity: 1 }, 150).addClass('open');

});

// Close write menu
$('div.write-menu div.tails-tail').click(function() {
    $('div.write-menu span.header-close').click();
});

$('div.write-menu span.header-close').click(function() {

    $('div.fullscreen-wrapper.write-menu').animate({ opacity: 0 }, 150).removeClass('open')
        .delay(100).queue(function() {
            $(this).css({ display: 'none' }).dequeue();
    });

});

// Logout
$('.logout').click(function() {
    window.location.href = URI + 'logout';
});