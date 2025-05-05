import { Component, inject } from '@angular/core';
import { BgColor, ButtonComponent, ButtonModel, CardComponent, CardModal, InputType, LSService, TextFieldComponent, TextfieldModel, ToastAlertType } from '@balaraju404/custom-components';
import { Util } from '../../utils/util.service';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../utils/constants.service';

@Component({
 selector: 'app-add-word',
 standalone: true,
 imports: [CardComponent, TextFieldComponent, ButtonComponent],
 templateUrl: './add-word.component.html',
 styleUrls: []
})
export class AddWordComponent {
 private readonly http = inject(HttpClient);

 editRecId: string = '';

 card_mdl!: CardModal;
 tf_word!: TextfieldModel;
 tf_word_tel!: TextfieldModel;
 tf_translated_word!: TextfieldModel;

 btn_save!: ButtonModel;
 btn_clear!: ButtonModel;

 ngOnInit() {
  this.setupFields();
 }

 setupFields() {
  this.card_mdl = new CardModal('Add Word', BgColor.Default, true);
  this.card_mdl.customClass = 'p-0';

  this.tf_word = new TextfieldModel(1, 'Word', 'Enter Word', InputType.Text, true);
  this.tf_word_tel = new TextfieldModel(2, 'Word in Telugu', '', InputType.Text, true);
  this.tf_word_tel.isDisabled = true;

  this.tf_translated_word = new TextfieldModel(3, 'Translation', 'Enter Translation Word', InputType.Text, true);

  this.btn_save = new ButtonModel(4, 'Save');
  this.btn_clear = new ButtonModel(5, 'Clear');
 }

 eventHandler(event: any) {
  const tag = event['tag'] || 0;
  switch (tag) {
   case 1:
    this.transliterateApi(event['selectedValue']);
    break;
   case 4:
    this.checkValidations();
    break;
   case 5:
    this.clearForm();
    break;
  }
 }

 transliterateApi(text: string) {
  Util.loaderSubject.next(true);
  const url = `https://inputtools.google.com/request?itc=te-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`;
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  const body = new URLSearchParams({ text: JSON.stringify([text]) }).toString();

  this.http.post(url, body, { headers, responseType: 'text' }).subscribe({
   next: (resText: string) => {
    Util.loaderSubject.next(false);
    const res = JSON.parse(resText);
    if (res[0] === 'SUCCESS') {
     const rawEncoded = res[1][0][1][0];
     const decoded = this.decodeHTMLEntities(rawEncoded);
     const parsedArray = JSON.parse(decoded);
     const translated = parsedArray[0];
     this.tf_word_tel.selectedValue = translated;
    } else {
     console.warn('Translation failed', res);
    }
   },
   error: err => {
    Util.loaderSubject.next(false);
    console.error('HTTP error:', err);
   }
  });
 }

 decodeHTMLEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
 }

 checkValidations() {
  let msg = '';
  if (!this.tf_word.selectedValue) {
   msg = 'Please enter word';
  } else if (!this.tf_translated_word.selectedValue) {
   msg = 'Please enter Translated word';
  }

  if (msg) {
   Util.showToastAlert(ToastAlertType.Danger, '', msg);
   return;
  }

  this.addDataToLs();
 }

 addDataToLs() {
  const previousData = LSService.getItem(Constants.LS_STORED_WORDS_DATA_KEY) || [];
  const newData: any = this.getParams();
  newData['id'] = previousData.length + 1;
  previousData.push(newData);
  LSService.setItem(Constants.LS_STORED_WORDS_DATA_KEY, previousData);
  Util.showToastAlert(ToastAlertType.Success, '', "Word added successfully");
  this.clearForm();
 }

 getParams() {
  return {
   word: this.tf_word.selectedValue,
   // word_in_tel: this.tf_word_tel.selectedValue,
   english_meaning: this.tf_translated_word.selectedValue,
   created_date: new Date().toISOString()
  }
 }

 clearForm() {
  this.tf_word.selectedValue = '';
  this.tf_word_tel.selectedValue = '';
  this.tf_translated_word.selectedValue = '';
  this.editRecId = '';
 }
}
