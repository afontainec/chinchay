import { $MODELNAME$Service } from './../$MODELFILENAME$-service/$MODELFILENAME$.service';
import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-index-$MODELFILENAME$',
  templateUrl: './index-$MODELFILENAME$.component.html',
  styleUrls: ['./index-$MODELFILENAME$.component.css']
})
export class Index$MODELNAME$Component implements OnInit {

  public $MODELFILENAME$s: any[] = {};
  public loading: boolean = true;
  public errorMessage: string = null;
  public keys: string[] = [];

  constructor(private $MODELFILENAME$Service: $MODELNAME$Service) { }

  ngOnInit() {
    this.$MODELFILENAME$Service.all().then((result) => {
      this.loading = false;
      this.$MODELFILENAME$s = result;
      this.keys = this.getKeys();
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
    });
  }

  getKeys() {
    if(!this.$MODELFILENAME$s[0]) return [];
    delete this.cars[0].links;
    return Object.keys(this.$MODELFILENAME$s[0]);
  }

}
