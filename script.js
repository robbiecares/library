class Book {
  // Data structure for book details


  constructor (title, author, pages, read=false) {
    this.title = title
    this.author = author
    this.pages = Number(pages)
    this.read = Boolean(read)
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
  // Display class for book details

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
    myLibrary.shelfDisplay.appendChild(card)
    
    const cardData = document.createElement('div')
    cardData.classList.add('card-data')
    card.appendChild(cardData)
    
    const cardControls = document.createElement('div')
    cardControls.classList.add('card-controls')
    card.appendChild(cardControls)

    const removeBtn = document.createElement('span')
    removeBtn.classList.add('control', 'close')
    removeBtn.innerHTML = '&times;' 
    removeBtn.addEventListener('click', (e) => this.remove(e))
    cardControls.appendChild(removeBtn)

    const editBtn = document.createElement('span')
    editBtn.classList.add('control')
    editBtn.innerHTML = 'o'
    editBtn.addEventListener('click', () => this.openCard())
    cardControls.appendChild(editBtn)

    let titleAndAuthor = document.createElement('div')
    cardData.appendChild(titleAndAuthor)
    
    let content = document.createElement('div')
    content.classList.add('title')
    content.innerHTML = this.title
    titleAndAuthor.appendChild(content)
    
    content = document.createElement('div')
    content.classList.add('author')
    content.innerHTML =  `by ${this.author}`
    titleAndAuthor.appendChild(content)


    let pagesAndRead = document.createElement('div')
    pagesAndRead.classList.add('pages-and-read')
    cardData.appendChild(pagesAndRead)

    content = document.createElement('div')
    pagesAndRead.appendChild(content)
    content.innerHTML = `pages: ${this.pages}`
  
    let readStatusLabel = document.createElement('div')
    pagesAndRead.appendChild(readStatusLabel)
    readStatusLabel.innerHTML = 'read: '
    let readStatus = document.createElement('span')  
    readStatusLabel.appendChild(readStatus)
    readStatus.classList.add('read-status')
    readStatus.addEventListener('click', (e) => this.updateReadStatus(e))    
    readStatus.innerHTML = `${this.read ? '✓' : '✖'}`
    readStatus.style.color = this.read ? 'green' : 'red'

    console.log(`a new card with ID <${this.id}> has been created`)
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


  openCard() {
    // Displays current card details in the card form.
  
    myLibrary.formData.set('read', Boolean(this.read))
    for (const key of myLibrary.formData.keys()) {
      let element = myLibrary.cardForm[key];
      if (element.type === 'checkbox') {
        element.checked = this[key]
      } else {
        element.value = this[key]
      }
    };
    myLibrary.modalBG.style.display = 'flex'
    console.log('open card: ' + myLibrary.cardForm.id.value)
  }


  updateCard() {
    // collect details from form
    // loop:
      // book(super) attributes = form details
    // run "update display" on card

    console.log('card updated')
  }

}

class Library { 
  // Data structure class for data collection, maintenance and display.

  #shelf = new Array;
  #shelfDisplay = document.getElementById('shelf');

  constructor() {
    this.initializeCardForm();
  }
  

  displayBooks() {
    this.shelfDisplay.innerHTML = ""
    this.shelf.forEach(card => {
        card.createCard();
        this.shelfDisplay.appendChild(card.element);
        // card.setAttribute('style.display', "flex")
      });
  }


  save(details, e=null) {
    // Creates or updates a card based on user or test data and adds the card details to the library shelf.

    
    // prevent page refresh during form submission
    if (e) {
      e.preventDefault();
      this.formData = new FormData(this.cardForm)
    }

    // if the open book has an ID update book details  
    const id = this.formData.get('id')
    if (id) {
      console.log('book has an ID')
      const book = myLibrary.findBook(id)
      book.updateCard()
      return;
    }
    
    // format form data 
    if (!details) {
      details = this.readCardForm();
    }
    
    let card = new Card(...details)
    this.shelf.push(card)
    console.log(`card ID <${card.id}> has been added to the library shelf`)    
    this.modalBG.style.display = "none"

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


  readCardForm() {
    // Formats user input data for new card creation.          
    
    let details = new Array()

    for (let [key, value] of this.formData) {
      details.push(value)
    };
    
    return details
  }
  

  initializeCardForm() {
    // Initializes all details related to the card creation form.

    this.modalBG = document.getElementById("myModal");
    
    this.addBookBtn = document.getElementById("add-book-btn");
    this.addBookBtn.addEventListener('click', this.openDesk)

    this.leaveDesk = document.getElementsByClassName("close")[0];
    this.leaveDesk.addEventListener('click', () => {
      this.modalBG.style.display = "none";
    })

    this.cardForm = document.getElementById("book-form");
    this.cardForm.addEventListener('submit', (e) => {this.save(null, e)})
    this.formData = new FormData(this.cardForm)

    // alternate modal close (looks for clicks outside of the modal)
    window.addEventListener('click', (e) => {
      if (e.target == this.modalBG) {
        this.modalBG.style.display = "none";
      }
    })
  }


  get shelf() {
    return this.#shelf
  }


  set shelf(x) {
    console.log('the shelf cannot be updated directly')
  }


  get shelfDisplay() {
    return this.#shelfDisplay
  }


  set shelfDisplay(x) {
    console.log('the shelf display cannot be updated directly')
  }


  openDesk() {
    myLibrary.modalBG.style.display = "flex";
    myLibrary.cardForm.id.value = ''
  }

}


main = (() => {

  myLibrary = new Library
  
  // temp book objects for testing
  let lotr = ['The Lord of the Rings: The Two Towers', 'J.R.R. Tolkien', '412', true]
  let nineteenEightyFour = ['Nineteen Eighty-four', 'George Orwell', 318, 'true']
  let theQuietPowerOfIntroverts = ['The Quiet Power of Introverts', 'Susan Cain', 371]
  
  for (i=0; i<6; i++) {
    myLibrary.save(lotr);
    myLibrary.save(nineteenEightyFour);
    myLibrary.save(theQuietPowerOfIntroverts);
  }

})();




// todo: is it possible to "name" the type of object? E.g. to typeof() an object and
// see 'book' or 'card'. Saw this in the reading and think it is. To be tested!

//idea: could checkboxes in formdata object be "abstracted" to look for any/all booleans in the card object?
//idea: could form data objects be passed around during editing?

// stopped at: trying to create edit book feature (l222)
