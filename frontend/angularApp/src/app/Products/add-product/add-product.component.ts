import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormGroup,FormControl,Validators,FormArray} from '@angular/forms';
import { ProductService } from 'src/app/appServices/product.service';
import { mimeType } from './mime-type.validator';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { CategoryService } from 'src/app/appServices/category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  sellerAddProductModalForm: any = FormGroup;
  imagePreviews: string = '';
  categoryTypeOptions: { value: string; label: string }[] = [];

  @ViewChild('filePicker')
  filePicker!: ElementRef<HTMLInputElement>;

  discountOptions = [
    { value: 'Select', label: 'Select' },
    { value: '5%', label: '5%' },
    { value: '10%', label: '10%' },
    { value: '20%', label: '20%' },
  ];

  constructor(
    private fb: FormBuilder,
    private _productService: ProductService,
    private ng2ImgMax: Ng2ImgMaxService,
    private _categoryService: CategoryService
  ) {
    this.sellerAddProductModalForm = this.fb.group({
      category: new FormControl('Select', [Validators.required]),
      productName: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      closeDate: new FormControl('', [Validators.required]),
      discount: new FormControl('5%', [Validators.required]),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
  }

  ngOnInit(): void {
    this.updateCategoryOptions();
  }

  updateCategoryOptions(): void {
    // Fetch categories from CategoryService and update categoryTypeOptions
    this._categoryService.getCategories().subscribe(
      (categories: any[]) => {
        this.categoryTypeOptions = [
          { value: 'Select', label: 'Select' },
          ...categories.map((category) => ({
            value: category._id,
            label: category.name,
          })),
        ];
      },
      (error) => {
        console.log('Error fetching categories', error);
      }
    );
  }

  onImagesPicked(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
      const file = input.files[0];
      this.sellerAddProductModalForm.patchValue({ image: file });
      this.sellerAddProductModalForm.get('image').updateValueAndValidity();
      console.log(file);
      console.log(this.sellerAddProductModalForm);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('Input or files are null');
    }
  }

  onSubmitAddProduct() {
    if (this.sellerAddProductModalForm.valid) {
      const formValue = this.sellerAddProductModalForm.value;

      // Format dates as ISO strings
      const startDate = new Date(formValue.startDate).toISOString();
      const closeDate = new Date(formValue.closeDate).toISOString();

      // Convert discount to a number
      const discount = parseInt(formValue.discount, 10);

      this._productService.addProduct(formValue.category,formValue.productName,formValue.description,formValue.price,startDate,closeDate,discount,formValue.image).subscribe((res) => {
        console.log('AddProduct:=>', res);
        alert('Product added successfully.');
        this.sellerAddProductModalForm.reset();
        this.imagePreviews = '';
        this.filePicker.nativeElement.value = '';
      },(error) => {
          console.error('Error:', error);
          alert('An error occurred while adding the product.');
        }
      );
    }
  }
}