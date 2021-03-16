var default_load = 'home';
var admin = null;
var global_data = {};

$(document).ready(function () {
    init();
});

function init()
{
    check_user_status();
    setDefault(default_load);
}

// setzen des aus der Schnittstelle geladenen contents
function setContent(content)
{
    if (typeof content === 'undefined') {
        console.log('No valid content could be set');
        return;
    }
    console.log('page loaded');
    $('.wrapper .outer-container').html(content);

    content_ready();
}

// Default setzen des Headers und defaultlink
function setDefault(data)
{
    $('.default-linking').each(function(){
        this.href = data;

        if (this.innerHTML.search('h1') !== -1) return;
        this.innerText = capitalize(data);
    });
}

// Funktion zum abgreifen von Daten aus HTMLObjekten
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

// schnittstelle zum content
function load_content(section = 'home')
{
    $.post('http://timetracker.de:8080/contentLoader.php', {
        'content': section
    }, function(data, success) {
        if (success) {
            setContent(data);
        }
        else console.log('Content loading failed');
    });
}

// schnittstelle zum Backend
function load_data(data)
{
    $.post('http://backend.timetracker.de:8090/dataHandler.php', {
        data
    }, function(data, success) {
        if (success && data.search('Fatal error') === -1) {
            data = JSON.parse(data);
            global_data = data;

            if (data.action === undefined ||
                data.results === undefined)
            {
                if (data.session.session === 'destroyed') {
                    data.action = data.session.action;
                    console.log('destroyed');
                }
                else {
                    call_error(data.error);
                    return;
                }
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

function content_ready()
{
    let data = $('.wrapper .outer-container').children().attr('class');

    // datenbefüllung des dashboards
    if (data.search('dashboard') !== -1) {
        let tracking_list = JSON.parse(JSON.stringify(global_data.results.created.tracking_list));
        if (tracking_list) {
            fill_tracking_list(tracking_list);

            let changes = check_track(tracking_list);
            for (let key in changes) {
                change_button(changes[key].type,
                    changes[key].start_stop,
                    changes[key].text);
            }
        }
    }

    // datenbefüllung der Bilanz
    if (data.search('balance') !== -1) {
        // initialize_script('Calendar');
        // initialize_script('date');

        let tracking_list = JSON.parse(JSON.stringify(global_data.results.created.tracking_list));
        if (tracking_list) {
            build_balanceList(tracking_list);
            list_balanceTracks(tracking_list);
            list_trackedMonths(tracking_list);

            build_timeMonth();
            jquery_balance();
        }
    }

    $('#tracking_list option').click( function () {
        change_track(this);
    });

    adjust_wrapper();
}

// ausführen der vom backend vorgegebenen zu ausführenden aktion
function call_action(action) {
    if (global_data.session.authenticated) {
        let user = global_data.user;
        logged_in();
        user_authentication(user.status);

        default_load = user ? user.default_landing : default_load;
        setDefault(default_load);

        // laden des default gesetzten contents
        if (action.load === 'default') {
            load_content(default_load);

            let default_element = $('.' + user.default_landing);
            if (default_element.length === 0) {
                load_content(user.default_landing);
            }
            else content_ready(default_element.attr('class'));
        }

        if (action.load === 'balance') load_content('balance');

        if (action.update === 'tracking') {
            fill_tracking_list(global_data.results.created.tracking_list);
        }

        if (action.call === 'docu') {
            window.open(global_data.results.created.docu);
        }
    }
    else {
        // falls userauthentifizierung nicht erfolgreich
        // prüfung ob session zerstört und laden
        // des default gesetzten contents
        if (global_data.session === 'destroyed') {
            global_data.logout = true;
        }
        setDefault(default_load);
        load_content(action.load);
    }
}

function call_error(error)
{
    console.log(error);
}

function initialize_script(name) {
    $.getScript("/js/Classes/" + name + ".js", function() {
        alert('loaded script and content');
    });
}

// --- link-load script --- : BEGIN

function loadDefault(a)
{
    let link = a.href.split('/');
    load_content(link[link.length - 1]);
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
    load_data({action: 'tracking_list'});
}

// --- link-load script --- : END

// --- time script --- : BEGIN

function calculateSeconds(msecs)
{
    return Math.floor(msecs / 1000);
}

function calculateMinutes(msecs)
{
    return Math.floor(msecs / 1000 / 60);
}

function calculateHours(msecs)
{
    return Math.floor(msecs / 1000 / 60 / 60);
}

// calculating time difference
// source: https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
function calculateDifference(time1, time2)
{
    return Math.abs(time1 - time2);
}

// umrechnung der übergebenen zeit in stunden, minuten sekunden
function calculateTime(time, what)
{
    // umrechnung der Zeit in Stunden
    if (what === 'hours') {
        time.h = calculateHours(time.calc);
        time.rest = time.calc - (time.h * 60 * 60 * 1000);
        time = Object.assign(calculateTime(time, 'minutes'));
    }
    // umrechnung der verbliebenen Restzeit in Minuten
    if (what === 'minutes') {
        time.m = calculateMinutes(time.rest);
        time.rest = time.rest - (time.m * 60 * 1000);
        time = Object.assign(calculateTime(time, 'seconds'));
    }
    // umrechnung der verbliebenen Restzeit in Sekunden
    if (what === 'seconds') {
        time.s = calculateSeconds(time.rest);
        time.rest = time.rest - (time.s * 1000);
    }
    return time;
}

// --- time script --- : END


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

// --- content script --- : BEGIN


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

function fill_form_element_with(data, which)
{
    let area = $('.' + which + ' input, .' + which + ' select');

    for (const key of Object.keys(area)) {
        area[key].value = data[area[key].name];
    }
}

// --- content script --- : END

// --- style script --- : BEGIN

// korrektur der höhe des wrappers
// src: https://stackoverflow.com/questions/324486/how-do-you-read-css-rule-values-with-javascript

function adjust_wrapper()
{
    let wrapper = $('.wrapper');
    let height_wrapper_current = parseInt($(wrapper).css('height'));
    let height_wrapper_css = parseInt(getStyledCSSRules('.wrapper', 'minHeight'));

    if (height_wrapper_current > height_wrapper_css) {
        let margin_bottom = parseInt($('footer').css('height')) + 30;
        $(wrapper).css('margin-bottom', margin_bottom);
    }
}
// coded from(src): https://stackoverflow.com/questions/16965515/how-to-get-a-style-attribute-from-a-css-class-by-javascript-jquery
function getStyledCSSRules(what, style)
{
    let rules = document.styleSheets[1].rules;

    for (const rule of rules) {
        if (rule.selectorText === what) {
            return rule.style[style];
        }
    }
}

// --- style script --- : END

function showRegister()
{
    if (admin) $('#register-link').attr('class', '');
}

// userregistrierung
function register_user()
{
    var register_form = $('.register-area input');
    register_form.push($('.register-area select')[0]);
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


// setzen der daten des eingeloggten user im frontend
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

// Prüfung ob der Header eines Tages bereits gesetzt
function dayGotSet(dayElement, day) {
    $(dayElement).find('h6').each(function(key){
        return (this.innerText.search(day) !== -1);
    });
}

// Aufbau eines Stempels für die Stempelliste
function build_trackDisplay(track)
{
    return capitalize(track['type']) + ' ' +
        capitalize(track['start_stop']) + ' ' +
        track['timestamp'];
}


function work(start_stop)
{
    track('work', start_stop);
}

function break_work(start_stop)
{
    track('break', start_stop);
}

// das Stempeln
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

// überprüfung der tracks zum stempeln der nächsten Zeiten
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

// änderung eines Buttons
function change_button(type, start_stop, text)
{
    let btn = $('#btn-' + type);

    $(btn).html(text);
    $(btn).val(start_stop);
}

// befüllen der Stempelliste
function fill_tracking_list(tracks)
{
    var track_list = [];

    for (let key in tracks) {
        track_list[key] = document.createElement('option');
        track_list[key].value = tracks[key]['id'];
        track_list[key].innerHTML =
                    capitalize(tracks[key]['type']) + ' ' +
                    capitalize(tracks[key]['start_stop']) + ' ' +
                    tracks[key]['timestamp'];
    }

    $('#tracking_list').html(track_list);
}

// aufsetzen des zu ändernden Stempels
// src: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local

function change_track(element)
{
    let track = element.value;
    track = global_data.results.created.tracking_list[track];
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

// Auflistung der Zeiten
function build_balanceList(tracks) {
    tracks = JSON.parse(JSON.stringify(tracks));
    let list = list_years(tracks);
    let calendar = new Calendar();

    for (let year of list) {
        calendar.pushYear(year);
    }

    calendar.createDates();
    calendar.build();
    $('.balance .tracking-list').html(calendar.get());
}


function build_balanceList_test(tracks) {
    tracks = JSON.parse(JSON.stringify(tracks));
    let list = list_years(tracks);
    let calendar = new Calendar();

    for (let year of list) {
        calendar.pushYear(year);
    }
    calendar.createDates();
    calendar.build();
    return calendar
}

function list_balanceTracks(tracks)
{
    tracks = JSON.parse(JSON.stringify(tracks));

    // Zeiten eines Jahres
    for (let key in tracks) {

        let hover = document.createElement('span');
        $(hover).attr('class', 'tracks hover-box d-none');

        // Zeiten eines Tages
        let date = tracks[key].timestamp;
        let dayId = '#day-' + date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();

        let day = $(dayId);
        let track = document.createElement('li');

        track.id = 't-' + tracks[key].id;
        track.innerHTML = build_trackDisplay(tracks[key]);

        let trackedDayTime = build_trackedTime(tracks, tracks[key]);
        day.append(trackedDayTime);

        hover.append(track);
        day.append(hover);
    }
}

// Auflistung der aufgezeichneten Monate im Select-Feld
// für die Auswahl der zu, in PDF, zu dokumentierenden Monate
function list_trackedMonths(tracks)
{
    let list = date_list(tracks);
    let html = [];

    for (let keyY in list) {
        for (let keyM in list[keyY]) {
            let opt = document.createElement('option');
            opt.value = keyY + '-' + keyM;
            opt.innerText = monthInYear[keyM].substr(0, 3) + ' ' + keyY;
            html.push(opt);
        }
    }

    $('#tracked_months').html(html);
}

// Aufbauen und Berechnung der zu erstellenden Monate in der Statistik
// für die gezeichneten Stempel
function build_trackedTime(tracks, day)
{
    let input = document.createElement('input');
    let text = document.createElement('span');
    let set = document.createElement('div');

    let time = calculate_trackedTime(build_trackedTimeList(tracks, day));


    input.type = 'hidden';
    input.id = time.id;
    input.name = 'work_time';
    input.value = time.calc;

    text.innerText = time.h + ':' + time.m;

    set.class = 'd-inline';
    set.append(input);
    set.append(text);
    return set;
}

// vorbereitung der zu berechnenden Zeiten eines Tages
function build_trackedTimeList(tracks, day) {
    let time = {};
    let counters = {
        'work_start': 0,
        'work_stop': 0,
        'break_start': 0,
        'break_stop': 0
    };

    for (const id in day) {
        if (tracks[id].toString() !== Object.prototype.toString()) continue;
        let loopCounter = counters[tracks[id].type + '_' + tracks[id].start_stop]++;

        if (!time[loopCounter]) time[loopCounter] = {};
        if (!time[loopCounter][tracks[id].type]) time[loopCounter][tracks[id].type] = {};
        time[loopCounter][tracks[id].type][tracks[id].start_stop] = day[id].getTime();

        if (!time.id)
            time.id = 'work-day:' +
                day[id].getFullYear() +
                '-' +
                (day[id].getMonth() + 1) +
                '-' +
                day[id].getDate();
    }

    return time;
}

// berechnung der Zeiten eines Tages
function calculate_trackedTime(time)
{
    time.calc = {'work': 0, 'break': 0};
    for (const key in time) {
        if (isNaN(parseInt(key))) continue;

        if (!time[key].work) time[key].work = {'start': 0, 'stop': 0};
        else {
            if (!(time[key].work.start || time[key].work.stop)) {
                time[key].work = {'start': 0, 'stop': 0};
            }
        }
        if (!time[key].break) time[key].break = {'start': 0, 'stop': 0};
        else {
            if (!(time[key].break.start || time[key].break.stop)) {
                time[key].break = {'start': 0, 'stop': 0};
            }
        }

        time.calc.work += time[key].work.stop - time[key].work.start;
        time.calc.break += time[key].break.stop - time[key].break.start;
    }
    time.calc = time.calc.work - time.calc.break;

    // umrechnung der zeit in Std, Min und Sek
    time = Object.assign(calculateTime(time, 'hours'), time);

    return time;
}

// berechnung der gearbeiteten Zeit eines Monats
function calculateMonth(y, m)
{
    let i = 0;
    let list = [];

    for (let value of $('.y-' + y + ' .m-' + m + ' input[name=work_time]')) {
        list.push(value.value);
    }

    // aufsummierung der gearbeiteten Tage eines Monats
    // src: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Summe_von_Werten_in_einem_Objektarray
    return list.reduce(function(accumulate, current){
        current = parseInt(current);
        return isNaN(current) ? accumulate : accumulate + current;
    }, i);
}

// erstellen des hidden input elements zum aufzeichnen der gearbeiteten Monatszeit
function build_timeMonth()
{
    $('.balance .year').each(function() {
        const y = $(this).children('h5').html().split(' ')[1];

        $(this).find('.month').each(function() {
            const m = $(this).children('h5').html().split(' ')[1];
            let time = calculateMonth(y, monthInYear.indexOf(m));

            let time_element = document.createElement('input');
            time_element.type = 'hidden';
            time_element.className = 'month_time';
            time_element.value = time;

            this.append(time_element);
        });
    });
}

// * --- balance script --- * : END

// * --- document script --- * : BEGIN

// abrufen der Monate und Übergabe ans Backend zur Erstellung
// eines PDF der dafür aufgezeichneten Monate
function create_pdf()
{
    const months = $('#tracked_months').val();
    let copiedMonths = JSON.parse(JSON.stringify(months));
    let area = copiedMonths.shift();
    if (copiedMonths.length) area += '_' + copiedMonths.pop();

    let timeList = build_timeList(months);

    for (let y in timeList) {
        for (let m in timeList[y]) {
            timeList[y][m]['time'] = $('.y-' + y + ' .m-' + m + ' .month_time').val();
            $('.y-' + y + ' .m-' + m + ' h6').each(function() {
                let d = $(this).text().split(' ')[1];
                timeList[y][m][d] = $('input[id$=' + y + '-' + m + '-' + d + ']').val();
            });
        }
    }

    load_data({action: 'document', time_list: timeList, area: area});
}

// Aufbau der, für in create_pdf(), benötigten Liste
function build_timeList(list)
{
    let newList = {};
    for (let i in list) {
        let val = list[i].split('-');
        if(!newList[val[0]]) newList[val[0]] = {};
        newList[val[0]][val[1]] = {};
    }
    return newList;
}

// * --- document script --- * : END

// --- jquery functions ---

function jquery_balance()
{
// hover-box der aufgezeichneten Tracks eines Tages
    $('.balance h6').click(function(){
        let tracks = $(this).nextAll('li');

    });
    $(".balance ul.week li ul h6").on("mouseover", function(){
        $(this).siblings(".hover-box").removeClass("d-none");
        $(this).siblings(".hover-box").addClass("d-inline");
    }).on("mouseleave", function(){
        $(this).siblings(".hover-box").removeClass("d-inline");
        $(this).siblings(".hover-box").addClass("d-none");
    });
}

$(document).ready(function () {

    $('a').click(function (e) {
        e.preventDefault();
    });

    adjust_wrapper();

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



// --- override ---

// anhand der funktion sort von Objekten
// src: https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
const flip = (arr) => {
    if (typeof arr !== 'object') return undefined;
    arr = Object.keys(arr).sort(function (a, b) {
        return b - a;
    });
    return arr;
}

