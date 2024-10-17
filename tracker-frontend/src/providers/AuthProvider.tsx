import { useState } from "react"

const AuthProvider = () => {
    const [user, setUser] = useState<IUser>()

    const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        console.log(event.target)
    }

    return (
        <div onClick={(e) => {}} >

        </div>
    )
}