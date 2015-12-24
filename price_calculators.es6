'use strict';
var sectionAmounts = {
  officeservices: 0,
  altinn: 0,
  verification: 0,
  bookkeeping: 0,
  fakturabank: 0,
  lodo: 0,
  totalAmount: 0,
}

function updateSectionAmount(sectionName, sum) {
  // debugger
  sectionAmounts[sectionName] = sum;
  sectionAmounts.totalAmount += sum;
  if (sectionName.length !== 0 && document.getElementById(sectionName).length !== 0) {
    document.getElementById(sectionName).innerHTML = accounting.formatNumber(sum, 2, " ");
  }
}

function updateTotalAmount() {
  // debugger
  var total = sectionAmounts.totalAmount;
  jQuery('.total-sum').html(accounting.formatNumber(total, 2, " "));
  for (let section in sectionAmounts) {
    if (sectionAmounts[section] !== 0) {
      let percentage = (sectionAmounts[section] * 100) / total;
      jQuery('#percentage_' + section).html(percentage);
    }
  }
}

var objectID = 1;

class Row{
  constructor(options) {
    this.domElement = undefined
    this.rendered = false

    this.id = objectID++;
    this.name = options.name
    this.quantity = options.quantity // can be copied from top table or input manually
    this.usingLodo = window.usingLodo // global variable linked to select box on top of the page
    this.userCanChange = options.userCanChange // off, auto or array of strings
    this.userWorks = options.userWorks || 0
    this.price = options.price || 0
    this.qtyInput = options.qtyInput || undefined
    this.section = options.section
    this.type = options.type // defines subclass and category
    this.period = options.period
    this.amount = 0 // usually price * quantity
    this.payment = options.payment || undefined
    this.selectWork = 0
    this.category = ''
  }

  updateRowQuantity(qty, type, period) {
    //
    if ( this.type !== type) {
      return;
    }
    if (this.payment == 'monthly') {
      this.quantity = parseInt(period);
    } else if (this.payment == 'perpiece'){
      this.quantity = parseInt(qty);
    } else {
      this.quantity = parseInt(qty);
    }
    this.updateRowPrice();
  }

  updateRowPrice() {
    if (typeof(this.price) == 'number' && typeof(this.quantity) == 'number') {
      this.amount = this.price * this.quantity;
    } else {
      this.amount = 0;
    }
  }


  static updateSectionSum(sum, classname, classMonths) {
    var section = '',
        amount = 0,
        i = 1;
        //
        debugger
    for ( let row of rowsList.keys() ) {
      let thisRow = rowsList.get(row);
      thisRow.updateRowQuantity(sum, classname, classMonths);
      // debugger
      if (section !== thisRow.section && i !== 1) {
        section = thisRow.section;
        amount = 0;
        updateSectionAmount(section, amount);
      } else if (section == thisRow.section){
        amount += thisRow.amount;
      } else {
        i = 0;
        section = thisRow.section;
        amount += thisRow.amount;
      }
    }
    updateSectionAmount(section, amount);
    updateTotalAmount();
  }

  toHtml(id) {

   if (this.userCanChange == 'off') {
      this.selectWork = '';
    } else {
      let i = 0,
          userOptions = '';
      for (let selectOptions of this.userCanChange) {
        userOptions += `<option value="${i}" ${this.userWorks == i ? 'selected' : ''}>${selectOptions}</option>`;
        i++;
      }
      this.selectWork = `<select class="user-works" onchange="userCanChangeValue(${id}, jQuery(this));">${userOptions}</select>`;

      if (this.qtyInput) {
        if (this.qtyInput.includes('input')) {

          this.qtyInput = `<input id="${id}" class="user-can-change" onchange="rowsList.get(String(${id})).updateRowQuantity(jQuery(this).val()); userWorkSelect(${id}, this);" type="number" step="1" value="${this.quantity ? this.quantity : 0}">` ;
        } else {
          let options = '';
          for (let i = 0; i < 100; i++) {
            options += `<option ${this.quantity == i ? 'selected' : ''}>` + i + `</option>`;
          };
          this.qtyInput = `<select id="${id}" class="user-can-change" onchange="rowsList.get(String(${id})).updateRowQuantity(jQuery(this).val()); userWorkSelect(${id}, this);">${options}</select>` ;
        }
      }
    }

    return `
      <td>${this.name}</td>
      <td>${this.userWorks ? 0 : this.qtyInput ? this.qtyInput : this.quantity }</td>
      <td>${this.price}</td>
      <td>${this.period}</td>
      <td>${this.userWorks ? 0 :this.amount}</td>
      <td></td>
      <td>${this.selectWork}</td>
      <td>${this.userWorks ? this.amount : ''}</td>
    `
  }

}

(function() {
  // window.usingLodo = 1;
})();

