import { toRender, toRenderDetail } from "../assets/util.js";
import {
  // currentFunctionToLoadData,
  elementsPerPage,
  paginationLimit,
} from "./main.js";

import { loadDataArtworks, loadDataArtwork } from "../models/artwork.js";

function renderCards(data) {
  let html = document.createElement("div");
  html.classList.add(
    "row",
    "row-cols-1",
    "row-cols-sm-2",
    "row-cols-md-3",
    "g-3"
  );

  data.forEach((item) => {
    let col = document.createElement("div");
    col.classList.add("col");

    let card = document.createElement("div");
    card.classList.add("card", "shadow-sm");

    let img = document.createElement("img");
    img.classList.add("card-img-top", "img-fluid");
    img.src = item.img_url;

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = item.title;

    let subtitle = document.createElement("h6");
    subtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    subtitle.textContent = item.subtitle;

    let divContainer = document.createElement("div");
    divContainer.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );

    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-outline-secondary");
    button.textContent = "View";
    button.addEventListener("click", () => {
      renderDetailsPage(item.id);
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary");
    small.textContent = `Created in ${item.smallElement}`;

    buttonGroup.appendChild(button);
    divContainer.appendChild(buttonGroup);
    divContainer.appendChild(small);
    cardBody.appendChild(title);
    cardBody.appendChild(subtitle);
    cardBody.appendChild(divContainer);
    card.appendChild(img);
    card.appendChild(cardBody);
    col.appendChild(card);
    html.appendChild(col);
  });

  let container = document.getElementById("container");
  container.innerHTML = "";
  container.appendChild(html);
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
  let obj = await loadDataArtworks(currentPage, elementsPerPage);
  const totalPages = obj.pagination.total_pages;

  renderCards(toRender(obj));

  renderPagination(totalPages, currentPage);

  console.log(obj);
}

async function renderDetailsPage(id) {
  let obj = await loadDataArtwork(id);

  renderDetails(toRenderDetail(obj));
}

function renderDetails(data) {
  // relation_ids: obj.data.artist_ids,
  // img_url: obj.img_url,
  // title: obj.data.title,
  // description: obj.data.description,
  // date: obj.data.date_display,
  // array_data: obj.data.artist_titles
  // short_text: obj.data.credit_line,
  // place: obj.data.place_of_origin,

  // Crear el contenedor principal
  const div = document.createElement("div");
  div.classList.add("pt-5", "my-5", "text-center");

  // Crear el contenedor interno
  const innerContainer = document.createElement("div");
  innerContainer.classList.add("container", "px-5");
  div.appendChild(innerContainer);

  // Crear la imagen
  const image = document.createElement("img");
  image.src = data.img_url;
  image.classList.add("img-fluid", "border", "rounded-3", "shadow-lg", "mb-4");
  image.alt = "Example image";
  image.loading = "lazy";
  innerContainer.appendChild(image);

  // Crear el título
  const title = document.createElement("h1");
  title.classList.add("display-4", "fw-bold", "text-body-emphasis");
  title.textContent = data.title;
  div.appendChild(title);

  // Crear el párrafo para los metadatos
  const meta = document.createElement("p");
  meta.classList.add("details-meta");

  // Suponiendo que data.array_data es un array
  const arrayDataLinks = data.array_data.map(
    (value) => `<a href="#">${value}</a>`
  );

  // Luego, puedes unir los enlaces en una sola cadena separada por comas
  const arrayDataString = arrayDataLinks.join(", ");

  // Finalmente, puedes usar esta cadena en tu concatenación
  meta.innerHTML = data.place + " - " + data.date + " by " + arrayDataString;

  div.appendChild(meta);

  // Crear el párrafo para el texto corto
  const shortText = document.createElement("p");
  shortText.classList.add("details-meta");
  shortText.textContent = data.short_text;
  div.appendChild(shortText);

  // Crear el párrafo para la descripción
  const description = document.createElement("p");
  description.classList.add("lead", "mb-4");
  description.innerHTML = data.description;
  div.appendChild(description);

  let pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  let container = document.getElementById("container");
  container.innerHTML = "" ;
  container.appendChild(div);
}
