import {
  goToArtworks,
  goToArtworkDetails,
  goToExhibitions,
  goToExhibitionDetails,
  goToArtists,
  goToArtistDetails,
  nextPaginationSearch,
} from "./controller.js";

import {
  elementsPerPage as exhibitionElementsPerPage,
  paginationLimit as exhibitionPaginationLimit,
} from "./entities/exhibition.js";
import {
  elementsPerPage as artworkElementsPerPage,
  paginationLimit as artWorkPaginationLimit,
} from "./entities/artwork.js";

import {
  elementsPerPage as artistElementsPerPage,
  paginationLimit as artistPaginationLimit,
} from "./entities/artist.js";

import {
  loadDataCardListPage,
  loadDataCardDetails,
  loadDataCardListSection,
} from "./dataManagement.js";

import {
  getArtworks,
  getArtwork,
  getExhibitions,
  getExhibition,
  getArtworksByExhibition,
  getArtists,
  getArtist,
  getArtworksByArtist,
  getArtworkSearch,
  getExhibitionSearch,
  getArtistSearch,
} from "./api.js";
import { NavbarPageIndex } from "./util.js";

const NO_RESULTS_TEXT = "No results found";
const NO_ARTWORKS_BY_EXHIBITION = "This exhibition has no assigned artworks";
const NO_ARTWORKS_BY_ARTIST = "This artist has no assigned artworks";
const ARTWORKS_BY_EXHIBITION_CONTAINER_ID = "container-artworksByExhibition";
const ARTWORKS_BY_ARTIST_CONTAINER_ID = "container-artworksByArtist";

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
      "align-items-center",
      "mt-4"
    );

    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-primary");
    button.textContent = "Details";
    button.addEventListener("click", () => {
      goToArtworkDetails(item.data.id);
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary", "text-end");
    small.textContent = item.data.date_display
      ? `Created in ${item.data.date_display}`
      : "";

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

  let containerCardList = document.getElementById("container");
  containerCardList.innerHTML = "";
  containerCardList.appendChild(html);
}

function renderPagination(
  totalPages,
  currentPage,
  buttonCallback,
  paginationLimit
) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.classList.add("mt-5");
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

function renderInputSearch(callback, formElementId, inputElementId) {
  const parentDiv = document.getElementById("navbar-linksContainer");

  const form = document.createElement("form");
  form.classList.add("d-flex");
  form.setAttribute("role", "search");
  form.id = formElementId;
  parentDiv.appendChild(form);

  const input = document.createElement("input");
  input.classList.add("form-control", "me-2");
  input.setAttribute("type", "search");
  input.setAttribute("placeholder", "Search");
  input.setAttribute("aria-label", "Search");
  input.id = inputElementId;
  form.appendChild(input);

  const button = document.createElement("button");
  button.classList.add("btn", "btn-outline-success");
  button.setAttribute("type", "submit");
  button.textContent = "Search";
  form.appendChild(button);

  const initialPage = 1;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTerm = input.value;

    callback(initialPage, searchTerm);
  });
}

