import { $MODELNAME$Service } from './../$MODELFILENAME$-service/$MODELFILENAME$.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-$MODELFILENAME$',
  templateUrl: './edit-$MODELFILENAME$.component.html',
  styleUrls: ['./edit-$MODELFILENAME$.component.css']
})
export class Edit$MODELNAME$Component implements OnInit {

  public $MODELFILENAME$: any = {};
  public loading = true;
  public finished = false;
  public errorMessage: string = null;
  public successMessage: string = null;
  public keys: string[] = [];
  public showConfirm = false;

  constructor(private $MODELFILENAME$Service: $MODELNAME$Service,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params.id;
    this.get(id);
  }

  get(id) {
    this.$MODELFILENAME$Service.findById(id).then((result) => {
      this.loading = false;
      this.$MODELFILENAME$ = result;
      delete this.$MODELFILENAME$.links;
      delete this.$MODELFILENAME$.created_at;
      delete this.$MODELFILENAME$.updated_at;
      this.keys = Object.keys(this.$MODELFILENAME$);
    }).catch((err) => {
      this.errorMessage = 'Unexpected error.';
    });
  }

  update() {
    this.loading = true;
     this.$MODELFILENAME$Service.update(this.$MODELFILENAME$.id, this.$MODELFILENAME$).then(() => {
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
