import getPhotoUrl from 'get-photo-url'
import { useEffect, useState } from 'react'
// react hook function (only use in component)
import profileIcon from '../assets/profileIcon.svg'
import { db } from '../dexie'

const Bio = () => {
  const [userDetails, setUserDetails] = useState({//setuserdetails state
    name: 'dlwlrma',
    about: 'I LOVE IU❤️',
  })
  const [editFormIsOpen, setEditFormIsOpen] = useState(false)//editform state
  const [profilePhoto, setProfilePhoto] = useState(profileIcon)//setprofilephoto state

  useEffect(() => {
    const setDataFromDb = async () => {
      const userDetailsFromDb = await db.bio.get('info')
      const profilePhotoFromDb = await db.bio.get('profilePhoto')
      userDetailsFromDb && setUserDetails(userDetailsFromDb)//條件渲染if left(有data) is true, then run right
      profilePhotoFromDb && setProfilePhoto(profilePhotoFromDb)
    }
    setDataFromDb()
  }, [])

  const updateUserDetails = async (event) => {//按下submit後
    event.preventDefault()
    const objectData = {
      name: event.target.nameOfUser.value,
      about: event.target.aboutUser.value,
    }

    setUserDetails(objectData)//直接set
    await db.bio.put(objectData, 'info(key)') //存入db
    setEditFormIsOpen(false)
  }

  const updateProfilePhoto = async () => {//更新profilephoto後
    const newProfilePhoto = await getPhotoUrl('#profilePhotoInput')
    setProfilePhoto(newProfilePhoto)//直接set
    await db.bio.put(newProfilePhoto, 'profilePhoto')//存入db
  }

  const editForm = (
    <form className="edit-bio-form" onSubmit={(e) => updateUserDetails(e)}>
      <input type="text" id="" name="nameOfUser" defaultValue={userDetails?.name} placeholder="Your name" required />
      <input type="text" id="" name="aboutUser" defaultValue={userDetails?.about} placeholder="About you" required />
      <br />
      <button type="button" className="cancel-button" onClick={() => setEditFormIsOpen(false)}>
        Cancel
      </button>
      <button type="submit">Save</button>
    </form>
  )

  const editButton = <button onClick={() => setEditFormIsOpen(true)}>Edit profile</button>

  return (
    <section className="bio">
      <input type="file" accept="image/*" name="photo" id="profilePhotoInput" />
      <label htmlFor="profilePhotoInput" onClick={() => updateProfilePhoto()}>
        <div className="profile-photo" role="button" title="Click to edit photo">
          <img src={profilePhoto} alt="profile" />
        </div>
      </label>

      <div className="profile-info">
        <p className="name">{userDetails?.name}</p>
        <p className="about">{userDetails?.about}</p>

        {editFormIsOpen ? editForm : editButton}
      </div>
    </section>
  )
}

export default Bio
