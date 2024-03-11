// import React from "react";

import axios from "axios";
import { useState } from "react"

function Register(){

    const [values, setValues] = useState({
        FirstName: '',
        email:'',
        password:''
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/Register', values)
        .then(res => console.log(res))
        .then(err => console.log(err));
    }

    return (
        <div className="d-flex justify-content-center align-item-center bg-primary vh-100" >
            <div className="bg-white p-3 rounded w-25">
                <h2>Sign-up</h2>
                <form onSubmit={handleSubmit} action="">
                    <div className="mb-3">
                        <label htmlFor="FirstName"> <strong>Name</strong></label>
                        <input type="text" placeholder='Enter Name' name="FirstName" id="" onChange={e => setValues({...values, FirstName: e.target.value})} className="form-control rounded-0"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email"> <strong>Email</strong></label>
                        <input type="text" placeholder='Enter Email' name="email" id="" onChange={e => setValues({...values, email: e.target.value})} className="form-control rounded-0"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"> <strong>Password</strong></label>
                        <input type="text" placeholder='Enter Password' name="password" id=""  onChange={e => setValues({...values, password: e.target.value})} className="form-control rounded-0"/>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0"> Sign up</button>
                </form>
            </div>
        </div>
    )
}

export default Register