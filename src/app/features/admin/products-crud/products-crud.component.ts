import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
// import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { ProductService } from '../../../core/services/product.service';
// import { AdminService } from '../../../core/services/admin.service';
// import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
// import { Product, Category } from '../../../core/models';

@Component({
  selector: 'app-products-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './products-crud.component.html',
  styleUrls: ['./products-crud.component.css']
})
export class ProductsCrudComponent implements OnInit {
  private fb = inject(FormBuilder);
  // private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  // private adminService = inject(AdminService);
  constructor(private productService : ProductService){}

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  
  productForm!: FormGroup;
  isModalOpen = false;
  editingProductId: number | null = null;

  ngOnInit(): void {
    this.loadProducts();
    this.categoryService.getCategories().subscribe(res => this.categories.set(res));

    this.productForm = this.fb.group({
      name_en: ['', Validators.required],
      name_ar: ['', Validators.required],
      brand: ['', Validators.required],
      brand_ar: ['', Validators.required],
      sku: ['', Validators.required],
      barcode: ['', Validators.required],
      primary_image_url: ['', Validators.required],
      category_id: ['', Validators.required],
      unit: ['pcs', Validators.required],
      unit_size: [1, Validators.required],
      description_en: [''],
      description_ar: [''],
      is_active: [true]
    });
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(res => {
      this.products.set(res);
      console.log(this.products());
    });
  }

  openAddModal(): void {
    this.editingProductId = null;
    this.productForm.reset({ is_active: true, unit: 'pcs', unit_size: 1 });
    this.isModalOpen = true;
  }

  openEditModal(p: any): void {
    this.editingProductId = p.id;
    this.productForm.patchValue({
      name_en: p.name_en,
      name_ar: p.name_ar,
      brand: p.brand,
      brand_ar: p.brand_ar,
      sku: p.sku,
      barcode: p.barcode,
      primary_image_url: p.primary_image_url,
      category_id: p.category_id,
      unit: p.unit,
      unit_size: p.unit_size,
      description_en: p.description_en || '',
      description_ar: p.description_ar || '',
      is_active: p.is_active === 1
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const val = this.productForm.value;
    const payload = {
      name_en: val.name_en,
      name_ar: val.name_ar,
      brand: val.brand,
      brand_ar: val.brand_ar,
      sku: val.sku,
      barcode: val.barcode,
      primary_image_url: val.primary_image_url,
      category_id: Number(val.category_id),
      unit: val.unit,
      unit_size: Number(val.unit_size),
      description_en: val.description_en || '',
      description_ar: val.description_ar || '',
      is_active: val.is_active ? 1 : 0
    };

    // if (this.editingProductId) {
    //   this.productService.updateProduct(this.editingProductId, payload).subscribe(res => {
    //     this.adminService.logAction('product', res.id, 'UPDATE', 1, payload);
    //     this.loadProducts();
    //     this.closeModal();
    //   });
    // } else {
    //   this.productService.createProduct(payload).subscribe(res => {
    //     this.adminService.logAction('product', res.id, 'CREATE', 1, payload);
    //     this.loadProducts();
    //     this.closeModal();
    //   });
    // }
  }

  // deleteProduct(id: number): void {
  //   if (confirm('Are you sure you want to delete this product? All active offers linking to this item will lose their product specifications.')) {
  //     this.productService.deleteProduct(id).subscribe(() => {
  //       this.adminService.logAction('product', id, 'DELETE', 1);
  //       this.loadProducts();
  //     });
  //   }
  // }
}
export { TranslationService } from '../../../core/services/translation.service';
