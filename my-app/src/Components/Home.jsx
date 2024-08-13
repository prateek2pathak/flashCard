import React from 'react'
import { useNavigate } from 'react-router-dom'
import './ComponentCSS/Home.css';

export default function Home() {
    const navigator = useNavigate();
    const admin = ()=>{
        navigator('/admin')
    }
    const student = ()=>{
        navigator('/student')
    }
  return (
    <div className='home'>
        <div>
            <h1>Who are you??</h1>
        </div>
       <div className="buttons">
        <button onClick={admin}>Admin</button>
        <button onClick={student}>Student</button>
       </div>
      
    </div>
  )
}
