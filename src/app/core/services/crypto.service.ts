import { Injectable } from '@angular/core';
import * as cryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private enc_key=environment.encryption_key;
  constructor() { }
  
  decrypt(cipher:string){
    return cryptoJS.AES.decrypt(cipher,this.enc_key).toString(cryptoJS.enc.Utf8);
  }

  getRole():string{
    const enc_role:string=localStorage.getItem('role')!;
    return JSON.parse(this.decrypt(enc_role)).role;
  }

}
