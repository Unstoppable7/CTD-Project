import { Entity } from "../assets/util.js";

const headers = {
  headers: {
    "AIC-User-Agent": "personal-project (alejandro7120@gmail.com)",
  },
};

async function getAPI({ url, headers, model }) {
  let response = await fetch(url, headers);
  try {
    if (!response.ok) {
      return null;
    }
    if (model === Entity.ArtworkImage) {
      return response;
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation: '" + error + "'"
    );
  }
}

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

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Artwork,
  });
  if (!response) {
    throw new Error("Error getArtworks(): " + response);
  } else {
    return response;
  }
}

export async function getImageByArtwork(artworks, image_id) {
  let baseImageEndPoint = artworks.config.iiif_url + "/";
  let paramsImageEndPoint = "/full/843,/0/default.jpg";

  let response = await getAPI({
    url: baseImageEndPoint + image_id + paramsImageEndPoint,
    model: Entity.ArtworkImage,
  });
  if (!response) {
    return null;
  } else {
    return response.url;
  }
}

export async function getArtwork(id) {
  const base_url = "https://api.artic.edu/api/v1/artworks/";
  const fields_url =
    "fields=title,image_id,credit_line,description,place_of_origin,artist_titles,date_display,artist_ids";
  const url = base_url + id + "?" + fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Artwork,
  });
  if (!response) {
    throw new Error("Error getArtworks(): " + response);
  } else {
    return response;
  }
}

export async function getExhibitions(currentPage) {
  var limit = "limit=50";
  const fields_url = "fields=id,title,image_id,short_description,status";
  const base_url = "https://api.artic.edu/api/v1/exhibitions";
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

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Exhibition,
  });
  if (!response) {
    throw new Error("Error getExhibitions(): " + response);
  } else {
    return response;
  }
}

export async function getExhibition(elementId) {
  const base_url = "https://api.artic.edu/api/v1/exhibitions/";
  const fields_url =
    "fields=title,image_id,short_description,gallery_title,artwork_ids,artwork_titles";
  const url = base_url + elementId + "?" + fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Exhibition,
  });
  if (!response) {
    throw new Error("Error getExhibition(): " + response);
  } else {
    return response;
  }
}

// https://api.artic.edu/api/v1/artworks?ids=190827,272153
export async function getArtworksByExhibition(artwork_ids) {
  const base_url = "https://api.artic.edu/api/v1/artworks";
  const fields_url = "fields=id,title,image_id,artist_display,date_display";
  const url = base_url + "?ids=" + artwork_ids.join(",") + "&" + fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Artwork,
  });
  if (!response) {
    throw new Error("Error getArtworksByExhibition(): " + response);
  } else {
    return response;
  }
}

export async function getArtists(currentPage, elementsPerPage) {
  var limit = "limit=" + elementsPerPage;
  const fields_url =
    "fields=id,title,birth_date,death_date,updated_at,is_artist";
  const base_url = "https://api.artic.edu/api/v1/agents";
  const url =
    base_url +
    "/search?query[match][is_artist]=true" +
    "&" +
    "page=" +
    currentPage +
    "&" +
    limit +
    "&" +
    fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Artist,
  });
  if (!response) {
    throw new Error("Error getArtists(): " + response);
  } else {
    return response;
  }
}

export async function getArtist(elementId) {
  const base_url = "https://api.artic.edu/api/v1/agents/";
  const fields_url = "fields=id,title,birth_date,death_date,description";
  const url = base_url + elementId + "?" + fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Artist,
  });
  if (!response) {
    throw new Error("Error getArtist(): " + response);
  } else {
    return response;
  }
}

export async function getArtworksByArtist(artist_id) {
  const base_url = "https://api.artic.edu/api/v1/artworks";
  const fields_url =
    "fields=id,title,image_id,artist_display,date_display,artist_ids";
  const url =
    base_url +
    "/search?query[match][artist_id]=" +
    artist_id +
    "&" +
    fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Artwork,
  });
  if (!response) {
    throw new Error("Error getArtworksByExhibition(): " + response);
  } else {
    return response;
  }
}

export async function getArtworkSearch(currentPage, query){
  var limit = "limit=9";
  const fields_url = "fields=id,title,image_id,artist_display,date_display";
  const base_url = "https://api.artic.edu/api/v1/artworks";
  const url =
    base_url +
    "/search?q=" +
    query +
    "&" +
    "page=" +
    currentPage +
    "&" +
    limit +
    "&" +
    fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Artwork,
  });
  if (!response) {
    throw new Error("Error getArtworkSearch(): " + response);
  } else {
    return response;
  }
}

export async function getExhibitionSearch(currentPage, query){
  var limit = "limit=9";
  const fields_url = "fields=id,title,image_id,short_description,status";
  const base_url = "https://api.artic.edu/api/v1/exhibitions";
  const url =
    base_url +
    "/search?q=" +
    query +
    "&" +
    "page=" +
    currentPage +
    "&" +
    limit +
    "&" +
    fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Exhibition,
  });
  if (!response) {
    throw new Error("Error getExhibitionSearch(): " + response);
  } else {
    return response;
  }
}

export async function getArtistSearch(currentPage, query){
  var limit = "limit=27";
  const fields_url = "fields=id,title,birth_date,death_date,updated_at,is_artist";
  const base_url = "https://api.artic.edu/api/v1/artists";
  const url =
    base_url +
    "/search?q=" +
    query +
    "&" +
    "page=" +
    currentPage +
    "&" +
    limit +
    "&" +
    fields_url;

  let response = await getAPI({
    url: url,
    headers: headers,
    model: Entity.Exhibition,
  });
  if (!response) {
    throw new Error("Error getArtistSearch(): " + response);
  } else {
    return response;
  }
}