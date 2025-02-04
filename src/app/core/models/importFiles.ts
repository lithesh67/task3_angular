import { Timestamp } from "rxjs";

export interface importFilesModel{
    file_name:string,
    status:string,
    error_file:string,
    file_id:number,
    created_at:Date
}