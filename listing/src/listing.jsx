
import "./listingstyle.css";
// import "./style.css"
import "./alert.css"
import axios from "axios";
import companyLogo from './assets/images/company_logo.jpg';
import { useEffect, useState } from "react";
// // import React from "react";
// import '/loginPage.css';

const Listing = () => {

    const [agents, setAgents] = useState([]);
    const [listings, setListings] = useState([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState('');

    const [propertyCategories, setPropertyCategories] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);

    const [selectedPropertyCategory, setSelectedPropertyCategory] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('');

    const handlePropertyCategoryChange = (value) => {
        setSelectedPropertyCategory(value);
    };

    const handlePropertyTypeChange = (value) => {
        setSelectedPropertyType(value);
    };

    // const handlePropertyCategoryChange = (value) => {
    //     setSelectedPropertyCategory(value);
    // };

    // const handlePropertyTypeChange = (value) => {
    //     setSelectedPropertyType(value);
    // };





    const handleRoomTypeChange = (value) => {
        setSelectedRoomType(value === selectedRoomType ? '' : value);
    };


    useEffect(() => {
        // Agent List
        const fetchAgents = async () => {
            try {
                const response = await axios.get('http://localhost:8081/agents');
                setAgents(response.data);
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };
        fetchAgents();

        const fetchPropertyCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8081/distinctPropertyCategories');
                setPropertyCategories(response.data);
            } catch (error) {
                console.error('Error fetching property categories:', error);
            }
        };

        const fetchPropertyTypes = async () => {
            try {
                const response = await axios.get('http://localhost:8081/distinctPropertyTypes');
                setPropertyTypes(response.data);
            } catch (error) {
                console.error('Error fetching property types:', error);
            }
        };

        fetchPropertyCategories();
        fetchPropertyTypes();




        // Function to fetch listings
        const fetchListings = async (agentName = null) => {
            try {
                let url = 'http://localhost:8081/listDetail';

                const params = new URLSearchParams();
                if (agentName) {
                    params.append('agent', agentName);
                }
                if (selectedPropertyCategory) {
                    params.append('propertyCategory', selectedPropertyCategory);
                }
                if (selectedPropertyType) {
                    params.append('propertyType', selectedPropertyType);
                }

                if (params.toString()) {
                    url += `?${params.toString()}`;
                }
                const response = await axios.get(url);
                const modifiedListings = response.data.map(listing => {
                    return {
                        ...listing,

                        Is_Premium: listing.Is_Premium === "1" ? 'Premium' : 'Non-premium',
                    };
                });
                setListings(modifiedListings);
            } catch (error) {
                console.error('There was an error fetching the listings', error);
            }
        };
        // Call the fetchListings function on component mount
        if (selectedAgent || selectedPropertyCategory || selectedPropertyType) {
            fetchListings(selectedAgent);
        } else {
            fetchListings();
        }
    }, [selectedAgent, selectedPropertyCategory, selectedPropertyType]);




    return (
        // <>
        <div className="list_page">
            <div className="vl_loader-wrapper d-none loaderHideShow">
                <div className="vl_loader"></div>
            </div>
            <header className="shadow-sm py-3 mb-4 border-bottom">
                <div className="container-fluid px-md-5">

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
                            <a href="logout.php" className="btn btn-outline-danger btn-sm">
                                <span className="me-2"><i className="fa-solid fa-arrow-right-from-bracket"></i></span> Logout
                            </a>
                        </div>
                    </div>
                </div>
            </header>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb my-2 text-center small justify-content-center" id="breadcrumb2">
                    <li className="breadcrumb-item"><a href="dashboard.php" className="text-capitalize"> <span><i className="fa-solid fa-house"></i> </span> {'dashboard'}</a></li>
                    <li className="breadcrumb-item"><a href="categories.php?project-type=booking" className="text-capitalize"> {'listed'}</a></li>
                    <li className="breadcrumb-item active" aria-current="page"><a href="#" className="text-capitalize"> Result</a></li>
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
                                    <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Room</label>
                                        <div className="d-flex gap-2">
                                            <div className="d-inline">
                                                <input className="form-check-input rd_chip_input"
                                                    type="checkbox" name="chk_room_type[]" id="rdbhk_1" value="1 BHK" hidden onChange={() => handleRoomTypeChange('1 BHK')} />
                                                <label className="rd_chip_tag" htmlFor="rdbhk_1">1 BHK</label>
                                            </div>
                                            <div className="d-inline">
                                                <input className="form-check-input rd_chip_input"
                                                    type="checkbox" name="chk_room_type[]" id="rdbhk_2" value="2 BHK" hidden onChange={() => handleRoomTypeChange('2 BHK')} />
                                                <label className="rd_chip_tag" htmlFor="rdbhk_2">2 BHK</label>
                                            </div>
                                            <div className="d-inline">
                                                <input className="form-check-input rd_chip_input"
                                                    type="checkbox" name="chk_room_type[]" id="rdbhk_3" value='3 BHK' hidden onChange={() => handleRoomTypeChange('3 BHK')} />
                                                <label className="rd_chip_tag" htmlFor="rdbhk_3">3 BHK</label>
                                            </div>

                                        </div>
                                    </div>

                                    <div className="ms-md-2 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">By Agent</label>
                                        <div className="d-flex gap-2 flex-wrap">
                                            <select name="ddlAgentList" className="form-select" id="ddlAgentList" onChange={(e) => setSelectedAgent(e.target.value)}>
                                                <option value="">Select Agent</option>
                                                {agents.map(agent => (
                                                    <option key={agent} value={agent}>{agent}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="ms-md-2 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Property Category</label>
                                        <select name="ddlPropertyCategory" className="form-select" onChange={(e) => handlePropertyCategoryChange(e.target.value)}>
                                            <option value="">Select Property Category</option>
                                            {propertyCategories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="ms-md-2 d-flex gap-2 align-items-center flex-wrap">
                                        <label className="small">Property Type</label>
                                        <select name="ddlPropertyType" className="form-select" onChange={(e) => handlePropertyTypeChange(e.target.value)}>
                                            <option value="">Select Property Type</option>
                                            {propertyTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>



                                </div>
                                <div className="my-1">
                                    <div className="d-flex justify-content-md-start justify-content-start flex-wrap gap-2">
                                        <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap">
                                            <label className="small">Budget</label>
                                            {/* <!-- Rent --> */}
                                            <div className="d-flex gap-2 PriceCat0">
                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_5" value="5" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_5">5 CR</label>
                                                </div>

                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_10" value="10" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_10">10 CR</label>
                                                </div>

                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_15" value="15" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_15">15 CR</label>
                                                </div>

                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_20" value="20" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_20">20 CR</label>
                                                </div>

                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_25" value="25" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_25">25 CR</label>
                                                </div>

                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_30" value="30" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_30">30 CR</label>
                                                </div>

                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_40" value="40" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_40">40 CR</label>
                                                </div>

                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio"
                                                        name="rd_budget" id="rdBudget_sell_50" value="50" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rdBudget_sell_50">50 CR</label>
                                                </div>

                                            </div>
                                            <div
                                                className="ms-md-3 d-flex gap-2 align-items-center flex-wrap hideAndShowSubBudget d-none">
                                                <label className="small">Sub Budget</label>
                                                {/* <!-- Sub Budget --> */}
                                                <div className="d-flex gap-2 addDyanamicSubBudget">
                                                    {/* <!-- sub budget dynamically fill here  --> */}
                                                </div>
                                            </div>
                                            <div
                                                className="ms-md-3 d-flex gap-2 align-items-center flex-wrap hideAndShowMiniBudget d-none">
                                                <label className="small">Mini Budget</label>
                                                {/* <!-- Mini Budget --> */}
                                                <div className="d-flex gap-2 addDyanamicMiniBudget">
                                                    {/* <!-- Mini budget dynamically fill here  --> */}
                                                </div>
                                            </div>
                                            {/* <!-- End --> */}
                                        </div>
                                        <div className="ms-md-3 d-flex gap-2 align-items-center flex-wrap d-none">
                                            <label className="small">Price</label>
                                            <div className="d-flex gap-2 PriceAD">
                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio" name="rd_orderby" id="rd_orderby_1" value="ASC" hidden />
                                                    <label className="rd_chip_tag" htmlFor="rd_orderby_1">Min to Max</label>
                                                </div>
                                                <div className="d-inline">
                                                    <input className="form-check-input rd_chip_input"
                                                        type="radio" name="rd_orderby" id="rd_orderby_2" value="DESC"
                                                        hidden />
                                                    <label className="rd_chip_tag" htmlFor="rd_orderby_2">Max to Min</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="d-flex gap-2 flex-column flex-md-row">
                                    <div className="table-responsive  flex-10 table_wrapper">
                                        <table className="table table-hover border mb-0 small cell-border" id="propertyTable">
                                            <thead className="bg-light ">
                                                <tr>
                                                    <th scope="col" >PropertyID</th>
                                                    <th scope="col" >Title</th>
                                                    <th scope="col" >IsPremium</th>
                                                    <th scope="col" >Agent</th>
                                                    <th scope="col" >Price</th>
                                                    <th scope="col" >Area Type</th>
                                                    <th scope="col" >Total Area</th>
                                                    <th scope="col" >Listed Date</th>
                                                    <th scope="col" >Expiry Date</th>
                                                    <th scope="col" >Property Category</th>
                                                    <th scope="col" >Property Type</th>
                                                    <th scope="col" >Remark Section</th>
                                                    <th scope="col" >Created Date</th>
                                                    <th scope="col" >Created By</th>
                                                    <th scope="col" >Modified Date</th>
                                                    <th scope="col" >Modified By</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {listings
                                                    .filter((listing) => {
                                                        return (selectedAgent === '' || listing.AssignedTo === selectedAgent) &&
                                                            (selectedRoomType === '' || listing.Title.includes(selectedRoomType));
                                                    })
                                                    .map((listing) => (
                                                        <tr key={listing.Id}>
                                                            <td>{listing.ListingID}</td>
                                                            <td>{listing.Title}</td>
                                                            <td>{listing.Is_Premium}</td>
                                                            <td>{listing.AssignedTo}</td>
                                                            <td>{listing.Price}</td>
                                                            <td>{listing.AreaType}</td>
                                                            <td>{listing.TotalArea}</td>
                                                            <td>{new Date(listing.ListedDate).toLocaleDateString()}</td>
                                                            <td>{new Date(listing.ExpiryDate).toLocaleDateString()}</td>
                                                            <td>{listing.PropertyCategory}</td>
                                                            <td>{listing.PropertyType}</td>
                                                            <td>{listing.RemarkID}</td>
                                                            <td>{new Date(listing.CreatedDate).toLocaleDateString()}</td>
                                                            <td>{listing.CreatedBy}</td>
                                                            <td>{new Date(listing.ModifyDate).toLocaleDateString()}</td>
                                                            <td>{listing.ModifyBy}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                        <nav aria-label="...">
                                            <ul className="pagination justify-content-between my-2 mx-2 flex-wrap">
                                                <li className="page-item disabled">
                                                    <a className="page-link" href="#" aria-disabled="true">Previous</a>
                                                    {/*  tabindex="-1" */}
                                                </li>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <li className="page-item num_item active"><a className="page-link" href="#">1</a></li>
                                                    <li className="page-item num_item " aria-current="page">
                                                        <a className="page-link" href="#">2</a>
                                                    </li>
                                                    <li className="page-item num_item"><a className="page-link" href="#">3</a></li>
                                                </div>
                                                <li className="page-item">
                                                    <a className="page-link" href="#">Next</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
        // </>
    )
}

export default Listing;







