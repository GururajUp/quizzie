import React, { useState } from 'react'
import Style from '../../styles/get_all_questions.module.css'
import { IoMdAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import GetQandOptionType from './get_qandoption_type';
import GetOptions from './get_options';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../utils/globalLoader/loader';
import { quizeInfo } from '../../utils/dummyObjects/quize';
import GetTimer from './get_timer';
import { useNavigate } from 'react-router-dom';


const GetAllQuestions = ({ setUrl, changePopup, quizeData, type }) => {
  const navigate = useNavigate()

  //declaring initiall states with some dummy data
  const dummyQ = quizeData.quizeType == 'QnA' ? quizeData.QnAQuestions : quizeData.pollQuestions;
  const initialOptions = [
    {
      text: '',
      imageURL: '',
    },
    {
      text: '',
      imageURL: '',
    }
  ]
  const initialEditQues = [...dummyQ]
  const initialCreateQues = [{ ...dummyQ[0], options: initialOptions }]
  const initialQues = type == 'create' ? initialCreateQues : initialEditQues;

  const [questions, setQuestions] = useState(initialQues);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [loading, setLoading] = useState(false);

  //function to add one more question
  const addQuestion = () => {
    if (questions.length < 6) {
      if (quizeData.type == 'QnA') {
        setQuestions([...questions, { ...quizeInfo.QnAQuestions[0], options: initialOptions, }])
      } else {
        setQuestions([...questions, { ...quizeInfo.pollQuestions[0], options: initialOptions, }])
      }
    }
  }

  //function to remove a question
  const removeQuestion = (val) => {
    if (val > 0) {
      setQuestions(questions.filter((q, i) => i != val))
    }

    if (val == questions.length - 1) {
      setActiveQuestion(val - 1);
    }
  }

  //function to change current question-- on which we are working currently
  const changeActiveQ = (i) => {
    setActiveQuestion(i);
  }

  //function to validate all quizedata
  const validateQuizeData = () => {
    let validate = false;

    // if (!quizeData.timePerQuestion && quizeData.quizeType == 'QnA') {
    //   toast.error("Please select the timer")
    //   return validate;
    // }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].ques) {
        toast.error(`Enter the Question no. ${i + 1}`)
        return validate;
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if ((!questions[i].options[j].text && questions[i].optionType == 'text') || (!questions[i].options[j].imageURL && questions[i].optionType == 'imageURL') || ((!questions[i].options[j].text || !questions[i].options[j].imageURL) && questions[i].optionType == 'textAndImageURL')) {
          toast.error(`Enter all options in Q.${i + 1}`);
          return validate;
        }
      }

      if (!questions[i].correctOption && quizeData.quizeType == 'QnA') {
        toast.error(`Select correct option in Q.${i + 1}`)
        return validate;
      }
    }

    if (quizeData.quizeType == 'QnA') {
      quizeData.QnAQuestions = questions;
      quizeData.pollQuestions = [];
    } else {
      quizeData.pollQuestions = questions;
      quizeData.QnAQuestions = [];
    }

    return true;
  }
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const submitCreateQuize = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/quiz/create-quiz`, quizeData, {
        headers: {
          Authorization: localStorage.getItem('authToken')
        }
      })
      if (data.success) {
        setUrl(data.url);
        changePopup('lastPopup');
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  const submitEditQuize = async () => {
    try {
      const { data } = await axios.put(`http://localhost:3000/quiz/${quizeData._id}`, quizeData, {
        headers: {
          Authorization: localStorage.getItem('authToken')
        }
      })
      if (data.success) {
        setUrl(data.url);
        changePopup('lastPopup');
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  //function to submit the quize on the api
  const submitQuize = async (e) => {
    e.preventDefault();

    if (validateQuizeData()) {

      setLoading(true);
      if (type == 'create') {
        await submitCreateQuize();
      } else {
        await submitEditQuize();
      }
      setLoading(false);
    }
  }

  //function to handle cancle button 
  const cancelHandler = () => {
    navigate('/dashboard')
  }


  return (
    <>
      {loading && <Loader />}
      <form onSubmit={submitQuize} className={Style.addQcontainer}>
        <div className={Style.addQ}>
          <div className={Style.left}>
            {
              questions.map((q, i) => (
                <div key={i}>
                  <div onClick={() => { changeActiveQ(i) }}
                    className={activeQuestion == i ? `${Style.addCircle} ${Style.bgGreen}` : Style.addCircle}>
                    <h2>{i + 1}</h2>
                  </div>

                  <RxCross2 style={i == 0 && { display: 'none' }}
                    className={Style.removeIcon}
                    onClick={() => { removeQuestion(i) }}
                  />

                </div>
              ))
            }

            <IoMdAdd className={Style.addIcon}
              style={questions.length == 5 && { display: 'none' }}
              onClick={addQuestion}
            />

          </div>
          <div className={Style.right}>
            Max 5 questions
          </div>
        </div>

        <div>
          <GetQandOptionType questions={questions} setQ={setQuestions} i={activeQuestion} quizeType={quizeData.quizeType} />
        </div>

        <div className={Style.optionsAndTimer}>
          <GetOptions questions={questions} quizeData={quizeData} no={activeQuestion} setQ={setQuestions} />
          <GetTimer quizeData={quizeData} />
        </div>

        <div className={Style.buttons}>
          <button onClick={cancelHandler}>Cancel</button>
          <button type='submit'>{type} Quize</button>
        </div>
      </form>
    </>
  )
}

export default GetAllQuestions