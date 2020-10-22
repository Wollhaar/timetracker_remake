var user_logging_in = false;
var user_logging_out = false;


function login()
{
    var login_input = $('.login-area input');
    var data = getData(login_input);

    load_data(data);
    user_logging_in = true;
}

function logout()
{
    user_logging_out = true;
    load_data({action: 'logout'});

    if (global_data.session === 'destroyed') {
        hide_user();
        load_content(default_load);
    }
}

function logged_in()
{
    var user_element = $('#user-field');
    var username = global_data.user.first_name + ' ' + global_data.user.last_name;

    $(user_element).attr('class', '');
    $(user_element).text(username);

    $('#login-link').attr('class', 'd-none');
    $('#logout-link').attr('class', '');

    user_logging_in = false;
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

function check_user_status()
{
    var data = {
        action:'check_session'
    }

    load_data(data);
}

// --- jquery functions ---

$('.login-area input').ready(function() {
    $(this).keyup(function (event) {
        if (event.key === 'Enter') login();
    });
});
