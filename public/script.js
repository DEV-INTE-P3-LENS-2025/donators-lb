/*------ Variables ------*/

const main = document.getElementById("main");


/*------ Fetch ------*/

async function getData() {
  const url = "https://randomuser.me/api/?results=50";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}


  // fetch(url).then((data) => {const users = data;})

 const users = getData();

 console.log(users);


/*------ Main ------*/

function amount_sort(obj) {
  const cache = [];
  for (let i = 0; i < obj.results.length; i++) {
  }
}

function abc_sort(obj){
  let first_names = [];
    for (let i = 0; i < obj.length; i++) {
        first_names.push(obj[i].name.first);
    }
    first_names.sort();
    let abc_sorted = [];
    for (let j = 0; j < first_names.length; j++) {
        for (let k = 0; k < obj.length; k++) {
            if (first_names[j] == obj[k].name.first) {
                abc_sorted.push(obj[k]);
            }
        }
    }
    return abc_sorted;
}

function filter_sort(filter = "", sort = "") {

}

function create_card(obj) {
  const card = document.createElement("section");
  card.classList.add("card");
  const amnt = document.createElement("p");
  amnt.innerHTML = (Math.floor(Math.random() * 100) * 10).toFixed(2) + " €";
  card.appendChild(amnt);
  const img = document.createElement("img");
  img.src = obj.picture.thumbnail;
  img.alt = obj.name.first + " " + obj.name.last;
  img.title = obj.name.first + " " + obj.name.last;
  card.appendChild(img);
  const name = document.createElement("p");
  name.innerHTML = obj.name.first + " " + obj.name.last;
  card.appendChild(name);
  const place = document.createElement("section");
  const city = document.createElement("p");
  city.innerHTML = obj.location.city + ", ";
  place.appendChild(city);
  const country = document.createElement("p");
  country.innerHTML = obj.location.country;
  place.appendChild(country);
  card.appendChild(place);
  const phone_nbr = document.createElement("p");
  phone_nbr.innerHTML = obj.phone;
  card.appendChild(phone_nbr);

  return card;
}

function display_cards(obj) {
  document.querySelectorAll(".card").forEach((elt) => {
    main.removeChild(elt);
  });
  for (let i = 0; i < obj.results.length; i++) {
    const card = create_card(obj.results[i]);
    main.appendChild(card);
  }
}
