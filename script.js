// Book object details
class Book {

  constructor (title, author, pages, read=false) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this.id = null
  }

  displayInfo = () => {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read': 'not read yet'}`
  }

  updateReadStatus = () => {
    this.read = !this.read;
    console.log(`fully read?: ${this.read}`)
  }

  get id() {
    return this._id
  }

  set id(i) {
    if (!this.id) {
      this._id = i
    } else {
      console.log("this book already has an ID")
    }
  }

}

class Card extends Book {


  // Creates a new card to display the book's details.
  constructor (title, author, pages, read=false) {
    super(title, author, pages, read=false);
    this.element()
    }

    element() {
      // creates the DOM elements for the card
      
      const card = document.createElement('div')
      card.classList.add('card')
      // card.setAttribute('data-book-id', this.id)

      // ensures all cards in the holder have equal borders and spacing
      const fauxMargin = document.createElement('div')
      fauxMargin.classList.add('card-faux-margin')
      fauxMargin.appendChild(card)
      shelf.appendChild(fauxMargin)
      
      const cardDetails = document.createElement('div')
      cardDetails.classList.add('card-details')
      card.appendChild(cardDetails)

      const removebtn = document.createElement('span')
      removebtn.classList.add('close')
      removebtn.innerHTML = '&times;' 
      removebtn.addEventListener('click', removeCard)
      card.appendChild(removebtn)

      let titleAndAuthor = document.createElement('div')
      titleAndAuthor.classList.add('title-and-author')
      cardDetails.appendChild(titleAndAuthor)
      
      let content = document.createElement('div')
      content.innerHTML = this.title
      titleAndAuthor.appendChild(content)
      
      content = document.createElement('div')
      content.innerHTML = this.author
      titleAndAuthor.appendChild(content)

      content = document.createElement('div')
      content.innerHTML = this.pages
      cardDetails.appendChild(content)

      content = document.createElement('div')
      let readStatus = document.createElement('span')  
      readStatus.classList.add('read-status')
      readStatus.addEventListener('click', updateCardReadStatus)
      content.appendChild(readStatus)
      readStatus.innerHTML = `${this.read ? '✓' : '✖'}`
      readStatus.style.color = this.read ? 'green' : 'red'
      cardDetails.appendChild(content)   


    }
    
    // adds book details to card
      
    // formats how details should be displayed on card
    // if (key !== 'id') {
    //   switch (key) {
    //     case 'title':
    //       detail.innerHTML = value
    //       titleAndAuthor.appendChild(detail)             
    //       break;
    //     case 'author':
    //       detail.innerHTML = `by ${value}`
    //       titleAndAuthor.appendChild(detail)
    //       break;
    //     case 'pages':
    //       detail.innerHTML = `${value} ${key}`
    //       cardDetails.appendChild(detail)        
    //       break;
    //     case 'read':
    //       detail.innerHTML = `${key}: `
    //       readStatus = document.createElement('span')  
    //       readStatus.classList.add('read-status')
    //       readStatus.addEventListener('click', updateCardReadStatus)
    //       detail.appendChild(readStatus)
    //       readStatus.innerHTML = `${value ? '✓' : '✖'}`
    //       readStatus.style.color = book.read ? 'green' : 'red'
    //       cardDetails.appendChild(detail)        
    //       break;
    //   }
    // }
  
  remove() {
    // 
  }

  updateReadStatus() {
    // 
  }
}


class Library { 

  // todo: shelf should be 'read only' - add getter/setter
  #shelf = new Array;

