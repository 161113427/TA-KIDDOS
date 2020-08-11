class BottomBox extends HTMLElement {
    set value(data) {
        this._data = data;
        this.render();
    }
    render() {
        this.innerHTML = `<box class="py-3 d-flex bottom-box justify-content-center">
            <div class="mx-3 text-center col-12">
                <h3 class="app-title">
                    ${this._data.title}
                </h3>
                <div id="${this._data.id}-content">
                </div>
            </div>
        </box>`;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (!newValue)
            this[name] = newValue;
        this.render();
    }

    static getobservedAttributes() {
        return ["title", "id"];
    }
}


customElements.define("bottom-box", BottomBox);