// Book object details
class Book {

  constructor (title, author, pages, read=false) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read
    this._id = Date.now()
  }


  displayInfo = () => {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read': 'not read yet'}`
  }


  get id() {
    return this._id
  }


  set id(i) {
    console.log("this book already has an ID")
  }
  
  
  updateReadStatus() {
    this.read = !this.read;
    console.log(`fully read?: ${this.read}`)
  }
}


class Card extends Book {

  // Creates a new card to display the book's details.
  constructor (title, author, pages, read) {
    super(title, author, pages, read);
    this.element = this.createCard();
    }

  createCard() {
    // creates the DOM elements for the card

    const card = document.createElement('div')
    card.classList.add('card')
    card.setAttribute('data-id', super.id)

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
    removebtn.addEventListener('click', (e) => this.remove(e))
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
    readStatus.addEventListener('click', (e) => this.updateReadStatus(e))
    content.appendChild(readStatus)
    readStatus.innerHTML = `${this.read ? '✓' : '✖'}`
    readStatus.style.color = this.read ? 'green' : 'red'
    cardDetails.appendChild(content)

    return card
  }


  remove(e) {
    console.log(this)
    shelf.remove(this.element.parentElement)
    myLibrary.removeBook(this)

  }


  updateReadStatus(e) {
    super.updateReadStatus()
    e.target.innerHTML = `${this.read ?'✓' : '✖'}`
    e.target.style.color = this.read ? 'green' : 'red'
  }
}


class Library { 

  // todo: shelf should be 'read only' - add getter/setter
  shelf = new Array;

  displayBooks() {
    shelf.innerHTML = ""
    this.shelf.forEach(book =>       
      new Card(book))
  }


  addBook(deets) {
    // Creates a new book and card from the user data and adds the book to the library shelf.
    
      // prevents form from submitting and refreshing page
      // e.preventDefault()
      
      // scrubs form data
      let details = [...form.querySelectorAll('textarea, input')]
      details = details.map(deet => deet.type === 'checkbox' ? deet.checked : deet.value)
  
      // creates a new card object and adds the book details to the library shelf
      let card = new Card(...deets)
      this.shelf.push(card)
      modal.style.display = "none";
      console.log(`<${card.title}> has been added to the library shelf`)
      // this.displayBooks()
      return card  
  }

  findBook(id) {
    return this.shelf.find(book => book.id === id)
  }

  removeBook(book) {
    const i = this.shelf.indexOf(book)
    const response = this.shelf.splice(i, 1) ? `${book.title} removed` : `${book.title} not found`
    console.log(response)
  }

}


function displayBooks() {
  shelf.innerHTML = ''
  myLibrary.forEach(book => {
    createCard(book)
  })
}


function main() {

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

  myLibrary = new Library
  
  // temp book objects for testing
  // let lotr = ['The Lord of the Rings: The Two Towers', 'J.R.R. Tolkien', 412]
  let nineteenEightyFour = ['Nineteen Eighty-four', 'George Orwell', 318]
  
  let card = myLibrary.addBook(nineteenEightyFour)
  

  
  
  // myLibrary.displayBooks()
}





main()



// todo: is it possible to "name" the type of object? E.g. to typeof() an object and
// see 'book' or 'card'. Saw this in the reading and think it is. To be tested!