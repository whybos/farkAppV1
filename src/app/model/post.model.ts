import { photoModel } from "./photo.model"

export interface PostModel{
    userId:number
    id:number
    title:string
    body:string,
        photo:photoModel
}