import { $MODELNAME$Service } from './../$MODELFILENAME$-service/$MODELFILENAME$.service';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-new-$MODELFILENAME$',
  templateUrl: './new-$MODELFILENAME$.component.html',
  styleUrls: ['./new-$MODELFILENAME$.component.css']
})
export class New$MODELNAME$Component implements OnInit {

  public $MODELFILENAME$: any = {};
  public loading: boolean = false;
  public finished: boolean = false;
  public errorMessage: string = null;
  public successMessage: string = null;
  public keys: string[] = [];

  constructor(private $MODELFILENAME$Service: $MODELNAME$Service) { }

  ngOnInit() {
    
    this.$MODELFILENAME$Service.template().then((result) => {
      this.$MODELFILENAME$ = result;
      this.keys = Object.keys(this.$MODELFILENAME$);
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.'
    });
  }

  create() {
     this.loading = true;
     this.$MODELFILENAME$Service.new(this.$MODELFILENAME$).then(() => {
      this.loading = false;
      this.finished = true;
      this.successMessage = 'Entry saved successfully.'
     }).catch((err) => {
      this.errorMessage = 'Unexpected error.'

     });
  }

}
