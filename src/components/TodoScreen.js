import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit, AiOutlineDelete, AiOutlinePoweroff } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL_USERS, userNameMaxLength } from './Login';
import { useEffect, useRef, useState } from 'react';
import { FiSun, FiMoon } from "react-icons/fi";
import Todos from './Todos';
import axios from 'axios';

import '../style/App.css';
import '../style/List.css';

export const maxTodoLength = 22;

export default function TodoScreen() {
  //gets the props passed down from navigation
  const { state } = useLocation();

  const API_URL_TODOS = API_URL_USERS + state.id + "/todos/";
  const navigate = useNavigate();


  const [edit, setEdit] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [darkMode, setDarkMode] = useState(state.darkMode);
  const [userName, setUserName] = useState(state.userName);
  const [currentUserName, setCurrentUserName] = useState(state.userName);

  const isFirstRender = useRef(true);
  const userRef = useRef(null);
  const ref = useRef(null);

  //enter and escape key press control
  const onKeyPress = (e, enter, escape = null) => {
    if (e.key === "Enter") {
      enter();
    }
    if (e.key === "Escape" && escape) {
      escape();
    }
  };

  //css class variables
  const darkModeTopInput = darkMode ? "topInput darkModeTextAndIcons darkModeInputBg" : "topInput";
  const darkModeToggleIcons = darkMode ? "darkModeIcon darkModeTextAndIcons" : "darkModeIcon";
  const darkModeIcons = darkMode ? "userBarIcons darkModeTextAndIcons" : "userBarIcons";
  const darkModeUserName = darkMode ? "userName darkModeTextAndIcons" : "userName";
  const darkModeText = darkMode ? "darkModeTextAndIcons" : null;
  const darkModeButton = darkMode ? "darkModeButton" : null;

  //gets todos
  async function fetchTodos() {
    await axios.get(API_URL_TODOS)
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data : ", error);
        setError(error);
      })
  };

  //deletes user and todos it's associated with
  //might take a while to execute
  //because it deletes both the user and the todos it's associated with
  async function deleteUser() {
    for (const todo of data) {
      await axios.delete(API_URL_USERS + state.id + "/todos/" + todo.id);
    };
    await axios.delete(API_URL_USERS + state.id);
    logOff();
  };
  //deletes completed todos
  async function deleteAllCompleted() {
    for (const todo of data) {
      if (todo.isCompleted)
        await axios.delete(API_URL_USERS + state.id + "/todos/" + todo.id);
    };
    fetchTodos();
  }

  //dark mode
  const darkModeCss = () => {
    if (darkMode) {
      document.body.classList.add("darkModeBody");
    }
    else {
      document.body.classList.remove("darkModeBody");
    }
  }
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }
  async function updateDarkMode() {
    await axios.put(API_URL_USERS + state.id, { darkMode });
    navigate("/Todos", { state: { id: state.id, userName: state.userName, darkMode: darkMode } });
  }
  useEffect(() => {
    if (isFirstRender.current) {
      darkModeCss();
      fetchTodos();
      ref.current.focus();
      isFirstRender.current = false
      return;
    }
    updateDarkMode();
    darkModeCss();
  }, [darkMode]);// eslint-disable-line react-hooks/exhaustive-deps
  //above comment is for disabling the mentioned warning.


  //logs off
  const logOff = () => {
    navigate("/");
  }

  //creates to do
  async function createTodo() {
    if (content === "")
      return alert("To do content can not be empty!");

    await axios.post(API_URL_TODOS, { content }).then(() => fetchTodos());
    ref.current.value = "";
  };
  const handleChange = (e) => {
    setContent(e);
  };

  useEffect(() => {
    if (edit)
      userRef.current.focus();
  }, [edit])// eslint-disable-line react-hooks/exhaustive-deps
  //above comment is for disabling the mentioned warning.

  //edits username
  const onEditClick = () => {
    setEdit(true);
  };
  async function onEditSubmit() {
    if (userName === "")
      return alert("User Name can not be empty!");

    setEdit(false);
    var id = state.id;
    await axios.put(API_URL_USERS + id, { userName });
    setCurrentUserName(userName);
    navigate("/Todos", { state: { id: state.id, userName: userName, darkMode: state.darkMode } });
  };
  const onChangeValue = (e) => {
    setUserName(e);
  };
  const onCancelEdit = () => {
    userRef.current.value = currentUserName;
    setEdit(false);
  }

  if (error) return "Error!";
  return (
    <>
      <div className="userBar">
        {darkMode ? <FiMoon onClick={() => toggleDarkMode()} className={darkModeToggleIcons} /> : <FiSun onClick={() => toggleDarkMode()} className={darkModeToggleIcons} />}
        <input className={darkModeUserName} ref={userRef} type="text" defaultValue={userName} disabled={!edit} maxLength={userNameMaxLength} onChange={(e) => onChangeValue(e.target.value)} onKeyDown={(e) => onKeyPress(e, () => onEditSubmit(), () => onCancelEdit())}></input>
        {edit ? <><AiOutlineCheck className={darkModeIcons} onClick={() => onEditSubmit()} /><AiOutlineClose className={darkModeIcons} onClick={() => onCancelEdit()} /></> : <>
          <AiOutlineEdit className={darkModeIcons} onClick={() => onEditClick()} />
          <AiOutlineDelete className={darkModeIcons} onClick={() => deleteUser()} />
          <AiOutlinePoweroff className={darkModeIcons} onClick={() => logOff()} /></>}
      </div>
      <div className="App">
        <div><p className={darkModeText}>Welcome, {state.userName}!</p></div>
        <input placeholder="What To Do?" className={darkModeTopInput} maxLength={maxTodoLength} ref={ref} type="text" onChange={(e) => handleChange(e.target.value)} onKeyDown={(e) => onKeyPress(e, () => createTodo())}></input>
        <button className={darkModeButton} onClick={() => createTodo()}>What To Do?</button>
        <div><button className={darkModeButton} onClick={() => deleteAllCompleted()}>Delete Completed</button></div>
        <Todos todos={data} fetch={() => fetchTodos()} API_URL_TODOS={API_URL_TODOS} darkMode={darkMode} />
      </div>
    </>

  );
}
