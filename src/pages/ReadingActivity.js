import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import API from '../utils/API';
import AppContext from '../AppContext';


export default function ReadingActivity() {


    return (
        <React.Fragment>
            <div>dis right here is where I'm going to put all my good ol stats info and here's what it's gonna look like</div>

            <h1>This Month</h1>
            <div>same stats as dash; number of books, number of pages, avg rating</div>
            <div>right under that good shit, an option to choose a previous month, likely a date picker w just months in it. not sure yet tbh</div>


            <div>
                DOWN HERE 
                <ul>
                    <li>our classic lil shelf layout -- books that were read in the currently selected month</li>
                    <li>Each one will have the cover, title, author, dates read, rating</li>
                </ul>
            </div>
        </React.Fragment>
    )
}