import { getArtworks, getArtwork, getImageByArtwork } from "../API/api.js";

export async function loadDataArtworks(currentPage, dataLength) {
  let artworks = await getArtworks(currentPage);
  let data = [];
  let currentDataArtworks;

  for (const element of artworks.data) {
    let img_url = await getImageByArtwork(artworks, element.image_id);
    
    if (!img_url) {
      continue;
    } else {
      data.push({
        data: element,
        img_url: img_url,
      });
    }
    
    if (data.length == dataLength) {
      break;
    }
  }
  
  currentDataArtworks = {
    elements: data,
    pagination: artworks.pagination,
  };

  console.log("current page: " + currentPage);
  return currentDataArtworks;

}

export async function loadDataArtwork(id) {
  let artwork = await getArtwork(id);
  let img_url = await getImageByArtwork(artwork, artwork.data.image_id);

  console.log(artwork);
  return {
    data: artwork.data,
    img_url: img_url,
  };
    
}