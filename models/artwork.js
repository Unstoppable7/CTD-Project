import { getArtworks, getImageByArtwork } from "../API/api.js";

export var currentData;

export async function loadData(pagination, dataLength) {
  let artworks = await getArtworks(pagination);
  let data = [];

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

  currentData = {
    elements: data,
    pagination: artworks.pagination,
  };
}
