import { useEffect, useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import {Room,Settings,Star} from "@material-ui/icons"
import "./app.css"
import axios from "axios"
import { format, render, cancel, register } from 'timeago.js';
import Register from './components/Register';
import Login from "./components/Login"

function App() {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins,setPins] = useState([]);
  const [currentPlace,setCurrentPlace] = useState(null);
  const [newPlace,setNewPlace] = useState(null);
  const [title,setNewTitle] = useState(null);
  const [desc,setNewReview] = useState(null);
  const [rating,setNewRating] = useState(0);
  const [showRegister,setShowRegister] = useState(null);
  const [showLogin,setShowLogin] = useState(null);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 46,
    longitude: 17,
    zoom: 4
  });

  useEffect (()=>{
    const getPins = async ()=>{
      try{
        const res = await axios.get("/pins");
        setPins(res.data);

      }catch(err){
        console.log(err);
      }     
    };
    getPins();
  },[])

  const handleMarkerClick = (id,lat,long) =>{
    setCurrentPlace(id);
    setViewport ({...viewport,latitude:lat,longitude:long})
  }

  const handleAddClick = (e) =>{
    const [long,lat] = e.lngLat;
    setNewPlace({
      lat,
      long
    })
  }

  const handleNewPin = async (e) =>{
    e.preventDefault();
    const newPin = ({
      username:currentUser,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    });

    try{
      const res = await axios.post("/pins",newPin);
      setPins([...pins,res.data]);
      setNewPlace(null);

    }catch(err){
      console.log(err);
    }
  }

  const handleLogout = () =>{
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  return (
    <div className="App">
      <ReactMapGL
      {...viewport}
      mapboxApiAccessToken= {process.env.REACT_APP_MAPBOX}
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      onViewportChange={nextViewport => setViewport(nextViewport)}
      onClick={handleAddClick}
      >
      {pins.map((p)=>(
        <>
        <Marker latitude={p.lat} longitude={p.long} offsetLeft={-20} offsetTop={-10} >
      <Room style={{fontSize:viewport.zoom * 7 , color: p.username === currentUser? "tomato" : "slateblue", cursor:"pointer"}} onClick={()=>{handleMarkerClick(p._id,p.lat,p.long)}}/></Marker>
      {p._id === currentPlace && (
        <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left" 
          onClose={()=>{setCurrentPlace(null)}}>
          <div className="card">
            <label>Place</label>
            <h4 className="place">{p.title}</h4>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating </label>
            <div className="stars">
              {Array(p.rating).fill(<Star className="star"/>)}
            </div>
            <label>InformationCreated by</label>
            <span className="username"><b> {p.username}</b></span> 
            <span className="date">{format (p.createdAt)}</span> 
          </div>
        </Popup>
      )}
      </>
      ))}
      {newPlace && (
        <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left" 
          onClose={()=>{setNewPlace(null)}}>
          <div>
          <form onSubmit={handleNewPin}>
            <label>Title</label>
            <input type="text" placeholder="Enter a title" onChange={(e)=>{setNewTitle(e.target.value)}}/>
            <label>Review</label>
            <textarea placeholder="Say us something about this place" onChange={(e)=>{setNewReview(e.target.value)}}></textarea>
            <label>Rating</label>
            <select onChange={(e)=>{setNewRating(e.target.value)}}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button className="submitButton">Add pin</button>
          </form>
           
          </div>
          </Popup>    
      )}
      {currentUser?  <button className="button logout" onClick={handleLogout}>Log out</button> : <div className="buttons">
      <button className="button login" onClick={()=>setShowLogin(true)}>Login</button>
      <button className="button register" onClick={()=>setShowRegister(true)}>Register</button>
    
      </div>}
      
      {showRegister && <Register setShowRegister={setShowRegister}/>}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} /> }

      
    
      </ReactMapGL>
    </div>
  );
}

export default App;
