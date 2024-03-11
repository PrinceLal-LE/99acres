import "./listingstyle.css";
// import "./style.css"
import "./alert.css"

function category() {
    return (
        <>
            <main>
                <div className="vl_loader-wrapper d-none loaderHideShow">
                    <div className="vl_loader"></div>
                </div>
                <div className="page_wrapper">
                    <header className="shadow-sm py-3 mb-4 border-bottom">
                        <div className="container">
                            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                                <a href="dashboard.php"
                                    className="d-flex align-items-center text-dark text-decoration-none">
                                    <img src="assets/images/logo.png" width="150" className="img-fluid" alt="logo" />
                                </a>

                                <a href="logout.php" className="btn btn-outline-danger"><span className="me-2"><i className="fa-solid fa-arrow-right-from-bracket"></i></span> Logout</a>
                            </div>
                        </div>
                    </header>


                    <div className="container py-3 px-md-5">
                        {/* <main> */}
                        <div className="row justify-content-center">
                            <div className="col-md-7 mb-4">
                                <a href="dashboard.php" className="text-dark text-decoration-none fs-5"><span className="me-2"><i className="fa-solid fa-chevron-left"></i></span>Go Back</a>
                                {/* <!-- <h2 className="text-center text-capitalize">
                                    <?php// echo $_GET['project-type']; ?>
                                </h2> --> */}
                            </div>
                            <div className="col-md-12">
                                <div className="text-center mb-4">
                                    <h2 className="fw-600 fs-2 text-uppercase d-inline px-2 " style="color: #0071bc;">
                                        {/* Choose <?php echo $_GET['project-type']; ?> Type */}
                                    </h2>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="list_wrpaper d-flex align-items-center px-4 flex-column gap-4">
                                    {/* <?php if($_GET['project-type']=='booking') { ?> */}
                                    <a href="<?=($_GET['project-type']=='booking'?'residential-list.php':'/');?>?project-type=<?=$_GET['project-type'];?>&category=residential" className="d-flex align-items-center list_item ">
                                        <div className="flex-shrink-0">
                                            <img src="assets/images/residential.png" alt="Residential" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h3 className="fw-bold mb-0">Residential</h3>
                                                <span className="icon"><i className="fa-solid fa-arrow-right-long"></i></span>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="<?=($_GET['project-type']=='booking'?'commercial-list.php':'/');?>?project-type=<?=$_GET['project-type'];?>&category=commercial" className="d-flex align-items-center list_item">
                                        <div className="flex-shrink-0">
                                            <img src="assets/images/commercial.png" alt="Commercial" />
                                        </div>
                                        <div className="flex-grow-1 ms-3 text-end">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h3 className="fw-bold mb-0">Commercial</h3>
                                                <span className="icon"><i className="fa-solid fa-arrow-right-long"></i></span>
                                            </div>
                                        </div>
                                    </a>
                                    {/* <? php }else{ ?> */}
                                    <a href="residential_inventory_list.php?rent_sell=<?=$_GET['project-type'];?>&property_type=residential" className="d-flex align-items-center list_item ">
                                        <div className="flex-shrink-0">
                                            <img src="assets/images/residential.png" alt="Residential" />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h3 className="fw-bold mb-0">Upload Excel Data</h3>
                                                <span className="icon"><i className="fa-solid fa-arrow-right-long"></i></span>
                                            </div>
                                        </div>
                                    </a>
                                    <a href="commercial_inventory_list.php?rent_sell=<?=$_GET['project-type'];?>&property_type=commercial" className="d-flex align-items-center list_item">
                                        <div className="flex-shrink-0">
                                            <img src="assets/images/commercial.png" alt="Commercial" />
                                        </div>
                                        <div className="flex-grow-1 ms-3 text-end">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h3 className="fw-bold mb-0">List</h3>
                                                <span className="icon"><i className="fa-solid fa-arrow-right-long"></i></span>
                                            </div>
                                        </div>
                                    </a>
                                    {/* <? php }  ?> */}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header bg-transparent text-start">
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className="btn btn-primary" onClick="history.back()">Go Back</button>
                                </div>

                            </div>
                            {/* <div className="card-body ">
                                <div className="d-flex justify-content-md-start justify-content-center flex-wrap align-items-start gap-4 detail_content_wrapper">
                                    <?php if($_GET['project-type']=='booking') { ?>
                        <div className="text-start text-dark rounded p-4 border detail_wrap bg-light">
                            <a href="<?=($_GET['project-type']=='booking'?'residential-list.php':'/');?>?project-type=<?=$_GET['project-type'];?>&category=residential">Residential</a>
                        </div>
                        <div className="text-start text-dark rounded p-4 border detail_wrap bg-light">
                            <a href="<?=($_GET['project-type']=='booking'?'commercial-list.php':'/');?>?project-type=<?=$_GET['project-type'];?>&category=commercial">Commercial</a>
                        </div>
                        <? php }else{ ?>
                            <div className="text-start text-dark rounded p-4 border detail_wrap bg-light">
                                <a href="residential_inventory_list.php?rent_sell=<?=$_GET['project-type'];?>&property_type=residential">Residential</a>
                            </div>
                            <div className="text-start text-dark rounded p-4 border detail_wrap bg-light">
                                <a href="commercial_inventory_list.php?rent_sell=<?=$_GET['project-type'];?>&property_type=commercial">Commercial</a>
                            </div>
                        <? php }  ?>
                                </div>
                            </div> */}
                        </div>


                    </div>
                </div>
            </main>
        </>
    )
}

export default category;