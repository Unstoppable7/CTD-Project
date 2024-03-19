import {
  getImageByArtwork,
} from "./API/api.js";

export async function loadDataCardListPage(obj, elementsPerPage) {
  let data = [];
  let currentData;

  for (const element of obj.data) {
    let img_url = await getImageByArtwork(obj, element.image_id);

    if (!img_url) {
      continue;
    } else {
      data.push({
        data: element,
        img_url: img_url,
      });
    }

    if (data.length == elementsPerPage) {
      break;
    }
  }

  currentData = {
    elements: data,
    pagination: obj.pagination,
  };

  return currentData;
}

export async function loadDataCardDetails(obj) {

  let img_url = await getImageByArtwork(obj, obj.data.image_id);
  return {
    data: obj.data,
    img_url: img_url,
  };
}

export async function loadDataCardListSection(obj) {
  let data = [];

  for (const element of obj.data) {
    let img_url = await getImageByArtwork(obj, element.image_id);
    data.push({
      data: element,
      img_url: img_url,
    });
  }

  return data;
}
