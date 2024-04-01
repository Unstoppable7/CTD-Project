import {
  renderArtworkCardListPage,
  renderArtworkCardDetailsPage,
  renderExhibitionCardListPage,
  renderExhibitionCardDetailsPage,
  renderArtistListPage,
  renderArtistDetailsPage,
  renderNavBar
} from "./dom.js";

import { searchInputElementId as searchInputElementIdArtwork, searchformElementId as searchformElementIdArtwork} from "../models/artwork.js";

import { searchformElementId as searchformElementIdExhibition, searchInputElementId as searchInputElementIdExhibition} from "../models/exhibition.js";

import { searchInputElementId as searchInputElementIdArtist, searchformElementId as searchformElementIdArtist } from "../models/artist.js";

import { NavbarPageIndex } from "./util.js";

export function controllerListener() {
  document.addEventListener("DOMContentLoaded", async function () {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const currentPage = parseInt(params.get("page"));
    const elementId = parseInt(params.get("id"));
    const query = params.get("q");
    

    switch (pathname) {
      case "/":
        renderNavBar(NavbarPageIndex.Home,false);
        break;
      case "/artworks.html":

        if (currentPage && !query) {
          await showArtworkCardListPage(currentPage);
        } else if (elementId) {
          await showArtworkDetails(elementId);
        } else if (query) {
          await showArtworkCardListPage(currentPage, query);
        }
        break;
      case "/exhibitions.html":

        if (currentPage && !query) {
          await showExhibitionCardListPage(currentPage);
        } else if (elementId) {
          await showExhibitionDetails(elementId);
        } else if (query) {
          await showExhibitionCardListPage(currentPage, query);
        }
        break;

      case "/artists.html":

        if (currentPage && !query) {
          await showArtistCardListPage(currentPage);
        } else if (elementId) {
          await showArtistDetails(elementId);
        } else if (query) {
          await showArtistCardListPage(currentPage, query);
        }
        break;
    }
  });
}

async function showArtworkCardListPage(currentPage, query = null) {
  await renderArtworkCardListPage(currentPage, query, goToArtworkSearch, searchformElementIdArtwork,searchInputElementIdArtwork);
}

async function showArtworkDetails(elementId) {
  await renderArtworkCardDetailsPage(elementId);
}

async function showExhibitionCardListPage(currentPage, query = null) {
  await renderExhibitionCardListPage(currentPage, query, goToExhibitionSearch,searchformElementIdExhibition,searchInputElementIdExhibition);
}

async function showExhibitionDetails(elementId) {
  await renderExhibitionCardDetailsPage(elementId);
}

async function showArtistCardListPage(currentPage, query = null) {
  await renderArtistListPage(currentPage, query, goToArtistSearch, searchformElementIdArtist,searchInputElementIdArtist);
}

async function showArtistDetails(elementId) {
  await renderArtistDetailsPage(elementId);
}

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

export function goToArtistDetails(elementId) {
  window.location.href = `/artists.html?id=${elementId}`;
}

export function goToArtworkSearch(currentPage, query) {
  window.location.href = `/artworks.html?q=${query}&page=${currentPage}`;
}

export function nextPaginationSearch(currentPage) {
  let currentUrl = new URL(window.location.href);

  let params = new URLSearchParams(currentUrl.search);

  params.set("page", currentPage);

  let updatedUrl =
    currentUrl.origin + currentUrl.pathname + "?" + params.toString();

  window.location.href = updatedUrl;
}

export function goToExhibitionSearch(currentPage, query) {
  window.location.href = `/exhibitions.html?q=${query}&page=${currentPage}`;
}

export function goToArtistSearch(currentPage, query) {
  window.location.href = `/artists.html?q=${query}&page=${currentPage}`;
}
