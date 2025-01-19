import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor() { }
  async downloadZip(fileUrls:string[]):Promise<void>{
    const zip=new JSZip();
    for(const url of fileUrls){
      try{
        const fileName=this.extractFileName(url);
        const response=await fetch(url);
        const blob=await response.blob();
        zip.file(fileName,blob);
      }
      catch(err){
        console.log(err);
        
      }
    }
    const zipBlob=await zip.generateAsync({type:'blob'});
    saveAs(zipBlob,`Inventory_files.zip`);
  }

  extractFileName(url:string):string{
    return url.split('/').pop() || 'file';
  }
}
