function changeTheme(theme, domain) {

    // Change stylesheet link
    var link = "styles/themes/" + theme + "/" + domain + ".min.css";
    $('#theme').attr("href", link);

}