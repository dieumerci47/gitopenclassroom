let Users;
let fetchData = async () => {
  const data = await fetch("http://localhost:3001/get")
    .then((data) => data.json())
    .then((data) => (Users = data))
    .catch((err) => console.log(err));
  console.log(Users);
  let Liste = document.getElementById("liste");
  let body = document.querySelector("body");
  for (let i = 0; i < Users.length; i++) {
    let li = document.createElement("li");
    li.textContent = Users[i].nom;
    Liste.appendChild(li);
  }
  body.appendChild(Liste);
  let buttonEnvoyer = document.getElementById("envoyer");
  buttonEnvoyer.addEventListener("click", async (e) => {
    e.preventDefault();
    let inputNom = document.getElementById("nom");
    let inputEmail = document.getElementById("email");
    let inputAge = document.getElementById("age");
    const data = {
      nom: inputNom.value,
      email: inputEmail.value,
      age: inputAge.value,
    };
    await fetch("http://localhost:8080/db.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nom: data.nom,
        email: data.email,
        age: data.age,
      }),
    });
    console.log(inputNom.value, inputEmail.value, inputAge.value);
  });
  return data;
};
fetchData();
