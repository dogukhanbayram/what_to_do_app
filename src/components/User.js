import { AiOutlineRight } from "react-icons/ai";
import React from 'react';

import '../style/List.css'

export default function User({ user, navigate }) {
    return (
        <div className="centeredContainer" onClick={() => navigate(user)}>
            <input className="inputText" type="text" defaultValue={user.userName} disabled={true} ></input>
            <AiOutlineRight className="icons" />
        </div>
    )
}