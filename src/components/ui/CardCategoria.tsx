import photo from "../../../public/Cachorro1.jpg"

const CardCategoria = ({img, icon, titulo, sub}) => {
    return (
        <div className="w-96 bg-white rounded-xl shadow-lg overflow-hidden font-sans cursor-pointer hover:-translate-y-2 transform-gpu duration-100">
            <div className="aspect-w-16 aspect-h-12">
                <img src={img} alt="imagem produto" className="w-full h-40 object-cover"/>
            </div>

            <div className="p-8">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl">{icon}</span>
                    <h2 className="font-bold text-xl">{titulo}</h2>
                </div>
                <div>
                    <p className="text-base text-gray-500">{sub}</p>
                </div>
            </div>
        </div>
    )
}

export default CardCategoria;