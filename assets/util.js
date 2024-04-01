export const Entity = {
  Artwork: "Artwork",
  ArtworkImage: "ArtworkImage",
  Exhibition: "Exhibition",
  Artist: "Artist"
};

export const NavbarPageIndex = {
  Home: 0,
  Artwork: 1,
  Artist: 2,
  Exhibition: 3,
};

export function handleSearchPrototype(callback, formElementId, inputElementId) {
  const searchForm = document.getElementById(formElementId);
  const searchInput = document.getElementById(inputElementId);

  const initialPage = 1;

  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchTerm = searchInput.value;
    
    callback(initialPage, searchTerm);

  });
}
