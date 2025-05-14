/*------ Variables ------*/

const main = document.querySelector("main");
let users = [];


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

getData().then(data => {
  users = data.results;
  display_cards(users);
})


/*------ Main ------*/

function gender_filter(obj, gender) {
  let filtered = [];
  if (gender == "m") {
    obj.forEach((user) => {
      if (user.gender == "male") {
        filtered.push(user);
      }
    });
  } else {
    obj.forEach((user) => {
      if (user.gender == "female") {
        filtered.push(user);
      }
    });
  }
  return filtered;
}

function amount_sort(obj) {
  let cache = [];
  for (let i = 0; i < obj.length; i++) {
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

let current_filter = "";
let current_sort = "";
function filter_sort(filter, sort) {
  let res = [];
  // Filtering
  if (filter == "") {filter = current_filter;}
  if (filter == "a") {
    res = users;
    current_filter = "a";
  } else if (filter == "m") {
    res = gender_filter(users, "m");
    current_filter = "m";
  } else {
    res = gender_filter(users, "f");
    current_filter = "f";
  }
  // Sorting
  if (sort == "") {sort = current_sort;}
  if (sort == "abc") {
    res = abc_sort(res);
  } else if (sort == "amt") {
    res = amount_sort(res);
  }
  display_cards(res);
}

function create_card(user) {
  const card = document.createElement("section");
  card.classList.add("card");
  const amnt = document.createElement("p");
  amnt.classList.add("amnt");
  amnt.innerHTML = ((Math.floor(Math.random() * 39) * 10)+10).toFixed(2) + " €"; // Min : 10.00€; Max : 400.00€; Arondi à la dizaine; 2 chiffres après la virgule
  card.appendChild(amnt);
  const img = document.createElement("img");
  img.classList.add("user_img");
  img.src = user.picture.large;
  img.alt = user.name.first + " " + user.name.last;
  img.title = user.name.first + " " + user.name.last;
  card.appendChild(img);
  const name = document.createElement("p");
  name.classList.add("name");
  name.innerHTML = user.name.first + " " + user.name.last;
  card.appendChild(name);
  const place = document.createElement("section");
  place.classList.add("place");
  const pin = document.createElement("img");
  pin.src = "./images/icons/place.svg";
  place.appendChild(pin);
  const city = document.createElement("p");
  city.innerHTML = user.location.city + ",";
  place.appendChild(city);
  const country = document.createElement("p");
  country.classList.add("bold");
  country.innerHTML = user.location.country;
  place.appendChild(country);
  card.appendChild(place);
  const phone = document.createElement("section");
  phone.classList.add("phone");
  const phone_img = document.createElement("img");
  phone_img.src = "./images/icons/phone.svg";
  phone.appendChild(phone_img);
  const phone_nbr = document.createElement("p");
  phone_nbr.innerHTML = user.phone;
  phone.appendChild(phone_nbr);
  card.appendChild(phone);
  
  return card;
}

function display_cards(obj) {
  document.querySelectorAll(".card").forEach(elt => {
    main.removeChild(elt);
  });
  obj.forEach (user => {
    const card = create_card(user);
    main.appendChild(card);
  })
}