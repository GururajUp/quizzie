import React from 'react'
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css';
import Style from './delete_confirmation_popup.module.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const DeleteConfirmationPopup = ({ popupInfo, setOpen, setLoading, setRefresh }) => {
  const navigate = useNavigate()
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const deleteQuize = async () => {
    navigate('/analytics')
    setOpen({ isOpen: false, id: '' })
    setLoading(true)
    try {
      const { data } = await axios.delete(`${backendUrl}/quiz/${popupInfo?.id}`, {
        headers: {
          authorization: localStorage.getItem('authToken')
        }
      });
      setRefresh((prev) => !prev)
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.error)
    }
  }

  return (
    <>
      <Popup open={popupInfo.isOpen}
        closeOnDocumentClick
        onClose={() => { setOpen({ isOpen: false, id: '' }) }}
        contentStyle={{ borderRadius: "10px", width: '845px', height: '300px' }}
      >
        <div className={Style.deletePopup}>
          <h1>Are you confirm <br /> you want to delete ?</h1>
          <div>
            <button onClick={deleteQuize}>Confirm Delete</button>
            <button onClick={() => { setOpen({ isOpen: false, id: '' }) }}>Cancel</button>
          </div>
        </div>

      </Popup>
    </>
  )
}

export default DeleteConfirmationPopup