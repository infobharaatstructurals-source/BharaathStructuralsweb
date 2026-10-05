import {
  UserPlus,
} from 'lucide-react'

import {
  useSelector,
} from 'react-redux'

import type {
  RootState,
} from '../../../app/store'

import CareerSidebar from '../CareerSidebar/CareerSidebar'

import './AddUser.css'


export default function AddUser() {

  const user =
    useSelector(
      (state: RootState) =>
        state.auth.user
    )


  const role =
    user?.role || 'candidate'


  const canAccess =
    role === 'admin' ||
    role === 'hr'


  if (!canAccess) {

    return (

      <div
        style={{
          minHeight: '100vh',
          background: '#f5f7f9',
        }}
      >

        <CareerSidebar />

        <main
          style={{
            marginLeft: '90px',
            padding: '60px',
          }}
        >

          <h1>
            Access Denied
          </h1>

          <p>
            You do not have permission to access this page.
          </p>

        </main>

      </div>

    )

  }


  return (

    <div
      className="
        bs-add-user-page
      "
    >

      <CareerSidebar />


      <main
        className="
          bs-add-user-content
        "
      >

        <div
          className="
            bs-add-user-header
          "
        >

          <div>

            <span
              className="
                bs-add-user-eyebrow
              "
            >
              User Management
            </span>

            <h1>
              Add User
            </h1>

            <p>
              Create a new user account for Bharaat Structurals.
            </p>

          </div>


          <div
            className="
              bs-add-user-icon
            "
          >

            <UserPlus
              size={24}
              strokeWidth={1.8}
            />

          </div>

        </div>


        <div
          className="
            bs-add-user-card
          "
        >

          <div
            className="
              bs-add-user-placeholder
            "
          >

            <UserPlus
              size={32}
              strokeWidth={1.6}
            />

            <h2>
              Add User
            </h2>

            <p>
              The user creation form will be added here.
            </p>

          </div>

        </div>

      </main>

    </div>

  )
}