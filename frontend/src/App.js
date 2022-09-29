import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Public from './components/Public'
import Login from './features/auth/Login'
import DashLayout from './components/DashLayout'
import Welcome from './features/auth/Welcome'
import NotesList from './features/notes/NotesList'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import EditNote from './features/notes/EditNote'
import NewNote from './features/notes/NewNote'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
// this is for protecting Routes
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* PUBLIC ROUTES */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* PROTECTED ROUTES */}
        {/* redux subscription */}
        <Route element={<PersistLogin />}>
          {/* means select roles which is in ROLES array[...object.values(ROLES)] */}
          <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>

            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>

                <Route index element={<Welcome />} />

                {/* Users */}
                <Route element={<RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                {/* Notes */}
                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

              </Route>{/* End Dash */}
            </Route>
          </Route>
        </Route> {/* END PROTECTED ROUTES */}

      </Route>
    </Routes>
  );
}

export default App;
