import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories-crud',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories-crud.html',
  styleUrl: './categories-crud.css',
})
export class CategoriesCrud implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  // private adminService = inject(AdminService);

  constructor(
    private cd: ChangeDetectorRef
  ) {

  }

  categories: any[] = [];
  catForm!: FormGroup;
  isModalOpen = false;
  editingCategoryId: number | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.catForm = this.fb.group({
      nameEn: ['', Validators.required],
      nameAr: ['', Validators.required],
      iconSlug: ['folder', Validators.required],
      parentId: [null],
      sortOrder: [1, Validators.required],
      isActive: [true],
      image: [null]
    });
  }
  parentCategories: any[] = [];
  subCategories: any[] = [];

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
      console.log(res)

      // Parent categories (parentId is null)
      this.parentCategories = res.filter((c: { parentId: null; }) => c.parentId === null);

      // Subcategories (parentId is not null)
      this.subCategories = res.filter((c: { parentId: null; }) => c.parentId !== null);

      this.cd.detectChanges();
    });
  }

  openAddModal(): void {
    this.editingCategoryId = null;
    this.catForm.reset({ isActive: true, sortOrder: 1, iconSlug: 'folder', parentId: null });
    this.isModalOpen = true;
  }

  openEditModal(cat: any): void {
    this.editingCategoryId = cat.id;
    this.catForm.patchValue({
      nameEn: cat.nameEn,
      nameAr: cat.nameAr,
      iconSlug: cat.iconSlug,
      parentId: cat.parentId || null,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive === 1
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.catForm.patchValue({ image: file });
      // You can also add logic here to create a preview URL if needed
    }
  }
  onSubmit() {
    // 1. Check if the form is valid before doing anything
    if (this.catForm.invalid) {
      this.catForm.markAllAsTouched();
      return;
    }

    const formValue = this.catForm.value;

    // 2. NEW: Check for duplicates in your existing categories array
    const isDuplicate = this.categories.some((cat: any) => {
      const existingNameEn = cat.nameEn ? cat.nameEn.toLowerCase().trim() : '';
      const existingNameAr = cat.nameAr ? cat.nameAr.toLowerCase().trim() : '';
      const newNameEn = formValue.nameEn.toLowerCase().trim();
      const newNameAr = formValue.nameAr.toLowerCase().trim();

      return existingNameEn === newNameEn || existingNameAr === newNameAr;
    });

    if (isDuplicate) {
      // 3. NEW: Show SweetAlert Warning for Duplicate
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Category',
        text: 'A category with this English or Arabic name already exists!',
        confirmButtonColor: '#3085d6'
      });
      return; // Stop the submission from happening
    }

    // 4. Create FormData (This is your original logic)
    const category = {
      nameEn: formValue.nameEn,
      nameAr: formValue.nameAr,
      iconSlug: formValue.iconslug,
      sortOrder: formValue.sortOrder,
      active: formValue.isActive,
      parentId: formValue.parentId ? Number(formValue.parentId) : null
    };

    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify(category)], { type: 'application/json' })
    );

    if (formValue.image) {
      formData.append('file', formValue.image);
    }

    // 5. Submit to backend
    this.categoryService.createCategory(formData).subscribe({
      next: (response) => {
        // NEW: Success SweetAlert
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category created successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        console.log(response)

        // NEW: Add to local array so duplicate check keeps working without refreshing the page
        this.categories.push(category);

        this.catForm.reset({
          sortOrder: 0,
          isActive: true,
          parentId: '',
          image: null
        });
      },
      error: (error) => {
        console.error('Error Creating Category', error.error.message);

        // NEW: Error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Something went wrong while creating the category. Please try again.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe(() => {
        // this.adminService.logAction('category', id, 'DELETE', 1);
        this.loadCategories();
      });
    }
  }
}
export { TranslationService } from '../../../core/services/translation.service';