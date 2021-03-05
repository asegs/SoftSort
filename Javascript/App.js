import './App.css';
import Form from './Components/Form.js';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';
import AddSchema from "./Components/AddSchema";
import AppNav from './Components/AppNav';
import React from "react";
import DataUpload from './Components/DataUpload';
import UploadKey from "./Components/UploadKey";
import SoftsortLogo from "./Components/logo.png";
import About from "./Components/About";
import Validator from "./Components/Validator";
import Joiner from "./Components/Joiner";


function App() {
    const isMobile = window.innerWidth <= 500;
    let width = isMobile ? "100%" : "60%";
  return (
    <div className="App" style={{width:width,margin:'auto'}}>
        <AppNav/>
      <img src={SoftsortLogo} alt={"SOFTSORT"} width={"50%"}/>
        <Router>
            <Switch>
                <Route path='/' exact={true} component={Form}/>
                <Route path='/create' exact={true} component={AddSchema}/>
                <Route path='/upload' exact={true} component={DataUpload}/>
                <Route path='/account' exact={true} component={UploadKey}/>
                <Route path='/about' exact={true} component={About}/>
                <Route path='/joiner' exact={true} component={Joiner}/>
                <Route path='/verify/:verification' exact={true} component={Validator}/>
                <Route path='/:company' component={Form}/>
            </Switch>
        </Router>
    </div>

  );
}

export default App;
