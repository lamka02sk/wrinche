// Add current script
previousScripts.push('sorting');

// Determine type of content
type = window.location.href.split('/');
for(let i = 0; i < type.length; ++i) {
    if(type[i] === '')
        type.splice(i, 1);
}
typeName = type[type.length - 1];
typeName = capitalizeFirstLetter(typeName);

// Remove category / tag function
function removeItem(event) {
    let parent = event.target.parentNode;
    let id = parent.getAttribute('data-id');
    postData(
        URI + 'sorting',
        { id: id, type: typeName.toLowerCase() },
        function(response, type) {

            if(type !== 'error') {
                response = JSON.parse(response);
                if(response.success)
                    parent.parentNode.removeChild(parent);
            }

            // Hide loading message
            responseBox.classList.remove('loading');
            responseBox.classList.remove('open');
            responseBox.querySelector('span.message-content').innerHTML = '';

        }
    );
}

if(typeName === 'Categories')
    selectors = document.querySelectorAll('span.category-tail-remove');
else if(typeName === 'Tags')
    selectors = document.querySelectorAll('span.tag-tail-remove');
else {
    typeName = 'Categories';
    selectors = document.querySelectorAll('span.category-tail-remove');
}

for(let i = 0; i < selectors.length; ++i)
    selectors[i].addEventListener('click', removeItem);

// Remove Splash screen
$('div.splash').addClass('done');