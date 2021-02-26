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



