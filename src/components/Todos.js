import React from 'react';
import Todo from './Todo';

export default function Todos({ todos, fetch, API_URL_TODOS, darkMode }) {
    return (
        todos.map(todo => {
            return <Todo key={todo.id} todo={todo} fetch={fetch} API_URL_TODOS={API_URL_TODOS} darkMode={darkMode} />
        })
    )
}