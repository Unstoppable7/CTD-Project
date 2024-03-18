import { loadDataArtworks, loadDataArtwork} from '../models/artwork.js';
import { renderPage } from '../assets/dom.js';

// export var currentFunctionToLoadData;
export const elementsPerPage = 9;
export const paginationLimit = 5;

( async function main(){
  var currentPage = 1;

  // currentFunctionToLoadData = loadDataArtworks;

  await renderPage(currentPage);
  

})();

