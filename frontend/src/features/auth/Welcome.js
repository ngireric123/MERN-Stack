import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    //Destructure username, isManager, isAdmin from useAuth hook

    const { username, isManager, isAdmin } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('default', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        <section className="welcome">

            <p>{today}</p>

            <h1>Welcome {username} !</h1>

            <p><Link to="/dash/notes">View techNotes</Link></p>

            <p><Link to="/dash/notes/new">Add New techNote</Link></p>

            {/* check if the user is admin or manager this is to protect Link*/}
            {(isManager || isAdmin) && <p><Link to="/dash/users">View User Settings</Link></p>}

            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}

        </section>
    )
    return content
}

export default Welcome
