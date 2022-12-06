import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerCLick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');

            if(!btn) return;

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

    _generateMarkup() {
        const currPage = this._data.page;
        const noPages = Math.ceil(this._data.results.length / this._data.resultsPerpage);
        

        // page 1 and other pages present
        if(currPage === 1 && noPages > 1) {
            return this._generateMarkupBtn(currPage + 1, 'next', 'right');
        }

        // last page
        if(currPage == noPages && noPages > 1) {
            return this._generateMarkupBtn(currPage - 1, 'prev', 'left')
        }

        // in between pages
        if(currPage < noPages) {
            return this._generateMarkupBtn(currPage + 1, 'next', 'right') + this._generateMarkupBtn(currPage - 1, 'prev', 'left'); 
        }

        // page 1 and no other pages
        return '';
    }

    _generateMarkupBtn(currPage, btnNextPrev, arrowLeftRight) {
        return `
                <button data-goto="${ currPage }" class="btn--inline pagination__btn--${ btnNextPrev }">
                    <span>Page ${ currPage }</span>
                    <svg class="search__icon">
                        <use href="${ icons }#icon-arrow-${ arrowLeftRight }"></use>
                    </svg>
                </button>
            `;
    }
}

export default new PaginationView();
