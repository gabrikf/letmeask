
import Button from '../components/Button'
import '../styles/room.scss'
import Header from '../components/Header'
import { useHistory, useParams, Link } from 'react-router-dom'
import deleteImg from '../assets/images/delete.svg'
import Question from '../components/Question'
import useRoom from '../hooks/useRoom'
import { database } from '../services/firebase'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'



type RoomParams = {
    id: string;
}
type FireBaseQuestions = Record<string, { 
    title: string;
    authorId: string;
    questions: number
    
    }>
    type UserRoom = {
      id:string;
      title: string;
      authorId: string;
      questions:number
    }

const AdminRoom = () => {
    
    const [userRooms, setUserRooms] = useState<UserRoom[]>([])
  const { user } = useAuth()
  useEffect(() => {
      if(user == undefined) {
          return;
      }
    const userRef = database.ref('rooms')

    userRef.orderByChild("authorId").equalTo(user?.id as any).on("value", function (snapshot) {
        //console.log(snapshot.val())
      const rooms = snapshot.val()
      const userRooms = rooms as FireBaseQuestions
      const parseRooms = Object.entries(userRooms).map(([key, value]) => {
          console.log(value.questions)
        return {
          id:key,
          title: value.title,
          authorId: value.authorId,
          questions: Object.keys(value.questions || {}).length
        }
      })
 //console.log(parseRooms)
  setUserRooms(parseRooms)
   })   
},[user])

    const history = useHistory();

    const params = useParams<RoomParams>()
    const roomId = params.id
    
    const  { title, questions} = useRoom(roomId)

   const handleDeleteQuestion = async(questionId: string) => {
       if(window.confirm('Tem certeza que deseja deletar essa pergunta?')) {
           await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
       }
   }
   const handleCheckQuestAsAnswred = async(questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true
    })
   }
   const handleHighLightQuestion = async(questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true
    })
}
   const handleEndRoom = async() => {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('/')
   }
   
    return (
    <div id='page-room'>
        <Header>
        <Button isOutlined onClick={handleEndRoom} >Encerrar Sala</Button>
        </Header>
        <div id="content">
            <div className='room-title'>
                <h1>Sala {title}</h1>
                {questions.length > 0 && <span>{questions.length} perguntas</span> }
                {userRooms.map(userRoom => (
                    <span key={userRoom.id}>
                       <Link to={`/admin/rooms/${userRoom.id}`}>{userRoom.title} {userRoom.questions} perguntas </Link> 
                    </span>
                ))}
            </div>
          
           
            <div className='question-list'>
            {questions.map(question => {
                return (
                    <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighLighted={question.isHighlighted}
                    >
                       {!question.isAnswered &&
                        <> 
                            <button 
                            onClick={() => handleCheckQuestAsAnswred(question.id)}
                            type='button'
                            >
                            <img src={checkImg} alt='Marcar a pergunta como respondida' /> 
                            </button>
                            <button 
                            onClick={() => handleHighLightQuestion(question.id)}
                            type='button'
                            >
                            <img src={answerImg} alt='Dar destaque a pergunta' /> 
                            </button>
                            </>
                        }
                       
                        <button 
                        onClick={() => handleDeleteQuestion(question.id)}
                        type='button'
                        >
                           <img src={deleteImg} alt='Remover pergunta' /> 
                        </button>
                    </Question>
                )
            })}

            </div>
         
        </div>

    </div>
    )
}

export default AdminRoom