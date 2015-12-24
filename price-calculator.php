





<?php /* Template Name: PrisKalkulator */ ?>

<div class="main_element price-calculator">
  <h1>Pris Kalkulator</h1>
  <div class="unit-info clearfix">
    <h3 class=""></h3>
    <div class="company-name">
      Tilbud år <input type="number">
      Selskapsnavn <input type="text">
    </div>
    <div id="print" onclick="window.print()"></div>
    <div class="clear"></div>
    <select name="using-lodo" id="using-lodo" class="fl-l" onchange="usingLodo();" tabindex="6">
      <option value="0">Velg regnskapspakke</option>
      <option value="1">Bruker Lodo regnskapspakke</option>
      <option value="2">Bruker ikke Lodo</option>
    </select>
 <!--    <select name="account-type" id="account-type" class="invisible fl-l" package="lodo" onchange="usingLodo();" tabindex="7">
      <option value="0">Velg konto type</option>
      <option value="1">Regnskapsfører utfører regnskapsjobben</option>
      <option value="2">Velg hva var du lager</option>
    </select> -->
  <br>
  </div>
  <div class="js-calculator-data invisible">
    <table class="simple-table monthly-invoicing text-r">
      <thead>
        <tr>
          <th class="text-l">Måneder</th>
          <th package="lodo">Kasse</th>
          <th>Bank</th>
          <th>Salg(utgående)</th>
          <th>Utgift(ingående)</th>
          <th>Lønn</th>
          <th package="lodo">Uke</th>
          <th>Giro</th>
          <th>Sum</th>
        </tr>
      </thead>
      <tbody>
      <td package="lodo"><input type="number" step="1" min='0' class="kasse"  placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'));"></td>
            <td><input type="number" step="1" min='0' class="bank" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="sell" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="buy" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="paycheck" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td package="lodo"><input type="number" step="1" min='0' class="week" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="giro" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td></td>

