import React from 'react'
import { Route, BrowserRouter} from 'react-router-dom'
// Pages
import Main from './pages/Main'
import CreatePoint from './pages/CreatePoint'
// Components
import Navbar from './components/Navbar'

const Routes = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Route component={Main} path='/' exact/>
            <Route component={CreatePoint} path='/create-point' />
        </BrowserRouter>
    )
}

export default Routes