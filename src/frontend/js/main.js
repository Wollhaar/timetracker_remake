var default_load = 'login';
var admin = null;
var dayInWeek = [null, 'Mo','Di','Mi','Do','Fr','Sa','So'];
var monthInYear = [null, 'Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
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
            if (value.toString() !== '[object HTMLInputElement]' &&
                value.toString() !== '[object HTMLSelectElement]') continue;
            array[value.attributes.name.value] = value.value;
        }
        return array;
    }
    return array;
}

function collectData(from)
{
    let data = {};
    $('.' + from + ' input').each(function(key){
        data[$(this).attr('name')] = this.value;
    });
    $('.' + from + ' select').each(function(key){
        data[$(this).attr('name')] = this.value;
    });

    return data;
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
                console.log('check one');
                if (data.session === 'destroyed') {
                    data.action = {load: 'home'};
                    console.log('destroyed');
                }
                else {
                    call_error(data.error);
                    return;
                }
            }
            console.log('check two');

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
        let tracking_list = JSON.parse(JSON.stringify(global_data.request.tracking_list));
        if (tracking_list !== undefined) { // TODO: check for better conditions
            fill_tracking_list(tracking_list);

            let changes = check_track(tracking_list);

            for (let key in changes) {
                change_button(changes[key].type,
                    changes[key].start_stop,
                    changes[key].text);
            }
        }

        $('#tracking_list option').click( function () {
            change_track(this);
        });
    }

    if (content.search('balance') !== -1) {
        let tracking_list = JSON.parse(JSON.stringify(global_data.request.tracking_list));
        if (tracking_list !== undefined) { // TODO: check for better conditions
            list_balance(tracking_list);
        }

    }
    $('#tracking_list option').click( function () {
        change_track(this);
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
            else {
                let default_element = $('.' + global_data.user.default_landing);
                if (default_element.length === 0) {
                    load_content(global_data.user.default_landing);
                }
                else content_ready(default_element.attr('class'));
            }
        }

        if (action.load.content === 'balance')
            load_content('balance');

        if (action.update === 'tracking') {
            fill_tracking_list(global_data.request.tracking_list);
        }
    }
    else {
        console.log('load');
        if (global_data.session === 'destroyed') {
            global_data.logout = true;
        }
        load_content(action.load);
    }
    console.log('check');
}

function call_error(error)
{
    console.log(error);
}

// --- date script --- : BEGIN

function date_list(tracks)
{
    let list = {};
    for (let value of Object.values(tracks)) {
        let date = new Date(value.timestamp);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();

        if (list[y] === undefined) list[y] = [];
        if (list[y][m] === undefined) list[y][m] = [];
        if (list[y][m][d] === undefined) list[y][m][d] = [];

        list[y][m][d][value.id] = date;
    }

    return list;
}

function endOfWeek(day)
{
    return day >= 5;
}

function endOfMonth(day, date)
{
    switch (date.getMonth()) {
        // source: https://stackoverrun.com/de/q/4444865

        case 2:
            if (day >= 28) {
                let year = date.getFullYear();
                return !(day !== 29 &&
                    ((year % 4 === 0) &&
                        (year % 100 !== 0)) ||
                    (year % 400 === 0));
            }
            break;
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:

        case 12:
            if (day === 31) return true;
            break;
        case 4:
        case 6:
        case 9:

        case 11:
            if (day === 30) return true;
        break;
        default:
            return false;
    }
}

function dayGotSet(dayElement, day) {
    $(dayElement).find('h6').each(function(key){
        return (this.innerText.search(day) !== -1);
    });
}

function build_trackDisplay(track)
{
    return capitalize(track['type']) + ' ' +
        capitalize(track['start_stop']) + ' ' +
        track['timestamp'];
}

// --- date script --- : END


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

function loadBalance()
{
    load_content('balance');
}