  displayBooks() {
    shelf.innerHTML = ""
    this.#shelf.forEach(book =>       
      new Card(book))
  }

  addBook(deets) {
    // Creates a new book and card from the user data and adds the book to the library shelf.
    
      // // prevents form from submitting and refreshing page
      // e.preventDefault()
      
      // // scrubs form data
      // let details = [...form.querySelectorAll('textarea, input')]
      // details = details.map(deet => deet.type === 'checkbox' ? deet.checked : deet.value)
  
      // creates a new book object and adds it to library
      let card = new Card(...deets)
      card.id = this.#shelf.push(card)
      modal.style.display = "none";
      console.log(`<${card.title}> has been added to the library shelf`)
      // this.displayBooks()
      
      return card
      
  }

  createCard(book) {

    let card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-book-id', book.id)

    // ensures all cards in the holder have equal borders and spacing
    const fauxMargin = document.createElement('div')
    fauxMargin.classList.add('card-faux-margin')
    fauxMargin.appendChild(card)
    shelf.appendChild(fauxMargin)
    
    const cardDetails = document.createElement('div')
    cardDetails.classList.add('card-details')
    card.appendChild(cardDetails)

    const removebtn = document.createElement('span')
    removebtn.classList.add('close')
    removebtn.innerHTML = '&times;' 
    removebtn.addEventListener('click', removeCard)
    card.appendChild(removebtn)

    let titleAndAuthor = document.createElement('div')
    titleAndAuthor.classList.add('title-and-author')
    cardDetails.appendChild(titleAndAuthor)
    
    let content = document.createElement('div')
    
    content.innerHTML = book.title
    titleAndAuthor.appendChild(content)
    
    content.innerHTML = book.author
    titleAndAuthor.appendChild(content)
  }

}


// function addBookToLibrary(e) {
//   // Converts the form data into a book object and adds it to the array of books
  
//     // prevents form from submitting and refreshing page
//     e.preventDefault()
    
//     // scrubs form data
//     let details = [...form.querySelectorAll('textarea, input')]
//     details = details.map(deet => deet.type === 'checkbox' ? deet.checked : deet.value)

//     // creates book object and adds it to library
//     let  book = new Book(...details)
//     book.id = myLibrary.push(book) - 1
//     modal.style.display = "none";
//     displayBooks()
// }


function displayBooks() {
  shelf.innerHTML = ''
  myLibrary.forEach(book => {
    createCard(book)
  })
}


function createCard(book) {
    // Creates a new card to display the book's details.

    const card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-book-id', book.id)

    // ensures all cards in the holder have equal borders and spacing
    const fauxMargin = document.createElement('div')
    fauxMargin.classList.add('card-faux-margin')
    fauxMargin.appendChild(card)
    shelfDiv.appendChild(fauxMargin)
    
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
  shelf.removeChild(card.parentElement)
}





function updateCardReadStatus() {
  const card = this.closest('.card')
  const id = Number(card.getAttribute('data-book-id'))
  const book = myLibrary[id]
  book.updateReadStatus()
  this.innerHTML = `${book.read ?'✓' : '✖'}`
  this.style.color = book.read ? 'green' : 'red'
}


let myLibrary = new Array;
const shelf = document.querySelector('#shelf')

const modal = document.getElementById("myModal");
const addBookBtn = document.getElementById("add-book-btn");
const closeModal = document.getElementsByClassName("close")[0];
let form = document.querySelector('#new-book-form')
// form.addEventListener('submit', addBookToLibrary)
// form.addEventListener('submit', (e) => {Library.addBook(e)})

// display modal
addBookBtn.onclick = function() {
  modal.style.display = "block";
}

// close modal
closeModal.onclick = function() {
  modal.style.display = "none";
}

// alternate modal close (looks for clicks outside of the modal)
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function main() {
  myLibrary = new Library
  
  // temp book objects for testing
  // let lotr = ['The Lord of the Rings: The Two Towers', 'J.R.R. Tolkien', 412]
  let nineteenEightyFour = ['Nineteen Eighty-four', 'George Orwell', 318, true]
  
  let card = myLibrary.addBook(nineteenEightyFour)
  

  
  
  // myLibrary.displayBooks()
}





main()



// todo: determine how book ID will be added to card object. Current issue, id 
// is returned during push to shelf and shelf holds books objects. I need
//  an object to push to shelf and I need to push and object to get it's ID.
//  Must touch object twice :-(

// todo: is it possible to "name" the type of object? E.g. to typeof() an object and
// see 'book' or 'card'. Saw this in the reading and think it is. To be tested!

// stopped at: read status is not being read properly during book/card creation




