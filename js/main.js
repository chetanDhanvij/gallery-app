var items
const getItem = () => {

  Promise.all(
    Array.from(
      Array(25).keys())
    .map(id => fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id*99 + 1}`, {
        headers: {
          "Content-Type": "application/json"
        },
      })
      .then(r => r.json())
    )
  ).then(_items => {
    var myItems = getMyGallery();
    items = _items.filter(d => d.primaryImage)
      .map(d => ({
        ...d,
        isSelected: myItems.includes(d.objectID)
      }))
    items.map(d => renderItem(d))
  })
}





getItem()

//helper function

function getMyGallery() {
  var myItems = localStorage.getItem("myItems");
  if (myItems == undefined) {
    myItems = []
  } else {
    myItems = JSON.parse(myItems)
  }
  return myItems
}


//Returns true if the update is succes, else false
function updateMyGallery(myItems) {
  if (myItems.length > 5 && myItems.length > getMyGallery().length) {
    alert("Max 5 items can be added to MyGallery");
    return false;
  }
  localStorage.setItem("myItems", JSON.stringify(myItems))
  return true;

}

const renderItem = (item) => {
  var img = document.createElement('img');
  img.src = item.primaryImage;
  img.style.minHeight = "200px";
  var li = document.createElement('li');



  var h3 = document.createElement('h3');
  h3.innerHTML = item.title

  var p = document.createElement('p');
  p.innerHTML = item.artistDisplayName || "Anonymous";

  var a = document.createElement('a')
  a.href = item.objectURL;
  a.target = "_blank";
  // a.innerHTML = "OPEN"

  var i = document.createElement('i')
  i.classList.add("far", "fa-star")
  i.onclick = () => {
    item.isSelected = !item.isSelected;
    if (item.isSelected) {

      var myItems = getMyGallery();
      myItems.push(item.objectID);

      if (updateMyGallery(myItems)) {
        i.classList.remove("far")
        i.classList.add("fas")
        li.classList.add('selected');
      }


    } else {

      var myItems = getMyGallery();
      myItems = myItems.filter(d => item.objectID != d);

      if (updateMyGallery(myItems)) {
        i.classList.remove("fas")
        i.classList.add("far");
        li.classList.remove('selected');

      };


    }

  }
  if (item.isSelected) {
    i.classList.add("fas", "fa-star");
    li.classList.add('selected');
  }

  a.appendChild(img);
  a.appendChild(h3);
  a.appendChild(p);
  li.appendChild(a);
  li.appendChild(i);

  document.querySelector('.gallery').appendChild(li);

}

const clearGallery = () => {
  document.querySelector('.gallery').innerHTML = '';
}

showGallery = () => {
  const navGallery = document.getElementById("navGallery");
  navGallery.classList.add("active")

  const navMyGallery = document.getElementById("navMyGallery");
  navMyGallery.classList.remove("active")

  document.querySelector('.gallery').classList.add('allGallery'); 
  document.querySelector('.gallery').classList.remove('myGallery'); 


//   clearGallery();
//   items.filter(d => d.isSelected).map(d => renderItem(d))
}

showMyGallery = () => {
  const navMyGallery = document.getElementById("navMyGallery");
  navMyGallery.classList.add("active")

  const navGallery = document.getElementById("navGallery");
  navGallery.classList.remove("active");

  document.querySelector('.gallery').classList.add('myGallery'); 
  document.querySelector('.gallery').classList.remove('allGallery'); 
//   clearGallery();
//   let myItems = [...items]
//   myItems = myItems.filter(d => d.isSelected)

//   if(myItems.length > 0){
//     document.getElementById('no_items').style.display = "none";
//     myItems.map(d => renderItem(d));
//   } else {
//     document.getElementById('no_items').style.display = "block";
//     document.querySelector('.gallery').appendChild(p); 
//   }

}
