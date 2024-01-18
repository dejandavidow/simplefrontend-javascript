let proizvodjaciroute = "https://localhost:44377/api/proizvodjaci";
let telefoniroute = "https://localhost:44377/api/telefoni";
let loginroute = "https://localhost:44377/api/Auth/login";
let registerroute = "https://localhost:44377/api/Auth/register";
let searchroute = "https://localhost:44377/api/pretraga";
let jwt = undefined;
function Auth() {
  return `Bearer ${jwt}`;
}
function OnBodyLoad() {
  GetTelefoni();
}
function Logout() {
  jwt = undefined;
  document.getElementById("postform").style.display = "none";
  document.getElementById("searchform").style.display = "none";
  document.getElementById("loginfo").style.display = "none";
  document.getElementById("userinfo").innerText =
    "Korisnik nije prijavljen na sistem";
  BackToStart();
  GetTelefoni();
}
function Login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let loginModel = {
    username: username,
    password: password,
  };
  let options = {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: JSON.stringify(loginModel),
  };
  fetch(loginroute, options)
    .then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          jwt = res.token;
          //localStorage.setItem("jwt", res.token);
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";
          document.getElementById("loginform").style.display = "none";
          document.getElementById("postform").style.display = "block";
          document.getElementById("searchform").style.display = "block";
          document.getElementById("loginfo").style.display = "";
          document.getElementById(
            "userinfo"
          ).innerText = `Prijavljen korisnik:${res.username}`;
          GetTelefoni();
          GetProizvodjaci();
        });
      } else {
        alert("Neuspela prijava. Pogresno ime ili lozinka!");
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
      }
    })
    .catch((err) => console.log(err));
}
function Register() {
  let username = document.getElementById("newusername").value;
  let password = document.getElementById("newpassword").value;
  let email = document.getElementById("newemail").value;
  let registermodel = {
    username: username,
    email: email,
    password: password,
  };
  let options = {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify(registermodel),
  };
  fetch(registerroute, options)
    .then((res) => {
      if (res.ok) {
        alert("Uspesna registracija!");
        document.getElementById("newusername").value = "";
        document.getElementById("newpassword").value = "";
        document.getElementById("newemail").value = "";
        document.getElementById("checkpassword").value = "";
        ShowLoginForm();
      } else {
        res.json().then((err) => {
          alert("Greska prilikom registracije!");
        });
      }
    })
    .catch((err) => console.log(err));
}
function ShowLoginForm() {
  document.getElementById("registerform").style.display = "none";
  document.getElementById("onLoadButtons").style.display = "none";
  document.getElementById("loginform").style.display = "block";
}
function ShowRegisterForm() {
  document.getElementById("onLoadButtons").style.display = "none";
  document.getElementById("registerform").style.display = "block";
}
function BackToStart() {
  document.getElementById("onLoadButtons").style.display = "block";
  document.getElementById("loginform").style.display = "none";
  document.getElementById("registerform").style.display = "none";
}
function SearchTelefoni() {
  let najmanje = document.getElementById("start").value;
  let najvise = document.getElementById("end").value;
  let isvalid = true;
  if (najmanje > najvise || (!najmanje && !najvise)) {
    isvalid = false;
    alert(
      "Proverite unos, polja su obavezna za unos. Vrednosti moraju biti pravilno unete!"
    );
  }
  let options = {
    headers: { "Content-Type": "application/json", Authorization: Auth() },
    method: "POST",
    body: JSON.stringify({ najmanje, najvise }),
  };
  isvalid &&
    fetch(searchroute, options)
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => ShowTelefoni(data));
        } else {
          alert("Desila se greska prilikom pretrage!");
        }
      })
      .catch((err) => console.log(err));
}
function AddTelefon() {
  let model = document.getElementById("model").value;
  let os = document.getElementById("operativnisistem").value;
  let kolicina = document.getElementById("kolicina").value;
  let cena = document.getElementById("cena").value;
  let proizvodjacid = document.getElementById("proizvodjacid").value;
  let telefon = {
    model: model,
    operatingSystem: os,
    size: kolicina,
    price: cena,
    manufacturerId:proizvodjacid
  };
  if (validateTelefon(telefon)) {
    let options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: Auth(),
      },
      method: "POST",
      body: JSON.stringify(telefon),
    };
    fetch(telefoniroute, options)
      .then((res) => {
        if (res.ok) {
          GetTelefoni();
          ResetForm();
        } else {
          alert("Desila se greska prilikom dodavanja telefona!");
        }
      })
      .catch((errors) => console.log(errors));
  }
}
function validateTelefon(x) {
  if (!x.model) {
    alert("Model telefona mora biti unet!");
    return false;
  } else if (x.model.length < 3 || x.model.length > 120) {
    alert("Model telefona mora imati izmedju 3 i 120 karaktera!");
    return false;
  }
  if (!x.operatingSystem) {
    alert("Operativni sistem telefona mora biti unet!");
    return false;
  } else if (x.operatingSystem.length < 2 || x.operatingSystem.length > 30) {
    alert("Operativni sistem mora imati izmedju 2 i 30 karaktera!");
  }
  if (!x.size) {
    alert("Dostupne velicine moraju biti unete!");
    return false;
  } else if (x.size < 0 || x.size > 1000) {
    alert("Dostupne velicine telefona moraju biti u intervalu od 0 do 1000!");
  }
  if (!x.price) {
    alert("Cena telefona mora biti uneta!");
    return false;
  } else if (x.price < 1 || x.price > 250000) {
    alert("Cena telefona mora biti izmedju 1 i 250000");
    return false;
  }
  return true;
}
function DeleteTelefon() {
  let telefonId = this.name;
  fetch(telefoniroute + `/${telefonId}`, {
    method: "DELETE",
    headers: { Authorization: Auth() },
  })
    .then((res) => {
      if (res.ok) {
        GetTelefoni();
      } else {
        alert("Desila se greska prilikom brisanja telefona!");
      }
    })
    .catch((errors) => console.log(errors));
}
function ResetForm() {
  document.getElementById("kolicina").value = "";
  document.getElementById("cena").value = "";
  document.getElementById("operativnisistem").value = "";
  document.getElementById("model").value = "";
  document.getElementById("proizvodjacid").value = 1;
}
function GetTelefoni() {
  fetch(telefoniroute)
    .then((res) => {
      if (res.ok) {
        res.json().then(ShowTelefoni);
      } else {
        alert(`Desila se greska ${res.status}`);
      }
    })
    .catch((err) => console.log(err));
}
function ShowTelefoni(telefoni) {
  let data = document.getElementById("data");
  data.innerHTML = "";
  let table = document.createElement("table");
  table.classList.add("table", "table-bordered", "table-sm");

  let thead = document.createElement("thead");
  thead.classList.add("table-success");
  thead.classList.add("text-center");
  let tr = document.createElement("tr");

  let thProizvodjac = document.createElement("th");
  thProizvodjac.innerText = "Proizvodjac";
  let thModel = document.createElement("th");
  thModel.innerText = "Model";
  let thCena = document.createElement("th");
  thCena.innerText = "Cena (din)";
  let thKolicina = document.createElement("th");
  thKolicina.innerText = "Kolicina";

  tr.appendChild(thProizvodjac);
  tr.appendChild(thModel);
  tr.appendChild(thCena);
  tr.appendChild(thKolicina);

  if (jwt) {
    let thOS = document.createElement("th");
    thOS.innerText = "OS";
    let thAkcija = document.createElement("th");
    thAkcija.innerText = "Akcija";
    tr.appendChild(thOS);
    tr.appendChild(thAkcija);
  }

  thead.appendChild(tr);
  table.appendChild(thead);

  let tbody = document.createElement("tbody");
  for (let x of telefoni) {
    let tr = document.createElement("tr");

    let thProizvodjac = document.createElement("td");
    thProizvodjac.innerText = x.manufacturerName;
    let thModel = document.createElement("td");
    thModel.innerText = x.model;
    let thCena = document.createElement("td");
    thCena.innerText = x.price;
    let thKolicina = document.createElement("td");
    thKolicina.innerText = x.size;

    tr.appendChild(thProizvodjac);
    tr.appendChild(thModel);
    tr.appendChild(thCena);
    tr.appendChild(thKolicina);

    if (jwt) {
      let tdOs = document.createElement("td");
      tdOs.innerText = x.operatingSystem;
      let tdAkcija = document.createElement("td");
      tdAkcija.classList.add("text-center");
      let deletebutton = document.createElement("button");
      deletebutton.innerText = "Obrisi";
      deletebutton.type = "button";
      deletebutton.name = x.id;
      deletebutton.classList.add("btn", "btn-danger");
      deletebutton.addEventListener("click", DeleteTelefon);
      tdAkcija.appendChild(deletebutton);
      tr.appendChild(tdOs);
      tr.appendChild(tdAkcija);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  data.appendChild(table);
}
function GetProizvodjaci() {
  fetch(proizvodjaciroute)
    .then((res) => {
      if (res.ok) {
        res.json().then(ShowProizvodjaci);
      } else {
        alert(`Desila se greska ${res.status}`);
      }
    })
    .catch((err) => console.log(err));
}
function ShowProizvodjaci(proizvodjaci) {
  let select = document.getElementById("proizvodjacid");
  for (const x of proizvodjaci) {
    let option = document.createElement("option");
    option.innerText = x.name;
    option.value = x.id;
    select.appendChild(option);
  }
}
