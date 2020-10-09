var user_logging_in = false;
var user_logging_out = false;

var default_load = 'login';


var global_data = {};

$(document).ready(function () {
    init();
});

function init()
{
    check_user_status();
    load_content(default_load);
}

function setContent(content)
{
    if (typeof content === 'undefined') {
        console.log('No valid content could be set');
        return;
    }
    console.log('page loaded');
    $('.wrapper .container').html(content);
}

function getData(array_element) {
    var array = {};
    if (array_element.toString() === '[object Object]') {
        for (const [key, value] of Object.entries(array_element)) {
            if (value.toString() !== '[object HTMLInputElement]') continue;
            array[value.attributes.name.value] = value.value;
        }
        return array;
    }
    // array_element.forEach(function (key) {
    //     if (typeof array_element[key] === 'object') {
    //         array[$(array_element[key]).attr('name')] = $(array_element[key]).val();
    //     }
    //     if (typeof array_element[key] === 'string') {
    //         var data = array_element[key].split(':');
    //         array[data[0]] = data[1];
    //     }
    // });
    return array;
}

function load_content(section = 'login')
{
    $.post('http://timetracker.de:8080/contentLoader.php', {
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
    $.post('http://backend.timetracker.de:8090/dataHandler.php', {
        data
    }, function(data, success) {
        if (success && data.search('Fatal error') === -1) {
            data = JSON.parse(data);
            global_data = data;

            if (data.action !== undefined) call_error(data.error);
            call_action(data.action);
        }
        else {
            console.log('Loading Data failed');
            console.log(success);
            console.log(data);
        }
    });
}

function call_action(action) {

    if (global_data.session['authenticated']) {
        logged_in();

        if (action['load']['content'] === 'default') {

            if (global_data.user['load_default'] === null) {
                load_content(default_load);
            } else load_content(global_data.user['default_landing']);
        }

        if (global_data.user['default_landing'] === 'dashboard') {
            fill_element_with(global_data.tracked, 'tracking_list');
        }
    }
    else {
        login_failed();
    }
}

function call_error(error)
{
    console.log(error);
}

function login()
{
    var login_input = $('.login-area input');
    var data = getData(login_input);

    load_data(data);
    user_logging_in = true;
}

function logged_in()
{
    var user_element = $('#user-field');
    var username = global_data.user.first_name + ' ' + global_data.user.last_name;

    $(user_element).attr('class', '');
    $(user_element).text(username);

    user_logging_in = false;
}

function user_load(user)
{
    if (user['logged']) {
        load_content(default_load);
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

function update_title(content)
{
    var title = $('title');
    $(title).html(content + ' - ' + $(title).html());
}

function register_user()
{
    var register_form = $('.register-area input');
    var data = getData(register_form);

    load_data(data);
}

function check_user_status()
{
    var data = {
        action:'check_session'
    }

    load_data(data);
}

function login_failed()
{
    console.log('login failed');
}

function logout()
{
    user_logging_out = true;
    load_data('logout');


    if(logged) {
        load_content(default_load);
    }
}

function fill_element_with(data, id)
{
    var element = $(id);

    if (id === 'tracking-list') {
        var content_row;
        data.forEach(function (key) {
            content_row +=
                '<option value="' +
                data['type'] + ':' + data['value'] + '">' +
                data['value'] +
                '</option>'; // foreach
        });

        $(element).append(content_row);
    }
}

// --- jquery functions ---

$('.login-area input').keyup(function (event) {
    console.log('key pressed: ' + event.key);
    if (event.key === 13) login();
});

