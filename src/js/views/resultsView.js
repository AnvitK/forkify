import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsViews extends View {
    _parentElement = document.querySelector('.results');
    _errorMsg = 'No recipes found for your query! Please try again!!';
    _successMsg = ''

    _generateMarkup() {
        return this._data.map(result => previewView.render(result, false)).join('');
    }
}

export default new ResultsViews();