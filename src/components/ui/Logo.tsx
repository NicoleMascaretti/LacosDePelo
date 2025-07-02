import logo from '../../../public/logo.png'

interface LogoProps {
    className?: string;
}

export default function Logo ({className = ""}: LogoProps) {
    return(
            <img
                src={logo} 
                alt="logo"
                className={`object-contain ${className}`}
            />
    )
}