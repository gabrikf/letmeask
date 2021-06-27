import { useState, useEffect } from 'react'
import { database } from '../services/firebase'
import useAuth from './useAuth'


type FireBaseQuestions = Record<string, {  // Record é quando o tipo é um  Objeto e sua chave nesse caso é uma string / e o valor é um objeto.
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string,{
    authorId: string
    }>
}>

type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId:string | undefined;
    }

const useRoom = (roomId: string) => {
     const { user } = useAuth();
    const [questions, setQuestion] = useState<QuestionType[]>([]) 
    const [title, setTile] = useState('')
    const [author, setAthor] = useState('')

 useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const databaseRoom = room.val();
            const firebaseQuestions: FireBaseQuestions = databaseRoom.questions ?? {}
            const parseQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length, // caso likes nao ntenha nada retorna um objeto vazio
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0] // a interrogação vai fazer ele acessar a posição 0 somente se a condição for verdadeira
                }
            }) 
            setTile(databaseRoom.title) 
            setAthor(databaseRoom.authorId) 
            setQuestion(parseQuestion)
        })
        return () => {
            roomRef.off('value') //desabilita o eventlistener
        }
    },[roomId, user?.id]) // passa o user.id aqui embaixo pq o useEffect depende dele.
    return {questions, title, author}
   
        

}
export default useRoom