import { toRender } from "../assets/util.js";
import {
  currentFunctionToLoadData,
  elementsPerPage,
  paginationLimit,
} from "./main.js";

function renderCards(data, buttonCallback) {
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
  row.innerHTML = html;
}
function renderPagination(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // Limpiar cualquier contenido existente

  const nav = document.createElement("nav");
  const ul = document.createElement("ul");
  ul.classList.add("pagination", "pagination-lg", "flex-wrap");

  const previousButton = createPageButton(
    "Previous",
    currentPage > 1 ? currentPage - 1 : 1,
    currentPage,
    totalPages
  );

  ul.appendChild(previousButton);
  nav.appendChild(ul);
  paginationContainer.appendChild(nav);

  const startPage = Math.max(1, currentPage - Math.floor(paginationLimit / 2));
  const endPage = Math.min(totalPages, startPage + paginationLimit - 1);

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createPageButton(i, i, currentPage, totalPages);
    ul.appendChild(pageButton);
  }

  const nextButton = createPageButton(
    "Next",
    currentPage < totalPages ? currentPage + 1 : totalPages,
    currentPage,
    totalPages
  );
  ul.appendChild(nextButton);
}

function createPageButton(label, pageNumber, currentPage, totalPages) {
  const pageItem = document.createElement("li");
  pageItem.classList.add("page-item");
  if (currentPage === pageNumber && label !== "Previous" && label !== "Next") {
    pageItem.classList.add("active");
  }
  const pageLink = document.createElement("a");
  pageLink.classList.add("page-link");
  pageLink.textContent = label;
  pageLink.href = "#"; // Puedes cambiar esto si quieres enlaces reales
  if (label === "Previous") {
    pageLink.id = "btnPrevious";

    currentPage === 1
      ? pageLink.classList.add("disabled")
      : pageLink.classList.remove("disabled");
  } else if (label === "Next") {
    pageLink.id = "btnNext";

    currentPage === totalPages
      ? pageLink.classList.add("disabled")
      : pageLink.classList.remove("disabled");
  }
  pageLink.addEventListener("click", async (event) => {
    event.preventDefault();
    renderPage(pageNumber);
  });

  pageItem.appendChild(pageLink);
  return pageItem;
}

export async function renderPage(currentPage) {
  let obj = await currentFunctionToLoadData(currentPage, elementsPerPage);
  const totalPages = obj.pagination.total_pages;

  renderCards(toRender(obj));

  renderPagination(totalPages, currentPage);

  console.log(obj);
}

export async function renderDetails() {}
