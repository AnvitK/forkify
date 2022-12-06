import icons from 'url:../../img/icons.svg';

export default class View {
    _data;

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (eg. recipe)
     * @param {boolean} [render=true] If render=false, create markup string instead of rendering to the DOM
     * @returns {undefined | string}  If render=false, a markup string is returned
     * @this {Object} View instance
     * @author Anvit Kamble
     */

    render(data, render = true) {
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const currElements = Array.from(this._parentElement.querySelectorAll('*'));
        // console.log(currElements);
        // console.log(newElements);

        newElements.forEach((newEle, i) => {
            const currEle = currElements[i];
            // console.log(newEle, currEle, newEle.isEqualNode(currEle));
            
            // update changed texts
            if(!newEle.isEqualNode(currEle) && newEle.firstChild?.nodeValue.trim() !== '') {
                // console.log('😸😄', newEle.firstChild.nodeValue.trim());
                currEle.textContent = newEle.textContent;
            }

            // update changed attributes
            if(!newEle.isEqualNode(currEle)) {
                Array.from(newEle.attributes).forEach((attr) => currEle.setAttribute(attr.name, attr.value));
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner = () => {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${ icons }#icon-loader"></use>
                </svg>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };

    renderError = (msg = this._errorMsg) => {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${ icons }#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMsg = (msg = this._successMsg) => {
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${ icons }#icon-smile"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}