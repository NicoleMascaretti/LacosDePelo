interface LogoProps {
    className?: string;
}

export default function Logo ({className = ""}: LogoProps) {
    return(
            <img
                src="public/logo_lacos_de_pelo_invertida.png"
                alt="logo"
                className={`object-contain ${className}`}
            />
    )
}