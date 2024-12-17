/**
 * The App component is responsible for rendering a user interface that displays a list of users and their data.
 * It fetches user data from an API and allows the user to click on a user ID to display the relevant data for that user.
 * The user data can be found either in a PostgreSQL database or in a Redis cache, and the component handles rendering
 * the data accordingly. The component also includes a list of current user IDs and allows the user to select a user to
 * view their data. The component uses React hooks such as useState and useEffect to manage state and perform API calls.
 */

import {useEffect, useState} from 'react'
import Postgres from './assets/postgresql.svg'
import Redis from './assets/redis.svg'

function App() {
  const [users, setUsers] = useState([])
  const [user, setUser] = useState([])

  const getUser = async userID => {
    /**
     * Fetches user data from the API based on the provided userID.
     *
     * @param {string} userID - The ID of the user to fetch data for.
     * @returns {Promise<void>} - A Promise that resolves when the user data is fetched and set.
     */
    await fetch(`http://127.0.0.1:80/api/v2/datapipeline/${userID}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error(error))
  }

  useEffect(() => {
    // generate a list of users on mount
    fetch(`http://127.0.0.1:80/api/v2/datapipeline/list-users`)
      .then(response => response.json())
      .then(data => {
        setUsers(data)
      })
      .catch(error => console.error(error))
  }, [])

  const renderUserData = () => {
    if (Array.isArray(user)) {
      // Handle rendering for postgres_data (array)
      return user.map((userArray, index) => (
        <>
          <div className="flex items-center mb-4">
            <p className="mr-4">Data found in:</p>
            <img src={Postgres} width={50} className="align-middle" />
          </div>

          <div
            key={index}
            className="rounded-md border border-gray-300 bg-gray-600 p-4 font-mono text-white"
          >
            {userArray.map((item, itemIndex) => (
              <p key={itemIndex}>{item}</p>
            ))}
          </div>
        </>
      ))
    } else {
      // Handle rendering for redis_data (object)
      return (
        <>
          <div className="flex items-center mb-4">
            <p className="mr-4">Data found in:</p>
            <img src={Redis} width={50} className="align-middle" />
          </div>
          <div className="rounded-md border border-gray-300 bg-gray-600 p-4 font-mono text-white">
            {Object.entries(user).map(([key, value], index) => (
              <p key={index}>{`${key}: ${value}`}</p>
            ))}
          </div>
        </>
      )
    }
  }

  return (
    <div className="container mx-auto max-w-[960px]">
      <div>
        <p className="mt-8 text-lg">
          Click on the <code>uid</code> to display the relevant data for that
          user...
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-10">
        <div>
          <h1 className="font-bold mb-4">
            Current user <code>uid</code>s
          </h1>
          {users.length === 0
            ? () => <p>No users found</p>
            : users.map(item => (
                <ul key={item}>
                  <li
                    key={item}
                    className="font-mono hover:cursor-pointer hover:text-blue-500"
                    onClick={() => getUser(item)}
                  >
                    {item}
                  </li>
                </ul>
              ))}
        </div>
        <div>
          <div className="sticky top-10">
            <h1 className="font-bold mb-4">User data</h1>
            <div>{renderUserData()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
