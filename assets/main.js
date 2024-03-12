// const url = "https://api.artic.edu/api/v1/artworks/129884/manifest.json";
var pagination = 2;
var limit = "limit=9";
const fields_url = "fields=id,title,image_id,artist_display,date_display";
const base_url = "https://api.artic.edu/api/v1/artworks";
const url =
  base_url +
  "/search?query[exists][field]=image_id" +
  "&" +
  "page=" +
  pagination +
  "&" +
  limit +
  "&" +
  fields_url;

async function getArtworks() {
  let response = await fetch(url, {
    headers: {
      "AIC-User-Agent": "personal-project (alejandro7120@gmail.com)",
    },
  });

  try {
    if (!response.ok) {
      throw new Error("Error: " + response.status);
    }
    return await response.json();
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation: '" + error + "'"
    );
  }
}

async function renderArtworks() {
  let artworks = await getArtworks();
  let baseImageEndPoint = artworks.config.iiif_url + "/";
  let paramsImageEndPoint = "/full/843,/0/default.jpg";
  let html = "";

  let counter = 0;
  let htmlSegment = "";
  artworks.data.forEach((element) => {
    if (counter % 3 == 0) {
      htmlSegment +=
        '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">';
    }

    htmlSegment += `
        <div class="col">
          <div class="card shadow-sm">
            ${
              element.image_id
                ? `<img src="${
                    baseImageEndPoint + element.image_id + paramsImageEndPoint
                  }" class="card-img-top img-fluid" ></img>`
                : ""
            }
            
            <div class="card-body">
              <h5 class="card-title">
                ${element.title}
              </h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">
                ${element.artist_display}
              </h6>
              
              <div
                class="d-flex justify-content-between align-items-center"
              >
                <div class="btn-group">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary"
                  >
                    View
                  </button>
                </div>
                <small class="text-body-secondary">Created in ${element.date_display }</small>
              </div>
            </div>
          </div>
        </div>`;

    counter++;
    if (counter % 3 == 0) {
      htmlSegment += `
      </div>`;
    }
  });
  html += htmlSegment;
  console.log(artworks);
  let row = document.getElementById("container");
  row.innerHTML = html;
}

renderArtworks();
