class Book {
  // Data structure for book details


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


  openCard() {
    // Displays current card details in the card form.

    let card = new FormData(myLibrary.cardForm);
  
    card.set('read', Boolean(this.read))

    for (const key of card.keys()) {
      let element = myLibrary.cardForm[key];
      if (element.type === 'checkbox') {
        element.checked = this[key]
      } else {
        element.value = this[key]
      }
    };
    myLibrary.modalBG.style.display = 'flex'
  }


  updateCard() {

  }
}


class Library { 
  // Data structure class for data collection, maintenance and display.

  #shelf = new Array;
  #shelfDisplay = document.getElementById('shelf');
  #currentCard;


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

    
    // prevent form from refreshing page when user submits data 
    if (e) {
      e.preventDefault()
    }

    // if ID in form elements:

      // update book object based on form details (e.g. form.title = book.title)
    
    // else 


    // scrub details from card (this step is skipped when submitting test data)
    if (!details) {
      details = this.readCardForm(e)      
    }

    if (!this.#currentCard) {
      let card = new Card(...details)
      this.shelf.push(card)
      console.log(`<${card.title}> has been added to the library`)
    } else {
      for (const x of this.cardForm) {
        if (x.type === 'submit') {
          continue
        } else if (x.type === 'checkbox' && book[x.id]) {
          x.checked = true
        } else {
          x.value = book[x.id]  
        }
      }
    }
    this.modalBG.style.display = "none"
    

    // creates a new card object and adds the book details to the library shelf
    
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


  readCardForm(e) {
    // Reads & formats user input data for new card creation.          
    
    let formData = new FormData(this.cardForm)

    // let details = new Array()
    // for (const value of formData.values()) {
    //   console.log(value)  
    //   details.push(value)
    // }
    
    let details = [...formData.entries()]

    // console.log(formData.values())

    // let details = Array(...e.target.elements)
    // console.log(details)
    // for (let detail in details) {
    //   console.log(detail)
    //   if (detail.type === 'submit') {
    //     details.pop(detail)
    //   } else if (detail.type === 'checkbox') {
    //     detail = detail.checked
    //   } else {
    //     detail = detail.value
    //   }
    // }
    
    console.log(details)
    return details

  }


  initializeCardForm() {
    // Initializes all details related to the card creation form.

    this.modalBG = document.getElementById("myModal");
    
    this.addBookBtn = document.getElementById("add-book-btn");
    this.addBookBtn.addEventListener('click', () => {this.modalBG.style.display = "block";})

    this.leaveDesk = document.getElementsByClassName("close")[0];
    this.leaveDesk.addEventListener('click', () => {
      this.modalBG.style.display = "none";
    })

    this.cardForm = document.getElementById("book-form");
    this.cardForm.addEventListener('submit', (e) => {this.save(null, e)})

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

}


main = (() => {

  myLibrary = new Library
  
  // temp book objects for testing
  let lotr = ['The Lord of the Rings: The Two Towers', 'J.R.R. Tolkien', 412, true]
  let nineteenEightyFour = ['Nineteen Eighty-four', 'George Orwell', 318, true]
  let theQuietPowerOfIntroverts = ['The Quiet Power of Introverts', 'Susan Cain', 371]
  
  for (i=0; i<6; i++) {
    myLibrary.save(nineteenEightyFour);
    myLibrary.save(lotr);
    myLibrary.save(theQuietPowerOfIntroverts);
  }

})();




// todo: is it possible to "name" the type of object? E.g. to typeof() an object and
// see 'book' or 'card'. Saw this in the reading and think it is. To be tested!

//idea: could checkboxes in formdata object be "abstracted" to look for any/all booleans in the card object?
//idea: could form data objects be passed around during editing?

// stopped at: trying to create edit book feature (l222)
