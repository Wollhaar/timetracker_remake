class Calendar {
    elements = Array();

    constructor() {
        this.elements.push(this.create('ul', 'calendar'));
    }

    create(tName, cName) {
        return new Element(tName, cName);
    }

    build(timeElement, headName, time) {
        let element = this.create('ul');

        if (timeElement === 'year') {
            let head = this.create('h5'); // TODO: Title for Year, Month, Day
            head.innerHTML = + headName + ' ' + time;
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

    addClass(className) {
        this.className = className; // TODO: outsourcing in another class for own Objects
    }

    buildYear(year) {
        // Bau eines Jahres
        let yearElement = this.build('year', 'Jahr', year);
        let dateObj = new Year(year);


        // building a month
        for (let i = 0; i < 12; i++) {
            dateObj.setMonth(i);
            let month = this.buildMonth(dateObj);

            let li = this.create('li');
            li.append(month);

            // yearElement.append(li);
        }

        return yearElement;
    }


    buildMonth(date) {
        let monthElement = this.build('month', 'Monat' + date.getMonth());

        let dayInMonth = date.getDate();
        let dayInWeek_L = date.getDay();
        let lastDay = lastDayOfMonth(date);

        do {
            let week = this.buildWeek();
            let days = this.countDays(dayInWeek_L);

            monthElement.append(week);
            for (let i = 1; i <= days; i++) {
                if (i >= days) dayInWeek_L = 0;

                let dayData = 'd-' + date.getFullYear() + '-' + date.getMonth() + '-' + dayInMonth;
                let dayHead = document.createElement('h6');

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

// Bau einer Woche
    buildWeek() {
        let week = document.createElement('ul');
        let li = document.createElement('li');
        week.className = 'week col-7';

        for (let i = 1; i < 7; i++) {
            week.append(this.buildDay(i));
        }
        week.append(this.buildDay(0));
        li.append(week);

        return week;
    }

    buildDay() {
        let day = document.createElement('ul');
        let liD = document.createElement('li');
        liD.className = 'col-1';
        day.className = 'wd-' + this.dayInWeek;

        liD.append(day);
        return liD;
    }

    countDays(day) {
        if (day === 0) return 1;
        let num = parseInt(((day - 8) + '').substr(1));
        return isNaN(num) ? 0 : num;
    }
}

class Element {
    element;

    constructor(tName, cName) {
        this.element = document.createElement(tName);
        element.addClass(cName)
        return element;
    }

}