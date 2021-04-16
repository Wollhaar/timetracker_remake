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
        for (let year of this.years.reverse())
            calendar[year] = new Year(year, 'weeks', true);

        this.years = calendar;
    }

    build() {
        for (let year of Object.values(this.years)) {
            let yrElement = new YearElement(year);

            for (let week of Object.values(year.get('weeks'))) {
                let wkElement = new WeekElement(week);
                wkElement.build();
                yrElement.push(wkElement);
                yrElement.pushObj(wkElement);
            }

            this.push(yrElement);
            this.pushObj(yrElement);
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
    listElement = new Element('li');
    headElement = super.create('h5');
    head_content = {
        title: 'Jahr',
        value: null
    };

    constructor(year) {
        super('ul', 'year');
        this.head_content.value = year.stamp.getFullYear();
        this.yearObj = year;
        this.setId('y_' + year.stamp.getFullYear());
    }

    build() {
        let yearElement = super.create('ul', 'year');
        yearElement.buildHead(this.headElement, this.head_content);
        this.listElement.push(yearElement);
        this.pushObj(yearElement);
    }
}

class MonthElement extends Element {
    monthObj;
    listElement = new Element('li');
    headElement = super.create('h5');
    head_content = {
        title: 'Monat',
        value: null
    };

    constructor(month) {
        super('ul', 'month');
        this.head_content.value = month.stamp.getMonth();
        this.monthObj = month;
        this.setId('m_' + month.stamp.getMonth() + '-' + month.stamp.getFullYear());
    }

    buildHead(head, content) {
        head.innerText =  content.title + ' ' + monthInYear[content.value];
    }

    build() {
        super.buildHead(this.headElement, this.head_content);
        // super.pushObj(this.get());
        this.listElement.push(this.get());
    }
}

class WeekElement extends Element {
    weekObj;
    listElements = Array();
    headElement = super.create('h5');
    head_content = {
        title: 'KW',
        value: null
    };

    constructor(week = null) {
        super('ul', 'week');

        if (week instanceof Week) {
            this.weekObj = week;
            this.head_content.value = week.WN;
            this.setId('wn_' + week.stamp.getWeekNumber() + '-' + week.stamp.getFullYear());
            this.build();
        }
        else this.setId('wn_' + unique());
    }

    build() {
        super.add(Array('week', 'col-7'));

        if (this.head_content.value) {
            this.buildHead(this.headElement, this.head_content);
            this.fill(this.headElement);
        }

        for (let day of Object.values(this.weekObj.timeElements)) {
            let dyElement = new DayElement(day);
            this.push(dyElement);
        }
        this.move();
    }

    push(day) {
        this.pushObj(day);
        let liEl = new Element('li');
        liEl.push(day);
        this.listElements.push(liEl);
        // this.listElement = new Element('li');
        // if (this.check(this.element)) this.complete();
    }

    get() {
        return this.listElements;
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
    listElement = Array();
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

        super.setId('d-' +
            this.dayObj.stamp.getFullYear() + '_' +
            this.dayObj.stamp.getMonth() + '_' +
            this.dayObj.stamp.getDate()
        );

        this.build();
    }

    build() {
        this.buildHead(this.headElement, this.head_content);
        this.fill(this.headElement);
        console.log(this.headElement);
        console.log(this.element);
        super.add('wd-' + this.dayInWeek);
    }

    buildHead(head, content) {
        this.headElement.innerText = daysOfWeek[content.title] + ' ' + content.value;
    }
}

let daysOfWeek = ['So','Mo','Di','Mi','Do','Fr','Sa'];
let monthInYear = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
