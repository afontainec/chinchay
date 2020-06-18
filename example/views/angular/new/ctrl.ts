import { $PASCAL_CASE$Service } from './../$KEBAB_CASE$-service/$KEBAB_CASE$.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-$KEBAB_CASE$',
  templateUrl: './new-$KEBAB_CASE$.component.html',
  styleUrls: ['./new-$KEBAB_CASE$.component.css']
})
export class New$PASCAL_CASE$Component implements OnInit {

  public $CAMEL_CASE$: any = {};
  public loading = false;
  public finished = false;
  public errorMessage: string = null;
  public successMessage: string = null;
  public keys: string[] = [];

  constructor(private $CAMEL_CASE$Service: $PASCAL_CASE$Service) { }

  ngOnInit() {
    this.$CAMEL_CASE$Service.template().then((result) => {
      this.$CAMEL_CASE$ = result;
      this.keys = Object.keys(this.$CAMEL_CASE$);
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
    });
  }

  create() {
     this.loading = true;
     this.$CAMEL_CASE$Service.new(this.$CAMEL_CASE$).then(() => {
      this.loading = false;
      this.finished = true;
      this.successMessage = 'Entry saved successfully.';
     }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
     });
  }

}
