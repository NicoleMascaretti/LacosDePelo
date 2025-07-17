import photo from "../../../public/Cachorro1.jpg"

const CardCategoria = () => {
    return (
        <div className="w-96 bg-white rounded-xl shadow-lg overflow-hidden font-sans cursor-pointer hover:-translate-y-2 transform-gpu duration-100">
            <div className="aspect-w-16 aspect-h-12">
                <img src={photo} alt="" className="w-full h-40 object-cover"/>
            </div>

            <div className="p-8">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl">🥘</span>
                    <h2 className="font-bold text-xl">Ração e Alimentação</h2>
                </div>
                <div>
                    <p className="text-base text-gray-500">Rações premium e snacks</p>
                </div>
            </div>
        </div>
    )
}

export default CardCategoria;