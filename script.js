/*------ Variables ------*/

const cont = document.querySelector("#card_container");
let users = [];
const input = document.querySelector("input");
let change_order = false;


/*------ Fetch ------*/

async function getData() {
  const url = "https://randomuser.me/api/?results=100";
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
    let amt = (Math.floor(Math.pow(Math.random(), 2.5) * 99) * 10 + 10).toFixed(2); // Min : 10.00€; Max : 500.00€; Arondi à la dizaine; 2 chiffres après la virgule; Distribution exponentielle inversée
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

let amt_count = 0; // Tri croissant si 1, décroissant si 0
function amount_sort(tab) {
  amt_count++;
  amt_count = amt_count%2;

  if (amt_count == 1) {return tab.sort((a,b) => a.amount - b.amount);}
  return tab.sort((a,b) => b.amount - a.amount);
}

let abc_count = 0; // Tri croissant si 0, décroissant si 1
function abc_sort(tab, change_order) {
  abc_count++;
  abc_count = abc_count%2;

  let first_names = [];
  for (let i = 0; i < tab.length; i++) {
    first_names.push(tab[i].name.first); // Ajoute tous les prénoms dans la liste
  }
  first_names.sort(); // Trie la liste

  let abc_sorted = [];
  for (let j = 0; j < first_names.length; j++) {
    for (let k = 0; k < tab.length; k++) {
      if (first_names[j] == tab[k].name.first) {
        abc_sorted.push(tab[k]); // Ajoute user si le prénom correspond
      }
    }
  }

  if (abc_count == 1) {return abc_sorted.reverse()} // Décroissant
  return abc_sorted; // Croissant
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
  } else if (filter == "f" || filter == "m") {
    res = gender_filter(users, filter);
  } else {
    res = users;
  }
  current_filter = filter;

  // Sorting
  if (sort == "") {
    sort = current_sort;
  } else if (sort == "abc") {
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

  // Montant de la donation
  const amnt = document.createElement("p");
  amnt.classList.add("amnt");
  amnt.innerHTML = user.amount + "€";
  card.appendChild(amnt);

  // Photo de profil
  const img = document.createElement("img");
  img.classList.add("user_img");
  img.src = user.picture.large;
  img.alt = user.name.first + " " + user.name.last;
  card.appendChild(img);

  // Prénom et nom
  const name = document.createElement("p");
  name.classList.add("name");
  name.innerHTML = user.name.first + " " + user.name.last;
  card.appendChild(name);

  // Infos emplacement
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

  // Numéro de téléphone
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
  // Retire toutes les anciennes cartes
  document.querySelectorAll(".card").forEach((elt) => {
    cont.removeChild(elt);
  });
  // Retire les cartes de stats
  document.querySelectorAll(".stat_card").forEach((elt) => {
    cont.removeChild(elt);
  });
  // Puis affiche les nouvelles
  tab.forEach((user) => {
    const card = create_card(user);
    cont.appendChild(card);
  });
}

function search() { // Rechercher par nom, non sensible à la casse
  // Convertit les string en minuscule
  let input_val = input.value.toLowerCase();
  // Ajoute tous les users qui correspondent aux critères
  let tab = [];
  users.forEach(user => {
    let fullname = user.name.first.toLowerCase() + ' ' + user.name.last.toLowerCase();
    if (fullname.includes(input_val)) {
      tab.push(user);
    } else if (input_val == '') {
      tab = users;
    }
  })
  display_cards(tab);
}

input.addEventListener("keypress", function(event){
    if(event.key == "Enter"){search();}
});

function display_stat_cards() {
  document.querySelectorAll(".card").forEach((elt) => {
    cont.removeChild(elt);
  });
  document.querySelectorAll(".active").forEach(elt => {
    elt.classList.remove("active");
  });

  let avg = 0;
  let donation_sum = 0;
  let max_donation = 0;
  users.forEach(user => {
    let amount = parseInt(user.amount)
    donation_sum += amount;
    if (amount > max_donation) {max_donation = amount}
  })
  avg = donation_sum / users.length;

  for (let i=0; i<4; i++) {
    const card = document.createElement("section");
    card.classList.add("stat_card");
    const img = document.createElement("img");
    const text_cont = document.createElement("section");
    const title = document.createElement("h2");
    const msg = document.createElement("p");
    
    if (i == 0) {
      img.alt = 'donation_nbr';
      img.src = './images/icons/number.svg';
      title.innerHTML = 'Donations number';
      msg.innerHTML = users.length;
    } else if (i == 1) {
      img.alt = 'donation_sum';
      img.src = './images/icons/add.svg';
      title.innerHTML = 'Donations total';
      msg.innerHTML = donation_sum;
    } else if (i == 2) {
      img.alt = 'avg_donation';
      img.src = './images/icons/avg.svg';
      title.innerHTML = 'Average donation';
      msg.innerHTML = avg;
    } else if (i == 3) {
      img.alt = 'max_donation';
      img.src = './images/icons/leader.svg';
      title.innerHTML = 'Max donation';
      msg.innerHTML = max_donation;
    }
    
    card.appendChild(img);
    text_cont.appendChild(title);
    text_cont.appendChild(msg);
    card.appendChild(text_cont);

    cont.appendChild(card);
  }

}

// TODO
// Change order true/false