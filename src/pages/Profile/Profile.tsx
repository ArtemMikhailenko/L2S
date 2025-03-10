// src/pages/Profile.tsx
import { useState } from 'react'

interface UserData {
  firstName: string
  lastName: string
  rating: number
}

function Profile() {
  const [userData] = useState<UserData>({
    firstName: 'Иван',
    lastName: 'Иванов',
    rating: 4.5
  })

  return (
    <div>
      <h2>Профиль</h2>
      <p>Имя: {userData.firstName}</p>
      <p>Фамилия: {userData.lastName}</p>
      <p>Рейтинг: {userData.rating}</p>
    </div>
  )
}

export default Profile
