

$(document).ready(function () {
    init();
});

function init()
{
    load_content();
}

function setContent(content)
{
    if (typeof content === 'undefined') {
        console.log('No valid content could be set');
        return;
    }
    console.log('page loaded');
    $('.wrapper').html(content);
}

function getData(array_element) {
    return array_element.prototype.forEach(function (keys) {
        var array = [];
        if (typeof array_element[keys] === 'object') {
            array[$(array_element[keys]).attr('name')] = $(array_element[keys]).val();
        }
        if (typeof array_element[keys] === 'string') {
            var data = array_element[keys].split(':');
            array[data[0]] = data[1];
        }
        return array;
    });
}

function load_content(section = 'default')
{
    $.post('/api/contentLoader.php', {
        'content': section
    }, function(data, success) {
        if (success) {
            setContent(data, section);
        }
        else console.log('Content loading failed');
    });
}

function load_data(data)
{
    data = JSON.stringify(data);
    $.post('/api/dataHandler.php', data, function(data, success) {
        if (success) {
            call_action(data);
        }
        else {
            console.log('Loading Data failed');
            console.log(success);
            console.log(data);
        }
    });
}

function call_action(action)
{
    var data = getData(action.split(';'));
    action = data['action'];


}

function login()
{
    var login_input = $('.login-area input');
    var data = getData(login_input);

    var user = load_data(data);
    user = user.split(';');

    if (user['logged']) {
        load_content('dashboard');
    }
    else login_failed();
}

function loadRegister()
{
    load_content('register');
}

function loadLogin()
{
    load_content('login');
}

function update_title(content) {
    var title = $('title');
    $(title).html(content + ' - ' + $(title).html());
}

function register_user()
{
    var register_form = $('.register-area input');
    var data = getData(register_form);

    var user = load_data(data);
    user = getData(user.split(';'));

    if (user['logged']) {
        load_content('dashboard');
    }
    else login_failed();
}

function login_failed()
{
    console.log('login failed');
}

function logout()
{
    var loggedOut = load_data('logout');

    if(loggedOut) {
        load_content('default');
    }
}

// --- jquery functions ---

$('.login-area input').keyup(function (event) {
    console.log('key pressed: ' + event.key);
    if (event.key === 13) login();
});

