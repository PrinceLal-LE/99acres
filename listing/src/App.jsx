import { Route, Routes } from "react-router-dom";

import Listing from "./listing";
import Login from "./login";
import Logout from "./Logout";
import UploadExcel from "./uploadExcel";

// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// import Home from './Home';
// import Dashbord from './dashboard';
// import Register from './Register';

// import Cateogry from './cateogry';
function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className="app">
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/Logout" element={<Logout />} />
        {/* <Route  path='/' element={<Home />} />
      <Route  path='/dashboard' element={<Dashbord />} />
      <Route  path='/Register' element={<Register />} /> */}
        <Route path="/Listing" element={<Listing />} />
        <Route path="/uploadExcel" element={<UploadExcel />} />
        {/* <Route  path='/Cateogry' element={<Cateogry />} /> */}
      </Routes>
    </div>
  );
}

export default App;
