import React, {useState} from 'react'
import './Navbar.scss'
import { FiLogIn, FiSkipBack} from 'react-icons/fi'
import { Link } from 'react-router-dom'

const Navbar = () => {

    const [clicked, setClicked] = useState(true) 

    const renderButton = () => {

        if (clicked){
            return (
            <Link className="info_box" to="/create-point" onClick={() => setClicked(!clicked)}>
                <FiLogIn color='#34CB79'/>
                <p> Cadastre um ponto de coleta</p>
            </Link>
            )
        }
        else {
            return (
            <Link className="info_box" to="/" onClick={() => setClicked(!clicked)}>
                <FiSkipBack color='#34CB79'/>
                <p> Voltar </p>
            </Link>
            )
        }
        
    }

    return (
    <div className="navbar">
        {console.log("Render do Navbar")}
        <div className="logo"></div>
        { renderButton() }
    </div>
    )
}

export default Navbar