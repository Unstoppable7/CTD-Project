export const Model = {
  Artwork: "Artwork",
  ArtworkImage: "ArtworkImage",
};

export function toRender(model, obj){

  let elements = obj.elements;
  let htmlData = [];

  for (let i = 0; i < elements.length; i++) {

    switch(model){
      case Model.Artwork:
        htmlData.push({
          img_url: elements[i].img_url,
          title: elements[i].data.title,
          subtitle: elements[i].data.artist_display,
          smallElement: elements[i].data.date_display
        });
        break;
      default:
        continue;
    }
  }
  return htmlData;
}