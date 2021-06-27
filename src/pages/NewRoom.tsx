import ilustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import Button from '../components/Button'
import { Link, useHistory } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { FormEvent } from 'react'
import { database } from'../services/firebase'


const NewRoom = () => {
    const history = useHistory()
    const { user } = useContext(AuthContext)
    const [newRomm, setNewRoom] = useState('')
    const handleCreateRoom = async(event: FormEvent) => {
        event.preventDefault()

        if(newRomm.trim() === ''){
            return
        }
        const roomRef = database.ref('rooms') 
        const firebaseRomm = await roomRef.push({
            title: newRomm,
            authorId: user?.id,

        })
        history.push(`/admin/rooms/${firebaseRomm.key}`) // key é o id que foi inserido no banco de dados(id que contem o title e o author.)
    } 

    return (
        <div id='page-auth'>
            <aside>
                <img src={ilustrationImg} alt='Ilustração perguntas e resposatas'/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main className='here'>
                <div className='main-content'>
                    <img src={logoImg} alt="logo" />
                    <h1>{user?.name}</h1>
                        <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                        type='text'
                        placeholder='Nome da sala'
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRomm}
                        />
                        <Button type='submit'>
                            Crie sala
                        </Button>
                        
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to='/'>Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}                                         
export default NewRoom