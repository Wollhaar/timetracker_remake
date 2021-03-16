class Element {
    element;
    classes = Array();

    constructor(tName, cName = null) {
        this.element = document.createElement(tName);
        this.add(Array(cName))
    }

    create(tName, cName) {
        return new Element(tName, cName);
    }

    get() {
        return this.element;
    }

    getHTML() {
        return this.element.outerHTML;
    }

    add(names) {
        if (typeof names === 'string')names = names.split(' ');
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
        this.element.innerHTML = content;
    }

    empty() {
        this.element.innerHTML = "";
    }

    buildHead(head, content) {
        head.innerText =  content.title + ' ' + content.value;
    }
}