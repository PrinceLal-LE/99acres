/* eslint-disable react-hooks/exhaustive-deps */

import "./listingstyle.css";
import "./alert.css"
import axios from "axios";
import companyLogo from './assets/images/company_logo.jpg';
import { useEffect, useState, useRef } from "react";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import $ from 'jquery';
import "datatables.net-dt"
import ReactDOMServer from 'react-dom/server'
import { DatePicker } from "rsuite";
import 'rsuite/DatePicker/styles/index.css';

const Listing = () => {
    // const [listings, setListings] = useState([]);
    const [agents, setAgents] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedTypes, setSelectedTypes] = useState('');
    const propertyTableRef = useRef(null);
    // Listed Date States
    const [selectedDateFilter, setSelectedDateFilter] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // Expiry Date state
    const [selectedExpiryFilter, setSelectedExpiryFilter] = useState('');
    const [expiryStartDate, setExpiryStartDate] = useState(new Date());
    const [expiryEndDate, setExpiryEndDate] = useState(new Date());
    const [selectedCategories, setSelectedCategories] = useState([]);


    // Handle Expiry Date filter change
    const handleExpiryFilterChange = (e) => {
        setSelectedExpiryFilter(e.target.value);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const [filters, setFilters] = useState({
        roomType: [],
        listingDate: '',
        expiryDate: '',
        totalArea: '',
        areaUnit: '',
        agentName: '',
        propertyCategory: '',
        propertyType: [],
        fromExpiryDate: '',
        toExpiryDate: '',
        fromListedDate: '',
        toListedDate: '',
        minPrice: '',
        maxPrice: '',
    });


    const handleFilterChange = (filter, value) => {
        if (filter === 'totalArea') {
            setFilters({ ...filters, totalArea: value });
        } else if (filter === 'propertyCategory') {
            setFilters({ ...filters, propertyCategory: value });
        } else {
            setFilters({ ...filters, [filter]: value });
        }
    }

    useEffect(() => {
        const fetchAgents = async () => {
            const response = await axios.get('http://localhost/test.php/api/apicommonagent.php');
            setAgents(response.data);
        };
        fetchAgents();
    }, [])
    const fetchListings = async () => {
        let params = {
            ...filters,
            dateFilter: selectedDateFilter,
            expiryDateFilter: selectedExpiryFilter
        };
        if (selectedDateFilter === "Custom") {
            params.fromListedDate = startDate.toISOString().split('T')[0];
            params.toListedDate = endDate.toISOString().split('T')[0];
        }
        if (selectedExpiryFilter === "Custom") {
            params.fromListedDate = expiryStartDate.toISOString().split('T')[0];
            params.toListedDate = expiryEndDate.toISOString().split('T')[0];
        }
        // var data = {id:1,name:'John Doe'};
        const response = await axios.get('http://localhost/test.php/api/apicommon.php', { params });

        // Destroy the DataTable if it's already initialized
        if ($.fn.DataTable.isDataTable(propertyTableRef.current)) {
            $(propertyTableRef.current).DataTable().destroy();
        }
        $(propertyTableRef.current).DataTable({
            pageLength: 20,
            data: response.data,
            columns: [
                // Define your columns here
                { data: 'ListingID' },
                {
                    data: 'Title',
                    width: "80px",
                    render: function (data, type, row) {
                        if (type === 'display' && data) {
                            const titleElement = (
                                <a href={row.Link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: "black" }}>
                                    <div className="hover-details">
                                        <div className="short-text" style={{ maxHeight: '40px', overflow: 'hidden' }}>{data}</div>
                                        <span className="full-text" title={data}>{data}</span>
                                    </div>
                                </a>
                            );
                            return ReactDOMServer.renderToString(titleElement);
                        }
                        return data;
                    }
                },
                {
                    data: 'Is_Premium',
                    className: 'text-center align-middle',
                },
                {
                    data: 'AssignedTo',
                    className: 'text-center align-middle',
                },
                {
                    data: 'Price',
                    className: 'text-center align-middle',
                    render: function (data, type) {
                        // Check if the data is being rendered for display
                        if (type === 'display' && data) {
                            const cleanedData = data.replace(/[\s,]/g, '');
                            let formattedData = cleanedData;
                            // Replace "Crore" or "crores" with "CR" (case-insensitive)
                            if (cleanedData.match(/crore(s?)/i)) {
                                formattedData = cleanedData.replace(/crore(s?)/i, ' Cr');
                            }
                            if (cleanedData.match(/lac(s?)/i)) {
                                formattedData = cleanedData.replace(/lakh(s?)/i, ' L');
                            }
                            if (cleanedData.match(/0{3}$/)) {
                                formattedData = cleanedData.replace(/0{3}$/, ' K');
                            }
                            return ReactDOMServer.renderToString(<div className="text-center">{formattedData}</div>);
                        }
                        return data;
                    }
                },
                {
                    data: 'AreaType',
                    className: 'text-center align-middle',
                },
                {
                    data: 'TotalArea',
                    className: 'text-center align-middle',
                },
                {
                    data: 'Score',
                    className: 'text-center align-middle',
                },
                {
                    data: 'MissingData',
                    className: 'text-center align-middle',
                },
                {
                    data: 'Credit',
                    className: 'text-center align-middle',
                    render: function (data, type) {
                        // Check if the data is being rendered for display
                        if (type === 'display' && data) {
                            const cleanedData = data.replace(/credits/i, '').trim();
                            return cleanedData;
                        }
                        return data;
                    }
                },
                {
                    data: 'LocalityPercentage',
                    className: 'text-center align-middle',
                },
                {
                    data: 'ListedDate',
                    className: 'text-center align-middle',

                    render: function (data, type) {
                        // Check if the data is being rendered for display
                        if (type === 'display' && data) {
                            const formattedDate = formatDate(data);
                            return formattedDate;
                        }
                        return data;
                    }
                },
                {
                    data: 'ExpiryDate',
                    className: 'text-center align-middle',
                    render: function (data, type) {
                        // Check if the data is being rendered for display
                        if (type === 'display' && data) {
                            const formattedDate = formatDate(data);
                            return formattedDate;
                        }
                        return data;
                    }
                },
                {
                    data: 'PropertyCategory',
                    className: 'text-center align-middle',
                },
                {
                    data: 'PropertyType',
                    className: 'text-center align-middle',
                },
                { data: 'RemarkID' }
            ]
        });
    };
    useEffect(() => {
        fetchListings();
    }, [filters, selectedDateFilter, selectedExpiryFilter, startDate, endDate, expiryStartDate, expiryEndDate]);

    return (
        // <>
        <div className="list_page">
            <div className="vl_loader-wrapper d-none loaderHideShow">
                <div className="vl_loader"></div>
            </div>
            <header className="shadow-sm py-3 mb-4 border-bottom">
                <div className="container-fluid px-md-5">
                    {/* fgfg */}
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                        <a href="dashboard.php" className="d-flex align-items-center text-dark text-decoration-none">
                            <img src={companyLogo} width="120" className="img-fluid" alt="logo" />
                        </a>
                        <div className="d-flex align-items-center justify-content-center flex-grow-1 header_title">
                            <div className="d-flex align-items-center gap-2">
                                <h4 className="text-uppercase fs-6 text-center fw-bold mb-0">inventory management</h4>
                                <a href="dashboard.php" className="text-capitalize nav_label">booking</a>
                            </div>
                        </div>
                        <div className="border-start ps-3 ms-2 d-flex align-items-center">
                            <div className="user_wrapper me-2">
                                <h2 className="text-uppercase">p</h2>
                                <p className="text-capitalize">Welcome -</p>
                            </div>
                            <a href="logout.jsx" className="btn btn-outline-danger btn-sm">
                                <span className="me-2"><i className="fa-solid fa-arrow-right-from-bracket"></i></span> Logout
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb my-2 text-center small justify-content-center" id="breadcrumb2">
                    <li className="breadcrumb-item"><a href="/" className="text-capitalize"> <span><i className="fa-solid fa-house"></i> </span> {'dashboard'}</a></li>
                    <li className="breadcrumb-item active" aria-current="page"><a href="#" className="text-capitalize"> 99Acres Listing</a></li>
                </ol>
            </nav>

            <div className="container-fluid px-md-5 mt-4">
                <main>
                    <div className="card">
                        <div className="card-header bg-transparent text-start">
                            <div className="d-flex justify-content-between align-items-center flex-md-row flex-column">
                                <div className="d-flex gap-2 search_wrapper ">
                                    <div className="search-input">
                                        <span className="icon"><i className="fas fa-search"></i></span>
                                        <input type="text" className="form-control" id="txtSearch" name="txtSearch" placeholder="search" />
                                    </div>
                                    <button className="btn btn-primary btnSearch btn-sm"><span className="me-2"><i className="fa-solid fa-magnifying-glass"></i></span>Search</button>
                                    <button className="btn btn-outline-primary btnMore btn-sm"><span className="me-2"><i className="fa-solid fa-sliders"></i></span>More</button>
                                    <button className="btn btn-outline-danger mt-md-0 mt-2" >Clear all
                                        Filter</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body ">
                            <div className="top_filter  py-3 px-3 d-flex flex-column gap-2">
                                <div className="d-flex justify-content-md-start justify-content-start flex-wrap gap-2">
                                    {/* Property Type */}
                                    <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Property Type</label>
                                        <div className="d-flex gap-2">
                                            <div className="d-inline">
                                                <input
                                                    className="form-check-input rd_chip_input"
                                                    type="checkbox"
                                                    name="chk_property_type[]"
                                                    id="chk_residential"
                                                    value="Residential" hidden
                                                    checked={selectedTypes.includes('Residential')}
                                                    onChange={() => {
                                                        const updatedTypes = selectedTypes.includes('Residential')
                                                            ? selectedTypes.filter(type => type !== 'Residential')
                                                            : [...selectedTypes, 'Residential'];
                                                        setSelectedTypes(updatedTypes);
                                                        handleFilterChange('propertyType', updatedTypes.length === 2 ? 'Both' : updatedTypes[0]);
                                                    }}
                                                />
                                                <label className="rd_chip_tag" htmlFor="chk_residential">
                                                    Residential
                                                </label>
                                            </div>
                                            <div className="d-inline">
                                                <input
                                                    className="form-check-input rd_chip_input" type="checkbox" name="chk_property_type[]" id="chk_commercial" value="Commercial" hidden checked={selectedTypes.includes('Commercial')} onChange={() => {
                                                        const updatedTypes = selectedTypes.includes('Commercial') ? selectedTypes.filter(type => type !== 'Commercial') : [...selectedTypes, 'Commercial']; setSelectedTypes(updatedTypes); handleFilterChange('propertyType', updatedTypes.length === 2 ? 'Both' : updatedTypes[0]);
                                                    }} />
                                                <label className="rd_chip_tag" htmlFor="chk_commercial">Commercial </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Property Category</label>
                                        <div className="d-flex gap-2">
                                            <div className="d-inline">
                                                <input
                                                    className="form-check-input rd_chip_input"
                                                    type="checkbox"
                                                    name="chk_property_category[]"
                                                    id="chk_sale"
                                                    value="Sale"
                                                    hidden
                                                    checked={selectedCategories.includes(`'Sale'`)}
                                                    onChange={() => {
                                                        const updatedCategories = selectedCategories.includes(`'Sale'`)
                                                            ? selectedCategories.filter(category => category !== `'Sale'`)
                                                            : [...selectedCategories, `'Sale'`];
                                                        setSelectedCategories(updatedCategories);
                                                        handleFilterChange('propertyCategory', updatedCategories.length === 3 ? updatedCategories.filter(category => category !== 'All').join(',') : updatedCategories.join(','))
                                                    }}
                                                />
                                                <label className="rd_chip_tag" htmlFor="chk_sale">
                                                    Sale
                                                </label>
                                            </div>
                                            <div className="d-inline">
                                                <input
                                                    className="form-check-input rd_chip_input"
                                                    type="checkbox"
                                                    name="chk_property_category[]"
                                                    id="chk_rent"
                                                    value="Rent"
                                                    hidden
                                                    checked={selectedCategories.includes(`'Rent'`)}
                                                    onChange={() => {
                                                        const updatedCategories = selectedCategories.includes(`'Rent'`)
                                                            ? selectedCategories.filter(category => category !== `'Rent'`)
                                                            : [...selectedCategories, `'Rent'`];
                                                        setSelectedCategories(updatedCategories);
                                                        handleFilterChange('propertyCategory', updatedCategories.length === 3 ? updatedCategories.filter(category => category !== 'All').join(',') : updatedCategories.join(','))
                                                    }}
                                                />
                                                <label className="rd_chip_tag" htmlFor="chk_rent">
                                                    Rent
                                                </label>
                                            </div>
                                            <div className="d-inline">
                                                <input
                                                    className="form-check-input rd_chip_input"
                                                    type="checkbox"
                                                    name="chk_property_category[]"
                                                    id="chk_lease"
                                                    value="Lease"
                                                    hidden
                                                    checked={selectedCategories.includes(`'Lease'`)}
                                                    onChange={() => {
                                                        const updatedCategories = selectedCategories.includes(`'Lease'`)
                                                            ? selectedCategories.filter(category => category !== `'Lease'`)
                                                            : [...selectedCategories, `'Lease'`];
                                                        setSelectedCategories(updatedCategories);
                                                        handleFilterChange('propertyCategory', updatedCategories.length === 3 ? updatedCategories.filter(category => category !== 'All').join(',') : updatedCategories.join(','))
                                                    }}
                                                />
                                                <label className="rd_chip_tag" htmlFor="chk_lease">
                                                    Lease
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Listed Date */}
                                    <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Listed Date</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-select form-select-sm" value={selectedDateFilter} onChange={(e) => setSelectedDateFilter(e.target.value)} >
                                                <option value="">Select Date</option>
                                                <option value="Today">Today</option>
                                                <option value="Yesterday">Yesterday</option>
                                                <option value="This week">This week</option>
                                                <option value="This month">This month</option>
                                                <option value="Custom" >Custom</option>
                                            </select>
                                            {selectedDateFilter === "Custom" && (
                                                <>
                                                    <div>
                                                        <DatePicker placeholder="From Date" selected={startDate} onChange={date => setStartDate(date)} />
                                                    </div>
                                                    <div>
                                                        <DatePicker selected={endDate} placeholder="To Date" onChange={(date) => setEndDate(date)}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {/* Expiry Date */}
                                    <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Expiry Date</label>
                                        <div className="d-flex gap-2">
                                            <select className="form-select form-select-sm" value={selectedExpiryFilter} onChange={handleExpiryFilterChange} >
                                                <option value="">Select Date</option>
                                                <option value="Today">Today</option>
                                                <option value="Yesterday">Yesterday</option>
                                                <option value="This week">This week</option>
                                                <option value="This month">This month</option>
                                                <option value="Custom" >Custom</option>
                                            </select>
                                            {selectedExpiryFilter === "Custom" && (
                                                <>
                                                    <input className="form-control form-control-sm" type="date" value={expiryStartDate.toISOString().split('T')[0]} onChange={(e) => setExpiryStartDate(new Date(e.target.value))} />
                                                    <input className="form-control form-control-sm" type="date" value={expiryEndDate.toISOString().split('T')[0]} onChange={(e) => setExpiryEndDate(new Date(e.target.value))} />
                                                </>
                                            )}
                                        </div>
                                        <button onClick={fetchListings} hidden> Apply</button>
                                    </div>

                                    {/* Room Details filter */}
                                    <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Room</label>
                                        <div className="d-flex gap-2">
                                            <div className="d-inline">
                                                <input className="form-check-input rd_chip_input" type="checkbox" name="chk_room_type[]" id="rdbhk_1" value="1 BHK" hidden onChange={(e) => handleFilterChange('roomType', e.target.checked ? [...filters.roomType, '1 BHK'] : filters.roomType.filter(type => type !== '1 BHK'))} />
                                                <label className="rd_chip_tag" htmlFor="rdbhk_1">1 BHK</label>
                                            </div>
                                            <div className="d-inline">
                                                <input className="form-check-input rd_chip_input"
                                                    type="checkbox" name="chk_room_type[]" id="rdbhk_2" value="2 BHK" hidden onChange={(e) => handleFilterChange('roomType', e.target.checked ? [...filters.roomType, '2 BHK'] : filters.roomType.filter(type => type !== '2 BHK'))} />
                                                <label className="rd_chip_tag" htmlFor="rdbhk_2">2 BHK</label>
                                            </div>
                                            <div className="d-inline">
                                                <input className="form-check-input rd_chip_input"
                                                    type="checkbox" name="chk_room_type[]" id="rdbhk_3" value='3 BHK' hidden onChange={(e) => handleFilterChange('roomType', e.target.checked ? [...filters.roomType, '3 BHK'] : filters.roomType.filter(type => type !== '3 BHK'))} />
                                                <label className="rd_chip_tag" htmlFor="rdbhk_3">3 BHK</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agent List */}
                                    <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Agent</label>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <select name="ddlagentlist" className="form-select form-select-sm" id="ddlagentlist" value={selectedAgent} onChange={(e) => {
                                                setSelectedAgent(e.target.value);
                                                handleFilterChange('agentName', e.target.value); // Update agentName in filters
                                            }}>
                                                <option value="">Select Agent</option>
                                                {agents.map((agent) => (
                                                    <option key={agent} value={agent}>{agent}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Table Listing */}
                            <div className="d-flex gap-2 flex-column flex-md-row mt-4">
                                <div className="table-responsive  flex-10 table_wrapper">
                                    <table className="table table-hover border mb-0 small cell-border display" id="propertyTable" ref={propertyTableRef}>
                                        <thead className="bg-light ">
                                            <tr>
                                                <th scope="col" >PropertyID</th>
                                                <th scope="col" style={{ width: '150px' }}>Title</th>
                                                <th scope="col" >Listing Type</th>
                                                <th scope="col" >Agent</th>
                                                <th scope="col" >Price</th>
                                                <th scope="col" >Area Type</th>
                                                <th scope="col" >Total Area</th>
                                                <th scope="col" >Score</th>
                                                <th scope="col" >Missing Data</th>
                                                <th scope="col" >Credit</th>
                                                <th scope="col" >Locality Percentage</th>
                                                <th scope="col">Listed Date</th>
                                                <th scope="col" >Expiry Date</th>
                                                <th scope="col" >Property Category</th>
                                                <th scope="col" >Property Type</th>
                                                <th scope="col" >Remark Section</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
        // </>
    )
};
export default Listing;