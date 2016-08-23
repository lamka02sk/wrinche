$(document).ready(function() {

    // Formstone - Dropdown
    $('select').dropdown();

    // Animate intro
    $('div.intro').addClass('animate');
    $('button.proceed-install').delay(500).queue(function() {
        // Animate install button
        $(this).addClass('animate').dequeue();
    }).click(function() {
        // Hide intro
        $('div.intro').addClass('hide').removeClass('animate');
        // Show installer
        $('div.installer').addClass('animate');
    });

});