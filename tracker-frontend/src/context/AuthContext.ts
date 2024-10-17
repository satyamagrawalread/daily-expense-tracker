import React, { createContext } from "react";
import { IUser } from "../types/user.types";


interface AuthContextType {
    user?: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    setUser: () => {}
})


