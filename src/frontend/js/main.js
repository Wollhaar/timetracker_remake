var default_load = 'login';
var admin = null;

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

    if (global_data.session.authenticated) {
        logged_in();
        user_authentication(global_data.user.status);

        if (action.load.content === 'default') {
            if (global_data.user.load_default === null) {
                load_content(default_load);
            }
            else load_content(global_data.user.default_landing);
        }

        if (global_data.request.action === 'track' && global_data.request.tracked) {
            load_data({action: 'tracking_list', tracking_area: 'today'});
        }
    }
}

function call_error(error)
{
    console.log(error);
}

function user_load(user)
{
    if (user['logged']) {
        load_content(default_load);
    }
    else login_failed();
}

function hide_user()
{
    $('#user-field').text('');
    $('#user-field').attr('class', 'd-none');

    $('#login-link').attr('class', '');
    $('#logout-link').attr('class', 'd-none');
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

function showRegister()
{
    if (admin) $('#register-link').attr('class', '');
}

function register_user()
{
    var register_form = $('.register-area input');
    var data = getData(register_form);

    load_data(data);
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


// * --- login script --- * : BEGIN

function check_user_status()
{
    var data = {
        action:'check_session'
    }

    load_data(data);
}

function login()
{
    var login_input = $('.login-area input');
    var data = getData(login_input);

    load_data(data);
}

function logged_in()
{
    var user_element = $('#user-field');
    var username = global_data.user.first_name + ' ' + global_data.user.last_name;

    $(user_element).attr('class', '');
    $(user_element).text(username);

    $('#login-link').attr('class', 'd-none');
    $('#logout-link').attr('class', '');
}

function user_authentication(auth)
{
    if (auth > 7) {
        admin = true;
        showRegister();
    }
}

function login_failed()
{
    console.log('login failed');
}

function logout()
{
    load_data({action: 'logout'});

    if (global_data.session === 'destroyed') {
        hide_user();
        load_content(default_load);
    }
}

// * --- login script --- * : END



// * --- tracking script --- * : BEGIN

function work(start_stop)
{
    track('work', start_stop);
}

function break_work(start_stop)
{
    track('break', start_stop);
}

function track(type, start_stop)
{
    let data = {
        'action': 'track',
        'type': type,
        'start_stop': start_stop,
        'user_id': $('input[name=user_id]').value
    }

    load_data(data);
}

// * --- tracking script --- * : BEGIN



// --- jquery functions ---

$('a').click(function(e){
    e.preventDefault();
})

global_data.request.tracking_list.ready(function (){
    $('.dashboard .tracking-list').ready(function(){
        fill_element_with(global_data.request.tracking_list, 'tracking_list');
    });
});

// $('.dashboard .tracking-list').ready(function(){
//     if (global_data.request.tracking_list === undefined) {
//         load_data({action: 'tracking_list', tracking_area: 'today'})
//     }
//     else {
//         fill_element_with(global_data.request.tracking_list, 'tracking_list');
//     }
// });

// --- jquery login ---
$('.login-area input').ready(function() {
    $(this).keyup(function (event) {
        if (event.key === 'Enter') login();
    });
});
