import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor() { }
   
  ngOnInit(): void {
  }

  productForm:FormGroup=new FormGroup({
     productName : new FormControl('',[Validators.required]),
     category    : new FormControl('',[Validators.required]),
     vendor      : new FormControl('',[Validators.required]),
     quantity    : new FormControl('',[Validators.required]),
     measure     : new FormControl('',[Validators.required]),
     status      : new FormControl('',[Validators.required]),
     uploadImg   : new FormControl('')
  });

}
