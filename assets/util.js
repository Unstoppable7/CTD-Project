export const Model = {
  Artwork: "Artwork",
  ArtworkImage: "ArtworkImage",
};

export function toRender(obj) {
  let elements = obj.elements;
  let htmlData = [];

  for (let i = 0; i < elements.length; i++) {
    // switch(model){
    //   case Model.Artwork:
    //     htmlData.push({
    //       img_url: elements[i].img_url,
    //       title: elements[i].data.title,
    //       subtitle: elements[i].data.artist_display,
    //       smallElement: elements[i].data.date_display
    //     });
    //     break;
    //   default:
    //     continue;
    // }

    htmlData.push({
      id: elements[i].data.id,
      img_url: elements[i].img_url,
      title: elements[i].data.title,
      subtitle: elements[i].data.artist_display,
      smallElement: elements[i].data.date_display,
    });
  }
  return htmlData;
}

export function toRenderDetail(obj){
  let htmlData;

  //title,image_id,credit_line,description,place_of_origin,artist_titles,date_display,artist_ids

  htmlData = {
    
    relation_ids: obj.data.artist_ids,
    img_url: obj.img_url,
    title: obj.data.title,
    description: obj.data.description,
    place: obj.data.place_of_origin,
    short_text: obj.data.credit_line,
    date: obj.data.date_display,
    array_data: obj.data.artist_titles

  };

  return htmlData;
}
