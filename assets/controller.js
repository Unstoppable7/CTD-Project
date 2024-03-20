import {
  renderArtworkCardListPage,
  renderArtworkCardDetailsPage,
  renderExhibitionCardListPage,
  renderExhibitionCardDetailsPage,
  renderArtistListPage
} from "./dom.js";

export function initControllerListener() {
  document.addEventListener("DOMContentLoaded", async function () {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const currentPage = parseInt(params.get("page"));
    const elementId = parseInt(params.get("id"));

    switch (pathname) {
      case "/":
        break;
      case "/artworks.html":
        if (currentPage) {
          await showArtworkCardListPage(currentPage);
        } else if (elementId) {
          await showArtworkDetails(elementId);
        }
        break;
      case "/exhibitions.html":
        if (currentPage) {
          await showExhibitionCardListPage(currentPage);
        } else if (elementId) {
          await showExhibitionDetails(elementId);
        }
        break;

      case "/artists.html":
        if (currentPage) {
          await showArtistCardListPage(currentPage);
        // } else if (elementId) {
        //   await elementId;
        }
        break;
    }
  });
}

async function showArtworkCardListPage(currentPage) {
  await renderArtworkCardListPage(currentPage);
}

async function showArtworkDetails(elementId) {
  await renderArtworkCardDetailsPage(elementId);
}

async function showExhibitionCardListPage(currentPage) {
  await renderExhibitionCardListPage(currentPage);
}

async function showExhibitionDetails(elementId) {
  await renderExhibitionCardDetailsPage(elementId);
}

async function showArtistCardListPage(currentPage) {
  await renderArtistListPage(currentPage);
}

// async function showArtistDetails(elementId) {
//   await renderExhibitionCardDetailsPage(elementId);
// }

export function goToArtworks(currentPage) {
  window.location.href = `/artworks.html?page=${currentPage}`;
}

export function goToArtworkDetails(elementId) {
  window.location.href = `/artworks.html?id=${elementId}`;
}

export function goToExhibitions(currentPage) {
  window.location.href = `/exhibitions.html?page=${currentPage}`;
}

export function goToExhibitionDetails(elementId) {
  window.location.href = `/exhibitions.html?id=${elementId}`;
}

export function goToArtists(currentPage) {
  window.location.href = `/artists.html?page=${currentPage}`;
}
