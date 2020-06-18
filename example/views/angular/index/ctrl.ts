import { $PASCAL_CASE$Service } from './../$KEBAB_CASE$-service/$KEBAB_CASE$.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index-$KEBAB_CASE$',
  templateUrl: './index-$KEBAB_CASE$.component.html',
  styleUrls: ['./index-$KEBAB_CASE$.component.css']
})
export class Index$PASCAL_CASE$Component implements OnInit {

  public $CAMEL_CASE$s: any = [];
  public loading = true;
  public errorMessage: string = null;
  public keys: string[] = [];

  constructor(private $CAMEL_CASE$Service: $PASCAL_CASE$Service) { }

  ngOnInit() {
    this.$CAMEL_CASE$Service.all().then((result) => {
      this.loading = false;
      this.$CAMEL_CASE$s = result;
      this.keys = this.getKeys();
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
    });
  }

  getKeys() {
    if (!this.$CAMEL_CASE$s[0]) { return []; }
    delete this.$CAMEL_CASE$s[0].links;
    return Object.keys(this.$CAMEL_CASE$s[0]);
  }

}
