var default_load = 'login';
var admin = null;

var global_data = {};

$(document).ready(function () {
    init();
});

function init()
{
    check_user_status();
}

function setContent(content)
{
    if (typeof content === 'undefined') {
        console.log('No valid content could be set');
        return;
    }
    console.log('page loaded');
    $('.wrapper .container').html(content);

    let data = $('.wrapper .container').children().attr('class');
    content_ready(data);
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

            if (data.action === undefined ||
                data.request === undefined)
            {
                call_error(data.error);
                return;
            }
            call_action(data.action);
        }
        else {
            console.log('Loading Data failed');
            console.log(success);
            console.log(data);
        }
    });
}

function content_ready(content)
{
    if (content.search('dashboard') !== -1) {
        let tracking_list = global_data.request.tracking_list;
        if (tracking_list !== undefined) {
            let tracks = check_list(tracking_list);
            fill_tracking_list(tracks);

            let changes = check_track(tracking_list);
            change_button(changes.work.type,
                changes.work.start_stop,
                changes.work.text);

            change_button(changes.break.type,
                changes.break.start_stop,
                changes.break.text);
        }
    }
}

function call_action(action) {

    if (global_data.session.authenticated) {
        logged_in();
        user_authentication(global_data.user.status);

        if (action.load.content === 'default') {
            if (global_data.user.load_default === null) {
                load_content(default_load);
            }
            else {
                let default_element = $('.' + global_data.user.default_landing);
                if (default_element.length === 0) {
                    load_content(global_data.user.default_landing);
                }
                else content_ready(default_element.attr('class'));
            }
        }

        if (global_data.request.action === 'track') {
            // if (data.track === true) {
            // }
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

function check_track(tracking)
{
    let list = {};

    let k = Object.entries(tracking);
    let kl = k.length;
    for (let i = 0; kl > i; i++) {
        let track = k.pop()[1];
        let type = track.type;

        // skip or break if already set
        if (list['work'] !== undefined && list['break'] !== undefined) break;
        if (list[type] !== undefined) continue;

        if (track.type === 'work') track.text = 'Arbeit';
        else if (track.type === 'break') track.text = 'Pause';

        if (track.start_stop === 'start') {
            track.text += ' beenden';
            track.start_stop = 'stop';
        }
        else if (track.start_stop === 'stop') {
            track.text += ' beginnen';
            track.start_stop = 'start';
        }

        list[type] = track;
    }

    return list;
}

function change_button(type, start_stop, text)
{
    let btn = $('#btn-' + type);

    $(btn).html(text);
    $(btn).val(start_stop);
}

function check_list(tracks)
{
    let list = $('#tracking_list option');

    for (let key in list) {
        if (list[key] === tracks[key]) delete tracks[key];
    }
    return tracks;
}

function fill_element_with(data, id) {}

function fill_tracking_list(tracks)
{
    var content_row = '';

    for (let key in tracks) {
        content_row +=
            '<option value="' +
                tracks[key]['id'] +
            '">' +
                capitalize(tracks[key]['type']) + ' ' +
                capitalize(tracks[key]['start_stop']) + ' ' +
                tracks[key]['timestamp'] +
            '</option>'; // foreach
    }

    $('#tracking_list').append(content_row);
}
// * --- tracking script --- * : BEGIN



// --- jquery functions ---

$(document).ready(function () {
    $('a').click(function (e) {
        e.preventDefault();
    });


// --- jquery tracking ---

    $('#tracking_list option').click( function () {
        console.log('this.value');
        console.log(this.value);

        let track = this.value;
        track = global_data.request.tracking_list[track];
        let min = new Date(track.timestamp);
        let max = new Date();

        min = new Date(
            min.getFullYear() + '-' +
            '0' + (min.getMonth() - 2) +
            '-01 07:00:00');

        $('.change-time--box').removeClass('d-none');
        $('.change-time--box input[name=type__start_stop]').val(track.type + ' ' + track.start_stop);

        let timeElement = $('.change-time--box input[name=timestamp]');
        timeElement.val(track.timestamp);
        timeElement.attr('min', min);
        timeElement.attr('max', max);
    });


// --- jquery login ---

    $('.login-area input').ready(function () {
        $(this).keyup(function (event) {
            if (event.key === 'Enter') login();
        });
    });


});



// --- extensions ---

// --- uppercase first-letter ---
// --- https://flaviocopes.com/how-to-uppercase-first-letter-javascript/ ---
const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}
