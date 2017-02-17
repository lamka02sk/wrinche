/**
 * Get files from server through AJAX
 * @param url
 */
function getJson(url) {

    return JSON.parse(
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            global: false,
            async: false,
            cache: true,
            success: function(data) {
                return data;
            }
        }).responseText);

}