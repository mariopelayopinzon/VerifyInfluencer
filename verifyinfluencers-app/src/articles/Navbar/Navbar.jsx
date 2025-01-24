import React from 'react'
import { Button } from '../../components/ui/button.jsx'
import '../Navbar/navbar.css'
import 'boxicons'; 

const Navbar = () => {
  return (
    <div className='navbar-container'>
    <nav className="navbar">
        <div className='Logo-navbar'>
        <box-icon name='shield-alt-2' color='rgb(11, 241, 203)'></box-icon>
          VerifyInfluencers
          </div>
        <div className="links-navbar">
            <ul>
                <li><a href='#'>Leaderboard</a></li>
                <li><a href='#'>Products</a></li>
                <li><a href='#'>Monetization</a></li>
                <li><a href='#'>About</a></li>
                <li><a href='#'>Contact</a></li>
                <li><a href='#'>Admin</a></li>
                <li><a href='#'>Sign Out</a></li>
            </ul>
        </div>
    </nav>
<div className="button-dashboard">
    <div className='Back-to-Dashboard'>
      <Button color='teal' bg='none'> ← Back to Dashboard</Button>
       </div>
       <h1 className='Research-tasks'>Research Tasks</h1>
       </div>      

    </div>


  )
}

export default Navbar
