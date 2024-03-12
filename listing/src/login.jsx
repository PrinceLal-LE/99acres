import { useState } from 'react';
import axios from 'axios';
import loginImage from './assets/images/login.jpg';
import companyLogo from './assets/images/company_logo.jpg';
import './login.css';


import { useNavigate } from 'react-router-dom';


function Login() {
    const [values, setValues] = useState({
        txtuserName: '',
        txtPassword: ''
    })
    const navigate = useNavigate();
    const handleInput = (event) => {
        const { name, value } = event.target
        setValues(prev => ({ ...prev, [name]: value }))
    };
    // axios.defaults.withCredentials = true;

    // function handleClick() {
    //     navigate("/Home")     
    //  }


    const handleSubmit = (event) => {
            event.preventDefault();
            const loginData = {
                LoginID: values.txtuserName,
                Password: values.txtPassword
            };
            axios.post('http://localhost:8081/users', loginData)
                .then(res => {
                    console.log(res);
                    if (res.data.Status === "Success") {
                        navigate('/listing')
                        console.log("Login Successful");
                    } else {
                        alert('Invalid credentials');
                    }
                })
                .then (err => console.log(err));
                // .catch(err => {
                //     console.error(err);
                //     alert('An error occurred during login');
                // });

        };


        const [passwordShown, setPasswordShown] = useState(false);

        const togglePassword = () => {
            // Toggle the state from true to false or vice versa
            setPasswordShown(!passwordShown);
        };

        return (
            <main>
                <div className="container ">
                    <div className="loginContainer">
                        <div className="row loginRow">
                            <div className="col-md-5 d-none d-md-block px-0">
                                <img src={loginImage} alt="login" className="loginImages" />
                            </div>
                            <div className="col-md-7 my-5">
                                <div className='loginColumn'>
                                    <img src={companyLogo} alt="Dreamworld Properties" className="logo" />
                                </div>
                                <div className='creditinal'>
                                    <p className="login-card-description fw-bold">Log In</p>
                                    <form method="post" onSubmit={handleSubmit}>
                                        <input type="hidden" name="action" value="InventoryLoginSystem" />
                                        <div className="form-group">
                                            <label htmlFor="txtuserName">Mobile no. / User ID</label>
                                            <input type="text" name="txtuserName" id="txtuserName" onClick={handleInput} className="form-control" placeholder="Enter Mobile no. / User ID" required="" />
                                        </div>
                                        <div className="form-group mb-4">
                                            <label htmlFor="txtPassword">Password</label>
                                            <div className="position-relative">
                                                <input type={passwordShown ? "text" : "password"} name="txtPassword" id="txtPassword" onClick={handleInput} className="form-control" placeholder="***********" required="" />
                                                <i onClick={togglePassword} className={`toggle-password position-absolute fa ${passwordShown ? "fa-eye" : "fa-eye-slash"}`} style={{ cursor: 'pointer', top: '10px', right: '10px' }}></i>
                                            </div>
                                        </div>
                                        <button  type="submit" className="btn btn-primary btnsubmit">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </main>
        );
    }
    export default Login;