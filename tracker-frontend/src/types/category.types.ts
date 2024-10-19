export interface ICategories {
    name: string;
    id: string
    subCategories: {
        name: string;
        id: string
    }[]
}