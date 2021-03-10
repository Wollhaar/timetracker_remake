class Year {
    stamp = new Date();
    timeElements = Array();
    className = Array('year');

    constructor(year) {
        this.stamp.setFullYear(year);
        this.build();
    }

    set(month) {
        this.timeElements.push(month);
    }

    build() {
        for (let i = 0; i < 12; i++) {
            this.set(new Month(
                    i, this.stamp.getFullYear()
                ));
        }
    }
}

class Month {
    stamp = new Date();
    timeElements = Array();
    name;

    constructor(month, year) {
        this.stamp.setFullYear(year, month);
        this.name = monthInYear[month];
        this.build();
    }

    set(day) {
        this.timeElements.push(day);
    }

    build() {
        for (let i = 1; i <= lastDayOfMonth(this.stamp.getMonth, this.stamp); i++) {
            this.set(new Day(
                i, this.stamp.getMonth(), this.stamp.getFullYear()
            ));
        }
    }
}

class Week {
    KW;
    timeElements = Array();

    setKW(KW) {
        this.KW = KW;
    }

    set(day) {
        this.timeElements.push(day);
    }

    build() {
        let day = document.createElement('ul');
        let liD = document.createElement('li');
        liD.className = 'col-1';
        day.className = 'wd-' + this.dayInWeek;

        liD.append(day);
        return liD;
    }
}

class Day {
    stamp = new Date();
    dayInWeek;
    name;

    constructor(day, month, year) {
        this.stamp.setFullYear(year, month, day);

        this.dayInWeek = this.stamp.getDay();
        this.name = daysOfWeek[this.dayInWeek];
    }
}

let daysOfWeek = ['So','Mo','Di','Mi','Do','Fr','Sa'];
let monthInYear = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];


// aufbau der aufgezeichneten Stempel in einer (nach [Jahr][Monat][Tag] sortiert) Liste

function date_list(tracks)
{
    let list = {};
    for (let value of Object.values(tracks)) {
        let date = new Date(value.timestamp);
        let y = date.getFullYear();
        let m = date.getMonth();
        let d = date.getDate();

        if (list[y] === undefined) list[y] = [];
        if (list[y][m] === undefined) list[y][m] = [];
        if (list[y][m][d] === undefined) list[y][m][d] = [];

        list[y][m][d][value.id] = date;
    }

    return list;
}

function lastDayOfMonth(month, date)
{
    switch (month) {
        // source: https://stackoverrun.com/de/q/4444865

        case 2:
            let year = date.getFullYear();
            let day = 28;
            if (((year % 4 === 0) &&
                (year % 100 !== 0)) ||
                (year % 400 === 0))
                day = 29;
            return day;

        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;

        case 4:
        case 6:
        case 9:

        case 11:
            return 30;
        default:
            return false;
    }
}