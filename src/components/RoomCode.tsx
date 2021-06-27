import copyImg from '../assets/images/copy.svg'
import '../styles/room-code.scss'

type RoomCodeProops = {
    code: string;
}
const RoomCode = (props:RoomCodeProops) => {
const copyRoomCode = () => {
    navigator.clipboard.writeText(props.code)
}

    return (
        <button className='room-code'onClick={copyRoomCode}>
            <div>
                <img src={copyImg} alt="" />
            </div>
            <span>
            Sala #{props.code}
            </span>
        </button>
    )
}
export default RoomCode