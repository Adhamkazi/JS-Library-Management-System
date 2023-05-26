// --- do not touch  ↓↓↓↓↓↓↓↓↓↓↓↓ ----------
const baseServerURL = `http://localhost:${import.meta.env.REACT_APP_JSON_SERVER_PORT
  }`;
// --- do not touch  ↑↑↑↑↑↑↑↑↑↑↑↑ ----------

// ***** Constants / Variables ***** //
const bookURL = `${baseServerURL}/books`;
let mainSection = document.getElementById("data-list-wrapper");
let token = localStorage.getItem("token");

let name = document.getElementById("welcomName")
name.innerHTML = `Hello  :   ${token}`;


// book
async function getData() {
  try {
    let res = await fetch(bookURL)
    let data = await res.json()
    console.log(data);
    appendData(data);
  } catch (error) {
    console.log(error);
  }
}
getData()


function appendData(data) {
  mainSection.innerHTML = "";
  let cardList = document.createElement("div")
  cardList.className = "card-list"
  data.forEach(el => {
    let div = document.createElement("div");
    div.className = "card";

    let imageDiv = document.createElement("div");
    let image = document.createElement("img");
    image.src = el.image
    imageDiv.appendChild(image);

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let title = document.createElement("h4");
    title.innerText = el.title

    let author = document.createElement("p");
    author.innerText = el.author
    let category = document.createElement("p");
    category.innerText = el.category

    let price = document.createElement("p");
    price.innerText = `$${el.price}`

    let button = document.createElement("button");
    button.innerHTML = "EDIT"
    let delete_btn = document.createElement("button");
    delete_btn.innerText = "Delete";
    delete_btn.addEventListener("click", function (e) {
      deleteBook(el.id)
    })

    cardBody.append(title, author, category, price, button, delete_btn);

    div.append(imageDiv, cardBody);
    cardList.append(div);

  });
  mainSection.append(cardList)
}

async function deleteBook(id) {
  try {
    await fetch(`${bookURL}/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    })
    getData()

  } catch (error) {
    console.log(error);
  }
}




//sort
let sortAtoZBtn = document.getElementById("sort-low-to-high")
  .addEventListener("click", sortLowToHigh);
async function sortLowToHigh() {
  try {
    let res = await fetch(bookURL);
    let data = await res.json();
    data.sort((a, b) => a.price - b.price);
    appendData(data);
  } catch (error) {
    console.error(error);
  }
}

let sortZtoABtn = document.getElementById("sort-high-to-low").addEventListener("click", sortHighToLow);
async function sortHighToLow() {
  try {
    let res = await fetch(bookURL);
    let data = await res.json();
    data.sort((a, b) => b.price - a.price);
    appendData(data);
  } catch (error) {
    console.error(error);
  }
}
// filter
let filterClassic = document.getElementById("filter-Classic").addEventListener("click", ClassicFilter);
async function ClassicFilter() {
  try {
    let res = await fetch(bookURL);
    let data = await res.json();
    let filteredData = data.filter((el) => el.category === "Classic");
    if (filteredData.length > 0) {
      appendData(filteredData);
    } else {
      alert("No data of this category");
    }
  } catch (error) {
    console.log(error.message);
  }
}
let filterFantasy = document.getElementById("filter-Fantasy").addEventListener("click", FantasyFilter);
async function FantasyFilter() {
  try {
    let res = await fetch(bookURL);
    let data = await res.json();
    let filteredData = data.filter((el) => el.category === "Fantasy");
    if (filteredData.length > 0) {
      appendData(filteredData);
    } else {
      alert("No data of this category");
    }
  } catch (error) {
    console.log(error.message);
  }
}
let filterMystery = document.getElementById("filter-Mystery").addEventListener("click", MysteryFilter);
async function MysteryFilter() {
  try {
    let res = await fetch(bookURL);
    let data = await res.json();
    let filterdMystery = data.filter((el) => el.category === "Mystery");
    if (filterdMystery.length > 0) {
      appendData(filterdMystery)
    } else {
      alert("No data of this category");
    }
  } catch (error) {
    console.log(error.message);
  }
}



let updateID = "";
let updatePrice = "";
document.getElementById("update-price-book-id").addEventListener("input", function () {
  updateID = this.value;
});

document.getElementById("update-price-book-price").addEventListener("input", function () {
  updatePrice = this.value;
});

document.getElementById("update-price-book").addEventListener("click", updateBookPrice);
async function updateBookPrice() {
  try {
    const response = await fetch(`${bookURL}/${updateID}`);
    const book = await response.json();
    console.log(book);
    book.price = updatePrice;
    await fetch(`${bookURL}/${updateID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ price: updatePrice })
    });
    alert('Book price updated successfully!');
    getData()
  } catch (error) {
    console.log(error.message);
  }
}

