import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import Button from '../components/Button'
import { useHistory } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { FormEvent } from 'react'
import { useState } from 'react'
import { database } from '../services/firebase'
import usedarkTheme from '../hooks/useDarkTheme'

const Home = () => {
    const {theme} = usedarkTheme()
    const history = useHistory();// <Hook> tem que estar dentro do componente
    const { signInWithGoogle, user } = useAuth() //useContext(AuthContext)-> antes tinha que importar o authcontext e o usecontext, agora só o useAuth
 
    const handleCreateRoom = async() => {
        if (!user) {
           await signInWithGoogle()
        }
        history.push('./rooms/new')
    }

        const [room, setRoom] = useState('')
        const handleJoinRoom = async(event: FormEvent) => {
            event.preventDefault()
            if(room.trim() === '') {
                return
            }
            const roomRef = await database.ref(`rooms/${room}`).get()

            if(!roomRef.exists()) {
                alert('Essa sala não existe.')
                return
            }
            if(roomRef.val().endedAt) {
                alert('Essa sala está fechada.')
                return
            }
            history.push(`rooms/${room}`)
        }
 
   
    
    return (
        <div id='page-auth' className={theme}>
            <aside>
            
                <img src={ilustrationImg} alt='Ilustração perguntas e resposatas'/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="logo" />
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="" />
                        Crie sua sala com o Google
                    </button>
                    <div className='separator'>
                        ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input
                        type='text'
                        placeholder='digite o código da sala'
                        onChange={event => setRoom(event.target.value)}
                        value={room}
                        />
                        <Button type='submit'>
                            Entre na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}                                         
export default Home