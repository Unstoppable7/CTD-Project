import { getArtworks, getImageByArtwork } from "../API/api.js";

// export var currentDataArtworks;

export async function loadDataArtworks(currentPage, dataLength) {
  let artworks = await getArtworks(currentPage);
  let data = [];
  let currentDataArtworks;

  for (const element of artworks.data) {
    let response = await getImageByArtwork(artworks, element.image_id);
    
    if (!response) {
      continue;
    } else {
      data.push({
        data: element,
        img_url: response,
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
