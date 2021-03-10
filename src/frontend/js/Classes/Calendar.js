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
        for (let year in this.years) {
            calendar[year] = new Year(year);
        }
    }

    build(timeElement, headName, time) {
        let element = this.create('ul');

        if (timeElement === 'year') {
            let head = this.create('h5'); // TODO: Title for Year, Month, Day
        }
        else if (timeElement === 'month') {
            let head = this.create('h5'); // TODO: Title for Year, Month, Day
            head.innerHTML = + headName + ' ' + monthInYear[time];
        }
        else if (timeElement === 'day') {
            let head = this.create('h6'); // TODO: Title for Day; check for config of element and synchronize with HTMLElement
            head.innerHTML = + headName + ' ' + time;
        }

        element.append(head);
        element.className =  timeElement +
            ' _' + timeElement.substr(0, 1) + '-' + time + '_';

        return element;
    }

    buildIntoCalender() {

    }






    countDays(day) {
        if (day === 0) return 1;
        let num = parseInt(((day - 8) + '').substr(1));
        return isNaN(num) ? 0 : num;
    }
}

class Element {
    element;

    constructor(tName, cName = null) {
        this.element = document.createElement(tName);
        element.addClass(cName)
    }

    create(tName, cName) {
        return new Element(tName, cName);
    }

    get() {
        return this.element;
    }

    add(names) {
        for (let cName of names)
            this.element.addClass(cName);
    }

    set(attr, value) {
        this.element.attr(attr, value);
    }

    fill(content) {
        this.element.html(content);
    }

    buildHead(head, content) {
        head.innerText =  content.title + ' ' + content.value;
    }
}

class YearElement extends Element{
    headElement = super.create('h5');
    head_content = {
        title: 'Jahr',
        value: null
    };

    constructor(tName, cName, year) {
        super(tName, cName);
        this.head_content.value = year;
    }

    build(year) {
        // Bau eines Jahres
        let yearElement = super.create('ul', 'year');
        yearElement.buildHead(this.headElement, this.head_content);
        let dateObj = new Year(year);


        // building a month
        for (let i = 0; i < 12; i++) {
            dateObj.setMonth(i);
            let monthElement = new MonthElement(dateObj);
            monthElement.build(i, dateObj.getFullYear());

            let li = new Element('li');
            li.append(monthElement);

            // yearElement.append(li);
        }

        return yearElement;
    }
}

class MonthElement extends Element {
    headElement = 'h5';
    head_content = {
        title: 'Monat',
        value: null
    };

    constructor(tName, cName, month) {
        super(tName, cName);
        this.head_content.value = month;
    }

    build(month, year) {
        super.buildHead(this.headElement, this.head_content);
        let date = new Date();

        let dayInMonth = date.getDate();
        let dayInWeek_L = date.getDay();
        let lastDay = lastDayOfMonth(date);

        do {
            let weekElement = new WeekElement('ul', 'week');
            let week = weekElement.build();
            let days = this.countDays(dayInWeek_L);

            super.element.append(week);
            for (let i = 1; i <= days; i++) {
                if (i >= days) dayInWeek_L = 0;

                let dayData = 'd-' + date.getFullYear() + '_' + date.getMonth() + '_' + dayInMonth;
                let dayHead = new Element('h6', 'head');

                dayHead.innerText =
                    dayInWeek[dayInWeek_L] + ' ' + dayInMonth;
                $(week).find(".wd-" + dayInWeek_L).append(dayHead);

                $(week).find(".wd-" + dayInWeek_L).attr('id', dayData);
                dayInWeek_L++;
                if (lastDay === dayInMonth++) break;

            }
            let div = document.createElement('div');
            div.className = 'col-2';
            monthElement.append(div);
        } while (lastDay >= dayInMonth)

        return monthElement;
    }
}

class WeekElement extends Element {
    headElement = 'h5';
    head_content = {
        title: 'KW',
        value: null
    };

    constructor(tName, cName, KW = null) {
        super(tName, cName);
        this.head_content.value = KW;
    }

    // Bau einer Woche
    build() {
        let week = super.create('ul');
        let li = super.create('li');
        week.className = 'week col-7';

        for (let i = 1; i < 7; i++) {
            week.append(new DayElement('ul','day', i));
        }
        week.append(new DayElement('ul', 'day',0));
        li.append(week);

        return week;
    }
}

class DayElement extends Element{
    headElement = super.create('h6');
    head_content = {
        title: null,
        value: null
    };

    constructor(tName, cName, dayInMonth) {
        super(tName, cName);
        this.head_content.value = dayInMonth;
    }

    setHead(value, what) {
        this.head_content[what] = daysOfWeek[value];
    }

    build() {
        let li = new Element('li');
        li.add('col-1');

        super.buildHead(this.headElement, this.head_content)
        super.add('wd-' + this.dayInWeek);

        li.append(this.element);

        return li;
    }
}

let daysOfWeek = ['So','Mo','Di','Mi','Do','Fr','Sa'];
let monthInYear = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
