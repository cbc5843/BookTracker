import { useState } from "react";


const initialBooks = [
  {
    id: 118836,
    name: "Mistborn",
    image: "https://i.pravatar.cc/48?u=118836",
    completedStatus: "started",
  },
  {
    id: 933372,
    name: "Bunny",
    image: "https://i.pravatar.cc/48?u=933372",
    completedStatus: "finished",
  },
  {
    id: 499476,
    name: "Game of Thrones",
    image: "/images/mistborn.jpg",
    completedStatus: "notStarted",
  },
];

//Reusable button
function Button({children, onClick}){
  return <button className="button" onClick={ onClick }>{children}</button>
}

export default function App(){
  //State of book list
  const [books, setBooks] = useState(initialBooks);
  //State of add book form
  const [showAddBook, setShowAddBook] = useState(false)
  //State of book selected or not
  const [selectedBook, setSelectedBook] = useState(null)
  //State of search
  const [query, setQuery] = useState("")


  function handleShowAddBook(){
    setShowAddBook((show) => !show)
  }

  function handleAddBook(book){
    //Create new array with added book at the end
    setBooks((books) => [...books, book]);
    setShowAddBook(false)
  }

  function handleSelection(book){
    setSelectedBook((current) =>
    current?.id === book.id ? null : book)

    //Close add friend box
    setShowAddBook(false)
  }

  function handleBookUpdate(value){
    console.log(value)

    //Update the book array 
    setBooks((books) =>  
    books.map((book) =>
      book.id === selectedBook.id ? 
      {...book, completedStatus: value } 
      : book
    )
    ) 
    

    //Deselect and close detail box
    setSelectedBook(null);
  }

  return(
    <div className="app">
      <div className="sidebar">
      <h1>Books</h1>
      <input type="text" 
        placeholder="Search" 
        className="search" 
        onChange={(e) => setQuery(e.target.value)}
      />
        <BookList 
          books={books}   
          selectedBook={selectedBook} 
          onSelection={handleSelection} 
          query={query}
          />

        {showAddBook && <FormAddBook onAddBook={handleAddBook} />} 

        <Button onClick={handleShowAddBook}>
          {showAddBook ? "Close" : "Add Book"}
        </Button> 
      </div>
      {selectedBook && 
      <FormBookDetails 
        selectedBook={selectedBook} 
        onUpdateStatus={handleBookUpdate}
      />}
    </div>
  )
}

//List of books 
function BookList({books, selectedBook, onSelection, query}){
  return(
    <ul>
    {books.filter((book) => book.name.toLowerCase().includes(query)).map((book) =>(
      <Book book={book} key={book.id} 
      selectedBook={selectedBook}
      onSelection={onSelection}
      />
    ))}
    </ul>
  )

}

//Single book
function Book({book, selectedBook, onSelection}){
const isSelected = selectedBook?.id ===book.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={book.image} alt={book.name} />
      <h3>{book.name}</h3>

      {
        book.completedStatus === "started" && (
          <p className="red">
            You are reading {book.name} 
          </p>
        )
      }
            {
        book.completedStatus === "finished" && (
          <p className="green">
            You finished {book.name}
          </p>
        )
      }
            {
        book.completedStatus === "notStarted" && (
          <p>
            You have not started {book.name} 
          </p>
        )
      }

      <Button onClick={() => onSelection(book)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  )
}

//Add book
function FormAddBook({onAddBook}){
  //State for each input
  const[name, setName] = useState("");
  const[image, setImage] = useState("https://i.pravatar.cc/48")

  function handleSubmit(e){
    //Dont reload page
    e.preventDefault();

    //Only return newBook if data is put in form
    if (!name || !image) return;

    //Generate random id for each friend
    const id = crypto.randomUUID();

    const newBook ={
      id,
      name,
      image: `${image}?=${id}`,
      completedStatus: "notStarted",
      
    }
  
    onAddBook(newBook);
  
    setName("");
    setImage("https://i.pravatar.cc/48")
  }

  return(
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>📗Book Name</label>
      <input type="text" 
      value={name}
      onChange={(e) => setName(e.target.value)}/>

      <label>🌅Cover URL</label>
      <input type="text" 
      value={image}
      onChange={(e) => setImage(e.target.value)}/>

      <Button>Add</Button>
    </form>
  )
}

//View and modify book details
function FormBookDetails({selectedBook, onUpdateStatus}){
    //State of book status
    const [bookStatus, setBookStatus]= useState("notStarted")

    function handleSubmit(e){
      e.preventDefault();

      onUpdateStatus(bookStatus)
    }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>{selectedBook.name}</h2>

      <label>📝Book Notes</label>
      <input type="text" />

      <label>⭐️Book Rating (out of 5)</label>
      <input type="text" />

      <label>✅Book Status</label>
      <select value={bookStatus} onChange={(e) => setBookStatus(e.target.value)}>
        <option value="notStarted"></option>
        <option value="started">started</option>
        <option value="finished">finished</option>
      </select>

      <Button>Update</Button>
      </form>
  )
}