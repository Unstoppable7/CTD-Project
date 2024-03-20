import {
  goToArtworks,
  goToArtworkDetails,
  goToExhibitions,
  goToExhibitionDetails,
  goToArtists
} from "./controller.js";

import {
  elementsPerPage as exhibitionElementsPerPage,
  paginationLimit as exhibitionPaginationLimit,
} from "../models/exhibition.js";
import {
  elementsPerPage as artworkElementsPerPage,
  paginationLimit as artWorkPaginationLimit,
  
} from "../models/artwork.js";

import {
  elementsPerPage as artistElementsPerPage,
  paginationLimit as artistPaginationLimit,
  
} from "../models/artist.js";

import {
  loadDataCardListPage,
  loadDataCardDetails,
  loadDataCardListSection,
} from "../dataManagement.js";

import {
  getArtworks,
  getArtwork,
  getExhibitions,
  getExhibition,
  getArtworksByExhibition,
  getArtists,
} from "../API/api.js";

function renderArtworkCards(data) {
  let html = document.createElement("div");
  html.classList.add(
    "row",
    "row-cols-1",
    "row-cols-sm-2",
    "row-cols-md-3",
    "g-3"
  );

  data.elements.forEach((item) => {
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
    title.textContent = item.data.title;

    let subtitle = document.createElement("h6");
    subtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    subtitle.textContent = item.data.artist_display;

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
      goToArtworkDetails(item.data.id);
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary");
    small.textContent = `Created in ${item.data.date_display}`;

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

function renderPagination(
  totalPages,
  currentPage,
  buttonCallback,
  paginationLimit
) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const nav = document.createElement("nav");
  const ul = document.createElement("ul");
  ul.classList.add("pagination", "pagination-lg", "flex-wrap");

  const previousButton = createPaginationButton(
    "Previous",
    currentPage > 1 ? currentPage - 1 : 1,
    currentPage,
    totalPages,
    buttonCallback
  );

  ul.appendChild(previousButton);
  nav.appendChild(ul);
  paginationContainer.appendChild(nav);

  const startPage = Math.max(1, currentPage - Math.floor(paginationLimit / 2));
  const endPage = Math.min(totalPages, startPage + paginationLimit - 1);

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createPaginationButton(
      i,
      i,
      currentPage,
      totalPages,
      buttonCallback
    );
    ul.appendChild(pageButton);
  }

  const nextButton = createPaginationButton(
    "Next",
    currentPage < totalPages ? currentPage + 1 : totalPages,
    currentPage,
    totalPages,
    buttonCallback
  );
  ul.appendChild(nextButton);
}

function createPaginationButton(
  label,
  pageNumber,
  currentPage,
  totalPages,
  buttonCallback
) {
  const pageItem = document.createElement("li");
  pageItem.classList.add("page-item");
  if (currentPage === pageNumber && label !== "Previous" && label !== "Next") {
    pageItem.classList.add("active");
  }
  const pageLink = document.createElement("a");
  pageLink.classList.add("page-link");
  pageLink.textContent = label;
  pageLink.href = "#";
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
    buttonCallback(pageNumber);
  });

  pageItem.appendChild(pageLink);
  return pageItem;
}

export async function renderArtworkCardListPage(currentPage) {
  let obj = await loadDataCardListPage(
    await getArtworks(currentPage),
    artworkElementsPerPage
  );
  const totalPages = obj.pagination.total_pages;

  renderArtworkCards(obj);

  renderPagination(
    totalPages,
    currentPage,
    goToArtworks,
    artWorkPaginationLimit
  );
}

export async function renderArtworkCardDetailsPage(elementId) {
  renderArtworkCardDetails(
    await loadDataCardDetails(await getArtwork(elementId))
  );
}

function renderArtworkCardDetails(obj) {
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.classList.add("btn", "btn-outline-light");
  backButton.id = "backToListBtn";
  backButton.textContent = "Back";

  backButton.addEventListener("click", function () {
    window.history.back();
  });

  const div = document.createElement("div");
  div.classList.add("pt-5", "my-5", "text-center");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("container", "px-5");
  div.appendChild(innerContainer);

  const image = document.createElement("img");
  image.src = obj.img_url;
  image.classList.add("img-fluid", "border", "rounded-3", "shadow-lg", "mb-4");
  image.alt = "Example image";
  image.loading = "lazy";
  innerContainer.appendChild(image);

  const title = document.createElement("h1");
  title.classList.add("display-4", "fw-bold", "text-body-emphasis");
  title.textContent = obj.data.title;
  div.appendChild(title);

  const meta = document.createElement("p");
  meta.classList.add("details-meta");

  const arrayDataLinks = obj.data.artist_titles.map(
    (value) => `<a href="#">${value}</a>`
  );

  const arrayDataString = arrayDataLinks.join(", ");

  meta.innerHTML =
    obj.data.place_of_origin +
    " - " +
    obj.data.date_display +
    " by " +
    arrayDataString;

  div.appendChild(meta);

  const shortText = document.createElement("p");
  shortText.classList.add("details-meta");
  shortText.textContent = obj.data.credit_line;
  div.appendChild(shortText);

  const description = document.createElement("p");
  description.classList.add("lead", "mb-4");
  description.innerHTML = obj.data.description;
  div.appendChild(description);

  let container = document.getElementById("container");
  container.innerHTML = "";
  container.appendChild(backButton);
  container.appendChild(div);
}

export async function renderExhibitionCardListPage(currentPage) {
  let obj = await loadDataCardListPage(
    await getExhibitions(currentPage),
    exhibitionElementsPerPage
  );
  const totalPages = obj.pagination.total_pages;

  renderExhibitionCards(obj);

  renderPagination(
    totalPages,
    currentPage,
    goToExhibitions,
    exhibitionPaginationLimit
  );
}

