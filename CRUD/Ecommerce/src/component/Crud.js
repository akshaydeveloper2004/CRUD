import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";

const initialData = [
  {
    id: 1,
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  { id: 4, title: "The Living Mountain", author: "JK Rowling" },
  {
    id: 5,
    title: "Henrietta Consuelo Sansom",
    author: "Charles Dickens",
  },
  {
    id: 6,
    title: "The Merchant of Venice ",
    author: "William Shakespeare",
  },
  {
    id: 7,
    title: "first really profitable lesson",
    author: "Mark Twain",
  },
  { id: 8, title: "Discovery of India", author: "Jawaharlal Nehru" },
  { id: 9, title: "Making India Awesome", author: "Chetan Bhagat" },
  { id: 10, title: "A Passage to England ", author: "Nirad C. Chaudhuri" },
];

const PAGE_SIZE = 5;

const App = () => {
  const [data, setData] = useState(initialData);
  const [formData, setFormData] = useState({
    newTitle: "",
    newAuthor: "",
    editedTitle: "",
    editedAuthor: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = (id) => {
    setData(data.filter((book) => book.id !== id));
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setFormData({
      ...formData,
      editedAuthor: book.author,
      editedTitle: book.title,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    const updatedData = data.map((book) =>
      book.id === selectedBook.id
        ? {
            ...book,
            title: formData.editedTitle,
            author: formData.editedAuthor,
          }
        : book
    );
    setData(updatedData);
    setShowEditModal(false);
  };

  const handleAdd = () => {
    const newBook = {
      id: data.length + 1,
      title: formData.newTitle,
      author: formData.newAuthor,
    };
    setData([...data, newBook]);
    setShowAddModal(false);
  };

  const filteredData = data.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedData = sortKey
    ? [...filteredData].sort((a, b) => {
        const compareValueA = a[sortKey].toLowerCase();
        const compareValueB = b[sortKey].toLowerCase();
        if (compareValueA < compareValueB) {
          return sortOrder === "asc" ? -1 : 1;
        }
        if (compareValueA > compareValueB) {
          return sortOrder === "asc" ? 1 : -1;
        }
        return 0;
      })
    : filteredData;

  const pageCount = Math.ceil(sortedData.length / PAGE_SIZE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="container mt-4">
      <h1 className="text-success text-center">WELCOME</h1>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Add Book
      </Button>
      <div>
        <Form.Control
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-2"
        />
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => setSortKey("id")}>id</th>
            <th onClick={() => setSortKey("title")}>
              Title {sortKey === "title" && sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th onClick={() => setSortKey("author")}>
              Author {sortKey === "author" && sortOrder === "asc" ? "▲" : "▼"}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.author}</td>
              <td>
                <Button variant="info" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="newTitle"
                value={formData.newTitle}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author"
                name="newAuthor"
                value={formData.newAuthor}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add Book
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEditedTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="editedTitle"
                value={formData.editedTitle}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEditedAuthor">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter author"
                name="editedAuthor"
                value={formData.editedAuthor}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: pageCount }).map((_, index) => (
          <Button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            variant={currentPage === index + 1 ? "primary" : "light"}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default App;
