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

getData().then((data) => {
  users = data.results;
  users.forEach (user => {
    let amt = (Math.floor(Math.random() * 39) * 10 + 10).toFixed(2); // Min : 10.00€; Max : 400.00€; Arondi à la dizaine; 2 chiffres après la virgule
    user.amount = amt;
  })
  display_cards(users);
});

/*------ Main ------*/

function gender_filter(tab, gender) {
  let filtered = [];
  if (gender == "f") {gender = "female";}
  else if (gender == "m") {gender = "male";}
  tab.forEach (user => {
    if (gender == "a" || gender == user.gender) {
      filtered.push(user);
    }
  });
  return filtered;
}

function amount_sort(tab) {
  return tab.sort((a,b) => b.amount - a.amount);
}

function abc_sort(tab) {
  let first_names = [];
  for (let i = 0; i < tab.length; i++) {
    first_names.push(tab[i].name.first);
  }
  first_names.sort();
  let abc_sorted = [];
  for (let j = 0; j < first_names.length; j++) {
    for (let k = 0; k < tab.length; k++) {
      if (first_names[j] == tab[k].name.first) {
        abc_sorted.push(tab[k]);
      }
    }
  }
  return abc_sorted;
}

let current_filter = "";
let current_sort = "";
const f_op = document.querySelectorAll(".f_op");
const s_op = document.querySelectorAll(".s_op");
function filter_sort(option, filter, sort) {
  // Add or remove class for CSS styling
  const s_op_active = document.querySelectorAll(".s_op.active");
  const f_op_active = document.querySelectorAll(".f_op.active");
  if (filter != "") {
    if (f_op_active.length != 0) {
      f_op_active.forEach (elt => {
        elt.classList.remove("active");
      })
    }
    option.classList.add("active");
  }
  if (sort != "") {
    if (s_op_active.length != 0) {
      s_op_active.forEach (elt => {
        elt.classList.remove("active");
      })
    }
    option.classList.add("active");
  }

  let res = [];

  // Filtering
  if (filter == "") {
    filter = current_filter;
  }
  if (filter == "f") {
    res = gender_filter(users, "f");
  } else if (filter == "m") {
    res = gender_filter(users, "m");
  } else {
    res = users;
  }
  current_filter = filter;

  // Sorting
  if (sort == "") {
    sort = current_sort;
  }
  if (sort == "abc") {
    res = abc_sort(res);
  } else if (sort == "amt") {
    res = amount_sort(res);
  }
  current_sort = sort;

  display_cards(res);
}

function create_card(user) {
  const card = document.createElement("section");
  card.classList.add("card");
  const amnt = document.createElement("p");
  amnt.classList.add("amnt");
  amnt.innerHTML = user.amount + "€";
  card.appendChild(amnt);
  const img = document.createElement("img");
  img.classList.add("user_img");
  img.src = user.picture.large;
  img.alt = user.name.first + " " + user.name.last;
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

function display_cards(tab) {
  document.querySelectorAll(".card").forEach((elt) => {
    main.removeChild(elt);
  });
  tab.forEach((user) => {
    const card = create_card(user);
    main.appendChild(card);
  });
}