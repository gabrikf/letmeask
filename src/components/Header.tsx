import { ReactNode } from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import RoomCode from '../components/RoomCode'
import logoImg from '../assets/images/logo.svg'
import useAuth from "../hooks/useAuth"
import '../styles/header.scss'
import { FiLogOut, FiSun } from 'react-icons/fi'
import { AiOutlineHome, AiOutlinePoweroff } from 'react-icons/ai'
//import { FaCloudMoon } from 'react-icons/fa'



type RoomParams = {
    id: string;
}

type HeaderProps = {
    children?: ReactNode
}
const Header = ({children}:HeaderProps) => {

    const history = useHistory()
    const { signInWithGoogle, signOutfromGoogle,  user } = useAuth()
    const logOut = async() => {
        await signOutfromGoogle()
        return
    }
    const logIn = async() => {
        await signInWithGoogle()
        return
    }
    const params = useParams<RoomParams>()
    const roomId = params.id
    

const joinUserRooms = () => {

    if(user?.id.trim() === '') {
        return
    }
   
    history.push('/')
}

    return (
        <div>
             <header>
            <div className='content'>
                <img src={logoImg} alt='imagemLogo'/>
               
                <div>             
             <RoomCode code={roomId}/>
                {children}              
                </div>
                <div>
                <Link to='/'>  <AiOutlineHome /> </Link>
                {/*{user ? (<FiSun onClick={toggleTheme}/>) : (<FaCloudMoon onClick={toggleTheme}/>)} */}
                 {user ? (<FiLogOut onClick={logOut}/>) : (<AiOutlinePoweroff onClick={logIn}/>)}  
                </div>
            </div>
        </header>
        </div>
    )
}

export default Header