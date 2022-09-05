import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Users from './Users';
import axios from 'axios';

import '../style/List.css'

export const userNameMaxLength = 16;
export const API_URL_USERS = "https://6313c78bfc9dc45cb4e621d4.mockapi.io/users/";

export default function Login() {
    const [userName, setUserName] = useState("");
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const ref = useRef(null);

    //controls enter key press
    const onEnterCreate = (e) => {
        if (e.key === "Enter") {
            createUser();
        }
    };

    //gets users
    async function fetchUsers() {
        await axios.get(API_URL_USERS)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error("Error fetching data : ", error);
                setError(error);
            })
    };

    //navigation to Todo Screen
    const navigateToTodoList = (user) => {
        navigate("/Todos", { state: { id: user.id, userName: user.userName, darkMode: user.darkMode } });
    };

    //creates user
    async function createUser() {
        if (userName === "")
            return alert("User Name can not be empty!");

        setUserName(userName);
        await axios.post(API_URL_USERS, { userName }).then(() => fetchUsers());
        ref.current.value = "";
    };
    const onUserNameInputChange = (e) => {
        setUserName(e)
    };


    useEffect(() => {
        document.body.classList.remove("darkModeBody");
        fetchUsers();
        ref.current.focus();
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    //above comment is for disabling the mentioned warning.

    if (error) return "Error!";

    return (
        <div>
            <div><p>Welcome!</p></div>
            <input placeholder="User Name" className="topInput" type="text" ref={ref} maxLength={userNameMaxLength} onKeyDown={(e)=>onEnterCreate(e)} onChange={(e) => onUserNameInputChange(e.target.value)}></input>
            <button onClick={() => createUser()}>Create User</button>
            <Users users={users} navigate={(e) => navigateToTodoList(e)} />
        </div>
    )
}