var officeServices = {
 1: {
    name: 'Henter bilag',
    type: 'specific',
    period: 'mnd',
    quantity: 12,
    price: 200,
    userCanChange: ['Kunden scanner bilag', 'Kunden leverer bilag', 'Bilag blir hetet hos kunden', ],
    section: 'officeservices',
  },
  2: {
    name: 'Oppstart per mnd',
    type: 'bank',
    payment: 'monthly',
    period: 'mnd',
    quantity: 0,
    price: 100,
    userCanChange: ['Kunden scanner bilag', 'Kunden leverer bilag', 'Bilag blir hetet hos kunden', ],
    section: 'officeservices',
  },
  3: {
    name: 'Sortere og nummerere bankbilag ',
    type: 'bank',
    payment: 'perpiece',
    period: 'pr.bilag',
    quantity: 0,
    price: 10,
    userCanChange: ['Kunde nummererer/sorterer bilag og bank', 'Vi nummererer/sorterer bilag og bank', ],
    section: 'officeservices',
  },
  4: {
    name: 'Manglende bilag, darlig scann, stk pris',
    type: 'specific',
    qtyInput: 'select',
    period: 'pr.bilag',
    quantity: 0,
    price: 100,
    userCanChange: ['Kunde skaffer manglende bilag', 'Vi skaffer manglende bilag', ],
    section: 'officeservices',
  },
  5: {
    name: 'Konsulent',
    type: 'specific',
    period: 'timer',
    quantity: 0,
    price: 100,
    qtyInput: 'select',
    userCanChange: ['Kunden ønsker ikke konsultasjon', 'Kunden ønsker konsultasjon', ],
    section: 'officeservices',
  },
  6: {
    name: 'Utgående faktura,lager',
    type: 'sale',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 100,
    userCanChange: ['Kunde lager faktura', 'Regnskapsfører lager faktura', ],
    section: 'officeservices',
  },
  7: {
    name: 'Kasse salg, puncher ukeomsetning kasse',
    type: 'week',
    payment: 'monthly',
    period: 'en kas',
    quantity: 0,
    price: 300,
    userCanChange: ['Kunde puncher ukeomsetning kasse', 'Regnskapsfører puncher ukeomsetning kasse', ],
    section: 'officeservices',
  },
  8: {
    name: 'Lønnslipp, lager',
    type: 'paycheck',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 100,
    userCanChange: ['Kunde lager lønnslipp', 'Regnskapsfører lager lønnslipp', ],
    section: 'officeservices',
  },
  9: {
    name: 'Utgående faktura, lodo/annen til fakturabank',
    type: 'sale',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 10,
    userCanChange: ['Kunden sender faktura til fakturaBank', 'Regnskapsfører sender faktura til fakturaBank', ],
    section: 'officeservices',
  },
  10: {
    name: 'Lønnslipp, Lodo til fakturaBank',
    type: 'paycheck',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 10,
    userCanChange: ['Kunden sender faktura til fakturaBank', 'Regnskapsfører sender faktura til fakturaBank', ],
    section: 'officeservices',
  },
  11: {
    name: 'Scanner bilag inngaende faktura',
    type: 'buy',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 5,
    userCanChange: ['Kunden scanner faktura', 'Regnskapsfører scanner faktura', ],
    section: 'officeservices',
  },
  12: {
    name: 'Puncher info inngaende faktura',
    type: 'buy',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 6,
    userCanChange: ['Kunde puncher info data(utgift)', 'Regnskapsfører puncher info data(utgift)', ],
    section: 'officeservices',
  },
  13: {
    name: 'Scanner giro',
    type: 'giro',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 5,
    userCanChange: ['Kunden scanner giro', 'Regnskapsfører scanner giro', ],
    section: 'officeservices',
  },
  14: {
    name: 'Puncher giro',
    type: 'giro',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 6,
    userCanChange: ['Kunden puncher giro', 'Regnskapsfører puncher giro', ],
    section: 'officeservices',
  },
  15: {
    name: 'Avstemme utgående faktura',
    type: 'sale',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 5,
    userCanChange: ['Kunden avstemme utgående faktura(salg)', 'Regnskapsfører avstemme utgående faktura(salg)',],
    section: 'officeservices',
  },
  16: {
    name: 'Avstemme inngaende faktura',
    type: 'buy',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 5,
    userCanChange: ['Kunden avstemme inngaende faktura(utgift)', 'Regnskapsfører avstemme inngaende faktura(utgift)', ],
    section: 'officeservices',
  },
  17: {
    name: 'Avstemme lønn',
    type: 'paycheck',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 5,
    userCanChange: ['Kunden avstemme lønn(lønn)', 'Regnskapsfører avstemme lønn(lønn)', ],
    section: 'officeservices',
  },
  18: {
    name: 'Puncher bankkontoutskrift',
    type: 'specific',
    period: 'linje',
    qtyInput: 'input',
    quantity: 0,
    price: 6,
    userCanChange: ['Kunden puncher bankkontoutskrift(bank)', 'Regnskapsfører puncher bankkontoutskrift(bank)',],
    section: 'officeservices',
  },
  19: {
    name: 'Altinn Arbeidsg.avg og skattetrekk',
    type: 'specific',
    period: 'oppg',
    quantity: 0,
    price: 300,
    userCanChange: 'off',
    section: 'altinn',
  },
  20: {
    name: 'Altinn Merverdiavgift',
    type: 'specific',
    period: 'oppg',
    quantity: 0,
    price: 300,
    userCanChange: 'off',
    section: 'altinn',
  },
  21: {
    name: 'Lønns og trekkoppgave',
    type: 'specific',
    period: 'stk',
    quantity: 0,
    price: 100,
    userCanChange: 'off',
    section: 'altinn',
  },
  22: {
    name: 'Puncher fakturalinje',
    type: 'buy',
    period: 'stk',
    payment: 'perpiece',
    quantity: 0,
    price: 6,
    userCanChange: 'off',
    section: 'verification',
  },
  23: {
    name: 'Godkjenne faktura',
    type: 'buy',
    period: 'stk',
    payment: 'perpiece',
    quantity: 0,
    price: 6,
    userCanChange: 'off',
    section: 'verification',
  },
  24: {
    name: 'Årsoppgjør',
    type: 'specific',
    period: 'år',
    payment: 'yearly',
    quantity: 0,
    price: 1000,
    userCanChange: 'off',
    section: 'verification',
  },
  24: {
    name: 'Konsulent',
    type: 'specific',
    period: 'timer',
    qtyInput: 'select',
    quantity: 0,
    price: 600,
    userCanChange: ['Kunden ønsker ikke konsultasjon avansert', 'Kunden ønsker konsultasjon avansert'],
    section: 'verification',
  },
  25: {
    name: 'Bokføre',
    type: 'specific',
    period: 'år',
    quantity: 0,
    price: 1,
    userCanChange: 'off',
    section: 'bookkeeping',
  },
  26: {
    name: 'Årsoppgjør lignings papier, avstemminger',
    type: 'specific',
    period: 'år',
    quantity: 0,
    price: 2000,
    userCanChange: ['Kunden håndterer årsoppgjør', 'Regnskapsfører håndterer årsoppgjør', 'Revisor håndterer årsoppgjør'],
    section: 'bookkeeping',
  },
  27: {
    name: 'Årsoppgjør lignings papier, u/revisor',
    type: 'specific',
    period: 'år',
    quantity: 0,
    price: 3000,
    userCanChange: ['Kunden håndterer årsoppgjør', 'Regnskapsfører håndterer årsoppgjør', 'Revisor håndterer årsoppgjør'],
    section: 'bookkeeping',
  },
  28: {
    name: 'fakturaBank Utgående faktura lagre',
    type: 'sale',
    period: 'stk',
    payment: 'perpiece',
    quantity: 0,
    price: 2,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  29: {
    name: 'Utgående faktura per dag for sent.',
    type: 'specific',
    period: 'per dag',
    quantity: 0,
    price: 1,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  30: {
    name: 'fakturaBank Ingående faktura lagre',
    type: 'buy',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 2,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  31: {
    name: 'Inngående faktura per dag for sent',
    type: 'specific',
    period: 'per dag',
    quantity: 0,
    price: 1,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  32: {
    name: 'fakturaBank Lønnslipp lagre',
    type: 'paycheck',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 2,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  33: {
    name: 'Lønns slipp per dag for sent',
    type: 'specific',
    period: 'per dag',
    quantity: 0,
    price: 1,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  34: {
    name: 'fakturaBank til Lodo utgående faktura xml',
    type: 'sale',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 10,
    userCanChange: ['Jeg ønsker ikke å bruke dette alternativet', 'Jeg vil bruke dette alternativet'],
    section: 'fakturabank',
  },
  35: {
    name: 'fakturaBank til Lodo inngaende faktura xml',
    type: 'buy',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 10,
    userCanChange: ['Jeg ønsker ikke å bruke dette alternativet', 'Jeg vil bruke dette alternativet'],
    section: 'fakturabank',
  },
  36: {
    name: 'fakturaBank til Lodo lønnslipp xml',
    type: 'paycheck',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 10,
    userCanChange: ['Jeg ønsker ikke å bruke dette alternativet', 'Jeg vil bruke dette alternativet'],
    section: 'fakturabank',
  },
  37: {
    name: 'fakturaBank banktransaksjone xml',
    type: 'bank',
    payment: 'perpiece',
    period: 'stk',
    quantity: 0,
    price: 2,
    userCanChange: ['Jeg ønsker ikke å bruke dette alternativet', 'Jeg vil bruke dette alternativet'],
    section: 'fakturabank',
  },
  38: {
    name: 'DNB drift til fakturaBank xml',
    type: 'bank',
    payment: 'monthly',
    period: 'mnd',
    quantity: 0,
    price: 250,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  39: {
    name: 'DNB skattetrekk til fakturaBank xml',
    type: 'bank',
    payment: 'monthly',
    period: 'mnd',
    quantity: 0,
    price: 250,
    userCanChange: 'off',
    section: 'fakturabank',
  },
  40: {
    name: 'Ukeomsetning',
    type: 'week',
    payment: 'monthly',
    period: 'mnd',
    quantity: 0,
    price: 50,
    userCanChange: 'off',
    section: 'lodo',
  },
  41: {
    name: 'Lønnslipp',
    type: 'paycheck',
    payment: 'monthly',
    period: 'mnd',
    quantity: 0,
    price: 50,
    userCanChange: 'off',
    section: 'lodo',
  },
  42: {
    name: 'Utgående faktura uten eller med kid',
    type: 'sale',
    payment: 'monthly',
    period: 'mnd',
    quantity: 0,
    price: 50,
    userCanChange: 'off',
    section: 'lodo',
  },
  43: {
    name: 'Supportavtale, lisens',
    type: 'buy',
    payment: 'monthly',
    period: 'mnd',
    quantity: 0,
    price: 100,
    userCanChange: 'off',
    section: 'lodo',
  },
  44: {
    name: 'Årbeidsgiveravgift og skattetrekk',
    type: 'specific',
    period: 'mnd',
    quantity: 0,
    price: 100,
    userCanChange: 'off',
    section: 'lodo',
  },
  45: {
    name: 'Merverdiavgift',
    type: 'specific',
    period: 'mnd',
    quantity: 0,
    price: 100,
    userCanChange: 'off',
    section: 'lodo',
  },
  46: {
    name: 'Årsoppgjør ligninspapirer',
    type: 'specific',
    period: 'ar',
    quantity: 1,
    price: 1000,
    userCanChange: 'off',
    section: 'lodo',
  },
}

// Instantiate the Row class for each
var rowsList = new Map();
for (let k in officeServices) {
  let row = new Row(officeServices[k]);
  rowsList.set(k, row);
}

// var salg = {
//   name: 'Care',
//   type: 'salg',
//   period: 'month',
//   quantity: 12,
//   id: 2,
//   price: 1200,
//   userCanChange: ['bilag bli', 'bilag blu', 'bliag bla', 'bilag ble', 'bilag blo'],
// }

// var kjop = {
//   name: 'Sad',
//   type: 'kjop',2
//   period: 'stk',
//   quantity: 45,
//   id: 3,
//   price: 200,
//   userCanChange: 'off',
// }

// var rowsSet = new Map();
// var rowsList = [salg, banl, kjop];
// for (let oneRow of rowsList) {
//   let y = new Row(oneRow);
//   rowsSet.set(oneRow.name, y);
// }


// console.log(banl.toHtml());
// (function(){
    // console.log(banl);})();
// (function() {salg.updateQuantity(6, 'bank');})();
// (function() {console.log(banl);})();
  function constructTheTable() {
    let table = '<table class="simple-table consulting-service">',
        tablePlaceHolder = jQuery('.js-calculator-data'),
        section = '',
        i = 1;
    for (let g of rowsList.keys()) {
      if (section !== rowsList.get(g).section) {
        table += `<tr class="service-header"><th colspan="6">${rowsList.get(g).section}</th><th colspan="3"></th></tr>`;
        table += `<tr class="service-header"><th></th><th>Antall</th><th>Pris</th><th></th><th class="text-r">Betale</th><th></th><th id="${rowsList.get(g).section}">0</th><th id="percentage_${rowsList.get(g).section}"</th></tr>`;
        section = rowsList.get(g).section;
      }
      if (section == rowsList.get(g).section){
        table += `<tr id=${g}>${rowsList.get(g).toHtml(g)}</tr>`
      }

    }
      table += '</table>';
    tablePlaceHolder.prepend(table);
  }
jQuery(document).ready(function() {

jQuery('button.buttons-standard').on('click', function() {
  constructTheTable();
});
// var bank_sum = document.getElementById('js-banka');
// window.input_bank = { value: 0, type: 'bank', period: 'mnd' };
// input_bank.toHtml = function(val) { input_bank.value = val; let obj = `<input value="${input_bank.value}">`; return obj;  };

// bank_sum.innerHTML = window.input_bank.toHtml(5);


// bank_sum.on('input propertychange', function() {
//
//   for ( let row of rowsList.keys()) {
//     rowsList.get(row).updateQuantity(bank_sum.value, 'bank', 'mnd');
//   }
// });


var titi = `<table>`;
// for (let name of rowsSet.keys()) {
//   titi += rowsSet.get(name).toHtml();
// }
titi += `</table>`;
// document.getElementById('content-inner').innerHTML = titi;
// jQuery('div.company-name').html(titi);
    jQuery('input').on('keydown', function(e) {
      var key = e.keyCode ? e.keyCode : e.which,
          keys = [107, 109, 110, 189, 190];
      // allow only numbers disable inputs of numpad -, regular -, e???, . regular and numpad, numpad + and shift +
      if (isNaN(String.fromCharCode(key)) && ((keys.indexOf(key) > -1) || (e.shiftKey && key == 187))) return false;
    });
    // disable paste
    jQuery('input').on('paste', function(e) {
      var element = this;
      var element_val = jQuery(element).val()
      setTimeout(function() {
        var text = jQuery(element).val(element_val);
      }, 100);
    });
  })

  // sets selects to accountant does everything so we can get max-prices
  function setMaxPrice() {
    jQuery('[account-type="full"]').removeClass('invisible');
    // jQuery('[account-type="full"]').each(function() {
    //   // jQuery(this).val(2);
    //   accountServicePackage(jQuery(this));
    // });
    showPricingTable()
  }


  function userWorkSelect(rowId, obj) {
    rowsList.get(String(rowId)).quantity = parseInt(jQuery(obj).val());
    jQuery(`#${rowId}`).html(rowsList.get(String(rowId)).toHtml(rowId));
  }

  function userCanChangeValue(rowId, obj) {
    // rowsList.get(String(rowId)).userWorks = Math.abs(parseInt(rowsList.get(String(rowId)).userWorks) - 1);
    rowsList.get(String(rowId)).userWorks = parseInt(jQuery(obj).val());
    jQuery(`#${rowId}`).html(rowsList.get(String(rowId)).toHtml(rowId));

  }

  // select fields that let user decide what package will he use and what account type
  function usingLodo() {
    var lodo = jQuery('#using-lodo').val();
    // using different package, removes all 'package=lodo' fields
    if (lodo == 2) {
      jQuery('[package="lodo"]').addClass('invisible');
      jQuery('.js-calculator-data').removeClass('invisible');
      jQuery('.services-data.fabank-service select').each(function() {
        jQuery(this).val(1);
      });
      setMaxPrice();
    }else if (lodo == 1) { // using lodo
      jQuery('.js-calculator-data, [package="lodo"], select#yearly').removeClass('invisible');
      setMaxPrice();
      // accountant does everything, removes all select fields and savings field
      // if (jQuery('#account-type').val() == 1) {
      //   jQuery('.js-calculator-data').removeClass('invisible');
      //   // jQuery('.consulting-service td:last-child').addClass('invisible')
      //   jQuery('[account-type="full"]').addClass('invisible');
      // }else if (jQuery('#account-type').val() == 2) { // customer chooses, reveals full table
      //   jQuery('.js-calculator-data, .consulting-service th:last-child').removeClass('invisible');
      // }
    }
    constructTheTable();
  }

  // sum number of papers and active months, called on .monthly-invoicing table inputs
  // @param <string> classname
  function calculateTotal(classname) {
    var classSum = 0,
        classMonths = 0;
    // calculates columns sum as well as non empty cells for the monthly stats table, each cell in a column has the same class
    jQuery('.' + classname).each(function() {
      if (parseInt(jQuery(this).val() ) !== 0 && !isNaN(parseInt(jQuery(this).val() ) ) ) {
        classSum += parseInt(jQuery(this).val());
        classMonths++;
      }
    })
    // fill in the results
      Row.updateSectionSum(classSum, classname, classMonths);
    // if (classname == 'bank') {
    //   jQuery("#js-bank-sum").val(classSum);
    // } else {
      jQuery('.' + classname + '_sum').html(classSum);
      jQuery('.' + classname + '_months').html(classMonths);
    // }
    sumOfSums();
  }

  // calculates price by multiplying papers number with price, classname is the class of the table we want to calculate
  function sumOfSumsPrice(classname) {
    var totalcount = 0,
        totalsum = 0;
    jQuery(classname).children('tbody').children('tr').each(function() {
      // td with a class containing "-sum"( third row) is given html value of first-row( price per unit) multiplied with the second row( units count)
      var count = parseInt(jQuery(this).children('[class*=-count]').html()),
          price = parseInt(jQuery(this).children('td:first-of-type').html());
      jQuery(this).find('[class*=-sum]').html(count * price);
      totalcount += count;
      totalsum += count * price;
    });
    jQuery(classname).children('tfoot').find('.total-count').html(totalcount);
    jQuery('.bookkeeping-total-sum').each(function() {
      if(jQuery(this).hasClass('quantity')) {
        jQuery(this).attr('max-price', totalsum);
        jQuery(this).html(totalsum);
      } else {
        jQuery(this).html(accounting.formatNumber(totalsum, 2, " "));
      }
    });
  }

  function updateQuantity() {
    // if (jQuery('.js-yearly-report').val() == 2) {
    //   jQuery('#js-yearly-report-aditor').html(1);
    // } else {
    //   jQuery('#js-yearly-report-aditor').html(0);
    // }
    // sumOfSums();
    showPricingTable();
  }

  // calculates honorar for the sum of papers in .monthly-invoicing table
  function sumOfSums() {
    var sum = 0,
        i = 1;
    // sum up all the monthly counts
    // sum up all the months
    jQuery('[class*=_months]').each(function(){
      sum += parseInt(jQuery(this).html());
    });
    jQuery('.sum-of-months').html(sum);
    sum = 0;
    // reset sum
    jQuery('[class*=_sum]').each(function(){
      sum += parseInt(jQuery(this).html());
    });
    jQuery('.sum-of-sums').html(sum);
    // empty the pricing table
    jQuery('.bookkeeping-amount .standard-count, .bookkeeping-amount .standard-sum, .bookkeeping-amount .plus-count, .bookkeeping-amount .plus-sum, .bookkeeping-amount .extra-count, .bookkeeping-amount .extra-sum').html(0);
    // fill the pricing table according to the next principle
    // first 1500 have the price of 5; second 1500 have price of 4 and all above 3000 have a price of 3
    if (sum > 1500) {
      while (sum > 1500) {
        jQuery('.bookkeeping-amount tbody tr:nth-of-type(' +  i + ')').children('[class*=-count]').html(1500);
        sum -= 1500;
        i++;
        if (sum > 1500 && i > 2) {
          break;
        };
      }
      jQuery('.bookkeeping-amount tbody tr:nth-of-type(' +  i + ')').children('[class*=-count]').html(sum);
    }else {
      jQuery('.bookkeeping-amount tbody tr:first-of-type').children('[class*=-count]').html(sum);
    }
    sumOfSumsPrice('.bookkeeping-amount');
  }

  // builds the .consulting-service table
  function showPricingTable() {
    // all the variables
    var kasse_sum = parseInt(jQuery('.kasse_sum').html()),
        bank_sum = parseInt(jQuery('.bank_sum').html()),
        sell_sum = parseInt(jQuery('.sell_sum').html()),
        buy_sum = parseInt(jQuery('.buy_sum').html()),
        paycheck_sum = parseInt(jQuery('.paycheck_sum').html()),
        week_sum = parseInt(jQuery('.week_sum').html()),
        giro_sum = parseInt(jQuery('.giro_sum').html()),
        kasse_months = parseInt(jQuery('.kasse_months').html()),
        bank_months = parseInt(jQuery('.bank_months').html()),
        sell_months = parseInt(jQuery('.sell_months').html()),
        buy_months = parseInt(jQuery('.buy_months').html()),
        paycheck_months = parseInt(jQuery('.paycheck_months').html()),
        week_months = parseInt(jQuery('.week_months').html()),
        giro_months = parseInt(jQuery('.giro_months').html()),
        section_max_price = 0,
        max_price = 0,
        tax_update = parseInt(jQuery('#tax-update').val()) || 0,
        working_months = parseInt(jQuery('#working-months').val()) || 0,
        employees_count = parseInt(jQuery('dl .employees-count').val()) || 0,
        yearly = jQuery('.js-yearly-report').val() == 1 ? 0 : 1,
        table = jQuery('.consulting-service'),
        row = table.find('tr.services-data'),
        amount = 0,
        section_amount = 0,
        total_amount = 0,
        class_list;
    // when accountant does punching the lines and when customer does it the price for closing those lines is different
    if (jQuery('select#js-closing-punch-lines').val() == 1) {
      jQuery('.price.js-closing-punch-lines').html(10); // customer
    }else{
      jQuery('.price.js-closing-punch-lines').html(6); // accountant
    }

    if (jQuery('select.js-avstemminger').val() == 1) {
      jQuery('#js-avstemminger').children(".quantity").html(1).attr('max-price', 1);
      jQuery('#js-avstemminger td').children('.js-savings').addClass('invisible');
    } else {
      jQuery('#js-avstemminger').children(".quantity").html(0);
      jQuery('#js-avstemminger td').children('.js-savings').removeClass('invisible');
    }
    if (jQuery('select.js-revisor').val() == 1) {
      jQuery('#js-revisor').children(".quantity").html(1).attr('max-price', 1);
      jQuery('#js-revisor td').children('.js-savings').addClass('invisible');
    } else {
      jQuery('#js-revisor').children(".quantity").html(0);
      jQuery('#js-revisor td').children('.js-savings').removeClass('invisible');
    }

    if(jQuery('select.js-revisor').val() == 0 || jQuery('select.js-avstemminger').val() == 0) {
      var total = jQuery('.js-savings.different');
      var saved_amount = 0;
      jQuery('.bookkeeping-service select').each(function(){
        if (jQuery(this)[0].value == 0) {
          saved_amount += parseInt(jQuery(this).parents('tr').find('.quantity').attr('max-price')) * parseInt(jQuery(this).parents('tr').find('.price').html());
        }
      })
      total.html(accounting.formatNumber(saved_amount, 2, " "));
      total.attr('saved-amount', saved_amount);
      jQuery(total).removeClass('invisible');
    } else {
      var total = jQuery('.js-savings.different');
      total.attr('saved-amount', 0);
      total.html(accounting.formatNumber(0, 2, " "));
    }

    // in case where max count is number of months
    jQuery('#filtered-tvelwe').attr('max-price', 12);

    // check if customer or accountant punches lines, set the amount that the customer saved
    if(jQuery('#js-closing-punch-lines').val() == 1) {
      jQuery('.js-savings.diff').html(accounting.formatNumber((buy_sum * 2), 2, " "));
      jQuery('span.js-savings.diff').attr('saved-amount', buy_sum * 2);
      jQuery('span.js-savings.diff').html(accounting.formatNumber((buy_sum * 2), 2, " "));
    }else {
      jQuery('span.js-savings.diff').html(accounting.formatNumber(0, 2, " "));
      jQuery('span.js-savings.diff').attr('saved-amount', 0);
      //jQuery('.js-savings.diff').addClass('invisible');
    }

    // fill in row by row
    row.each(function() {
      var select_el = jQuery(this).find("select.accounting-service");
      if (select_el.length == 0) {
        select_el = jQuery(this).find("select.closing-faktura");
      };
      if (select_el.length == 0) {
        select_el = jQuery(this).find("select.services-data");
      };
      var row_without_select = false;
      if (select_el.length == 0 && jQuery(this).attr('class') == "services-data fabank-service") {
        row_without_select = jQuery(this)
      }

      accountServicePackage(select_el, row_without_select, bank_months, buy_months, sell_months, paycheck_months, giro_months, bank_sum, buy_sum, sell_sum, paycheck_sum, giro_sum)
      // first time we dont have the class list, so we set it
      if (!class_list) {
        class_list = jQuery(this).attr('class');
      }else if ( class_list !== jQuery(this).attr('class')) { // we check if the class list has changed indicating that the section has changed
        if ((class_list + ' invisible') == jQuery(this).attr('class')) { // depending on the selected options on the top of the page some class lists are added class invisible, in that case break
          return;
        }

        // if (class_list != "services-data") {
          jQuery('th[class*="' + class_list + '"]').html(section_amount == 0 ? 0 : accounting.formatNumber(section_amount, 2, " "));
          var saved_amount = section_max_price > section_amount ? (section_max_price - section_amount) : 0;
          jQuery('span[class*="' + class_list + '"]').html(accounting.formatNumber(saved_amount, 2, " "));
          jQuery('span[class*="' + class_list + '"]').attr('saved-amount', saved_amount);
        // };
        // if the class list has indeed changed we write section amount and max price to the section header and reset the values to 0

        section_amount = 0;
        section_max_price = 0;
        // set class list to the new value
        class_list = jQuery(this).attr('class');
      }

      // filtering data from the top table (.monthly-invoicing)
      if(jQuery(this).children('.quantity').hasClass('tax-update')){
        jQuery(this).children('.tax-update').html(tax_update);
        jQuery(this).children('.tax-update').attr('max-price', tax_update);
      }else if(jQuery(this).children('.quantity').hasClass('working-months')){
        jQuery(this).children('.working-months').html(working_months);
        jQuery(this).children('.working-months').attr('max-price', working_months);
      }else if(jQuery(this).children('.quantity').hasClass('employees-count')){
        jQuery(this).children('.employees-count').html(employees_count);
        jQuery(this).children('.employees-count').attr('max-price', employees_count);
      }else if(jQuery(this).children('.quantity').hasClass('weekly')) {
        jQuery(this).children('.weekly').html(week_months);
        jQuery(this).children('.weekly').attr('max-price', week_months);
      }else if(jQuery(this).children('.quantity').hasClass('yearly')) {
        jQuery(this).children('.yearly').html(yearly);
        jQuery(this).children('.yearly').attr('max-price', yearly);
      }else if(jQuery(this).find('.period').hasClass('monthly')) {
        if(jQuery(this).find('.period').hasClass('bank')) {
          jQuery(this).children('.quantity').html(bank_months);
        }else if(jQuery(this).find('.period').hasClass('buy')) {
          jQuery(this).children('.quantity').html(buy_months);
        }else if(jQuery(this).find('.period').hasClass('sale')) {
          jQuery(this).children('.quantity').html(sell_months);
        }else if(jQuery(this).find('.period').hasClass('paycheck')) {
          jQuery(this).children('.quantity').html(paycheck_months);
        }else if(jQuery(this).find('.period').hasClass('giro')) {
          jQuery(this).children('.quantity').html(giro_months);
        }else {
          jQuery(this).children('.quantity').html(0);
        }
      }else if(jQuery(this).find('.period').hasClass('per-piece')) {
        if(jQuery(this).find('.period').hasClass('bank')) {
          jQuery(this).children('.quantity').html(bank_sum);
        }else if(jQuery(this).find('.period').hasClass('buy')) {
          jQuery(this).children('.quantity').html(buy_sum);
        }else if(jQuery(this).find('.period').hasClass('sale')) {
          jQuery(this).children('.quantity').html(sell_sum);
        }else if(jQuery(this).find('.period').hasClass('paycheck')) {
          jQuery(this).children('.quantity').html(paycheck_sum);
        }else if(jQuery(this).find('.period').hasClass('giro')) {
          jQuery(this).children('.quantity').html(giro_sum);
        }else {
          jQuery(this).children('.quantity').html(0);
        }
      }

      // take the amount text or input/select value and multiply it with price per unit
      // if (class_list == "services-data fabank-service") {}
      if (jQuery(this).is(':visible')) {
        amount = (parseInt(jQuery(this).children('.quantity').html()) || parseInt(jQuery(this).children('.quantity').children().val())) * parseInt(jQuery(this).children('.price').html());
      };
      // add to the section amount, section max price and total amount
      section_amount += amount || 0;
      total_amount += amount || 0;

      max_price = parseInt(jQuery(this).children('.quantity').attr('max-price')) || 0;
      max_price = max_price * parseInt(jQuery(this).children('.price').html());
      section_max_price += max_price || 0;
       // if(class_list == 'services-data fabank-service'){
       //   console.log("max price", max_price);
       //   console.log("section price", section_max_price);
       //  }

      // fill in the calculated amount or 0
      jQuery(this).children('.amount').html(amount !== 'NaN' ?  (amount == 0 ? accounting.formatNumber(max_price, 2, " ") : accounting.formatNumber(amount, 2, " ")) : accounting.formatNumber(0, 2, " "));
      // fill in the current max price
      jQuery(this).find('.js-savings').html(max_price == 0 ? '' : accounting.formatNumber(max_price, 2, " "));
      if(jQuery(this).hasClass('bookkeeping-service')) {
        jQuery(this).find('.js-savings').attr('value', max_price == 0 ? '' : accounting.formatNumber(max_price, 2, " "));
      }

    })
    // Fill total savings
    var total_savings = parseInt(jQuery('span.js-savings.diff').attr('saved-amount')) + parseInt(jQuery('span.services-data.accounting-service').attr('saved-amount')) + parseInt(jQuery('span.js-savings.different').attr('saved-amount')) + parseInt(jQuery('span.services-data.fabank-service').attr('saved-amount'));
    //
    jQuery('.js-total-savings').html(accounting.formatNumber(total_savings, 2, " "));
    calculatePercentage(total_amount);
    setTabIndex();
  }

  function periodMaxPrice(tr, montly_value, sum_value) {
    if (tr.find('.period').hasClass('monthly')) {
      tr.children('.quantity').attr('max-price', montly_value);
    } else if (tr.find('.period').hasClass('per-piece')) {
      tr.children('.quantity').attr('max-price', sum_value);
    }
  }

  function calculatePercentage(total_amount) {
    // for individual sections calculate percentage in gross amount after the table is built
    jQuery('.consulting-service').children('tfoot').find('.total-sum').html(accounting.formatNumber(total_amount, 2, " "));
    jQuery('th.services-data').each(function() {
      var percentage = 100 / total_amount * currencyFormatToNumber(jQuery(this).html());
      jQuery(this).next('th').html(Math.round(percentage || 0) + '%');
    })
  }

  // add/remove select/input fields and calculate the table accordingly
  function accountServicePackage(selected_val, row_without_select, bank_months, buy_months, sell_months, paycheck_months, giro_months, bank_sum, buy_sum, sell_sum, paycheck_sum, giro_sum) {
    // calculate the prices according to the package that customer selects
    var value = selected_val.val(),
        class_name = selected_val.attr('class'),
        tr = selected_val.parents('.' + class_name);
    if (tr.length == 0) tr = row_without_select;
    // if the field dont have bank/buy/sale/paycheck in his class list it will not be included in calculations
    if (value == 1) {
      if(jQuery(tr).find('#filtered-sale').length !== 0) {
        periodMaxPrice(tr, sell_months, sell_sum);
        jQuery(tr).find('#filtered-sale').removeClass('sale');
      }else if (jQuery(tr).find('#filtered-buy').length !== 0) {
        periodMaxPrice(tr, buy_months, buy_sum);
        jQuery(tr).find('#filtered-buy').removeClass('buy');
      }else if (jQuery(tr).find('#filtered-paycheck').length !== 0){
        periodMaxPrice(tr, paycheck_months, paycheck_sum);
        jQuery(tr).find('#filtered-paycheck').removeClass('paycheck');
      }else if (jQuery(tr).find('#filtered-giro').length !== 0) {
        periodMaxPrice(tr, giro_months, giro_sum);
        jQuery(tr).find('#filtered-giro').removeClass('giro');
      }else if (jQuery(tr).find('#filtered-bank').length !== 0) {
        periodMaxPrice(tr, bank_months, bank_sum);
        jQuery(tr).find('#filtered-bank').removeClass('bank');
      }else if (jQuery(tr).find('#filtered-tvelwe').length !== 0){
        jQuery(tr).find('#filtered-tvelwe').text('0');
      }else if(jQuery(tr).find('.choose-or-none').length !==0) {
        jQuery(tr).find('.storage').html(jQuery(tr).find('.choose-or-none').contents());
        jQuery(tr).find('.storage').children().addClass('invisible');
        jQuery(tr).find('.choose-or-none').html(0);
      }else if (jQuery(tr).find('#filtered-week').length !== 0) {
        jQuery(tr).find('#filtered-week').removeClass('weekly');
      }
      jQuery(tr).find('.js-savings').removeClass('invisible');
      // show the amount that is saved
    }else { // if the field have bank/buy/sale/paycheck in his class list it will be included in calculations
      if(jQuery(tr).find('#filtered-sale').length !== 0) {
        periodMaxPrice(tr, sell_months, sell_sum);
        jQuery(tr).find('#filtered-sale').addClass('sale');
      }else if (jQuery(tr).find('#filtered-buy').length !== 0) {
        periodMaxPrice(tr, buy_months, buy_sum);
        jQuery(tr).find('#filtered-buy').addClass('buy');
      }else if (jQuery(tr).find('#filtered-giro').length !== 0) {
        periodMaxPrice(tr, giro_months, giro_sum);
        jQuery(tr).find('#filtered-giro').addClass('giro');
      }else if (jQuery(tr).find('#filtered-paycheck').length !== 0){
        periodMaxPrice(tr, paycheck_months, paycheck_sum);
        jQuery(tr).find('#filtered-paycheck').addClass('paycheck');
      }else if (jQuery(tr).find('#filtered-bank').length !== 0) {
        periodMaxPrice(tr, bank_months, bank_sum);
        jQuery(tr).find('#filtered-bank').addClass('bank');
      }else if (jQuery(tr).find('#filtered-tvelwe').length !== 0){
        jQuery(tr).find('#filtered-tvelwe').text(12);
      }else if(jQuery(tr).find('.choose-or-none').length !==0) {
        if (jQuery(tr).find('.choose-or-none').children('select').length == 0) {
          if (jQuery(tr).find('.choose-or-none').children('input').length == 0) {
            jQuery(tr).find('.choose-or-none').html(jQuery(tr).find('.storage').contents());
            jQuery(tr).find('.choose-or-none').children().removeClass('invisible');
          }
        };
      }else {
        jQuery(tr).find('#filtered-week').addClass('weekly');
      }
      // hide the amount that is saved
      jQuery(tr).find('.js-savings').addClass('invisible');
    }
    // showPricingTable();
  }

  function setTabIndex() {
    // we take the last tabindex in the monthly-pricing table and start from there
    // var start_index = parseInt(jQuery('[tabindex]:eq(-1)').attr('tabindex'));
    var highest_table_tabindex = jQuery('.monthly-invoicing tbody tr:nth-of-type(12) td:nth-of-type(8) input').attr('tabindex');
    var table_inputs_count = jQuery('.monthly-invoicing tbody input').length;
    // wordpress has one input prior to the table
    table_inputs_count += 1;
    var start_index = parseInt(highest_table_tabindex);
    jQuery('input:gt(' + table_inputs_count + '), select:gt(3)').each(function() {
      start_index += 1;
      jQuery(this).attr('tabindex', start_index);
    });
  }

// updates max-price on fields where amount is input by user
function updateMaxPrice(input) {
  var value = jQuery(input).val();
  if (jQuery(input).parent().hasClass('quantity')) {
    jQuery(input).parent().attr('max-price', value);
  } else {
    // when consultation is disabled, update max price
    if (jQuery(input).val() == 1)
    jQuery(input).parents('tr').find('.quantity').attr('max-price', 0);
  }
}


// var options = '';
// for (let i = 0; i < 100; i++) {
//   options += `${i}`;
// };



// var altinn = {
//   1: {
//     name: 'Altinn Arbeidsg.avg og skattetrekk',
//     type: 'specific',
//     period: 'oppg',
//     quantity: 0,
//     price: 300,
//     userCanChange: 'off'
//   },
//   2: {
//     name: 'Altinn Merverdiavgift',
//     type: 'specific',
//     period: 'oppg',
//     quantity: 0,
//     price: 300,
//     userCanChange: 'off'
//   },
//   3: {
//     name: 'Lønns og trekkoppgave',
//     type: 'specific',
//     period: 'stk',
//     quantity: 0,
//     price: 100,
//     userCanChange: 'off'
//   },
// }

// var godkjenne = {
//   1: {
//     name: 'Puncher fakturalinje',
//     type: 'specific',
//     period: 'stk',
//     quantity: 0,
//     price: 6,
//     userCanChange: ['Kunden puncher fakturalinje(utgift)', 'Regnskapsfører puncher fakturalinje(utgift)']
//   },
//   2: {
//     name: 'Godkjenne faktura',
//     type: 'specific',
//     period: 'stk',
//     quantity: 0,
//     price: 6,
//     userCanChange: 'off'
//   },
//   3: {
//     name: 'Årsoppgjør',
//     type: 'specific',
//     period: 'ar',
//     quantity: 1,
//     price: 1000,
//     userCanChange: 'off'
//   },
//   4: {
//     name: 'Konsulent',
//     type: 'specific',
//     period: 'ar',
//     quantity: 1,
//     price: 1000,
//     userCanChange: ['Kunden ønsker ikke konsultasjon avansert', 'Kunden ønsker konsultasjon avansert']
//   },
// }

// var bokfore = {
//   1: {
//     name: 'Bokføre',
//     type: 'specific',
//     period: 'ar',
//     quantity: 0,
//     price: 1,
//     userCanChange: 'off'
//   },
//   2: {
//     name: 'Årsoppgjør lignings papier, avstemminger',
//     type: 'specific',
//     period: 'ar',
//     quantity: 1,
//     price: 2000,
//     userCanChange: ['Kunden håndterer årsoppgjør', 'Regnskapsfører håndterer årsoppgjør', 'Revisor håndterer årsoppgjør']
//   },
//   3: {
//     name: 'Årsoppgjør lignings papier, u/revisor',
//     type: 'specific',
//     period: 'ar',
//     quantity: 1,
//     price: 3000,
//     userCanChange: ['Kunden håndterer årsoppgjør', 'Regnskapsfører håndterer årsoppgjør', 'Revisor håndterer årsoppgjør']
//   },
// }

// var fakturabank = {

// }

// var lodo = {
// }