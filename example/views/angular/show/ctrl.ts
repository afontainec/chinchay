import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { $PASCAL_CASE$Service } from '../$KEBAB_CASE$-service/$KEBAB_CASE$.service';

@Component({
  selector: 'app-show-$KEBAB_CASE$',
  templateUrl: './show-$KEBAB_CASE$.component.html',
  styleUrls: ['./show-$KEBAB_CASE$.component.css'],
})
export class Show$PASCAL_CASE$Component implements OnInit {
  public $CAMEL_CASE$: any = {};
  public loading = true;
  public finished = false;
  public errorMessage: string = null;
  public successMessage: string = null;
  public keys: string[] = [];
  public showConfirmDelete = false;

  constructor(private $CAMEL_CASE$Service: $PASCAL_CASE$Service, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const { id } = this.activatedRoute.snapshot.params;
    this.get(id);
  }

  get(id: string) {
    this.$CAMEL_CASE$Service.findById(id).then((result) => {
      this.loading = false;
      this.$CAMEL_CASE$ = result;
      delete this.$CAMEL_CASE$.links;
      this.keys = Object.keys(this.$CAMEL_CASE$);
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
    });
  }

  delete() {
    this.loading = true;
    this.$CAMEL_CASE$Service.delete(this.$CAMEL_CASE$.id).then(() => {
      this.loading = false;
      this.finished = true;
      this.successMessage = 'Entry deleted successfully.';
     }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
     });
  }

  confirmDelete() {
    this.showConfirmDelete = true;
  }

  cancelDelete() {
    this.showConfirmDelete = false;
  }
}
