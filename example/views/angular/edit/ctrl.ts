import { $PASCAL_CASE$Service } from './../$KEBAB_CASE$-service/$KEBAB_CASE$.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-$KEBAB_CASE$',
  templateUrl: './edit-$KEBAB_CASE$.component.html',
  styleUrls: ['./edit-$KEBAB_CASE$.component.css']
})
export class Edit$PASCAL_CASE$Component implements OnInit {

  public $CAMEL_CASE$: any = {};
  public loading = true;
  public finished = false;
  public errorMessage: string = null;
  public successMessage: string = null;
  public keys: string[] = [];
  public showConfirm = false;

  constructor(private $CAMEL_CASE$Service: $PASCAL_CASE$Service,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.get(id);
  }

  get(id) {
    this.$CAMEL_CASE$Service.findById(id).then((result) => {
      this.loading = false;
      this.$CAMEL_CASE$ = result;
      delete this.$CAMEL_CASE$.links;
      delete this.$CAMEL_CASE$.created_at;
      delete this.$CAMEL_CASE$.updated_at;
      this.keys = Object.keys(this.$CAMEL_CASE$);
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
    });
  }

  update() {
    this.loading = true;
    this.$CAMEL_CASE$Service.update(this.$CAMEL_CASE$.id, this.$CAMEL_CASE$).then(() => {
      this.loading = false;
      this.finished = true;
      this.successMessage = 'Entry Updated successfully.';
     }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
     });
  }

  confirm() {
    this.showConfirm = true;
   }

   cancel() {
    this.showConfirm = false;
   }

}
