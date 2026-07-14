import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
// import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { ProductService } from '../../../core/services/product.service';
// import { AdminService } from '../../../core/services/admin.service';
// import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
// import { Product, Category } from '../../../core/models';

import Swal from 'sweetalert2';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-products-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './products-crud.component.html',
  styleUrls: ['./products-crud.component.css']
})
export class ProductsCrudComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  filePath= environment.filePath;
  constructor(private productService: ProductService) { }

  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  filteredProducts = signal<any[]>([]);
  searchQuery = '';

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
      this.applyFilter();
      console.log(this.products());
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredProducts.set(this.products());
      return;
    }

    const filtered = this.products().filter(p => 
      (p.nameEn && p.nameEn.toLowerCase().includes(query)) ||
      (p.name_en && p.name_en.toLowerCase().includes(query)) ||
      (p.nameAr && p.nameAr.toLowerCase().includes(query)) ||
      (p.name_ar && p.name_ar.toLowerCase().includes(query)) ||
      (p.brand && p.brand.toLowerCase().includes(query)) ||
      (p.brandAr && p.brandAr.toLowerCase().includes(query)) ||
      (p.brand_ar && p.brand_ar.toLowerCase().includes(query)) ||
      (p.sku && p.sku.toLowerCase().includes(query)) ||
      (p.barcode && p.barcode.toLowerCase().includes(query)) ||
      (p.id && p.id.toString().includes(query))
    );
    this.filteredProducts.set(filtered);
  }

  openAddModal(): void {
    this.editingProductId = null;
    this.productForm.reset({ is_active: true, unit: 'pcs', unit_size: 1 });
    this.isModalOpen = true;
  }

  openEditModal(p: any): void {
    this.editingProductId = p.id;
    this.productForm.patchValue({
      name_en: p.nameEn || p.name_en,
      name_ar: p.nameAr || p.name_ar,
      brand: p.brand,
      brand_ar: p.brandAr || p.brand_ar,
      sku: p.sku,
      barcode: p.barcode,
      primary_image_url: p.primary_image_url,
      category_id: p.categoryId || p.category_id,
      unit: p.unit,
      unit_size: p.unitSize || p.unit_size,
      description_en: p.descriptionEn || p.description_en || '',
      description_ar: p.descriptionAr || p.description_ar || '',
      is_active: p.is_active === 1 || p.isActive === 1 || p.is_active === true || p.isActive === true
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.productForm.invalid) return;

    const val = this.productForm.value;
    const payload: any = {
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

    if (this.editingProductId) {
      payload.id = this.editingProductId;
      this.productService.updateProduct(payload).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Updated!',
            text: 'Product updated successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update product.'
          });
        }
      });
    } else {
      this.productService.addProduct(payload).subscribe({
        next: (res) => {
          Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Product added successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadProducts();
          this.closeModal();
        },
        error: (err) => {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to add product.'
          });
        }
      });
    }
  }

  deleteProduct(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All active offers linking to this item will lose their product specifications.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            this.loadProducts();
          },
          error: (err) => {
            console.error(err);
            Swal.fire('Error', 'Failed to delete product.', 'error');
          }
        });
      }
    });
  }
}
export { TranslationService } from '../../../core/services/translation.service';
