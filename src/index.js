let addToy = false;


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("div#toy-collection")
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });



  function renderOneToy(toyObject) {
    const card = document.createElement("div")
    card.className = "card"
    card.dataset.id = toyObject.id
    card.innerHTML = `
    <h2>${toyObject.name}</h2>
    <img src='${toyObject.image}' class="toy-avatar" />
    <p>${toyObject.likes} Likes </p>
    <button class="like-btn">Like <3</button>`
    toyCollection.appendChild(card)
  }

  function renderAllToys(toyArray) {
    toyArray.forEach(renderOneToy)
  }

  function getAllToys() {
    return fetch("http://localhost:3000/toys")
      .then(response => response.json())
  }

  function createToy(toyObject) {
    return fetch("http://localhost:3000/toys", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toyObject),
    })
      .then(response => response.json())
  }

  const newToyForm = document.querySelector(".add-toy-form")
  newToyForm.addEventListener("submit", handleToyFormSubmit)

  function handleToyFormSubmit(event) {
    event.preventDefault()
    const newToyObject = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    }
    createToy(newToyObject)
      .then(toyObject => {
        renderOneToy(toyObject)
      })
  }

  function updateLikes(id, likeCount) {
    return fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify({
        "likes": likeCount
      })
    })
  }

  // const likeButton = toyCollection.closest(".like-btn")
  toyCollection.addEventListener('click', handleLikeClick)
  
  function handleLikeClick(event){
    if (event.target.matches(".like-btn")){
      const likeButton = event.target
      const card = likeButton.closest(".card")
      const id = card.dataset.id
      const likeP = card.querySelector("p")
      let likeAmount = parseInt(likeP.textContent)
      likeAmount++
      likeP.textContent = `${likeAmount} Likes`
      updateLikes(id, likeAmount)
        .then(updatedLikeToy => {
          likeAmount.textContent = updatedLikeToy.likes
        })
    }
  }

  function initialize() {
    getAllToys()
      .then(toyArray => {
        renderAllToys(toyArray)
      })
  }

  initialize();

});

