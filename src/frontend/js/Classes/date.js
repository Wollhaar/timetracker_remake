class Year {
    stamp = new Date();
    timeElements = {
        months: Array(),
        weeks: Array()
    };
    conditions = {
        months: {
            reverse: false,
            number: 12,
        },
        weeks: {
            reverse: false,
            number: null,
        }
    };

    constructor(year = null, build = 'months', reverse = false) {
        this.set(year);
        this.adjust({reverse, build});
        this.build(build);
    }

    set(year) {
        if (!year) year = this.stamp.getFullYear();

        this.value = year;
        this.stamp.setFullYear(year, 0, 1);
    }

    adjust(settings) {
        if (settings.build === 'months') settings.number = 12;
        else if (settings.build === 'weeks') settings.number = this.stamp.lastWeekOfYear();

        this.settings(settings.build, settings.reverse, settings.number)
    }

    settings(what, reverse, number) {
        this.conditions[what].reverse = reverse;
        this.conditions[what].number = number;
    }

    add(value, what) {
        this.timeElements[what].push(value);
    }

    get(what) {
        return this.timeElements[what];
    }

    build(what) {
        this[what]();
    }

    months() {
        const conditions = this.conditions.months;
        for (let i = 0; i < conditions.number; i++) {
            this.add(new Month(
                i, this.stamp.getFullYear()
                ), 'months');
        }

        if (conditions.reverse) this.timeElements.months.reverse();
    }

    weeks() {
        const conditions = this.conditions.weeks;
        for (let i = 1; i <= conditions.number; i++) {
            this.add(new Week(
                i, this.stamp.getFullYear()
                ), 'weeks');
        }

        if (conditions.reverse) this.timeElements.weeks.reverse();
    }
}

class Month {
    stamp = new Date();
    timeElements = {
        weeks: Array(),
        days: Array()
    };
    conditions = {
        weeks: {
            reverse: false,
            number: null,
            current: null
        },
        days: {
            reverse: false,
            number: null
        }
    };
    value;

    constructor(month, year, build = 'days', reverse = false) {
        this.set(month, year);
        this.adjust({build, reverse});
        this.build(build);
    }

    set(month, year) {
        if (!year) year = this.stamp.getFullYear();
        if (!month && month < 0) month = this.stamp.getMonth();

        this.value = month;
        this.stamp.setFullYear(year, month, 1);
    }

    adjust(settings) {
        if (settings.build === 'days') settings.number = this.stamp.lastDayOfMonth();
        else if (settings.build === 'weeks') {
            settings.number = this.stamp.lastWeekOfMonth();
            settings.current = this.stamp.getWeekNumber();
        }

        this.settings(
            settings.build,
            settings.reverse,
            settings.number,
            settings.current
        );
    }

    settings(what, reverse, number, current = null) {
        this.conditions[what].reverse = reverse;
        this.conditions[what].number = number;
        this.conditions[what].current = current;
    }

    add(day, what) {
        this.timeElements[what].push(day);
    }

    build(what) {
        this[what]();
    }

    days() {
        const conditions = this.conditions.days;
        for (let i = 1; i <= conditions.number; i++) {
            this.add(new Day(
                i, this.stamp.getMonth(), this.stamp.getFullYear()
            ), 'days');
        }

        if (conditions.reverse) this.timeElements.days.reverse();
    }

    weeks() { // under construction
        const conditions = this.conditions.weeks;
        for (let i = conditions.current; i <= conditions.number; i++) {
            this.add(new Week(
                i, this.stamp.getFullYear()
            ), 'weeks');
        }

        if (conditions.reverse) this.timeElements.weeks.reverse();
    }
}

class Week {
    WN;
    stamp = new Date();
    timeElements = Array();

    constructor(WN, year) {
        this.stamp.setFullYear(year);
        this.stamp.setWeekNumber(WN);
        this.stamp.calcWeekTime();

        this.setWN(WN);
        this.build('days');
    }

    setWN(WN) {
        this.WN = WN;
    }

    add(day) {
        this.timeElements.push(day);
    }

    build(what) {
        this[what]();
    }

    days() {
        for (let i = 0; i < 7; i++) {
            this.add(new Day(
                this.stamp.getDate() + i,
                this.stamp.getMonth(),
                this.stamp.getFullYear()
            ));
        }
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

// override --- scripted prototype



// class Date


Date.prototype.lastDayOfMonth = function()
{
    switch (this.getMonth()) {
        // source: https://stackoverrun.com/de/q/4444865

        case 1:
            let year = this.getFullYear();
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
            return 0;
    }
}


// --- week config ---

Date.prototype.WN = null;

Date.prototype.lastWeekOfYear = function() {
    const d = new Date(this.getFullYear(), 11, 31);
    return d.getWeekNumber();
}

Date.prototype.lastWeekOfMonth = function() {
    const d = new Date(this.getFullYear(), this.getMonth(), this.lastDayOfMonth());
    return d.getWeekNumber();
}

Date.prototype.setWeekNumber = function(WN = null) {
    if (!WN) WN = this.getWeekNumber();
    this.WN = WN;
    this.setWeekTime(WN);
};

Date.prototype.setWeekTime = function(WN) {
    const yearStart = new Date(Date.UTC(this.getFullYear(), 0, 1));
    this.setTime(yearStart.getTime() + WN * 7 * 86400000);
};

Date.prototype.calcWeekTime = function() {
    const yearStart = new Date(Date.UTC(this.getFullYear(), 0, 1));
    let workaround = 0;
    if (yearStart.getFullYear() === 2020) workaround = 2; // workaround: 0.6.0.4
    this.setTime(
        yearStart.getTime() - (yearStart.getDay() - 1) * 86400000 +
        (this.getWeekNumber() - workaround) * 7 * 86400000
    );
    const dayNum = this.getDay() || 7;
    this.setDate(this.getDate() - (dayNum - 1));
};

// extension --- scripted prototype

// src: https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
Date.prototype.getWeekNumber = function() {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    this.WN = Math.ceil((((d - yearStart) / 86400000) + 1)/7);
    return this.WN;
};