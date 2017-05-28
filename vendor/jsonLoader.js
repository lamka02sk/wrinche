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

function getFile(url) {

    return $.ajax({
                type: 'GET',
                url: url,
                global: false,
                async: false,
                cache: true,
                success: function(data) {
                    return data;
                }
            }).responseText;

}

function ajax(url, method, data, contentType, onDone, onError) {

    $.ajax({
        url: url,
        type: method,
        data: data,
        dataType: contentType,
        async: true,
        success: onDone,
        error: onError
    });

}