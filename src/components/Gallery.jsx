import { useLiveQuery } from 'dexie-react-hooks'
import getPhotoUrl from 'get-photo-url'
import { db } from '../dexie'

const Gallery = () => {
  const allPhotos = useLiveQuery(() => db.gallery.toArray(), [])

  const addPhoto = async () => { //addphoto後
    db.gallery.add({url: await getPhotoUrl('#addPhotoInput'),})
  }

  const removePhoto = (id) => { //deletephoto後
    db.gallery.delete(id)
  }

  return (
    <>
      <input type="file" accept="image/*" name="photo" id="addPhotoInput" />
      <label htmlFor="addPhotoInput" onClick={addPhoto}>
        <i className="add-photo-button fas fa-plus-square" />
      </label>

      <section className="gallery">
        {!allPhotos && <p>Loading...</p>}
        {allPhotos?.map((photo) => (//if allphotos is available -> do map
          <div className="item" key={photo.id}>
            <img src={photo.url} className="item-image" alt="" />
            <button className="delete-button" onClick={() => removePhoto(photo.id)}>
              Delete
            </button>
          </div>
        )).reverse()}
      </section>
    </>
  )
}

export default Gallery
