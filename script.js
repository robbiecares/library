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
    myLibrary.shelfDisplay.appendChild(fauxMargin)
    
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

    console.log(`A card has been created for <${this.title}>`)
    return card
  }


  remove(e) {
    this.element.remove()
    console.log(`The card for <${this.title}> has been deleted`)
    myLibrary.removeBook(this)

  }


  updateReadStatus(e) {
    super.updateReadStatus()
    e.target.innerHTML = `${this.read ?'✓' : '✖'}`
    e.target.style.color = this.read ? 'green' : 'red'
  }
}


class Library { 

  shelf = new Array;
  shelfDisplay = document.querySelector('#shelf')


  displayBooks() {
    this.shelfDisplay.innerHTML = ""
    this.shelf.forEach(card => {
        this.shelfDisplay.appendChild(card.element);
        // card.setAttribute('style.display', "flex")
      });
  }


  addBook(e) {
    // Creates a new book and card from the user data and adds the book to the library shelf.
    
      // prevents form from refreshing page upon submission 
      e.preventDefault()
      
      // scrubs form data
      let details = [...e.target.querySelectorAll('textarea, input')]
      details = details.map(deet => deet.type === 'checkbox' ? deet.checked : deet.value)

      // creates a new card object and adds the book details to the library shelf
      let card = new Card(...details)
      this.shelf.push(card)
      main.modal.style.display = "none";
      console.log(`<${card.title}> has been added to the library`)
      return card  
  }


  findBook(id) {
    return this.shelf.find(book => book.id === id)
  }

  removeBook(book) {
    const i = this.shelf.indexOf(book)
    const response = this.shelf.splice(i, 1) ? `<${book.title}> has been removed from the library` : `${book.title} was not found in the library`
    console.log(response)
    this.displayBooks()
  }

}


main = (() => {

  const modal = document.getElementById("myModal");
  const addBookBtn = document.getElementById("add-book-btn");
  const closeModal = document.getElementsByClassName("close")[0];
  let form = document.querySelector('#new-book-form')
  form.addEventListener('submit', (e) => {myLibrary.addBook(e)})

  // display modal
  addBookBtn.onclick = function() {
    modal.style.display = "block";
  }

  // close modal
  closeModal.onclick = function() {
    modal.style.display = "none";
  }

  // alternate modal close (looks for clicks outside of the modal)
  window.onclick = function(e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  }

  myLibrary = new Library
  
  // temp book objects for testing
  // let lotr = ['The Lord of the Rings: The Two Towers', 'J.R.R. Tolkien', 412]
  // let nineteenEightyFour = ['Nineteen Eighty-four', 'George Orwell', 318, true]
  
  // let card = myLibrary.addBook(nineteenEightyFour)
  
  
  // myLibrary.displayBooks()

  return {
    modal
  }

})();




// todo: is it possible to "name" the type of object? E.g. to typeof() an object and
// see 'book' or 'card'. Saw this in the reading and think it is. To be tested!

// todo: add getter/setter for shelf data structure?