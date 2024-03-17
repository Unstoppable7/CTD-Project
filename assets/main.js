import { loadData, currentData } from '../models/artwork.js';
import { renderCard } from '../assets/dom.js';
import { toRender, Model } from '../assets/util.js';

const elementsPerPage = 9;

( async function test(){

  await loadData(1,elementsPerPage);

  renderCard(toRender(Model.Artwork, currentData,elementsPerPage));
  console.log(currentData);
})();
