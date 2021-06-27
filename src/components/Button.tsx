import { ButtonHTMLAttributes } from 'react'
import '../styles/button.scss'

type buttonPros = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
}
   


const Button = ({isOutlined = false, ...props}: buttonPros) => { // tudo o que não for a propriedade isOutlined vai ser jogando dentro de props
    return (
        <button 
                className={`button ${isOutlined ? 'outlined' : ''}`}
                {...props}/>
        )
        
}
export default Button