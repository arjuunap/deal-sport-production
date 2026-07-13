import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
// import { StoreService } from '../../../core/services/store.service';
import { CityService } from '../../../core/services/city.service';
import { CategoryService } from '../../../core/services/category.service';
// import { AdminService } from '../../../core/services/admin.service';
// import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
// import { Store, City, Category } from '../../../core/models';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-stores-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './stores-crud.component.html',
  styleUrls: ['./stores-crud.component.css']
})
export class StoresCrudComponent implements OnInit {

  constructor(private storeService: StoreService) { }
  private fb = inject(FormBuilder);
  // private storeService = inject(StoreService);
  private cityService = inject(CityService);
  private categoryService = inject(CategoryService);
  // private adminService = inject(AdminService);

  stores = signal<any[]>([]);
  cities = signal<any[]>([]);
  categories = signal<any[]>([]);
  
  storeForm!: FormGroup;
  isModalOpen = false;
  editingStoreId: number | null = null;

  ngOnInit(): void {
    this.loadStores();
    // this.cityService.getCities().subscribe(res => this.cities.set(res));
    this.categoryService.getCategories().subscribe(res => this.categories.set(res));

    this.storeForm = this.fb.group({
      name_en: ['', Validators.required],
      name_ar: ['', Validators.required],
      logo_url: ['', Validators.required],
      city_id: ['', Validators.required],
      category_id: ['', Validators.required],
      cr_number: [''],
      vat_number: [''],
      is_verified: [false],
      is_active: [true]
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe((res:any)=>{
      this.stores.set(res);
      console.log(res)
    });
  }

  openAddModal(): void {
    this.editingStoreId = null;
    this.storeForm.reset({ is_active: true, is_verified: false });
    this.isModalOpen = true;
  }

  openEditModal(store: any): void {
    this.editingStoreId = store.id;
    this.storeForm.patchValue({
      name_en: store.name_en,
      name_ar: store.name_ar,
      logo_url: store.logo_url,
      city_id: store.city_id,
      category_id: store.category_id,
      cr_number: store.cr_number || '',
      vat_number: store.vat_number || '',
      is_verified: store.is_verified === 1,
      is_active: store.is_active === 1
    });
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onSubmit(): void {
    if (this.storeForm.invalid) return;

    const val = this.storeForm.value;
    const payload = {
      name_en: val.name_en,
      name_ar: val.name_ar,
      logo_url: val.logo_url,
      city_id: Number(val.city_id),
      category_id: Number(val.category_id),
      cr_number: val.cr_number || '',
      vat_number: val.vat_number || '',
      is_verified: val.is_verified ? 1 : 0,
      is_active: val.is_active ? 1 : 0
    };

    // if (this.editingStoreId) {
    //   this.storeService.updateStore(this.editingStoreId, payload).subscribe(res => {
    //     this.adminService.logAction('store', res.id, 'UPDATE', 1, payload);
    //     this.loadStores();
    //     this.closeModal();
    //   });
    // } else {
    //   this.storeService.createStore(payload).subscribe(res => {
    //     this.adminService.logAction('store', res.id, 'CREATE', 1, payload);
    //     this.loadStores();
    //     this.closeModal();
    //   });
    // }
  }

  // deleteStore(id: number): void {
  //   if (confirm('Are you sure you want to delete this store and all its branches?')) {
  //     this.storeService.deleteStore(id).subscribe(() => {
  //       this.adminService.logAction('store', id, 'DELETE', 1);
  //       this.loadStores();
  //     });
  //   }
  // }
}
export { TranslationService } from '../../../core/services/translation.service';