export function renderNavBar(
  activePage,
  inputSearch = true,
  callback,
  formElementId,
  inputElementId
) {
  const header = document.querySelector("header");
  header.innerHTML = "";

  const nav = document.createElement("nav");
  nav.classList.add("navbar", "navbar-expand-lg", "bg-dark", "my-2");

  const containerFluid = document.createElement("div");
  containerFluid.classList.add("container-fluid");
  nav.appendChild(containerFluid);

  const brandLink = document.createElement("a");
  brandLink.classList.add("navbar-brand");
  brandLink.href = "/";
  brandLink.textContent = "CTD Pre-Work";
  containerFluid.appendChild(brandLink);

  const togglerButton = document.createElement("button");
  togglerButton.classList.add("navbar-toggler");
  togglerButton.setAttribute("type", "button");
  togglerButton.setAttribute("data-bs-toggle", "collapse");
  togglerButton.setAttribute("data-bs-target", "#navbarSupportedContent");
  togglerButton.setAttribute("aria-controls", "navbarSupportedContent");
  togglerButton.setAttribute("aria-expanded", "false");
  togglerButton.setAttribute("aria-label", "Toggle navigation");
  containerFluid.appendChild(togglerButton);

  const togglerIcon = document.createElement("span");
  togglerIcon.classList.add("navbar-toggler-icon");
  togglerButton.appendChild(togglerIcon);

  const linksContainer = document.createElement("div");
  linksContainer.classList.add("collapse", "navbar-collapse");
  linksContainer.setAttribute("id", "navbarSupportedContent");
  linksContainer.id = "navbar-linksContainer";
  containerFluid.appendChild(linksContainer);

  const linksList = document.createElement("ul");
  linksList.classList.add("navbar-nav", "me-auto", "mb-2", "mb-lg-0");
  linksContainer.appendChild(linksList);

  const linkNames = ["Home", "Artworks", "Artists", "Exhibitions"];
  const linkHrefs = [
    "/",
    "/artworks.html?page=1",
    "/artists.html?page=1",
    "/exhibitions.html?page=1",
  ];
  linkNames.forEach((name, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("nav-item");
    const link = document.createElement("a");
    link.classList.add("nav-link");
    link.setAttribute("href", linkHrefs[index]);
    link.textContent = name;
    if (index === activePage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
    listItem.appendChild(link);
    linksList.appendChild(listItem);
  });

  header.appendChild(nav);
  if (inputSearch) {
    renderInputSearch(callback, formElementId, inputElementId);
  }
}

export async function renderArtworkCardListPage(
  currentPage,
  query,
  callback,
  formElementId,
  inputElementId
) {
  renderNavBar(
    NavbarPageIndex.Artwork,
    true,
    callback,
    formElementId,
    inputElementId
  );

  renderSpinnerLoading();

  let obj = await loadDataCardListPage(
    query
      ? await getArtworkSearch(currentPage, query)
      : await getArtworks(currentPage),
    artworkElementsPerPage,
    query ? true : false
  );

  const totalPages = obj.pagination.total_pages;

  if (totalPages > 0) {
    renderArtworkCards(obj);
  
    renderPagination(
      totalPages,
      currentPage,
      query ? nextPaginationSearch : goToArtworks,
      artWorkPaginationLimit
    );
  }else{
    renderBackButton();
    renderNoResultsMessage(NO_RESULTS_TEXT);
  }

}

export async function renderArtworkCardDetailsPage(elementId) {
  renderNavBar(NavbarPageIndex.Artwork, false);

  renderSpinnerLoading();

  renderArtworkCardDetails(
    await loadDataCardDetails(await getArtwork(elementId))
  );
}

function renderArtworkCardDetails(obj) {
  renderBackButton();

  const div = document.createElement("div");
  div.classList.add("pt-5", "my-5", "text-center");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("container", "px-5");
  div.appendChild(innerContainer);

  if (obj.img_url) {
    const image = document.createElement("img");
    image.src = obj.img_url;
    image.classList.add(
      "img-fluid",
      "border",
      "rounded-3",
      "shadow-lg",
      "mb-4"
    );
    image.alt = "Example image";
    image.loading = "lazy";
    innerContainer.appendChild(image);
  }

  const title = document.createElement("h1");
  title.classList.add("display-4", "fw-bold", "text-body-emphasis");
  title.textContent = obj.data.title;
  div.appendChild(title);

  const meta = document.createElement("p");
  meta.classList.add("details-meta");
  let metaText = obj.data.place_of_origin
    ? obj.data.place_of_origin + " - "
    : "" + obj.data.date_display
    ? obj.data.date_display
    : "";

  if (obj.data.artist_ids.length > 0) {
    metaText += " by";
  }

  meta.innerHTML = metaText;

  for (let i = 0; i < obj.data.artist_ids.length; i++) {
    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-link");
    button.textContent = obj.data.artist_titles[i];
    button.addEventListener("click", () => {
      goToArtistDetails(obj.data.artist_ids[i]);
    });
    meta.appendChild(button);
  }

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
  container.appendChild(div);
}

export async function renderExhibitionCardListPage(
  currentPage,
  query,
  callback,
  formElementId,
  inputElementId
) {
  renderNavBar(
    NavbarPageIndex.Exhibition,
    true,
    callback,
    formElementId,
    inputElementId
  );

  renderSpinnerLoading();

  let obj = await loadDataCardListPage(
    query
      ? await getExhibitionSearch(currentPage, query)
      : await getExhibitions(currentPage),
    exhibitionElementsPerPage,
    query ? true : false
  );
  const totalPages = obj.pagination.total_pages;
  if (totalPages > 0) {
    renderExhibitionCards(obj);

    renderPagination(
      totalPages,
      currentPage,
      query ? nextPaginationSearch : goToExhibitions,
      exhibitionPaginationLimit
    );
  } else {
    renderBackButton();
    renderNoResultsMessage(NO_RESULTS_TEXT);
  }
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
      "align-items-center",
      "mt-4"
    );

    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-primary");
    button.textContent = "Details";
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
  renderNavBar(NavbarPageIndex.Exhibition, false);

  renderSpinnerLoading();

  let obj = await loadDataCardDetails(await getExhibition(elementId));
  renderExhibitionCardDetails(obj);
  renderArtworkCardListByExhibition(obj.data.artwork_ids);
}