function update_title(content)
{
    let title = $('title');

    let update = title.html();
    let uPos = update.search(' - ');

    if (uPos !== -1) {
        update = content + update.substr(uPos);
        $(title).html(update);
    }
}

function showRegister()
{
    if (admin) $('#register-link').attr('class', '');
}

function register_user()
{
    var register_form = $('.register-area input');
    register_form.push($('.register-area select'));
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
    var content_row = [];

    for (let key in tracks) {
        content_row[key] = document.createElement('option');
        content_row[key].value = tracks[key]['id'];
        content_row[key].innerHTML =
                    capitalize(tracks[key]['type']) + ' ' +
                    capitalize(tracks[key]['start_stop']) + ' ' +
                    tracks[key]['timestamp'];
    }

    $('#tracking_list').html(content_row);
}

function change_track(element)
{
    let track = element.value;
    track = global_data.request.tracking_list[track];
    let min = new Date(track.timestamp);
    let max = new Date();

    min.setMonth(min.getMonth() - 3);
    min.setDate(1);
    min.setHours(8);
    min.setMinutes(0);
    min.setSeconds(0);

    $('.change-track--box').removeClass('d-none');
    $('.change-track--box input[name=id]').val(track.id);
    $('.change-track--box input[name=type__start_stop]').val(track.type + ' ' + track.start_stop);

    let timeElement = $('.change-track--box input[name=timestamp]');
    timeElement.val(track.timestamp);
    timeElement.attr('min', min);
    timeElement.attr('max', max);
}

function split___type__start_stop(data)
{
    data = data.split(' ');
    return {type: data[0], start_stop: data[1]};
}

function update_track(action) {
    let data = collectData('change-track--box');
    data = Object.assign(split___type__start_stop(data.type__start_stop), data);

    data.action = action + '_track';
    load_data(data);
}

// * --- tracking script --- * : END

// * --- balance script --- * : BEGIN

function list_balance(tracks)
{
    let list = date_list(tracks);
    let html = document.createElement('ul');

    for (let keyY in list) {
        let year = document.createElement('ul');
        let head = document.createElement('h5');
        head.innerHTML = 'Jahr ' + keyY;
        year.append(head);
        year.className = 'year y-' + keyY;
        let li;

        for (let keyM in list[keyY]) {
            let month = document.createElement('ul');
            let head = document.createElement('h5');

            head.innerHTML = 'Monat ' + monthInYear[keyM];
            month.append(head);
            month.className = 'month m-' + keyM;


            let week = document.createElement('ul');
            week.className = 'week';
            let EoW = false;
            for (let keyD in list[keyY][keyM]) {

                let day = document.createElement('ul');
                for (let keyT in list[keyY][keyM][keyD]) {
                    let date = list[keyY][keyM][keyD][keyT];

                    let diW = dayInWeek[date.getDay()];
                    let diM = date.getDate();

                    let track = document.createElement('li');

                    track.id = 't-' + tracks[keyT].id;
                    track.innerHTML = build_trackDisplay(tracks[keyT]);

                    if(!day.head) {
                        let dayHead = document.createElement('h6');
                        let header = diW + ' ' + diM;
                        dayHead.append(header);
                        day.append(dayHead);
                        day.head = true;
                    }
                    day.append(track);

                    EoW = endOfWeek(dayInWeek.indexOf(diW));
                }
                li = document.createElement('li');
                li.append(day)
                week.append(li);

                if (EoW) {
                    li = document.createElement('li');
                    li.append(week)
                    month.append(li);
                    week = document.createElement('div');
                    week.className = 'week';
                }
            }
            li = document.createElement('li');
            li.append(month)
            year.append(li);
        }
        li = document.createElement('li');
        li.append(year)
        html.append(li);
    }

    $('.balance .tracking-list').html(html);
}

// * --- balance script --- * : END

// --- jquery functions ---
$(document).ready(function () {


    $('a').click(function (e) {
        e.preventDefault();
    });

// --- jquery tracking ---


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