//Search by title/author
let searchBySelect = document.getElementById("search-by-select")
// .addEventListener("change", async function () {
//   let query = this.value
//   console.log(query);
//   try {
//     let res = await fetch(bookURL);
//     let data = await res.json();
//     let filterdMystery = data.filter((el) => el === query);
//     if (filterdMystery.length > 0) {
//       appendData(filterdMystery)
//     } else {
//       alert("No data of this category");
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
// });
let query = ""
let searchByInput = document.getElementById("search-by-input").addEventListener("input", async function () {
  query = this.value

});
let searchByButton = document.getElementById("search-by-button").addEventListener("click", searchData);
async function searchData() {
  try {
    let res = await fetch(`${bookURL}?q=${query}`);
    let data = await res.json();
    appendData(data)
  } catch (error) {
    console.log(error.message);
  }

}
//Books Data
let booksData = [];

//Logout

if (token) {
  let bookCreateBtn = document.getElementById("add-book").addEventListener("click", AddBook);
  async function AddBook() {
    let bookTitleInput = document.getElementById("book-title").value;
    let bookImageInput = document.getElementById("book-image").value;
    let bookCategoryInput = document.getElementById("book-category").value;
    let bookAuthorInput = document.getElementById("book-author").value;
    let bookPriceInput = document.getElementById("book-price").value;

    let obj = {
      title: bookTitleInput,
      image: bookImageInput,
      category: bookCategoryInput,
      author: bookAuthorInput,
      price: bookPriceInput,
    }
    try {
      let res = await fetch(bookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
      })
      let data = await res.json()
      getData(data)
    } catch (error) {
      console.log(error);
      alert("Plese login first")
    }
  }
} else {
  document.getElementById("add-book").addEventListener("click", alertMesg);
  function alertMesg() {
    alert("Please login")
  }
}

let logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("token");
  alert("Logged out successfully")
  window.location.href = "./index.html";
});






// Update book

let updateBookBtn = document.getElementById("update-book").addEventListener("click", updateBookData);


async function updateBookData() {
  let updateBookIdInput = document.getElementById("update-book-id").value;
  let updateBookTitleInput = document.getElementById("update-book-title").value;
  let updateBookImageInput = document.getElementById("update-book-image").value;
  let updateBookAuthorInput = document.getElementById("update-book-author").value;
  let updateBookCategoryInput = document.getElementById("update-book-category").value;
  let updateBookPriceInput = document.getElementById("update-book-price").value;
  let updateObj = {
    id: updateBookIdInput,
    title: updateBookTitleInput,
    image: updateBookImageInput,
    author: updateBookAuthorInput,
    category: updateBookCategoryInput,
    price: updateBookPriceInput,
  }
  console.log(updateObj);
  try {
    let res = await fetch(`${bookURL}/${updateBookIdInput}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updateObj)
    })
    let data = await res.json()
    alert("Successfully Updated Data")
    getData()
  } catch (error) {
    console.log(error.message);
  }

}