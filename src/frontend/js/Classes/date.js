class Year {
    stamp = new Date();
    timeElements = Array();
    weeks = Array(1);

    constructor(year) {
        this.stamp.setFullYear(year);
        this.build();
    }

    add(value, what) {
        this[what].push(value);
    }

    get(what) {
        return this[what];
    }

    addToWeek(day) {
        let w = day.stamp.getWeekNumber();

        if (!(this.weeks[w] instanceof Week))
            this.weeks[w] = new Week(day.stamp);

        this.weeks[w].set(day);
    }

    build() {
        for (let i = 0; i < 12; i++) {
            this.add(new Month(
                    i, this.stamp.getFullYear()
                ), 'timeElements');
        }
    }

    buildWeeks() {
        for (let month of this.timeElements) {
            for (let day of Object.values(month.timeElements)) {
                this.addToWeek(day);
            }
        }
    }
}

class Month {
    stamp = new Date();
    timeElements = Array(1);
    value;

    constructor(month, year) {
        this.stamp.setFullYear(year, month);
        this.value = month;
        this.build();
    }

    set(day) {
        this.timeElements.push(day);
    }

    build() {
        for (let i = 1; i <= lastDayOfMonth(this.stamp); i++) {
            this.set(new Day(
                i, this.stamp.getMonth(), this.stamp.getFullYear()
            ));
        }
    }
}

class Week {
    KW;
    stamp;
    timeElements = Array();

    constructor(week = null) {
        this.stamp = week;
        if (week instanceof Date) this.setKW(week.getWeekNumber())
    }

    setKW(KW) {
        this.KW = KW;
    }

    set(day) {
        this.timeElements.push(day);
    }
}

class Day {
    stamp = new Date();
    dayInWeek;

    constructor(day, month, year) {
        this.stamp.setFullYear(year, month, day);
        this.dayInWeek = this.stamp.getDay();
    }
}


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


// aufbau der jahre, der aufgezeichneten Stempel, in einer Liste

function list_years(tracks)
{
    let list = [];
    for (let value of Object.values(tracks)) {
        let date = new Date(value.timestamp);
        let y = date.getFullYear();

        list.push(y);
    }

    return list;
}

function lastDayOfMonth(date)
{
    switch (date.getMonth()) {
        // source: https://stackoverrun.com/de/q/4444865

        case 1:
            let year = date.getFullYear();
            let day = 28;
            if (((year % 4 === 0) &&
                (year % 100 !== 0)) ||
                (year % 400 === 0))
                day = 29;
            return day;

        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31;

        case 3:
        case 5:
        case 8:

        case 10:
            return 30;
        default:
            return false;
    }
}


// extension --- scripted prototype

// src: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function(){
    var d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7)
};