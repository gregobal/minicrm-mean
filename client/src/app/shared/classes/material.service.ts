import {ElementRef} from "@angular/core";

declare var M;

export interface MaterialInstance {
  open?(): void
  close?(): void
  destroy?(): void
}

export interface MaterialDatepicker extends MaterialInstance {
  date?: Date
}

export class MaterialService {
  static toast (message: string) {
    M.toast({html: message})
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement)
  }

  static updateTextInputs() {
    M.updateTextFields()
  }

  static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement)
  }

  static initTooltip(ref: ElementRef) {
    return M.Tooltip.init(ref.nativeElement)
  }

  static initDateFilter(ref: ElementRef, onClose: () => void) {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose,
      i18n: {
        cancel:	'Отмена',
        clear: 'Очистить',
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
        weekdays: ['Воскресенее', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        weekdaysShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        weekdaysAbbrev:	['В','П','В','С','Ч','П','С']
      }
    })
  }

  static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement)
  }
}
