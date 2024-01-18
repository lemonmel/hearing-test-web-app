import React, {useEffect, useState} from 'react';
import { loadTest } from './TestManager';
import { generatePDF } from './pdfGenerator';
import { Modal } from 'react-bootstrap'
import { ComposedChart, Area, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DataTable from 'react-data-table-component';

function Statistics() {
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [env, setEnv] = useState();
  const [volume, setVolume] = useState();
  const [frequency, setFrequency] = useState();
  const [narrowband, setNarrowband] = useState();
  const [notched, setNotched] = useState();
  const [FS, setFS] = useState();
  const [side, setSide] = useState();
  const [date, setDate] = useState();
  const [status, setStatus] = useState();
  const [records, setRecords] = useState(results);
  const [copiedReading, setCopiedReading] = useState(false);

  useEffect(() => {
    const fetchData = async() => {
      try {
        const results = await loadTest();
        setResults(results);
        setRecords(results);
        console.log(results);
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    }
    fetchData();
  }, [])

  const handleSearch = () => {
    const searchTerm = event.target.value.toLowerCase();
    const filterData = results.filter(row => {
      const usernameMatch = row.username.toLowerCase().includes(searchTerm)
      const dateMatch = row.date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toLowerCase().includes(searchTerm)
      const typeMatch = row.type.toLowerCase().includes(searchTerm)
      const statusMatch = row.status.toLowerCase().includes(searchTerm)
      return usernameMatch || dateMatch || typeMatch || statusMatch;
    })
    setRecords(filterData)
  }

  const viewReport = (result) => {
    setUsername(result.username)
    setEmail(result.email)
    setFrequency(result.frequency)
    setVolume(result.volume)
    setEnv(result.environment)
    setNarrowband(result.narrowband)
    setNotched(result.notched)
    setFS(result.FS)
    setDate(result.date.toString())
    setSide(result.side)
    setStatus(result.status.toUpperCase())
    setShowModal(true)
    // generatePDF(result)
  }

  const renderGraph = () => {
    const nh_range = {
      500: { min: 15.3, max: 24.5 },
      1000: { min: 18.3, max: 29.7 },
      2000: { min: 23.89, max: 34.61 },
      4000: { min: 27.05, max: 40.57 },
      8000: { min: 23.5, max: 40.22 },
    };

    const data = Object.keys(FS).map(frequency => ({
      frequency: frequency,
      narrowband: narrowband[frequency].toFixed(2),
      notched: notched[frequency].toFixed(2),
      FS: FS[frequency].toFixed(2),
      normal_min: nh_range[frequency].min,
      normal_max: nh_range[frequency].max,
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="frequency" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                    dataKey={"normal_min"}
                    fill='turquoise'
                    fillOpacity={0}
                    stackId="stack"
                    stroke="none"
                />
                <Area
                    dataKey={"normal_max"}
                    fill='turquoise'
                    fillOpacity={0.2}
                    stackId="stack"
                    stroke="none"
                />
                {/* Display lines */}
                <Scatter type="monotone" dataKey="FS" stroke="dodgerblue" fill="dodgerblue"/>
                <Scatter type="monotone" dataKey="notched" stroke="#387908" fill="#387908" />
                <Scatter type="monotone" dataKey="narrowband" stroke="#ff7300" fill="#ff7300"  />
            </ComposedChart>
        </ResponsiveContainer>
    );
  }

  const renderFSResult = (row) => {
    let FShtml = ''
    Object.keys(row.FS).forEach((key, index) => {
      let value = row.FS[key].toFixed(2)
      FShtml += key + ' : ' + value + '<br>';
    })
    return FShtml
  }

  const copyToClipboard = () => {

    const tableForm = Object.keys(FS).map((frequency) => {
      const row = `${frequency}\t${narrowband[frequency].toFixed(2)}\t${notched[frequency].toFixed(2)}\t${FS[frequency].toFixed(2)}`;
      return row;
    });

    // Join the rows with line breaks
    const tableString =
    `Particpant\t${username}\n`+
    `Side\t${side.toUpperCase()}\n`+
    `Overall\t${status.toUpperCase()}\n`+
    `Frequency\tNB\tNN\tFS\n`+
    tableForm.join('\n');

    // Copy to clipboard
    console.log("copied to clipboard")
    navigator.clipboard.writeText(tableString);
    setCopiedReading(true)

    setTimeout(()=>{
      setCopiedReading(false)
    }, 2000)

  }

  const column = [
    {
        name: 'User',
        width: '20%',
        selector: row => row.username,
        sortable: true,
    },
    {
        name: 'Date',
        width: '20%',
        selector: row => row.date,
        sortable: true,
        cell: row => (
          <div>
            {row.date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )
    },
    {
        name: 'Type',
        width: '15%',
        selector: row => row.type,
        sortable: true,
    },
    {
      name: 'FS Reading',
      width: '25%',
      cell: row => (
        <div style={{ lineHeight: '1.4' }} dangerouslySetInnerHTML={{ __html: renderFSResult(row)}} />
      )
    },
    {
      name: 'Result',
      width: '10%',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Action',
      width: '10%',
      cell: row => (
        <div>
          <button type="button" className="btn btn-light" onClick={()=>viewReport(row)}>
            <i className="bi bi-eye" style={{color: 'dodgerblue'}}></i>
          </button>
        </div>
      ),
    },
]

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
        paddingBottom: '12px',
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
      <h1> User Hearing Statistic </h1>
      <div className="container shadow p-3 mb-5 bg-body rounded">
      <div className="mb-2 row">
        <div className="col-md-8"></div>
        <div className="col-md-4 d-flex justify-content-end">
          <input type="text" placeholder="Search by User / Date / Type / Result" className="form-control" onChange={handleSearch}/>
        </div>
      </div>
        <DataTable columns={column} data={records} pagination customStyles={customStyle}/>
        <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Test Details</Modal.Title>
          </Modal.Header>
          <Modal.Body className='m-3'>
          <h5 class="mt-1"> 1. User Details </h5>
          <table class="table">
          <tr>
              <td>User</td>
              <td>{username}</td>
          </tr>
          <tr>
              <td>Contact</td>
              <td>{email}</td>
          </tr>
          <tr>
              <td>Exposed Environment</td>
              <td>{env}</td>
          </tr>
          <tr>
              <td>Hearing Duration/Week</td>
              <td>{frequency}</td>
          </tr>
          <tr>
              <td>Hearing Volume</td>
              <td>{volume}</td>
          </tr>
          </table>
          <h5 class="mt-4"> 2. Test Details </h5>
          <table class="table">
          <tr>
              <td>Date </td>
              <td>{date}</td>
          </tr>
          <tr>
              <td>Side </td>
              <td>{side}</td>
          </tr>
          <tr>
              <td>Status</td>
              <td>{status}</td>
          </tr>
          </table>
          <div className="d-flex align-items-center mb-2">
            <button type="button" className="btn btn-light mb-3" onClick={copyToClipboard}>
              <i className="bi bi-copy"></i>
            </button>
            {copiedReading && (
              <div className="p-2 text-success">
                Copied to clipboard!
              </div>
            )}
          </div>
          {FS && renderGraph()}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Statistics;