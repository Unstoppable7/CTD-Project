import { renderPage, renderDetailsPage } from "../assets/dom.js";

export const elementsPerPage = 9;
export const paginationLimit = 5;

document.addEventListener("DOMContentLoaded", function () {
  const pathname = window.location.pathname;

  switch (pathname) {
    case "/":
      mostrarListado();
      break;
    case "/artworks.html":
      showArtworks();
      break;
    case "/detail.html":
      showDetails();
      break;
  }
});

export async function showArtworks() {
  const params = new URLSearchParams(window.location.search);
  const page = parseInt(params.get("page"));

  await renderPage(page);
}

async function showDetails() {
  const params = new URLSearchParams(window.location.search);
  const artworkId = parseInt(params.get("id"));

  await renderDetailsPage(artworkId);
}

export function goToDetails(id) {
  window.location.href = `/detail.html?id=${id}`;
}

export function goToArtworks(page){
  window.location.href = `/artworks.html?page=${page}`;
}
