class Element {
    id;
    element;
    obj = Object();
    classes = Array();

    constructor(tName, cName = null) {
        this.element = document.createElement(tName);
        this.add(Array(cName))
    }

    create(tName, cName) {
        return new Element(tName, cName);
    }

    setId(id) {
        this.id = id;
        this.element.id = id;
        this[id] = this.obj;
    }

    get() {
        return this.element;
    }

    getHTML() {
        return this.element.outerHTML;
    }

    pushObj(obj) {
        this.obj = Object.assign(this.obj, obj);
    }

    getObj() {
        return this.obj;
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
        this.element.innerHTML = content.getHTML();
    }

    empty() {
        this.element.innerHTML = "";
    }

    buildHead(head, content) {
        head.innerText =  content.title + ' ' + content.value;
    }
}