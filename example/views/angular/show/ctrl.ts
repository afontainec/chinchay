import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { $MODELNAME$Service } from '../$MODELFILENAME$-service/$MODELFILENAME$.service';

@Component({
  selector: 'app-show-$MODELFILENAME$',
  templateUrl: './show-$MODELFILENAME$.component.html',
  styleUrls: ['./show-$MODELFILENAME$.component.css'],
})
export class Show$MODELNAME$Component implements OnInit {
  public $MODELFILENAME$: any = {};
  public loading = true;
  public finished = false;
  public errorMessage: string = null;
  public successMessage: string = null;
  public keys: string[] = [];
  public showConfirmDelete = false;

  constructor(private $MODELFILENAME$Service: $MODELNAME$Service, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const { id } = this.activatedRoute.snapshot.params;
    this.get(id);
  }

  get(id: string) {
    this.$MODELFILENAME$Service.findById(id).then((result) => {
      this.loading = false;
      this.$MODELFILENAME$ = result;
      delete this.$MODELFILENAME$.links;
      this.keys = Object.keys(this.$MODELFILENAME$);
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
    });
  }

  delete() {
    this.loading = true;
    this.$MODELFILENAME$Service.delete(this.$MODELFILENAME$.id).then(() => {
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
