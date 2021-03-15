class Calendar {
    elements = Object;
    years = Array();

    constructor() {
        this.push(this.create('ul', 'calendar'));
    }

    push(element) {
        this.elements.assign(element);
    }

    create(tName, cName) {
        return new Element(tName, cName);
    }

    pushYear(year) {
        this.years.push(year);
    }

    createDates() {
        let calendar = Object();
        for (let year in this.years)
            calendar[year] = new Year(year);

        this.years = calendar;
    }

    build() {
        for (let year of this.years.timeElements) {
            let listElement = this.create('li');
            let yrElement = new YearElement(year);

            listElement.append(yrElement);
            this.push(listElement);

            for (let month of year.timeElements) {
                listElement = this.create('li');
                let mthElement = new MonthElement(month);

                listElement.append(mthElement);
                yrElement.push(listElement);

                this.years.buildWeeks();
                let weeks = this.years.get('weeks');
                let wkElement = new WeekElement(weeks[month.stamp.getWeekNumber()]);
                for (let day of month.timeElements) {
                    listElement = this.create('li');
                    listElement.append(wkElement);

                    let dyElement = new DayElement(day);
                    listElement = this.create('li');
                    listElement.append(dyElement);
                    wkElement.push(listElement);

                    if (this.check(day.stamp)) {
                        listElement.append(mthElement);
                        listElement = this.create('li');
                        wkElement = new WeekElement(weeks[day.stamp.getWeekNumber()]);
                    }
                }
            }
        }
    }

    check(day) {
        return day.getDay() === 0;
    }
}

class Element {
    element;
    classes = Array();

    constructor(tName, cName = null) {
        this.element = document.createElement(tName);
        this.classes.add(Array(cName))
    }

    create(tName, cName) {
        return new Element(tName, cName);
    }

    get() {
        return this.element;
    }

    add(names) {
        for (let cName of names)
            this.classes.push(cName);
    }

    set(attr, value) {
        this.element.attr(attr, value);
    }

    push(element) {
        this.element.append(element.get());
    }

    fill(content) {
        this.element.html(content);
    }

    buildHead(head, content) {
        head.innerText =  content.title + ' ' + content.value;
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

            if (week.stamp)
                this.head_content.value = week.stamp.getWeekNumber();
        }
    }

    build() {
        super.add(Array('week', 'col-7'));
        if (this.head_content.value)
            this.buildHead(this.headElement, this.head_content);
    }

    push(day) {
        this.element.append(day.get());
        if (this.check(this.element)) this.complete();
    }

    check(element) {
        return element.children.length === 7;
    }

    complete() {
        let div = document.createElement('div');
        div.className = 'col-2';
        super.append(div);
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
