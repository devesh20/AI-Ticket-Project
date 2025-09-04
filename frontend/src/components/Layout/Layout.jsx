import React from 'react'
import NavBar from '../NavBar/NavBar'

function Layout({children}) {
  return (
    <div>
        <div className='sticky top-0 z-50'>
            <NavBar/>
        </div>
        <main className='p-4'>
            {children}
        </main>
    </div>
  )
}

export default Layout