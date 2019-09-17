import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoriesService} from "../../shared/services/categories.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {MaterialService} from "../../shared/classes/material.service";
import {Category} from "../../shared/interfaces";

@Component({
  selector: 'app-categories-forms',
  templateUrl: './categories-forms.component.html',
  styleUrls: ['./categories-forms.component.css']
})
export class CategoriesFormsComponent implements OnInit {

  @ViewChild('input', null) inputRef: ElementRef;
  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview = null;
  category: Category;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });

    this.form.disable();

    this.route.params.pipe(
      switchMap((params: Params) => {
        if (params['id']) {
          this.isNew = false;
          return this.categoriesService.getById(params['id'])
        }

        return of(null)
      })
    ).subscribe(
      category => {
        if (category) {
          this.category = category;
          this.form.patchValue({
            name: category.name
          });
          this.imagePreview = category.imgSrc;
          MaterialService.updateTextInputs()
        }
        this.form.enable()
      },
    (err) => MaterialService.toast(err.error.message)
    )
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image)
    }
    obs$.subscribe(
      category => {
        this.category = category;
        MaterialService.toast('Изменения сохранены');
        this.form.enable()
      },
      err => {
        MaterialService.toast(err.error.message);
        this.form.enable()
      }
    )
  }

  triggerClick() {
    this.inputRef.nativeElement.click()
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result
    };
    reader.readAsDataURL(file)
  }

  deleteCategory() {
    const decision = window.confirm('Удалить категорию?');

    if (decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe(
          res => MaterialService.toast(res.message),
          err => MaterialService.toast(err.error.message),
          () => this.router.navigate(['/categories'])
        )
    }
  }
}
