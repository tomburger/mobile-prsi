x$.ready(function() {
    initCore();
    x$('div#zacni_hru').click(clickZacniHru);
    x$('div#pridej_hrace').click(clickPridejHrace);
    x$('div#pridej_bot').click(clickPridejBot);
    x$('div#jdi_na_tah').click(clickJdiNaTah);
    x$('div#tah_hotovy').click(clickTahHotovy);
    x$('div#nova_hra').click(clickNovaHra);
    x$('div.dalsibarva').click(clickDalsiBarva);
    x$('div#app_rating').click(clickGotoMarket);
    x$('div.view').setStyle('display', 'none');
    x$('div.panel').setStyle('height', '300');
    
    loadText('support', 'support_text');
    
    initHraci();
});
function clickGotoMarket() {
  window.plugins.webintent.startActivity(
    {
       action: WebIntent.ACTION_VIEW,
       url: 'https://market.android.com/details?id=cz.burger.android.phonegap.mobileprsi'
    }, 
    function() {},
    function() { alert('Failed to open Android Market'); }
  )
}
function nextView(current, next, action) {
  action();
  if (next != '') {
    x$('div.view').setStyle('z-index', 0);
    var view = x$('div#' + next);
    // view must cover the bottom part of the screen
//    var height = view.attr('height');
//    if (height < screen.height) view.setStyle('height', screen.height);
    // bring view from left to the screen
    //x$(window).scrollTop(0);  
    view.setStyle('left', '0px')
        .setStyle('z-index', 1)
        .setStyle('display', '')
//        .tween({left: '0px', duration: 280}, function() {
//          if (current != '') x$('div#' + current).setStyle('display', 'none');
//        })
        ;
  }
}
function addOneRow(el, ix, input) {
  var row = x$('<div class="input_row"></div>');
  row.bottom(
    '<div class="label"><label class="translate" for="name-hrace-'+ix+'">'+t('player_'+ix)+'</label></div>'
  );
  row.bottom(
    '<div class="input">'+input+'</div>'
  );
  el.bottom(row);
}
function addPlayerRow(el, ix, val) {
  addOneRow(el, ix, 
    '<input type="text" class="human hraci_jmena" name="hrac-'+ix+'" id="name-hrace-'+ix+'" value="'+val+'">'
  );
  x$('input#name-hrace-'+ix).on('keypress', changeHraciJmena);
}
function addBotRow(el, ix, val) {
  if (val === '') val = 'Droid #' + ix;
  addOneRow(el, ix, 
      '<img src="img/bot.png"><input disabled="disabled" type="text" class="bot hraci_jmena" name="hrac-'+ix+'" id="name-hrace-'+ix+'" value="'+val+'">'
  );
}
function prepareHraciJmena() {
  var rows = x$('#section_players');
  rows.html('');
  
  var hraci = hra.hraciForNextGame();
  if (hraci.length > 0) {
    var hr_ix = 1;
    while(hraci.length > 0) {
      var hrac = hraci.shift();
      if (hrac.bot) {
        addBotRow(rows, hr_ix, hrac.name);
      }
      else {
        addPlayerRow(rows, hr_ix, hrac.name);
      }
      hr_ix++;
    }
  }
  else {
    addPlayerRow(rows, 1, '');
    addPlayerRow(rows, 2, '');
  }
}
function initHraci() {
  prepareHraciJmena();
  changeHraciJmena(null);
  window.pocitadlo = 0;
  x$('div#hraci').setStyle('display', '');            
}
function enabledZacniHru() {
  var humans = 0;
  var bots = 0;
  x$('input.hraci_jmena').each(function(el) {
      if (x$(el).hasClass('human') && el.value) humans++;
      if (x$(el).hasClass('bot')) bots++;
  });
  // at least two players, at least one need to be human
  return (humans >= 1)
      && (humans + bots >= 2); 
}
function clickPridejHrace() {
  var ln = x$('div.input_row').length;
  if (ln < 5) {
    ln++;
    addPlayerRow(x$('#section_players'), ln, '');
    if (ln == 5) {
      x$('div#pridej_hrace').addClass('disabled');
      x$('div#pridej_bot').addClass('disabled');
    }
  }
}
function clickPridejBot() {
  var ln = x$('div.input_row').length;
  if (ln < 5) {
    ln++;
    addBotRow(x$('#section_players'), ln, '');
    changeHraciJmena(null);
    if (ln == 5) {
      x$('div#pridej_hrace').addClass('disabled');
      x$('div#pridej_bot').addClass('disabled');
    }
  }
}
function changeHraciJmena(event) {
    if (enabledZacniHru()) 
      x$('div#zacni_hru').removeClass('disabled')
    else
      x$('div#zacni_hru').addClass('disabled');
}
function dalsiKolo(from) {
  if (hra.actualPlayer().bot) {
    if (from === 'bot_hraje') {
      // two bots in a row need special treatment
      pripravBotHraje();
    }
    else {
      nextView(from, 'bot_hraje', pripravBotHraje);
    }
  }
  else {
    nextView(from, 'predavka', pripravPredavka);
  }
}
function botTahne() {
  var vruce = hra.actualPlayer().vruce;
  var povolene = [];
  for (vr_ix in vruce){
    var karta = vruce[vr_ix];
    if (hra.povolenaKarta(karta)) {
      povolene.push(karta);
    }
  }
  var lizani = hra.povoleneLizani();
  
  // autoplayer logic here!!
  if (povolene.length > 0) {
    var tah = povolene.shift();
    if (hra.isColorCard(tah)) {
      hra.dalsiTah(tah.toString(), hra.karty[tah].barva);
    }
    else {
      hra.dalsiTah(tah.toString(), '');
    }
  }
  else 
  if (lizani > 0) {
    hra.dalsiTah(-lizani, '');
  }
  else {
    hra.dalsiTah('', '');
  }
}
function pripravBotHraje() {
  x$('div#bot_predavka').html(hra.actualPlayer().name);
  window.setTimeout(function() {
      botTahne();
      if (hra.endOfGame()) {
        nextView('bot_hraje', 'vitez', pripravVitez);
      }
      else {
        hra.nextPlayer();
        dalsiKolo('bot_hraje');
      }
    }, 1500); 
}
function clickZacniHru(event) {
  if (!enabledZacniHru()) {
    alert(t('at_least_2_players_needed'));
    return;
  }
  pripravHru();
  dalsiKolo('hraci');
}
function pripravHru() {
   hra.init();
   x$('input.hraci_jmena').each(function(el, ix, xui) {
     if (el.value) {
       hra.add_player({ 
         name: el.value,
         bot: x$(el).hasClass('bot'),
         vruce: [] 
       });
     }
   })
   hra.mix_cards();
   hra.give_cards();
}
function pripravPredavka() {
  x$('div#hrac_predavka').html(hra.actualPlayer().name);
}
function setChoice(choice) {
  x$('input#stolek_volba').each(function(el) { el.value=choice; });
}
function getChoice() {
  var choice = '';
  x$('input#stolek_volba').each(function(el) { choice = el.value; });
  return choice;
}
function clearChoice() {
  setChoice('');
  if (!hra.cekani) x$('div#tah_hotovy').addClass('disabled');
}
function setColor(color) {
  x$('input#stolek_barva').each(function(el) { el.value=color; });
}
function getColor() {
  var color = '';
  x$('input#stolek_barva').each(function(el) { color = el.value; });
  return color;
}
function vezmiKartu() {
  if (x$(this).hasClass('vyrazna')) {
    x$('div.mazaci')
      .removeClass('vyrazna')
      .removeClass('maznuta');
    clearChoice();
    x$('div#section_dalsibarva').setStyle('display', 'none');
  }
  else {
    x$('div.mazaci')
      .removeClass('vyrazna')
      .addClass('maznuta');
    x$(this)
      .removeClass('maznuta')
      .addClass('vyrazna');
    var choice = parseInt(this.attributes['data-karta'].value); 
    setChoice(choice);
    if (choice >= 0 && hra.isColorCard(choice)) { 
      x$('div#tah_hotovy').addClass('disabled');
      x$('div.dalsibarva').removeClass('maznuta');
      x$('div#section_dalsibarva').setStyle('display', '');
    }
    else {
      x$('div#tah_hotovy').removeClass('disabled');
      x$('div#section_dalsibarva').setStyle('display', 'none');
    }
  }
}
function clickDalsiBarva() {
  x$('div.dalsibarva').addClass('maznuta');
  x$(this).removeClass('maznuta');
  setColor(this.attributes['data-barva'].value);
  x$('div#tah_hotovy').removeClass('disabled');
}
function novaBarva(br_ix) {
  return x$('<div class="karta_novabarva"><img src="img/' + barvy[br_ix] + '30.png"/></div>');      
}
function pridejSokl(el, btn) {
  if (btn >= 0) {
    var sokl = x$('<div>.</div>');
    sokl.addClass((btn == 0)?'podstavec':'podkartou');
    el.bottom(sokl);
  }     
}
function novaKarta(btn, data) {
  var html = x$('<div class="karta_box"></div>');
  if (btn > 0) html.addClass('klikaci');
  if (btn >= 0) html.addClass('mazaci');
  html.attr('data-karta', data);
  return html;
}
function pridejKartu(html, btn, kr_html) {
  if (btn >= 0) kr_html.addClass('shadow');
  html.bottom(kr_html);
  
  pridejSokl(html, btn);
  
  return html;
}
function pridejTxtKartu(txt, btn) {
  var html = novaKarta(btn, -btn);
  return pridejKartu(html, btn, x$('<div class="rub-karta">'+txt+'</div>'));
}
function pridejLicKartu(kr_ix, btn) {
  var html = novaKarta(btn, kr_ix);
  
  var karta = hra.karty[kr_ix];
  var kr_html = x$('<div class="karta '
                 + barvy[karta.barva] 
                 + '">'
                 + hodnoty[karta.hodnota]
                 + '</div>'
                );
  
  return pridejKartu(html, btn, kr_html);
}
function pocetKaretText(karet) {
  return t(
    ((karet == 1) ? '1_card' : 
    ((karet <= 4) ? '2_4_cards{1}' :
                    'more_cards{1}')),
  karet);
}
function pripravStolek() {
   x$('div#section_hrac').html(
       '<div class="hrac_na_tahu">' 
     + t('player_on_move({1})', hra.actualPlayer().name) 
     + '</div>'
   );
   
   var vruce = x$('div#vruce');
   var karta;
   vruce.html('');
   for(var kr_ix in hra.actualPlayer().vruce) {
     karta = hra.actualPlayer().vruce[kr_ix];
     vruce.bottom(pridejLicKartu(karta, hra.povolenaKarta(karta)));
   }
   
   var nastole = x$('div#nastole');
   nastole.html('');
   if (hra.isColorCard(hra.nastole[0])) {
     karta = pridejLicKartu(hra.nastole[0], 0);
     karta.bottom(novaBarva(hra.dalsi_barva));
     nastole.bottom(karta);
   }
   else {
     nastole.bottom(pridejLicKartu(hra.nastole[0], 0));
   }
  
   nastole.bottom(pridejTxtKartu(pocetKaretText(hra.nastole.length-1), 0));
   
   var lizani = hra.povoleneLizani();
   if (lizani > 0) nastole.bottom(pridejTxtKartu(t('take_cards({1})', lizani), lizani));
   
   x$('div.klikaci').click(vezmiKartu);
   
   x$('div#section_dalsibarva').setStyle('display', 'none');
      
   var historie = x$('div#historie');
   historie.html('');

   var zadna_historie = true;         
   hra.kazdyHrac(function(ix, hrac) {
     if (ix == 0) return;
     if (hrac.tah) {
       zadna_historie = false;
       historie.bottom('<div id="hrac-historie-'+ix+'" class="hrac_historie"></div>');
       var hr_hist = x$('div#hrac-historie-'+ix);
       hr_hist.bottom('<div class="hrac_jmeno">' + hrac.name + '</name>'); 
       hr_hist.bottom(pridejTxtKartu(pocetKaretText(hrac.vruce.length), -1));
       if (hrac.tah.karta >= 0) {
         if (hra.isColorCard(hrac.tah.karta)) {
           var karta = pridejLicKartu(hrac.tah.karta, -1);
           karta.bottom(novaBarva(hrac.tah.barva));
           hr_hist.bottom(karta);
         }
         else {
           hr_hist.bottom(pridejLicKartu(hrac.tah.karta, -1));
         }
       }
       else 
       if (hrac.tah.lizal > 0) {
         hr_hist.bottom('<div class="hrac_zprava">' + t('taken_cards:{1}', hrac.tah.lizal) + '</div>');
       }
       else {
         hr_hist.bottom('<div class="hrac_zprava">' + t('skipped_due_a') + '</div>');
       }
     }
   });
   if (zadna_historie) {
     historie.bottom('<div id="hrac-historie-none" class="hrac_historie">' + t('no_moves_yet') + '</div>');
   }
   
   clearChoice();
}
function clickJdiNaTah() {
  nextView('predavka', 'stolek', pripravStolek);
}
function pripravVitez() {
  x$('div#hrac_vitez').html(hra.actualPlayer().name);
}
function clickNovaHra() {
  window.pocitadlo++;
  if (window.pocitadlo === 1) {
    nextView('vitez', 'support', function() {});
  }
  else {
    nextView('vitez', 'hraci', function() {
      prepareHraciJmena();
      changeHraciJmena(null);
    });
  }
}
function clickSupport2Hra() {
  nextView('support', 'hraci', function() {
    prepareHraciJmena();
    changeHraciJmena(null);
  });
}
function clickTahHotovy() {
  if (getChoice()=='' && !hra.cekani) {
    alert(t('decide_on_move_first'));
    return;
  }
  hra.dalsiTah(getChoice(), getColor());
  if (hra.endOfGame()) {
    nextView('stolek', 'vitez', pripravVitez);
  }
  else {
    hra.nextPlayer();
    dalsiKolo('stolek');
  }
}

