import { Model } from '../assets/util.js';

const headers = {
  headers: {
    "AIC-User-Agent": "personal-project (alejandro7120@gmail.com)",
  },
};

async function getAPI({url, headers, model}) {
  let response = await fetch(url, headers);
  try {
    if (!response.ok) {
      return null;
    }
    if(model === Model.ArtworkImage){
      return response;
    }else{
      return await response.json();
    }
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation: '" + error + "'"
    );
  }
}
//https://api.example.com/data?page=2&limit=100&after=lastId
export async function getArtworks(currentPage) {
  var limit = "limit=50";
  const fields_url = "fields=id,title,image_id,artist_display,date_display";
  const base_url = "https://api.artic.edu/api/v1/artworks";
  const url =
    base_url +
    "/search?query[exists][field]=image_id" +
    "&" +
    "page=" +
    currentPage +
    "&" +
    limit +
    "&" +
    fields_url;

  let response = await getAPI({url:url, headers:headers, model:Model.Artwork});
  if(!response){
    throw new Error("Error getArtworks(): " + response);
  }else{
    return response;
  }
}

//TODO change name
export async function getImageByArtwork(artworks, image_id) {
  let baseImageEndPoint = artworks.config.iiif_url + "/";
  let paramsImageEndPoint = "/full/843,/0/default.jpg";
  
  let response = await getAPI({url:baseImageEndPoint + image_id + paramsImageEndPoint, model:Model.ArtworkImage});
  if(!response){
    return null;
  }else{
    return response.url;
  }
}

export async function getArtwork(id){
  const base_url = "https://api.artic.edu/api/v1/artworks/";
  const fields_url = "fields=title,image_id,credit_line,description,place_of_origin,artist_titles,date_display,artist_ids";
  const url =
    base_url +
    id +
    "?" +
    fields_url;

  let response = await getAPI({url:url, headers:headers, model:Model.Artwork});
  if(!response){
    throw new Error("Error getArtworks(): " + response);
  }else{
    return response;
  }
}