<!-- Removed to reduce nr of inputs -->
        // <?php
          $months = Array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
        foreach ($months as $i => $m) { ?>
         <!--  <tr class="<?php echo $m; ?>">
            <td class="name-table text-l"><?php echo $m; ?></td>
            <td package="lodo"><input type="number" step="1" min='0' class="kasse" tabindex="<?php echo ($i + 5) + 12; ?>" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'));"></td>
            <td><input type="number" step="1" min='0' class="bank" tabindex="<?php echo ($i + 5) + (12*2); ?>" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="sell" tabindex="<?php echo ($i + 5) + (12*3); ?>" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="buy" tabindex="<?php echo ($i + 5) + (12*4); ?>" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="paycheck" tabindex="<?php echo ($i + 5) + (12*5); ?>" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td package="lodo"><input type="number" step="1" min='0' class="week" tabindex="<?php echo ($i + 5) + (12*6); ?>" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td><input type="number" step="1" min='0' class="giro" tabindex="<?php echo ($i + 5) + (12*7); ?>" placeholder="0" onchange="calculateTotal(jQuery(this).attr('class'))"></td>
            <td></td>
          </tr> -->
        // <?php } ?>
      </tbody>
      <!-- *_sum sums all the input values, *_months counts the number of inputs !== 0 -->
      <tfoot>
        <tr>
          <td class="text-l">Sum</td>
          <td package="lodo" class="kasse_sum">0</td>
          <td id="js-banka" class="bank_sum">0</td>
          <td class="sell_sum">0</td>
          <td class="buy_sum">0</td>
          <td class="paycheck_sum">0</td>
          <td package="lodo" class="week_sum">0</td>
          <td class="giro_sum">0</td>
          <td class="sum-of-sums">0</td>
        </tr>
        <td class="text-l">Måneder i bruk</td>
        <td package="lodo" class="kasse_months">0</td>
        <td id="js-bank-months" class="bank_months">0</td>
        <td class="sell_months">0</td>
        <td class="buy_months">0</td>
        <td class="paycheck_months">0</td>
        <td package="lodo" class="week_months">0</td>
        <td class="giro_months">0</td>
        <td class="sum-of-months">0</td>
      </tfoot>
    </table>

    <br>
    <br>
    <br>
    <!-- How many times user wants to send reports to the government -->
    <div class="lodo-package-tools">
      <div package="lodo" class="package-lodo form-wrapper margin-r-30">
        <dl class="fl-l width-300 ">
          <dt>MVA Oppgave </dt>
          <dd>
            <select name="tax-update" id="tax-update" onchange="updateQuantity()">
              <?php for ($i=0; $i <= 6; $i++) {
                  echo "<option value='$i'>$i</option>";
                }
              ?>
            </select>
          </dd>
          <!-- For how many working months user wants us to send employee records -->
          <dt>Terminer aga og skatt</dt>
          <dd>
            <select name="working-months" id="working-months" onchange="updateQuantity()">
              <?php for ($i=0; $i <= 12; $i++) {
                  echo "<option value='$i'>$i</option>";
                }
              ?>
            </select>
          </dd>
          <!-- How many employees are there in the company -->
          <dt>Lønns og trekkoppgave</dt>
          <dd><input type="number" step="1" min='0' class="employees-count" onchange="updateQuantity()"></dd>
        </dl>

      </div>
      <table package="lodo" class="bookkeeping-amount simple-table margin-l-100 text-c fl-l">
        <thead>
          <tr>
            <th>kr</th>
            <th>bilag</th>
            <th>honorar</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>5.00</td>
            <td class="standard-count">0</td>
            <td class="standard-sum">0</td>
            <td>bilag antall < 1500</td>
          </tr>
          <tr>
            <td>4.00</td>
            <td class="plus-count">0</td>
            <td class="plus-sum">0</td>
            <td>bilag antall < 3000</td>
          </tr>
          <tr>
            <td>3.00</td>
            <td class="extra-count">0</td>
            <td class="extra-sum">0</td>
            <td>bilag antall > 3000</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>sum</td>
            <td class="total-count">0</td>
            <td class="bookkeeping-total-sum">0</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <br>
    <br>
    <br class="cf">

    <!--
    # <%= link_to 'New Price calculator', new_price_calculator_path %>
      -->
    <br>
    <br>
    <button class="buttons-standard" onclick="setMaxPrice(); showPricingTable();">Kalkulere!</button>
    <br>
    <br>

    <div class="table-wrapper">
      <table class="consulting-service simple-table">
      <thead>
        <tr class="service-header accounting-service">
          <th colspan="6`">Kontortjeneste</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th></th>
          <th class="quantity">Antall</th>
          <th class="price">Pris</th>
          <th></th>
          <th class="text-r">Betale</th>
          <th></th>
          <th class="services-data accounting-service">0</th>
          <th>0%</th>
          <th>Du spare <span class='services-data accounting-service'></span></th>
        </tr>
      </thead>
      <tbody>
        <tr class="services-data accounting-service">
          <td>Henter bilag</td>
          <td id="filtered-tvelwe" class="quantity">0</td>
          <td class="price">200</td>
          <td class="period">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden scanner bilag</option>
              <option value="1">Kunden leverer bilag</option>
              <option value="2" selected>Bilag blir hetet hos kunden</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Oppstart pr mnd</td>
          <td class="quantity">0</td>
          <td class="price">100</td>
          <td id="filtered-bank" class="period monthly">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden scanner bilag</option>
              <option value="1">Kunden leverer bilag</option>
              <option value="2" selected>Bilag blir hetet hos kunden</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Sortere og nummerere bankbilag</td>
          <td class="quantity">0</td>
          <td class="price">10</td>
          <td id="filtered-bank" class="period per-piece">pr.bilag</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunde nummererer/sorterer bilag og bank</option>
              <option value="2" selected>Vi nummererer/sorterer bilag og bank</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Manglende bilag, darlig scann, stk pris</td>
          <td class="quantity choose-or-none">0</td>
          <td class="price">100</td>
          <td class="per-piece">pr.bilag</td>
          <td class="amount">0</td>
          <td class="storage">
            <select name="paper-missing" id="paper-missing" class="invisible" onchange="updateMaxPrice(jQuery(this));updateQuantity();" >
              <?php for ($i=0; $i <= 100; $i++) {
                echo "<option value='$i'>$i</option>";
              }
            ?>
            </select>
          </td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunde skaffer manglende bilag</option>
              <option value="2" selected>Vi skaffer manglende bilag</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Konsulent</td>
          <td class="quantity choose-or-none">0</td>
          <td class="price">300</td>
          <td class="hourly">timer</td>
          <td class="amount">0</td>
          <td class="storage">
            <select name="consulting" id="consulting" class="invisible" onchange="updateMaxPrice(jQuery(this));updateQuantity();" >
              <?php for ($i=0; $i <= 100; $i++) {
                echo "<option value='$i'>$i</option>";
              }
            ?>
            </select>
          </td>
          <td colspan="2">
            <select class="accounting-service" onchange="updateMaxPrice(jQuery(this));showPricingTable();" >
              <option value="1">Kunden ønsker ikke konsultasjon</option>
              <option value="2" selected>Kunden ønsker konsultasjon</option>
            </select>
          </td>
          <td></td>
        </tr>
        <tr package="lodo" class="services-header accounting-service">
          <th colspan="8">lodo</th>
          <th></th>
        </tr>
        <tr package="lodo" class="services-data accounting-service">
          <td>Utgående faktura,lager</td>
          <td class="quantity">0</td>
          <td class="price">100</td>
          <td id="filtered-sale" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunde lager faktura</option>
              <option value="2" selected>Regnskapsfører lager faktura</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr package="lodo" class="services-data accounting-service">
          <td>Kasse salg, puncher ukeomsetning kasse</td>
          <td id="filtered-week"  class="quantity">0</td>
          <td class="price">300</td>
          <td class="period monthly">en kas</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunde puncher ukeomsetning kasse</option>
              <option value="2" selected>Regnskapsfører puncher ukeomsetning kasse</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr package="lodo" class="services-data accounting-service">
          <td>Lønnslipp, lager</td>
          <td class="quantity">0</td>
          <td class="price">100</td>
          <td id="filtered-paycheck" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunde lager lønnslipp</option>
              <option value="2" selected>Regnskapsfører lager lønnslipp</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr package="lodo" class="services-data accounting-service">
          <td>Utgående faktura, lodo/annen til fakturabank</td>
          <td class="quantity">0</td>
          <td class="price">10</td>
          <td id="filtered-sale" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden sender faktura til fakturaBank</option>
              <option value="2" selected>Regnskapsfører sender faktura til fakturaBank</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr package="lodo" class="services-data accounting-service">
          <td>Lønnslipp, Lodo til fakturaBank</td>
          <td class="quantity">0</td>
          <td class="price">10</td>
          <td id="filtered-paycheck" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()">
              <option value="1">Kunden sender lønnslipp til fakturaBank</option>
              <option value="2" selected>Regnskapsfører sender lønnslipp til fakturaBank</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-header accounting-service">
          <th colspan="8">fakturaBank</th>
          <th></th>
        </tr>
        <tr class="services-data accounting-service">
          <td>Scanner bilag inngaende faktura</td>
          <td class="quantity">0</td>
          <td class="price">5</td>
          <td id="filtered-buy" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden scanner faktura</option>
              <option value="2" selected>Regnskapsfører scanner faktura</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Puncher info inngaende faktura</td>
          <td class="quantity">0</td>
          <td class="price">6</td>
          <td id="filtered-buy" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunde puncher info data(utgift)</option>
              <option value="2" selected>Regnskapsfører puncher info data(utgift)</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Scanner giro</td>
          <td class="quantity">0</td>
          <td class="price">5</td>
          <td id="filtered-giro" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden scanner giro</option>
              <option value="2" selected>Regnskapsfører scanner giro</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Puncher giro</td>
          <td class="quantity">0</td>
          <td class="price">6</td>
          <td id="filtered-giro" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden puncher giro</option>
              <option value="2" selected>Regnskapsfører puncher giro</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Avstemme utgående faktura</td>
          <td class="quantity">0</td>
          <td class="price">5</td>
          <td id="filtered-sale" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden avstemme utgående faktura(salg)</option>
              <option value="2" selected>Regnskapsfører avstemme utgående faktura(salg)</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Avstemme inngaende faktura</td>
          <td class="quantity">0</td>
          <td class="price">5</td>
          <td id="filtered-buy" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden avstemme inngaende faktura(utgift)</option>
              <option value="2" selected>Regnskapsfører avstemme inngaende faktura(utgift)</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Avstemme lønn</td>
          <td class="quantity">0</td>
          <td class="price">5</td>
          <td id="filtered-paycheck" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable()" >
              <option value="1">Kunden avstemme lønn(lønn)</option>
              <option value="2" selected>Regnskapsfører avstemme lønn(lønn)</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
        <tr class="services-data accounting-service">
          <td>Puncher bankkontoutskrift</td>
          <td class="quantity choose-or-none">0</td>
          <td class="price">6</td>
          <td>linje</td>
          <td class="amount">0</td>
          <td class="storage"><input type="number" step="1" min='0' class="invisible" onchange="updateMaxPrice(jQuery(this));updateQuantity();"></td>
          <td colspan="2">
            <select class="accounting-service" account-type="full" onchange="showPricingTable();" >
              <option value="1">Kunden puncher bankkontoutskrift(bank)</option>
              <option value="2" selected>Regnskapsfører puncher bankkontoutskrift(bank)</option>
            </select>
          </td>
          <td><span class="js-savings invisible"></span></td>
        </tr>
      </tbody>
      <thead package="lodo">
        <tr class="service-header accounting-service-advanced">
          <th colspan="6`">Altinn</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th></th>
          <th class="quantity">Antall</th>
          <th class="price">Pris</th>
          <th></th>
          <th class="text-r">Betale</th>
          <th></th>
          <th class="services-data accounting-service-advanced">0</th>
          <th>0%</th>
          <th></th>
        </tr>
      </thead>
      <tbody package="lodo">
        <tr class="services-data accounting-service-advanced">
          <td>Altinn Arbeidsg.avg og skattetrekk</td>
          <td class="working-months quantity">0</td>
          <td class="price">300</td>
          <td>oppg</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data accounting-service-advanced">
          <td>Altinn Merverdiavgift</td>
          <td class="tax-update quantity">0</td>
          <td class="price">300</td>
          <td>oppg</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data accounting-service-advanced">
          <td>Lønns og trekkoppgave</td>
          <td class="employees-count quantity">0</td>
          <td class="price">100</td>
          <td class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
      </tbody>
      <thead>
      <tr class="service-header closing-faktura">
        <th colspan="6`">Godkjenne faktura</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th></th>
          <th class="quantity">Antall</th>
          <th class="price">Pris</th>
          <th></th>
          <th class="text-r">Betale</th>
          <th></th>
          <th class="services-data closing-faktura">0</th>
          <th>0%</th>
          <th>Du spare <span class='js-savings diff'>0.00</span></th>
        </tr>
      </thead>
        <tr class="services-data closing-faktura">
          <td>Puncher fakturalinje</td>
          <td class="quantity">0</td>
          <td class="price">6</td>
          <td id="filtered-buy" class="period per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select id="js-closing-punch-lines" class="closing-faktura" onchange="showPricingTable()" >
              <option value="1">Kunden puncher fakturalinje(utgift)</option>
              <option value="2" selected>Regnskapsfører puncher fakturalinje(utgift)</option>
            </select>
          </td>
          <td><span class="js-savings diff"></span></td>
        </tr>
        <tr class="services-data closing-faktura">
          <td>Godkjenne faktura</td>
          <td class="quantity">0</td>
          <td class="price js-closing-punch-lines">10</td>
          <td class="period buy per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">hvis regnsakesfører puncher linjene så koster det 6 ellers så er kostnaden 10</td>
          <td></td>
        </tr>
        <tr class="services-data closing-faktura">
          <td>Årsoppgjør</td>
          <td class="yearly quantity">0</td>
          <td class="price">1000</td>
          <td>år</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data closing-faktura">
          <td>Konsulent</td>
          <td class="quantity choose-or-none">0</td>
          <td class="price">600</td>
          <td class="hourly">timer</td>
          <td class="amount">0</td>
          <td class="storage">
            <select name="consulting" id="consulting" class="invisible" onchange="updateMaxPrice(jQuery(this));updateQuantity()" >
              <?php for ($i=0; $i <= 100; $i++) {
                echo "<option value='$i'>$i</option>";
              }
            ?>
            </select>
          </td>
          <td colspan="2">
            <select class="closing-faktura" onchange="showPricingTable()" >
              <option value="1">Kunden ønsker ikke konsultasjon avansert</option>
              <option value="2" selected>Kunden ønsker konsultasjon avansert</option>
            </select>
          </td>
          <td></td>
        </tr>
      </tbody>
      <thead package="lodo">
        <tr class="service-header bookkeeping-service">
          <th colspan="6`">Bokføre</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th></th>
          <th class="quantity">Antall</th>
          <th class="price">Pris</th>
          <th></th>
          <th class="text-r">Betale</th>
          <th></th>
          <th class="services-data bookkeeping-service"></th>
          <th></th>
          <th>Du spare <span class='js-savings different'></span></th>
        </tr>
      </thead>
      <tbody package="lodo">
        <tr class="services-data bookkeeping-service">
          <td>Bokføre</td>
          <td class="bookkeeping-total-sum quantity">0</td>
          <td class="price">1</td>
          <td>år</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data bookkeeping-service" id="js-avstemminger">
          <td>Årsoppgjør lignings papier, avstemminger</td>
          <td class="quantity" max-price="1">0</td>
          <td class="price">2000</td>
          <td>år</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="bookkeeping-service js-avstemminger" onchange="showPricingTable()">
              <option value="0">Kunden håndterer årsoppgjør</option>
              <option value="1" selected>Regnskapsfører håndterer årsoppgjør</option>
              <option value="1">Revisor håndterer årsoppgjør</option>
            </select>
          </td>
          <td><span class="js-savings invisible "></span></td>
        </tr>
        <tr class="services-data bookkeeping-service" id="js-revisor">
          <td>Årsoppgjør lignings papier, u/revisor</td>
          <td class="quantity" max-price="1">0</td>
          <td class="price">3000</td>
          <td>år</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="bookkeeping-service js-revisor" onchange="showPricingTable()">
              <option value="0">Kunden håndterer årsoppgjør</option>
              <option value="1" selected>Regnskapsfører håndterer årsoppgjør</option>
              <option value="0">Revisor håndterer årsoppgjør</option>
            </select>
          </td>
          <td><span class="js-savings invisible "></span></td>
        </tr>
      </tbody>
      <thead>
        <tr class="service-header fabank-service">
          <th colspan="6`">FakturaBank</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th></th>
          <th class="quantity">Antall</th>
          <th class="price">Pris</th>
          <th></th>
          <th class="text-r">Betale</th>
          <th></th>
          <th class="services-data fabank-service">0</th>
          <th>0%</th>
          <th>Du spare <span class="services-data fabank-service"></span></th>
        </tr>
      </thead>
      <tbody>
        <tr class="services-data fabank-service">
          <td>fakturaBank Utgående faktura lagre</td>
          <td class="quantity">0</td>
          <td class="price">2</td>
          <td id="filtered-sale" class="period sale per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>Utgående faktura per dag for sent.</td>
          <td class="quantity">0</td>
          <td class="price">1</td>
          <td class="period sale daily">per dag</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>fakturaBank Ingående faktura lagre</td>
          <td class="quantity">0</td>
          <td class="price">2</td>
          <td id="filtered-buy" class="period buy per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>Inngående faktura per dag for sent</td>
          <td class="quantity">0</td>
          <td class="price">1</td>
          <td class="period buy daily">per dag</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>fakturaBank Lønnslipp lagre</td>
          <td class="quantity">0</td>
          <td class="price">2</td>
          <td id="filtered-paycheck" class="period paycheck per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>Lønns slipp per dag for sent</td>
          <td class="quantity">0</td>
          <td class="price">1</td>
          <td class="period paycheck daily">per dag</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>fakturaBank til Lodo utgående faktura xml</td>
          <td class="quantity">0</td>
          <td class="price">10</td>
          <td id="filtered-sale" class="period sale per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="services-data" account-type="full" onchange="showPricingTable()">
              <option value="1" selected>Jeg ønsker ikke å bruke dette alternativet</option>
              <option value="2">Jeg vil bruke dette alternativet</option>
            </select>
          </td>
          <td><span class="js-savings invisible">0.00</span></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>fakturaBank til Lodo inngaende faktura xml</td>
          <td class="quantity">0</td>
          <td class="price">10</td>
          <td id="filtered-buy" class="period buy per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="services-data" account-type="full" onchange="showPricingTable()">
              <option value="1">Jeg ønsker ikke å bruke dette alternativet</option>
              <option value="2" selected>Jeg vil bruke dette alternativet</option>
            </select>
          </td>
          <td><span class="js-savings invisible">0.00</span></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>fakturaBank til Lodo lønnslipp xml</td>
          <td class="quantity">0</td>
          <td class="price">10</td>
          <td id="filtered-paycheck" class="period paycheck per-piece">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="services-data" account-type="full" onchange="showPricingTable()">
              <option value="1" selected>Jeg ønsker ikke å bruke dette alternativet</option>
              <option value="2">Jeg vil bruke dette alternativet</option>
            </select>
          </td>
          <td><span class="js-savings invisible">0.00</span></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>fakturaBank banktransaksjone xml</td>
          <td class="quantity">0</td>
          <td class="price">2</td>
          <td id="filtered-bank" class="period per-piece bank">stk</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2">
            <select class="services-data" account-type="full" onchange="showPricingTable()">
              <option value="1">Jeg ønsker ikke å bruke dette alternativet</option>
              <option value="2" selected>Jeg vil bruke dette alternativet</option>
            </select>
          </td>
          <td><span class="js-savings invisible">0.00</span></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>DNB drift til fakturaBank xml</td>
          <td class="quantity">0</td>
          <td class="price">250</td>
          <td id="filtered-bank" class="period monthly bank">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data fabank-service">
          <td>DNB skattetrekk til fakturaBank xml</td>
          <td class="quantity">0</td>
          <td class="price">250</td>
          <td id="filtered-bank" class="period monthly bank">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
      </tbody>
      <thead package="lodo">
        <tr class="service-header lodo-service">
          <th colspan="6`">Lodo</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr>
          <th></th>
          <th class="quantity">Antall</th>
          <th class="price">Pris</th>
          <th></th>
          <th class="text-r">Betale</th>
          <th></th>
          <th class="services-data lodo-service">0</th>
          <th>0%</th>
          <th></th>
        </tr>
      </thead>
      <tbody package="lodo">
        <tr class="services-data lodo-service">
          <td>Ukeomsetning</td>
          <td class="weekly quantity">0</td>
          <td class="price">50</td>
          <td class="period monthly week">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data lodo-service">
          <td>Lønnslipp</td>
          <td class="quantity">0</td>
          <td class="price">50</td>
          <td class="period monthly paycheck">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data lodo-service">
          <td>Utgående faktura uten eller med kid</td>
          <td class="quantity">0</td>
          <td class="price">50</td>
          <td class="period monthly sale">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data lodo-service">
          <td>Supportavtale, lisens</td>
          <td class="quantity">0</td>
          <td class="price">100</td>
          <td class="period monthly buy">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data lodo-service">
          <td>Årbeidsgiveravgift og skattetrekk</td>
          <td class="working-months quantity">0</td>
          <td class="price">100</td>
          <td class="period monthly">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data lodo-service">
          <td>Merverdiavgift</td>
          <td class="tax-update quantity">0</td>
          <td class="price">100</td>
          <td class="period monthly">mnd</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data lodo-service">
          <td>Årsoppgjør ligninspapirer</td>
          <td class="yearly quantity">0</td>
          <td class="price">1000</td>
          <td>år</td>
          <td class="amount">0</td>
          <td></td>
          <td colspan="2"></td>
          <td></td>
        </tr>
        <tr class="services-data divider"></tr>
      </tbody>
      <tfoot>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td>Sum</td>
          <td></td>
          <td></td>
          <td class="total-sum">0</td>
          <td>100%</td>
          <td class="js-total-savings"></td>
        </tr>
      </tfoot>
    </table>
    </div>
  </div>
</div>