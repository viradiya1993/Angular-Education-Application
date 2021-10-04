import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryListsComponent } from './country-lists/country-lists.component';
import { ListsRoutingModule } from './lists-routing.module';
import { DeleteCountryComponent } from './country-lists/components/delete-country/delete-country.component';
import { EditCountryModalComponent } from './country-lists/components/edit-country/edit-country.component';
import { FileFormatInvalidModel } from './state-lists/components/file-format-invalid/file-format-invalid.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { StateListsComponent } from './state-lists/state-lists.component';
import { DeleteStateComponent } from './state-lists/components/delete-state/delete-state.component';
import { EditStatesModalComponent } from './state-lists/components/edit-states/edit-states.component';
import { DistrictsListsComponent } from './districts-lists/districts-lists.component';
import { DeleteDistrictsComponent } from './districts-lists/components/delete-district/delete-districts.component';
import { EditDistrictComponent } from './districts-lists/components/edit-district/edit-district.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  imports: [
    CommonModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    SharedModule,
    ListsRoutingModule,
    NgSelectModule
  ],
  exports: [RouterModule],
  entryComponents: [
    FileFormatInvalidModel,
    DeleteStateComponent,
    EditStatesModalComponent,
    EditCountryModalComponent,
    EditDistrictComponent,
    DeleteDistrictsComponent
  ],
  declarations: [
    FileFormatInvalidModel,
    CountryListsComponent,
    StateListsComponent,
    DeleteStateComponent,
    EditDistrictComponent,
    DeleteDistrictsComponent,
    EditCountryModalComponent,
    DeleteCountryComponent,
    StateListsComponent,
    EditStatesModalComponent,
    DistrictsListsComponent,
  ],
})
export class ListsModule { }
