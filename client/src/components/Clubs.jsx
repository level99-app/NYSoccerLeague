import React from "react";
import { useState, useEffect } from "react";
import Club from "./Club";
import DropMenu from "./DropMenu";
import axios from 'axios';


const Clubs = () => {

    const [data,setData] = useState(
        {
            name: '',
            county: '',
            city: '',
            email: '',
            phone: ''
        }
    );

    const base = "https://soccerleagues.herokuapp.com";

    const [name, setName] = useState('');
    const [county, setCounty] = useState('Select County');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [counties, setCounties] = useState(['']);

    const [clubs, setClubs] = useState([]);

    const getLeagues = () => {
        axios.get(`${base}/leagues/`)
        .then(response => {
            const newData = response.data.sort((a, b) => { return (a.county > b.county) ? 1 : -1});
            setCounties(
                newData.map((e, i) => e.county)
            );
        })
        .catch(err => console.log("rr: ",err))
    }

    useEffect(getLeagues, []);

    const handleSearch = () => {

        getValue();

        if(county !== 'Select County' && name === '' && city === ''){

            const league = county + " ASL";
            axios.get(`${base}/clubs/league/${league}`)
            .then(res => {
                const newData = res.data.sort((a, b) => { return (a.name > b.name) ? 1 : -1});
                setClubs(newData);
                console.log(clubs);
            })
            .catch(err => console.log("Err: ", err))
        }else if(name !== '' && county === 'Select County' && city === ''){
            
            axios.get(`${base}/clubs/name/${name}`)
            .then(res => {
                const newData = res.data.sort((a, b) => { return (a.name > b.name) ? 1 : -1});
                setClubs(newData);
                console.log(clubs);
            })
            .catch(err => console.log("Err: ", err))
        }else if(name === '' && county === 'Select County' && city !== ''){
            
            axios.get(`${base}/clubs/city/${city}`)
            .then(res => {
                const newData = res.data.sort((a, b) => { return (a.city > b.city) ? 1 : -1});
                setClubs(newData);
                console.log(clubs);
            })
            .catch(err => console.log("Err: ", err))
        }else if(name !== '' && county === 'Select County' && city !== ''){
            console.log("city : " + city + ", name : " + name);
            const club = {'name': name, 'city': city};
            axios.get(`${base}/clubs/city&name/${city}/${name}`)
            .then(res => {
                const newData = res.data.sort((a, b) => { return (a.name > b.name) ? 1 : -1});
                setClubs(newData);
                console.log(clubs);
            })
            .catch(err => console.log("Err: ", err))
        }
        
        setCounty('Select County');
        setName('');
        setCity('');
    }

    const getValue = (value, id) =>{
        setCounty(value);
    }

    const handleAdd = () => {
        setData({name: name, county: county, city: city, email: email, phone: phone});
        const club = {
            name: name,
            county: county,
            city: city,
            league: county+" ASL",
            email: email,
            phone: phone
        };

        console.log(data);
        axios.post(`${base}/clubs`, club)
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
    }

    const handleDelete = (id, county, city) => {
        const newClubs = clubs.filter(club => club._id !== id);
            setClubs(newClubs);

            axios.delete(`${base}/clubs/${id}`)
            .then(res => {
                console.log(" deleted from database: ", id);
            })
            .catch(err => console.log(err))
    }
    const handleModify = (xname, xcounty, xcity, xemail, xphone, xid) => {
        setName(xname);
        setCounty(xcounty);
        setCity(xcity);
        setEmail(xemail);
        setPhone(xphone);
        setId(xid);
    }

    const handleUpdate = () => {
        const club = {"newName": name, "newCounty": county, "newLeague": county, "newCity": city, "newEmail": email, "newPhone": phone, "_id": id};
        console.log(club);
        axios.put(`${base}/clubs/update/${id}`, club)
        .then(res => {
            console.log("club updated")
        }).catch(err => console.log("ErRoR DeTeCtEd: ", err))
    }


    return (
        <div className="main">
            <div className="club-input">
            <label>Club County </label>
                <DropMenu defaultText="Select County" value={county} getValue={getValue} content={counties} id="clubcounty" />
                <label>City of Club </label>
                <input value={city} onChange={(e) => setCity(e.target.value)} type="text" id="clubcity" />
                <label>Name of Club </label>
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" id="clubname" />
                <label> Club's Email </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" id="clubemail" />
                <label>Phone Number </label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" id="clubphone" />
                <div className="buttons">
                <button className="club-input-button" onClick={handleSearch}>Search</button>
                <button className="club-input-button" onClick={handleAdd}>Add</button>
                <button className="club-input-button" onClick={handleUpdate}>Update</button>
                </div>
            </div>
            <div className="results">
            <div className="results-header"> <h3>Clubs</h3></div>
                { clubs.map((club) => <Club handleModify={handleModify} handleDelete={handleDelete}clubname={club.name} clubcity={club.city} clubcounty={club.county} clubphone={club.phone} clubemail={club.email} key={club._id} id={club._id}/>)}
               
            </div>
        </div>

    )
}

export default Clubs;