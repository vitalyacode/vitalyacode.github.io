let library = [];
let dataCounter = 0;
let titleMaxLength = 45;

function shortifyBySpace(text, titleMaxLength) {
    let temp = text.split(" ");
    let acc = 0;
    if(text.length > titleMaxLength) {
        for(let i = 0; i < temp.length - 1; i++) {
            if(acc + i + temp[i].length <= titleMaxLength && acc + temp[i].length + temp[i + 1].length + i + 1 >= titleMaxLength) {
                return text.slice(0, acc + temp[i].length) + "..."
            }
            acc += temp[i].length + 1;
        }
    } else {
        return text;
    }
}

function initializeLibrary() {
    if(localStorage.books) {
        if(localStorage.length) {
            let tempLibrary;
            tempLibrary = JSON.parse(localStorage.getItem("books"));
            dataCounter = JSON.parse(localStorage.getItem("id"))
            tempLibrary.forEach(e => {
                library.push(new Book(e.title, e.author, parseInt(e.pageNumber), e.read, e.data));
                addBookHTML(e);
            })
        }
    }
}

initializeLibrary();

function saveLibrary() {
    localStorage.clear();
    localStorage.setItem("books", JSON.stringify(library));
    localStorage.setItem("id", dataCounter);
    
}

function Book(title, author, pageNumber, read, data) {
    this.title = title.replace(/\s+/g,' ').trim();
    this.author = author;
    this.pageNumber = pageNumber;
    this.read = read;
    this.data = data; //book's id
    this.displayTitle = shortifyBySpace(this.title, titleMaxLength);
}

function addBook(title, author, pageNumber, read, data) {
    library.push(new Book(title, author, parseInt(pageNumber), read, data));
    addBookHTML(library[library.length - 1])
    dataCounter++;
}

function addBookHTML(book) {
    let newBook = document.createElement("div");
    let title = document.createElement("p");
    title.innerText = `"${book.displayTitle}"`;
    title.setAttribute("class", "title");
    let author = document.createElement("p");
    author.innerText = "Author: " + book.author;
    author.setAttribute("class", "author");
    let pageNumber = document.createElement("p");
    pageNumber.innerText = "Pages: " + book.pageNumber;
    pageNumber.setAttribute("class", "page-number");
    let read = document.createElement("p");
    read.innerText = book.read ? "This book has been read" : "This book has not been read";
    read.setAttribute("class", "read");
    let deleteBook = document.createElement("div");
    deleteBook.innerText = "x";
    deleteBook.setAttribute("class", "delete-book");
    deleteBook.setAttribute("data-index", book.data);
    
    newBook.appendChild(deleteBook);
    newBook.appendChild(title);
    newBook.appendChild(author);
    newBook.appendChild(pageNumber);
    newBook.appendChild(read);
    newBook.setAttribute("class", "book");
    newBook.setAttribute("data", book.data);
     
    let parent = document.getElementById("books");
    let addBook = document.getElementById("add-book");
    parent.insertBefore(newBook, addBook);
    
}

let addButton = document.getElementById("add-book");
let addBookForm = document.getElementById("add-book-form")
addButton.addEventListener("click", () => {
    addBookForm.style.display = "block";
    descriptionForm.style.display = "none";
})
let closeBookForm = document.getElementById("close-form")
closeBookForm.addEventListener("click", () => {
    addBookForm.style.display = "none";
})

let submitNewBook = document.getElementById("add-book-button");
submitNewBook.addEventListener("click", () => {
    let titleInput = document.getElementById("title-input");
    let authorInput = document.getElementById("author-input");
    let numberInput = document.getElementById("number-input");
    let readInput = document.getElementById("read-input");
    if(titleInput.value && authorInput.value && numberInput.value > 0) {
        addBook(titleInput.value, authorInput.value, numberInput.value, readInput.checked, dataCounter);
        addBookForm.style.display = "none";
        titleInput.value = "";
        authorInput.value = "";
        numberInput.value = 0;
        readInput.checked = false;
        saveLibrary();
    }
})

let descriptionForm = document.getElementById("book-description");

let descriptionTitle = document.getElementById("desc-title");
let descriptionAuthor = document.getElementById("desc-author");
let descriptionNumber = document.getElementById("desc-number");

let currentElement;
let id, book;

function getDescription(element) {
    addBookForm.style.display = "none";
    descriptionForm.style.display = "block";
    
    //element.getAttribute("data")
    id = element.getAttribute("data");

    book = library.filter(obj => {
        return obj.data == id;
    })[0]
    descriptionTitle.value = book.title;
    descriptionAuthor.value = book.author;
    descriptionNumber.value = parseInt(book.pageNumber);

    currentElement = element;
}

document.getElementById("close-description").addEventListener("click", () => {
    descriptionForm.style.display = "none";
})

document.addEventListener("click", e => {
    if(e.target.classList.contains("delete-book")) {
        library.forEach((elem, index) => {
            if(e.target.dataset.index == elem.data) {
                e.target.parentNode.remove()
                library.splice(index, 1);
                saveLibrary();
            }
        })  
    }
     else if(e.target.classList.contains("read")) {
        library.forEach((elem, index) => {
            if(e.target.parentNode.getAttribute("data") == elem.data) {
                library[index].read = !library[index].read;
                e.target.innerText = library[index].read ? "This book has been read" : "This book has not been read";
                saveLibrary()
            }
        }) 
    } else if(e.target.classList.contains("book")) {
        getDescription(e.target);
    } else if(e.target.parentNode.classList) {
        if(e.target.parentNode.classList.contains("book")) {
            getDescription(e.target.parentNode);
        }
    }
})

document.getElementById("edit-book-btn").addEventListener("click", e => {
    if(descriptionTitle.value && descriptionAuthor.value && descriptionNumber.value > 0) {
        book.title = descriptionTitle.value;
        book.displayTitle = shortifyBySpace(descriptionTitle.value, titleMaxLength);
        book.author = descriptionAuthor.value;
        book.pageNumber = parseInt(descriptionNumber.value);
        currentElement.querySelectorAll(".title")[0].innerText = `"${book.displayTitle}"`;
        currentElement.querySelectorAll(".author")[0].innerText = `Author: ${descriptionAuthor.value}`;
        currentElement.querySelectorAll(".page-number")[0].innerText = `Pages: ${descriptionNumber.value}`;
        e.target.parentNode.style.display = "none";
        saveLibrary();
    }
})
