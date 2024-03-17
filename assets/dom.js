export async function renderCard(data, buttonCallback) {
  let html = "";
  let htmlSegment = "";
  let counter = 0;
  while (counter < data.length) {

    if (counter % 3 == 0) {
      htmlSegment +=
        '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">';
    }
    htmlSegment += `
        <div class="col">
          <div class="card shadow-sm">
              <img src="${data[counter].img_url}" class="card-img-top img-fluid" ></img>
            <div class="card-body">
              <h5 class="card-title">
                ${data[counter].title}
              </h5>
              <h6 class="card-subtitle mb-2 text-body-secondary">
                ${data[counter].subtitle}
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
                <small class="text-body-secondary">Created in ${data[counter].smallElement}</small>
              </div>
            </div>
          </div>
        </div>`;

    counter++;
    if (counter % 3 == 0) {
      htmlSegment += `
      </div>`;
    }
  }
  html += htmlSegment;
  let row = document.getElementById("container");
  row.insertAdjacentHTML('afterbegin',html);
}