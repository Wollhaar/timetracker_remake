

$(document).ready(function () {
    init();
});

function init()
{

    var content = getContent();
    content = document.createElement();
    console.log('page loaded');

    $('.wrapper').html(content);
}