import React from 'react';
import User from './User';

export default function Users({ users, navigate }) {
    return (
        users.map(user => {
            return <User key={user.id} user={user} navigate={navigate} />
        })
    )
}