import React, {useEffect, useState} from 'react';
import { loadInfo, addInfo, updateInfo, deleteInfo } from './InfoManager.js';
import { Modal, Form, Button } from 'react-bootstrap'
import  DataTable from 'react-data-table-component'

function Info() {
  const [infos, setInfos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [content, setContent] = useState();
  const [title, setTitle] = useState();
  const [id, setID] = useState();
  const [operation, setOperation] = useState();
  const [validated, setValidated] = useState(false);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const infos = await loadInfo()
        setInfos(infos);
        setRecords(infos);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    }
    fetchData();
  }, [])

  const handleSearch = () => {
    const searchTerm = event.target.value.toLowerCase();
    const filterData = infos.filter(row => {
      const titleMatch = row.title.toLowerCase().includes(searchTerm)
      const contentMatch = row.title.toLowerCase().includes(searchTerm)
      return titleMatch || contentMatch ;
    })
    setRecords(filterData)
  }

  const updateSetInfos = async() =>{
    const updatedInfos = await loadInfo();
    setInfos(updatedInfos);
    setRecords(updatedInfos);
  }

  const handleUpdate = () => {
    updateInfo(id, title, content).then(() => {
      updateSetInfos()
      closeModal()
    })
  }

  const handleDelete = async(id) => {
    console.log(id)
    if (window.confirm("Are you sure you want to delete?")) {
      deleteInfo(id).then(() => {
        updateSetInfos()
      })
    }
  }

  const handleAdd = async() => {
    addInfo(title, content).then(() => {
      updateSetInfos()
      closeModal()
    })
  }

  const openAddModal = async() => {
    setModalTitle("Add new QnA")
    setOperation("Add")
    setShowModal(true)
  }

  const openUpdateModal = async(id, title, content) => {
    setModalTitle("Update QnA")
    setOperation("Update")
    setContent(content)
    setTitle(title)
    setID(id)
    setShowModal(true)
  }

  const closeModal = () => {
    setOperation('');
    setContent('');
    setTitle('');
    setID('');
    setShowModal(false);
    setValidated(false);
  }

  const handleModalOperation = () => {
    if(operation == 'Add'){
      handleAdd();
    }else if(operation == 'Update'){
      handleUpdate();
    }
  }

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === true) {
      handleModalOperation()
    }
    setValidated(true);
  };

  const column = [
    {
        name: '#',
        selector: (row, index) => index + 1,
        sortable: true,
        width: '60px',
    },
    {
        name: 'Question',
        width: '24%',
        selector: row => row.title,
        sortable: true,
        cell: row => (
          <div>
            {row.title}
          </div>
        )
    },
    {
        name: 'Answer',
        width: '60%',
        selector: row => row.content,
        sortable: true,
        cell: row => (
          <div dangerouslySetInnerHTML={{ __html: row.content }} />
        )
    },
    {
      name: 'Action',
      width: '11%',
      cell: row => (
        <div>
          <button type="button" className="btn btn-light" onClick={() => openUpdateModal(row.id, row.title, row.content)}>
            <i className="bi bi-pencil-square" style={{ color: 'dodgerblue' }}></i>
          </button>
          <button type="button" className="m-1 btn btn-light" onClick={() => handleDelete(row.id)}>
            <i className="bi bi-trash" style={{ color: 'red' }}></i>
          </button>
        </div>
      ),
    },
];

  const customStyle = {
    headCells: {
      style:{
        fontSize: 'medium',
        fontWeight: 'bold'
      }
    },
    rows:{
      style:{
        paddingTop: '12px',
        paddingBottom: '12px'
      }
    },
    cells:{
      style:{
        fontSize: 'medium',
      }
    }
  }


  return (
      <div className="body">
        <h1> Manage Hearing Info </h1>
        <div className="container-sm shadow p-3 mb-5 bg-body rounded">
          <div className="mb-2 row">
            <div className="col-md-4">
            <button type="button" className="btn btn-primary button" onClick={openAddModal}> Create New QnA </button>
            </div>
            <div className="col-md-4"/>
            <div className="col-md-4">
              <input type="text" placeholder="Search by Question / Answer" className="form-control" onChange={handleSearch}/>
            </div>
          </div>
          <DataTable columns={column} data={records} pagination customStyles={customStyle}/>
        </div>
        <Modal size="lg" show={showModal} onHide={() => closeModal()}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group controlId="validationCustom03">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="eg. What is Hearing Test?" value={title} onChange={()=>setTitle(event.target.value)} required />
                <Form.Control.Feedback type="invalid">
                  This field is required.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mt-3" controlId="validationCustom03">
                <Form.Label>Content</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="eg. Hearing Test is ..... (Enter <br/> to move to next line)" value={content} onChange={()=>setContent(event.target.value)} required />
                <Form.Control.Feedback type="invalid">
                This field is required.
                </Form.Control.Feedback>
              </Form.Group>
            <Button type="submit" className="mt-3 btn btn-primary button">
              {operation === 'Add' ? 'Add' : 'Update'}
            </Button>
          </Form>
          </Modal.Body>
        </Modal>
      </div>

    );
}

export default Info;