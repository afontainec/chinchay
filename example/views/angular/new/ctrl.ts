import { $MODEL$Service } from './../$MODELFILENAME$-service/$MODELFILENAME$.service';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-new-$MODELFILENAME$',
  templateUrl: './new-$MODELFILENAME$.component.html',
  styleUrls: ['./new-$MODELFILENAME$.component.css']
})
export class New$MODEL$Component implements OnInit {

  public $MODELFILENAME$: any = {};
  public loading: boolean = false;
  public errorMessage: string = null;
  public successMessage: string = null;

  constructor(private $MODELFILENAME$Service: $MODEL$Service) { }

  ngOnInit() {
    
    this.$MODELFILENAME$Service.template().then((result) => {
      this.$MODELFILENAME$ = result;
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.'
    });
  }

  create() {
     this.loading = true;
     this.$MODELFILENAME$Service.new(this.$MODELFILENAME$).then(() => {
      this.loading = false;
      this.successMessage = 'Entry saved successfully.'
     }).catch((err) => {
      this.errorMessage = 'Unexpected error.'

     });
  }

}
