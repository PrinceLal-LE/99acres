// import React from "react";
import { useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Home() {
    // const [FirstName, setName] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        axios.get('http://localhost:8081')
            .then(res => {
                if(res.data.valid){
                    console.log("Valied User")
                    // setName(res.data.FirstName)
                }else{
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
    })
    return (
        <div>
            <h1>
                Welcome  </h1>
        </div>
    )
}

export default Home;