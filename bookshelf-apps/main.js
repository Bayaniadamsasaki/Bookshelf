document.addEventListener("DOMContentLoaded", function () {
    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
  
    const STORAGE_KEY = "BOOKSHELF_APPS";
  
    function generateId() {
      return +new Date();
    }
  
    function saveDataToStorage(books) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  
    function getDataFromStorage() {
      const storedData = localStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    }
  
    function renderBook(book, shelf) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");
      bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="${shelf === "incomplete" ? "green" : "red"}">${shelf === "incomplete" ? "Selesai dibaca" : "Belum selesai dibaca"}</button>
          <button class="red">Hapus buku</button>
        </div>
      `;
  
      const toggleButton = bookItem.querySelector(".action button:first-child");
      const deleteButton = bookItem.querySelector(".action button:last-child");
  
      toggleButton.addEventListener("click", function () {
        const targetShelf = shelf === "incomplete" ? completeBookshelfList : incompleteBookshelfList;
        targetShelf.appendChild(bookItem);
        book.isComplete = !book.isComplete;
        saveDataToStorage(books);
        renderAllBooks(books); 
      });
  
      deleteButton.addEventListener("click", function () {
        bookItem.remove();
        books = books.filter((storedBook) => storedBook.id !== book.id);
        saveDataToStorage(books);
        renderAllBooks(books); 
      });
  
      return bookItem;
    }
  
    function renderAllBooks(booksToRender) {
      incompleteBookshelfList.innerHTML = "";
      completeBookshelfList.innerHTML = "";
  
      booksToRender.forEach((book) => {
        const shelf = book.isComplete ? "complete" : "incomplete";
        const shelfList = shelf === "incomplete" ? incompleteBookshelfList : completeBookshelfList;
        shelfList.appendChild(renderBook(book, shelf));
      });
    }
  
    let books = getDataFromStorage();
  
    renderAllBooks(books);
  
    inputBookForm.addEventListener("submit", function (event) {
      event.preventDefault();
    
      const titleInput = document.getElementById("inputBookTitle");
      const authorInput = document.getElementById("inputBookAuthor");
      const yearInput = document.getElementById("inputBookYear");
      const isCompleteInput = document.getElementById("inputBookIsComplete");
    
      const year = parseInt(yearInput.value, 10);
    
      const newBook = {
        id: generateId(),
        title: titleInput.value,
        author: authorInput.value,
        year: year,
        isComplete: isCompleteInput.checked,
      };
    
      books.push(newBook);
      saveDataToStorage(books);
    
      renderAllBooks(books); 
    
      titleInput.value = "";
      authorInput.value = "";
      yearInput.value = "";
      isCompleteInput.checked = false;
    });
  
    searchBookForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const searchTitleInput = document.getElementById("searchBookTitle");
      const searchTitle = searchTitleInput.value.toLowerCase();
  
      const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
  
      renderAllBooks(filteredBooks);
    });
  });
  