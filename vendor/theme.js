function changeTheme(theme, domain) {

    // Change stylesheet link
    let link = "styles/themes/" + theme + "/" + domain + ".min.css";
    $('#theme').attr("href", link);

}

function initTheme(domain) {

    // Load Theme
    let date = new Date();
    let theme = 'light';
    if((date.getHours() >= 18) || (date.getHours() < 8))
        theme = 'dark';
    if(localStorage.getItem('theme_' + domain))
        theme = localStorage.getItem('theme_' + domain);
    changeTheme(theme, domain);

}