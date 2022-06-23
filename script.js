class Book {
  // Data structure for book details


  constructor (title, author, pages, read=false) {
    this.title = title
    this.author = author
    this._pages = Number(pages)
    this._read = Boolean(read)
    this._id = Date.now()
  }


  displayInfo() {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read': 'not read yet'}`
  }


  get pages() {
    return this._pages
  }


  set pages(i) {
    this._pages = Number(i)
  }


  get read() {
    return this._read
  }


  set read(i) {
    this._read = i === 'false'? false : Boolean(i)
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
    // creates the DOM elements of the card and set variables for the each detail

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
    removeBtn.classList.add('fa')
    removeBtn.innerHTML = '&#xf00d;' 
    removeBtn.addEventListener('click', (e) => this.remove(e))
    cardControls.appendChild(removeBtn)

    const editBtn = document.createElement('span')
    editBtn.classList.add('control')
    editBtn.classList.add('material-icons')
    editBtn.innerHTML = '&#xe3c9;'
    editBtn.addEventListener('click', () => this.openCard())
    cardControls.appendChild(editBtn)
    
    // title
    let content = document.createElement('div')
    cardData.appendChild(content)
    content.classList.add('title')
    content.innerHTML = this.title
    this.titleElement = content

    // author
    let label = document.createElement('div')
    cardData.appendChild(label)
    label.classList.add('label')
    label.innerHTML = 'by'

    content = document.createElement('span')
    label.appendChild(content)
    content.classList.add('author')
    content.innerHTML =  this.author
    this.authorElement = content


    // elements which should appear at the bottom of the card
    const bottomElements = document.createElement('div')
    bottomElements.classList.add('bottom-elements')
    cardData.appendChild(bottomElements)

    // pages
    label = document.createElement('div')
    bottomElements.appendChild(label)    
    label.classList.add('label')
    label.innerHTML = 'pages:'
    
    content = document.createElement('span')
    label.appendChild(content)
    content.innerHTML = this.pages
    this.pagesElement = content
  
    // read
    label = document.createElement('div')
    bottomElements.appendChild(label)
    label.classList.add('label')
    label.innerHTML = 'read:'

    content = document.createElement('span')  
    label.appendChild(content)
    content.classList.add('read-status')
    content.classList.add('fa')
    content.addEventListener('click', (e) => this.updateReadStatus(e));
    this.readElement = content;
    this.setReadElement();
    
    console.log(`a new card with ID <${this.id}> has been created`)
    return card
  }


  remove(e) {
    this.element.remove()
    console.log(`The card with id ${this.id} has been deleted`)
    myLibrary.removeBook(this)

  }


  setReadElement(){
    // Updates display element for book's 'read' attribute.
    this.readElement.innerHTML = `${this.read ? '&#xf00c;' : '&#xf00d;'}`;
    this.readElement.style.color = this.read ? 'green' : 'red';
  }


  updateReadStatus(e) {
    super.updateReadStatus()
    this.setReadElement()
    
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


  updateCard(details) {
    // Updates details of existing card object and its display elements.
    
    details.delete('id')
    details.set('read', myLibrary.cardForm.read.checked)
    for (let [key, value] of details.entries()) {    
      console.log(key, value)
      this[key] = value;
      this[key + 'Element'].innerHTML = this[key]
    }
    this.setReadElement()

    console.log('card updated')
    myLibrary.modalBG.style.display = "none"

  }

}

class Library { 
  // Data structure class for data collection, maintenance and display.

  #shelf = new Array;
  #shelfDisplay = document.getElementById('shelf');

  constructor() {
    this.initializeCardDesk();
  }
  

  displayBooks() {
    this.shelfDisplay.innerHTML = ""
    this.shelf.forEach(card => {
        this.shelfDisplay.appendChild(card.element);
      });
  }


  save(details, e=null) {
    // Creates or updates a card based on user or test data and adds the card details to the library shelf.

    this.formData = new FormData(this.cardForm)
    const id = Number(this.formData.get('id'))
    
    // prevent page refresh during form submission
    if (e) {
      e.preventDefault();
    }
    
    // create new book
    if (!id) {
      // format form data 
      if (!details) {
        details = this.readCardForm();
      }
      let card = new Card(...details)
      this.shelf.push(card)
      console.log(`card ID <${card.id}> has been added to the library shelf`)
    // update existing book
    } else {
      let book = myLibrary.findBook(id)
      book.updateCard(this.formData)
    }
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
    this.formData.set('read', this.cardForm.read.checked)
    for (let [_, value] of this.formData) {
      details.push(value)
    };
    // console.log(details)
    return details
  }
  

  initializeCardDesk() {
    // Initializes all objects and events necessary for card creation.

    this.modalBG = document.getElementById("modal");
    
    this.addBookBtn = document.getElementById("add-book-btn");
    this.addBookBtn.addEventListener('click', this.openDesk)

    this.leaveDesk = document.getElementById("leave-desk");
    this.leaveDesk.addEventListener('click', () => {
      this.modalBG.style.display = "none";
    })

    this.cardForm = document.getElementById("book-form");
    this.cardForm.addEventListener('submit', (e) => {this.save(null, e)})
    this.formData = null;

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
  
  for (i=0; i<1; i++) {
    myLibrary.save(lotr);
    myLibrary.save(nineteenEightyFour);
    myLibrary.save(theQuietPowerOfIntroverts);
  }

})();


// todo: is it possible to "name" the type of object? E.g. to typeof() an object and
// see 'book' or 'card'. Saw this in the reading and think it is. To be tested!

//idea: could checkboxes in formdata object be "abstracted" to look for any/all booleans in the card object?
