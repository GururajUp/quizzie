import React from 'react'
import Style from '../../styles/quiz_card.module.css'
import { ImEye } from "react-icons/im";
import { getFormatedDate, getFormatedNo } from '../../utils/helper/helper_functions';

const QuizeCard = ({ quizeData }) => {


  return (
    <div className={Style.card}>
      <div>
        <h1>{quizeData?.name}</h1>
        <div>
          <h2>{getFormatedNo(quizeData.impressions)}</h2>
          <h2><ImEye /></h2>
        </div>
      </div>
      <p> Created On:
        {
          quizeData?.createdAt &&
          ` ${getFormatedDate(quizeData?.createdAt)}`
        }
      </p>
    </div>
  )
}

export default QuizeCard