function renderExhibitionCardDetails(obj) {
  renderBackButton();
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("pt-5", "my-5", "text-center");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("container", "px-5");
  mainDiv.appendChild(innerContainer);

  if (obj.img_url) {
    const image = document.createElement("img");
    image.src = obj.img_url;
    image.classList.add(
      "img-fluid",
      "border",
      "rounded-3",
      "shadow-lg",
      "mb-4"
    );
    image.alt = "Example image";
    image.loading = "lazy";
    innerContainer.appendChild(image);
  }
  const title = document.createElement("h1");
  title.classList.add("display-4", "fw-bold", "text-body-emphasis");
  title.textContent = obj.data.title;
  mainDiv.appendChild(title);

  if (obj.data.gallery_title) {
    const meta = document.createElement("p");
    meta.classList.add("details-meta");
    meta.innerHTML = obj.data.gallery_title + " Gallery";
    mainDiv.appendChild(meta);
  }

  const description = document.createElement("p");
  description.classList.add("lead", "mb-4");
  description.innerHTML = obj.data.short_description;
  mainDiv.appendChild(description);

  const divider = document.createElement("hr");
  mainDiv.appendChild(divider);

  const artworksDiv = document.createElement("div");

  artworksDiv.id = ARTWORKS_BY_EXHIBITION_CONTAINER_ID;

  let container = document.getElementById("container");
  container.appendChild(mainDiv);
  container.appendChild(artworksDiv);
}

