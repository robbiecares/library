// temp book objets for testing
let lotr = ['The Lord of the Rings: The Two Towers', 'J.R.R. Tolkien', 412]
let nineteenEightyFour = ['Nineteen Eighty-four', 'George Orwell', 318, true]

let myLibrary = [];

const cardHolder = document.querySelector('#card-holder')

let form = document.querySelector('#new-book-form')

form.addEventListener('submit', addBookToLibrary)


// Book object details
function Book(title, author, pages, read=false) {
  this.title = title
  this.author = author
  this.pages = pages
  this.read = read

}
Book.prototype.info = function() {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read': 'not read yet'}`
}
Book.prototype.updateReadStatus = function () {
  this.read = !this.read 
}


function addBookToLibrary(e) {
  // Converts the form data into a book object and adds it to the array of books
  
    // prevents form from submitting and refreshing page
    e.preventDefault()
    
    // scrubs form data
    let details = [...form.querySelectorAll('textarea, input')]
    details = details.map(deet => deet.type === 'checkbox' ? deet.checked : deet.value)

    // creates book object and adds it to library
    const book = new Book(...details)
    book.id = myLibrary.push(book) - 1
    modal.style.display = "none";
    displayBooks()
}


function displayBooks() {
  cardHolder.innerHTML = ''
  myLibrary.forEach(book => {
    createCard(book)
  })
}


function createCard(book) {
    // Creates a new card containing to display the book's details.

    const card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-book-id', book.id)

    // ensures all cards in the holder have equal borders and spacing
    const fauxMargin = document.createElement('div')
    fauxMargin.classList.add('card-faux-margin')
    fauxMargin.appendChild(card)
    cardHolder.appendChild(fauxMargin)
    
    const cardDetails = document.createElement('div')
    cardDetails.classList.add('card-details')
    card.appendChild(cardDetails)

    const removebtn = document.createElement('span')
    removebtn.classList.add('close')
    removebtn.innerHTML = '&times;' 
    removebtn.addEventListener('click', removeCard)
    card.appendChild(removebtn)

    const titleAndAuthor = document.createElement('div')
    titleAndAuthor.classList.add('title-and-author')
    cardDetails.appendChild(titleAndAuthor)

    // adds book details to card
    deets = Object.entries(book)
    deets.forEach(deet => {
      let [key, value] = deet
      let detail = document.createElement('div')
      detail.classList.add(key)
      
      // formats how details should be displayed on card
      if (key !== 'id') {
        switch (key) {
          case 'title':
            detail.innerHTML = value
            titleAndAuthor.appendChild(detail)             
            break;
          case 'author':
            detail.innerHTML = `by ${value}`
            titleAndAuthor.appendChild(detail)
            break;
          case 'pages':
            detail.innerHTML = `${value} ${key}`
            cardDetails.appendChild(detail)        
            break;
          case 'read':
            detail.innerHTML = `${key}: `
            readStatus = document.createElement('span')  
            readStatus.classList.add('read-status')
            readStatus.addEventListener('click', updateCardReadStatus)
            detail.appendChild(readStatus)
            readStatus.innerHTML = `${value ? '✓' : '✖'}`
            readStatus.style.color = book.read ? 'green' : 'red'
            cardDetails.appendChild(detail)        
            break;
        }
      }
    })
}


function removeCard() {
  const card = this.closest('.card')
  const id = Number(card.getAttribute('data-book-id'))
  delete myLibrary[id]
  cardHolder.removeChild(card.parentElement)
}


function updateCardReadStatus() {
  const card = this.closest('.card')
  const id = Number(card.getAttribute('data-book-id'))
  const book = myLibrary[id]
  book.updateReadStatus()
  this.innerHTML = `${book.read ?'✓' : '✖'}`
  this.style.color = book.read ? 'green' : 'red'
}


// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const addBookBtn = document.getElementById("add-book-btn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
addBookBtn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function main() {
  displayBooks()
}

main()