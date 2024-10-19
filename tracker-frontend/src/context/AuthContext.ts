import { createContext, useContext } from "react";
import { IUser } from "../types/user.types";


interface AuthContextType {
    user?: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
    isLoading: boolean
}

export const AuthContext = createContext<AuthContextType>({
    user: undefined,
    setUser: () => {},
    isLoading: false
})

export const useAuthContext = () => useContext(AuthContext);


