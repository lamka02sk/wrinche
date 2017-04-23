// Tabs number
tabsCount = 0;
$('div.menu-tabs span.tabs-tab').each(function() { ++tabsCount });
$('div.menu-tabs').addClass('tabs_' + tabsCount);

// Save selector setting
function saveSelectorSetting(instance, option) {

    let reference = instance.dataset.reference;
    let value = option.getAttribute('value');
    let link = window.location.href;
    let data = {};
    data[reference] = value;

    if(value == null) return;

    // Send new value to the server
    postData(link, data, function(response, status) {

        if(status === 'success') {



        } else {



        }

    });

    // Pre-defined actions for UI type events
    if(reference === 'theme') {

        let oldTheme = document.querySelector('link[id=theme]');
        let path = oldTheme.getAttribute('href').split('themes/')[0];
        oldTheme.parentNode.removeChild(oldTheme);
        let newTheme = document.createElement('link');
        newTheme.setAttribute('id', 'theme');
        newTheme.setAttribute('rel', 'stylesheet');
        newTheme.setAttribute('type', 'text/css');
        newTheme.setAttribute('href', path + 'themes/' + value + '/admin.min.css');
        document.querySelector('head').appendChild(newTheme);

    } else if(reference === 'language') {

        let newLocale = option.getAttribute('value');
        document.querySelector('html').setAttribute('lang', newLocale);
        translate = new Translate(translations, false);
        selector.destroy();
        selector = new Selector({
            onSelect: function(instance, option) {
                saveSelectorSetting(instance, option);
            }
        });

    }

    /*
     * TEMP ******************
     */
    // Hide loading message
    setTimeout(function() {
        responseBox.classList.remove('loading');
        responseBox.classList.remove('open');
        responseBox.querySelector('span.message-content').innerText = '';
    }, 400);

}

// Add current script
previousScripts.push('settings');

// Initialize Selector
selector = new Selector({
    onSelect: function(instance, option) {
        saveSelectorSetting(instance, option);
    }
});

// Remove Splash screen
$('div.splash').addClass('done');