export async function renderArtworkCardListByExhibition(artwork_ids) {
  renderSpinnerLoading(ARTWORKS_BY_EXHIBITION_CONTAINER_ID);

  let obj = await loadDataCardListSection(
    await getArtworksByExhibition(artwork_ids)
  );
  if (obj.length > 0) {
    renderArtworkCardsByExhibition(obj);
  } else {
    renderNoResultsMessage(NO_ARTWORKS_BY_EXHIBITION);
  }
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
      "align-items-center",
      "mt-4"
    );

    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-primary");
    button.textContent = "Details";
    button.addEventListener("click", () => {
      goToArtworkDetails(item.data.id);
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary");
    small.textContent = item.data.date_display
      ? `Created in ${item.data.date_display}`
      : "";

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
  const artworksTitle = document.createElement("h2");
  artworksTitle.classList.add("h2", "fw-bold", "text-body-emphasis", "my-4");
  artworksTitle.textContent = "Artworks";

  let container = document.getElementById(ARTWORKS_BY_EXHIBITION_CONTAINER_ID);
  container.innerHTML = "";
  container.appendChild(artworksTitle);
  container.appendChild(html);
}

export async function renderArtistListPage(
  currentPage,
  query,
  callback,
  formElementId,
  inputElementId
) {
  renderNavBar(
    NavbarPageIndex.Artist,
    true,
    callback,
    formElementId,
    inputElementId
  );

  renderSpinnerLoading();

  let obj = query
    ? await getArtistSearch(currentPage, query)
    : await getArtists(currentPage, artistElementsPerPage);
  const totalPages = obj.pagination.total_pages;

  if (totalPages > 0) {
    renderArtistList(obj);

    renderPagination(
      totalPages,
      currentPage,
      query ? nextPaginationSearch : goToArtists,
      artistPaginationLimit
    );
  } else {
    renderBackButton();
    renderNoResultsMessage(NO_RESULTS_TEXT);
  }
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
    if (item.death_date) {
      subtitle.textContent = item.birth_date + " - " + item.death_date;
    } else {
      subtitle.textContent = item.birth_date;
    }

    let divContainer = document.createElement("div");
    divContainer.classList.add(
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mt-4"
    );

    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-primary");
    button.textContent = "Details";
    button.addEventListener("click", () => {
      goToArtistDetails(item.id);
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

export async function renderArtistDetailsPage(elementId) {
  renderNavBar(NavbarPageIndex.Artist, false);

  renderSpinnerLoading();
  let obj = await getArtist(elementId);
  renderArtistDetails(obj);

  renderArtworkCardListByArtist(obj.data.id);
}

function renderArtistDetails(obj) {
  renderBackButton();
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("pt-5", "my-5", "text-center");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("container", "px-5");
  mainDiv.appendChild(innerContainer);

  const title = document.createElement("h1");
  title.classList.add("display-4", "fw-bold", "text-body-emphasis");
  title.textContent = obj.data.title;
  mainDiv.appendChild(title);

  const meta = document.createElement("p");
  meta.classList.add("details-meta");
  if (obj.data.death_date) {
    meta.innerHTML = obj.data.birth_date
      ? obj.data.birth_date
      : "Unknown date" + " - " + obj.data.death_date;
  } else {
    meta.innerHTML = obj.data.birth_date;
  }
  mainDiv.appendChild(meta);

  const description = document.createElement("p");
  description.classList.add("lead", "mb-4");
  description.innerHTML = obj.data.description;
  mainDiv.appendChild(description);

  const divider = document.createElement("hr");
  mainDiv.appendChild(divider);

  const artworksDiv = document.createElement("div");
  artworksDiv.id = ARTWORKS_BY_ARTIST_CONTAINER_ID;

  let container = document.getElementById("container");
  container.appendChild(mainDiv);

  container.appendChild(artworksDiv);
}

export async function renderArtworkCardListByArtist(artist_id) {
  renderSpinnerLoading(ARTWORKS_BY_ARTIST_CONTAINER_ID);

  let obj = await loadDataCardListSection(await getArtworksByArtist(artist_id));

  if (obj.length > 0) {
    renderArtworkCardsByArtist(obj);
  } else {
    renderNoResultsMessage(NO_ARTWORKS_BY_ARTIST);
  }
}

function renderArtworkCardsByArtist(data) {
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
      "align-items-center",
      "mt-4"
    );

    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    let button = document.createElement("button");
    button.type = "button";
    button.classList.add("btn", "btn-sm", "btn-primary");
    button.textContent = "Details";
    button.addEventListener("click", () => {
      goToArtworkDetails(item.data.id);
    });

    let small = document.createElement("small");
    small.classList.add("text-body-secondary");
    small.textContent = item.data.date_display
      ? `Created in ${item.data.date_display}`
      : "";

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

  const artworksTitle = document.createElement("h2");
  artworksTitle.classList.add("h2", "fw-bold", "text-body-emphasis", "my-4");
  artworksTitle.textContent = "Artworks";

  let container = document.getElementById(ARTWORKS_BY_ARTIST_CONTAINER_ID);
  container.innerHTML = "";
  container.appendChild(artworksTitle);
  container.appendChild(html);
}

function renderNoResultsMessage(text, parentID = "container") {
  const paragraph = document.createElement("p");
  paragraph.classList.add("h1", "text-center", "m-5");
  paragraph.textContent = text;
  let container = document.getElementById(parentID);
  container.appendChild(paragraph);
}

function renderBackButton() {
  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.classList.add("btn", "btn-outline-light", "me-5", "mb-5");
  backButton.id = "backToListBtn";
  backButton.textContent = "Back";

  backButton.addEventListener("click", function () {
    window.history.back();
  });

  let container = document.getElementById("container");
  container.innerHTML = "";
  container.appendChild(backButton);
}

function renderSpinnerLoading(parentId = "container") {
  const divContainer = document.createElement("div");
  divContainer.classList.add("d-flex", "justify-content-center");
  const div = document.createElement("div");
  div.classList.add("spinner-border", "text-light", "m-5");
  div.style.width = "3rem";
  div.style.height = "3rem";
  div.setAttribute("role", "status");
  divContainer.appendChild(div);
  let container = document.getElementById(parentId);
  container.innerHTML = "";
  container.appendChild(divContainer);
}
