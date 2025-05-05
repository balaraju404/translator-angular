import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderComponent, LoaderModal, ToastAlertComponent, ToastAlertModel } from '@balaraju404/custom-components';
import { Util } from '../utils/util.service';

@Component({
 selector: 'app-layout',
 imports: [RouterModule, ToastAlertComponent, LoaderComponent],
 templateUrl: './layout.component.html',
 styleUrls: []
})
export class LayoutComponent {
 toast_mdl: ToastAlertModel = new ToastAlertModel()
 loader_mdl: LoaderModal = new LoaderModal(false)

 ngOnInit() {
  Util.toastAlertSubject.subscribe((obj: any) => {
   if (obj) {
    const { toastType, title, message, showClose, autoHide, delay, position } = obj;
    this.toast_mdl.showToastAlert(toastType, title, message, showClose, autoHide, delay, position)
   }
  })
  Util.loaderSubject.subscribe((status: boolean) => {
   this.loader_mdl.isLoader = status
  })
 }
}
