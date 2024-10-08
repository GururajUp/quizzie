import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import Loader from '../utils/globalLoader/loader';
import QuizQuestionAnalysis from '../components/ques_analysis/quiz_question_analysis';
import PollQuestionAnalysis from '../components/ques_analysis/poll_question_analysis';

const QWiseAnalysis = () => {

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [quize, setQuize] = useState({});

const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fetchQuizes = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${backendUrl}/quiz/${id}`, {
        headers: {
          authorization: localStorage.getItem('authToken')
        }
      })
      console.log(data)
      setQuize(data.quize);
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQuizes();
  }, [])

  return (
    <>
      {loading && <Loader />}
      <div>
        {
          quize?.quizeType == 'QnA' ?
            <QuizQuestionAnalysis quizeData={quize} /> :
            <PollQuestionAnalysis pollData={quize} />
        }
      </div>
    </>
  )
}

export default QWiseAnalysis