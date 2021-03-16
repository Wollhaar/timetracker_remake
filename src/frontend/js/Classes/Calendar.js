class Calendar extends Element {
    years = Array();

    constructor() {
        super('ul', 'calendar');
    }

    pushYear(year) {
        this.years.push(year);
    }

    createDates() {
        let calendar = Object();
        for (let year in this.years) {
            calendar[year] = new Year(year);
            calendar[year].buildWeeks();
        }

        this.years = calendar;
    }

    build() {
        for (let year of Object.values(this.years)) {
            let listElement = new Element('li');
            let yrElement = new YearElement(year);

            listElement.push(yrElement);
            this.push(listElement);

            let weeks = year.get('weeks');
            for (let month of year.timeElements) {
                listElement = new Element('li');
                let mthElement = new MonthElement(month);

                listElement.push(mthElement);
                yrElement.push(listElement);

                for (let week of Object.values(weeks.timeElements)) { // building a year at calendar only on weeks ?
                    let wkElement = new WeekElement(week);
                    listElement = new Element('li');
                    listElement.push(wkElement);
                }
            }
        }
    }

    check(day) {
        return day.getDay() === 0;
    }

    test() {
        this.pushYear(2020);
        this.pushYear(2021);
        this.createDates();
        this.build();
    }
}

class YearElement extends Element {
    yearObj;
    headElement = super.create('h5');
    head_content = {
        title: 'Jahr',
        value: null
    };

    constructor(year) {
        super('ul', 'year');
        this.head_content.value = year.stamp.getFullYear();
        this.yearObj = year;
    }

    build() {
        let yearElement = super.create('ul', 'year');
        yearElement.buildHead(this.headElement, this.head_content);
    }
}

class MonthElement extends Element {
    monthObj;
    headElement = super.create('h5');
    head_content = {
        title: 'Monat',
        value: null
    };

    constructor(month) {
        super('ul', 'month');
        this.head_content.value = month.stamp.getMonth();
        this.monthObj = month;
    }

    build() {
        super.buildHead(this.headElement, this.head_content);
    }

    buildHead(head, content) {
        head.innerText =  content.title + ' ' + monthInYear[content.value];
    }
}

class WeekElement extends Element {
    weekObj;
    headElement = super.create('h5');
    head_content = {
        title: 'KW',
        value: null
    };

    constructor(week = null) {
        super('ul', 'week');

        if (week instanceof Week) {
            this.weekObj = week;
            this.head_content.value = week.KW;
            this.build();
        }
    }

    build() {
        super.add(Array('week', 'col-7'));

        for (let day of Object.values(this.weekObj.timeElements)) {
            let dyElement = new DayElement(day);
            this.push(dyElement);
        }
        this.move();

        if (this.head_content.value)
            this.buildHead(this.headElement, this.head_content);
    }

    push(day) {
        let listElement = new Element('li');
        listElement.push(day);
        super.push(listElement);
        // if (this.check(this.element)) this.complete();
    }

    check(element) {
        return element.children.length === 7;
    }

    move() {
        let element = $(this.element).find('.wd-0').parent();
        $(element).detach();
        super.push(element);
    }

    complete() {
        let div = new Element('div');
        div.add('col-2');

        let content = Object(this);
        super.empty();
        super.push(content);
        super.push(div);
    }
}

class DayElement extends Element{
    dayObj;
    headElement = super.create('h6');
    head_content = {
        title: null,
        value: null
    };

    constructor(day) {
        super('ul', 'day');
        this.dayObj = day;
        this.head_content.title = day.dayInWeek;
        this.head_content.value = day.stamp.getDate();
    }

    build() {
        this.buildHead(this.headElement, this.head_content)
        super.add('wd-' + this.dayInWeek);

        super.set('id', 'd-' +
            this.dayObj.stamp.getFullYear() + '_' +
            this.dayObj.stamp.getMonth() + '_' +
            this.dayObj.stamp.getDate()
        );
    }

    buildHead(head, content) {
        head.innerText = daysOfWeek[content.title] + ' ' + content.value;
    }
}

let daysOfWeek = ['So','Mo','Di','Mi','Do','Fr','Sa'];
let monthInYear = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
