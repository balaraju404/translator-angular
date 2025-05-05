import { Component } from '@angular/core';
import { AddWordComponent } from '../add-word/add-word.component';
import { TableComponent, TableHeaders, TableIcons, TableModal } from '../../custom-components/table/table.component';
import { LSService } from '@balaraju404/custom-components';
import { Constants } from '../../utils/constants.service';

@Component({
 selector: 'app-translated-words-details',
 imports: [AddWordComponent, TableComponent],
 templateUrl: './translated-words-details.component.html',
 styleUrls: []
})
export class TranslatedWordsDetailsComponent {
 tbl_mdl: TableModal = new TableModal("Words List", [], [])
 ngOnInit() {
  this.setupTable()
 }
 setupTable() {
  const word = new TableHeaders("Word", "word")
  const word_tel = new TableHeaders("Word (Tel)", "word_in_tel")
  const word_eng = new TableHeaders("Word (Eng)", "english_meaning")
  const edit = TableHeaders.withIcon("Edit", TableIcons.Edit, 4, "")
  const del = TableHeaders.withIcon("Delete", TableIcons.Delete, 5, "")
  const createdDate = new TableHeaders("Created Date", "created_date")
  const modifiedDate = new TableHeaders("Modified Date", "modified_date")
  this.tbl_mdl.tblHeaders = [word, word_tel, word_eng, createdDate, modifiedDate, edit, del]
  this.getDetails()
 }
 getDetails() {
  const data = LSService.getItem(Constants.LS_STORED_WORDS_DATA_KEY) || [];
  this.tbl_mdl.tblData = data
 }
}
