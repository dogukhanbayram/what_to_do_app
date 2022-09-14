import { AiOutlineCheck, AiOutlineClose, AiOutlineEdit, AiOutlineCarryOut, AiOutlineDelete, AiOutlineUndo } from "react-icons/ai"
import React, { useEffect, useRef, useState } from 'react';
import { maxTodoLength } from "./TodoScreen";
import axios from 'axios';

import '../style/List.css'

export default function Todo({ todo, fetch, API_URL_TODOS, darkMode }) {
    const [currentContent, setCurrentContent] = useState(todo.content);
    const [isCompleted, setIsCompleted] = useState(todo.isCompleted);
    const [content, setContent] = useState(todo.content);
    const [edit, setEdit] = useState(false);

    const isFirstRender = useRef(true);
    const ref = useRef(null);

    //controls enter and escape key press
    const onEditKeyPress = (e) => {
        if (e.key === "Enter") {
            onEditSubmit();
        }
        if (e.key === "Escape") {
            onCancelEdit();
        }
    };

    //css class variables
    const darkModeDiv = darkMode ? "centeredContainer darkModeCenteredContainer" : "centeredContainer";
    const completeStatus = isCompleted ? "inputText completed" : "inputText";

    //deletes todo
    async function deleteTodo(id) {
        await axios.delete(API_URL_TODOS + id).then(fetch);
    };

    //edits todo
    const onEditClick = () => {
        setEdit(true);
    };
    async function onEditSubmit() {
        if (content === "")
            return alert("To do content can not be empty!");
        if (content.length < 3)
            return alert("To do can not be shorter than 3 characters!")

        setEdit(false);
        var id = todo.id;
        await axios.put(API_URL_TODOS + id, { content }).then(fetch);
        setCurrentContent(content);
    };
    const onCancelEdit = () => {
        ref.current.value = currentContent;
        setEdit(false);
    }
    const onChangeValue = (e) => {
        setContent(e);
    };

    //completes todo
    const onComplete = () => {
        setIsCompleted(!isCompleted);
    };
    async function updateComplete() {
        await axios.put(API_URL_TODOS + todo.id, { isCompleted }).then(fetch);
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return;
        }
        updateComplete();
    }, [isCompleted]);// eslint-disable-line react-hooks/exhaustive-deps
    //above comment is for disabling the mentioned warning.

    useEffect(() => {
        if (edit)
            ref.current.focus();
    }, [edit]);// eslint-disable-line react-hooks/exhaustive-deps
    //above comment is for disabling the mentioned warning.

    return (
        <div className={darkModeDiv}>
            <input className={completeStatus} ref={ref} type="text" defaultValue={content} maxLength={maxTodoLength} disabled={!edit} onChange={(e) => onChangeValue(e.target.value)} onKeyDown={(e)=>onEditKeyPress(e)}></input>
            {edit ? <><AiOutlineCheck className="icons" onClick={() => onEditSubmit()} /><AiOutlineClose className="icons" onClick={() => onCancelEdit()} /></> : <>
                {!isCompleted ? <><AiOutlineCarryOut className="icons" onClick={() => onComplete()} /><AiOutlineEdit className="icons" onClick={() => onEditClick()} /></> : <AiOutlineUndo className="icons" onClick={() => onComplete()} />}
                <AiOutlineDelete className="icons" onClick={() => deleteTodo(todo.id)} /> </>}
        </div>
    )
}