import React from 'react';
import Header from './components/Header'
import Sections from './components/Sections'


function App() {
    return (
        <div className='h-[100vh] flex flex-col'>
            <div className='h-12'>
                <Header />
            </div>
            <div className='flex-1 bg-gray-100 w-[100vw] overflow-x-auto'>
                <Sections />
            </div>
        </div>
    )
}

export default App