function renderExhibitionCards(data) {
  let html = document.createElement("div");
  html.classList.add(
    "row",
    "row-cols-1",
    "row-cols-sm-2",
    "row-cols-md-3",
    "g-3"
  );

  data.elements.forEach((item) => {
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
    title.textContent = item.data.title;

    let subtitle = document.createElement("h6");
    subtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    subtitle.textContent = item.data.short_description;

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
      goToExhibitionDetails(item.data.id);
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary");
    small.textContent = `${item.data.status}`;

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

export async function renderExhibitionCardDetailsPage(elementId) {
  let obj = await loadDataCardDetails(await getExhibition(elementId));
  renderExhibitionCardDetails(obj);

  console.log(obj);
}

function renderExhibitionCardDetails(obj) {
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.classList.add("btn", "btn-outline-light");
  backButton.id = "backToListBtn";
  backButton.textContent = "Back";

  backButton.addEventListener("click", function () {
    window.history.back();
  });

  const mainDiv = document.createElement("div");
  mainDiv.classList.add("pt-5", "my-5", "text-center");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("container", "px-5");
  mainDiv.appendChild(innerContainer);

  const image = document.createElement("img");
  image.src = obj.img_url;
  image.classList.add("img-fluid", "border", "rounded-3", "shadow-lg", "mb-4");
  image.alt = "Example image";
  image.loading = "lazy";
  innerContainer.appendChild(image);

  const title = document.createElement("h1");
  title.classList.add("display-4", "fw-bold", "text-body-emphasis");
  title.textContent = obj.data.title;
  mainDiv.appendChild(title);

  const meta = document.createElement("p");
  meta.classList.add("details-meta");
  meta.innerHTML = obj.data.gallery_title + " Gallery";
  mainDiv.appendChild(meta);

  // const arrayDataLinks = obj.data.artwork_titles.map((value) => {
  //   const link = document.createElement("a");
  //   link.addEventListener("click", function(event) {
  //     event.preventDefault();
  //     miFuncion();
  //   });
  //   link.textContent = value;
  //   return link;
  // });

  // arrayDataLinks.forEach((link) => {
  //   document.body.appendChild(link);
  // });

  // const arrayDataLinks = obj.data.artwork_titles.map(
  //   (value) => `<a href="">${value}</a>`
  // );

  // const arrayDataString = arrayDataLinks.join(", ");

  // const shortText = document.createElement("p");
  // shortText.classList.add("details-meta");
  // shortText.innerHTML = arrayDataString;
  // div.appendChild(shortText);
  renderArtworkCardListByExhibition(obj.data.artwork_ids);
  const description = document.createElement("p");
  description.classList.add("lead", "mb-4");
  description.innerHTML = obj.data.short_description;
  mainDiv.appendChild(description);

  const divider = document.createElement("hr");
  mainDiv.appendChild(divider);

  const artworksDiv = document.createElement("div");
  // artworksDiv.classList.add("pt-5", "my-5",);

  const artworksTitle = document.createElement("h4");
  artworksTitle.classList.add("display-8", "fw-bold", "text-body-emphasis");
  artworksTitle.textContent = "Artworks";
  artworksDiv.appendChild(artworksTitle);

  let container = document.getElementById("container");
  container.innerHTML = "";
  container.appendChild(backButton);
  container.appendChild(mainDiv);

  //TODO logic if exists artwors
  container.appendChild(artworksDiv);
}

export async function renderArtworkCardListByExhibition(artwork_ids) {
  let obj = await loadDataCardListSection(
    await getArtworksByExhibition(artwork_ids)
  );
  console.log(obj);
  renderArtworkCardsByExhibition(obj);
}

function renderArtworkCardsByExhibition(data) {
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
    title.textContent = item.data.title;

    let subtitle = document.createElement("h6");
    subtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    subtitle.textContent = item.data.artist_display;

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
      goToArtworkDetails(item.data.id);
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary");
    small.textContent = `Created in ${item.data.date_display}`;

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
  container.appendChild(html);
}

export async function renderArtistListPage(currentPage) {
  let obj = await getArtists(currentPage, artistElementsPerPage);

  const totalPages = obj.pagination.total_pages;

  renderArtistList(obj);

  renderPagination(
    totalPages,
    currentPage,
    goToArtists,
    artistPaginationLimit
  );
}

function renderArtistList(obj) {
  let html = document.createElement("div");
  html.classList.add(
    "row",
    "row-cols-1",
    "row-cols-sm-2",
    "row-cols-md-3",
    "g-3"
  );

  obj.data.forEach((item) => {
    let col = document.createElement("div");
    col.classList.add("col");

    let card = document.createElement("div");
    card.classList.add("card", "shadow-sm");

    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    let title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = item.title;

    let subtitle = document.createElement("h6");
    subtitle.classList.add("card-subtitle", "mb-2", "text-body-secondary");
    if(item.death_date){
      subtitle.textContent = item.birth_date + " - " + item.death_date;
    }else{
      subtitle.textContent = item.birth_date;
    }

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
      // goToArtworkDetails(item.data.id);
      //TODO
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary");
    small.textContent = `Updated at ${item.updated_at}`;

    buttonGroup.appendChild(button);
    divContainer.appendChild(buttonGroup);
    divContainer.appendChild(small);
    cardBody.appendChild(title);
    cardBody.appendChild(subtitle);
    cardBody.appendChild(divContainer);
    card.appendChild(cardBody);
    col.appendChild(card);
    html.appendChild(col);
  });

  let container = document.getElementById("container");
  container.innerHTML = "";
  container.appendChild(html);
}
