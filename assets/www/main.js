$(document).ready(function() {
    initCore();
    $('div#zacni_hru').click(clickZacniHru);
    $('div#pridej_hrace').click(clickPridejHrace);
    $('div#pridej_bot').click(clickPridejBot);
    $('div#jdi_na_tah').click(clickJdiNaTah);
    $('div#tah_hotovy').click(clickTahHotovy);
    $('div#nova_hra').click(clickNovaHra);
    $('div.dalsibarva').click(clickDalsiBarva);
    $('div#app_rating').click(clickGotoMarket);
    $('div.view').css('display', 'none');
    $('div.panel').height(300);
    
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
    $('div.view').css('z-index', 0);
    var view = $('div#' + next);
    // view must cover the bottom part of the screen
    var height = view.height();
    if (height < screen.height) view.height(screen.height);
    // bring view from left to the screen
    $(window).scrollTop(0);  
    view.css('left', screen.width)
        .css('z-index', 1)
        .css('display', '')
        .animate({left: 0}, 280, function() {
          if (current != '') $('div#' + current).css('display', 'none');
        });
  }
}
function addOneRow(el, ix, input) {
  var row = $('<div class="input_row"></div>');
  row.append($(
    '<div class="label"><label class="translate" for="name-hrace-'+ix+'">'+t('player_'+ix)+'</label></div>'
  ));
  row.append($(
    '<div class="input">'+input+'</div>'
  ));
  el.append(row);
}
function addPlayerRow(el, ix, val) {
  addOneRow(el, ix, 
    '<input type="text" class="human hraci_jmena" name="hrac-'+ix+'" id="name-hrace-'+ix+'" value="'+val+'">'
  );
  $('input#name-hrace-'+ix).keypress(changeHraciJmena);
}
function addBotRow(el, ix, val) {
  if (val === '') val = 'Droid #' + ix;
  addOneRow(el, ix, 
      '<img src="bot.png"><input disabled="disabled" type="text" class="bot hraci_jmena" name="hrac-'+ix+'" id="name-hrace-'+ix+'" value="'+val+'">'
  );
}
function prepareHraciJmena() {
  var rows = $('#section_players');
  rows.empty();
  
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
      };
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
  $('div#hraci').css('display', '');            
}
function enabledZacniHru() {
  var humans = 0;
  var bots = 0;
  $('input.hraci_jmena').each(function(ix, el) {
      if ($(el).hasClass('human') && el.value) humans++;
      if ($(el).hasClass('bot')) bots++;
  });
  // at least two players, at least one need to be human
  return (humans >= 1)
      && (humans + bots >= 2); 
}
function clickPridejHrace() {
  var ln = $('div.input_row').length;
  if (ln < 5) {
    ln++;
    addPlayerRow($('#section_players'), ln, '');
    if (ln == 5) {
      $('div#pridej_hrace').addClass('disabled');
      $('div#pridej_bot').addClass('disabled');
    }
  }
}
function clickPridejBot() {
  var ln = $('div.input_row').length;
  if (ln < 5) {
    ln++;
    addBotRow($('#section_players'), ln, '');
    changeHraciJmena(null);
    if (ln == 5) {
      $('div#pridej_hrace').addClass('disabled');
      $('div#pridej_bot').addClass('disabled');
    }
  }
}
function changeHraciJmena(event) {
    if (enabledZacniHru()) 
      $('div#zacni_hru').removeClass('disabled')
    else
      $('div#zacni_hru').addClass('disabled');
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
function logKarta(prefix, karta) {
  console.log(prefix 
    + barvy[hra.karty[karta].barva]
    + '-'
    + hodnoty[hra.karty[karta].hodnota]);
}
function botTahne() {
  var vruce = hra.actualPlayer().vruce;
  var povolene = [];
  for (vr_ix in vruce){
    var karta = vruce[vr_ix];
    if (hra.povolenaKarta(karta)) {
      logKarta('X ', karta);
      povolene.push(karta);
    }
    else {
      logKarta('  ', karta);
    };
  }
  var lizani = hra.povoleneLizani();
  console.log('Lizani ' + lizani);
  
  // autoplayer logic here!!
  if (povolene.length > 0) {
    var tah = povolene.shift();
    if (hra.isColorCard(tah)) {
      hra.dalsiTah(tah.toString(), hra.karty[tah].barva);
    }
    else {
      hra.dalsiTah(tah.toString(), '');
    };
    logKarta('>>', tah);
  }
  else 
  if (lizani > 0) {
    hra.dalsiTah(-lizani, '');
    console.log('Liznul...')
  }
  else {
    hra.dalsiTah('', '');
    console.log('Vynechal...');
  };
  console.log('----------------------------------');
  
}
function pripravBotHraje() {
  $('div#bot_predavka').text(hra.actualPlayer().name);
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
  };
  pripravHru();
  dalsiKolo('hraci');
};
function pripravHru() {
   hra.init();
   $('input.hraci_jmena').map(function(index, el) {
     if (el.value) {
       hra.add_player({ 
         name: el.value,
         bot: $(el).hasClass('bot'),
         vruce: [] 
       });
     };
   });
   hra.mix_cards();
   hra.give_cards();
}
function pripravPredavka() {
  $('div#hrac_predavka').text(hra.actualPlayer().name);
}
function setChoice(choice) {
  $('input#stolek_volba').map(function(ix, el) { el.value=choice; });
}
function getChoice() {
  var choice = '';
  $('input#stolek_volba').map(function(ix, el) { choice = el.value; });
  return choice;
}
function clearChoice() {
  setChoice('');
  if (!hra.cekani) $('div#tah_hotovy').addClass('disabled');
}
function setColor(color) {
  $('input#stolek_barva').map(function(ix, el) { el.value=color; });
}
function getColor() {
  var color = '';
  $('input#stolek_barva').map(function(ix, el) { color = el.value; });
  return color;
}
function vezmiKartu() {
  if ($(this).hasClass('vyrazna')) {
    $('div.mazaci')
      .removeClass('vyrazna')
      .removeClass('maznuta');
    clearChoice();
    $('div#section_dalsibarva').hide();
  }
  else {
    $('div.mazaci')
      .removeClass('vyrazna')
      .addClass('maznuta');
    $(this)
      .removeClass('maznuta')
      .addClass('vyrazna');
    var choice = parseInt(this.attributes['data-karta'].value); 
    setChoice(choice);
    if (choice >= 0 && hra.isColorCard(choice)) { 
      $('div#tah_hotovy').addClass('disabled');
      $('div.dalsibarva').removeClass('maznuta');
      $('div#section_dalsibarva').show();
    }
    else {
      $('div#tah_hotovy').removeClass('disabled');
      $('div#section_dalsibarva').hide();
    }
  };
}
function clickDalsiBarva() {
  $('div.dalsibarva').addClass('maznuta');
  $(this).removeClass('maznuta');
  setColor(this.attributes['data-barva'].value);
  $('div#tah_hotovy').removeClass('disabled');
}
function novaBarva(br_ix) {
  return $('<div class="karta_novabarva"><img src="' + barvy[br_ix] + '30.png"/></div>');      
}
function pridejSokl(el, btn) {
  if (btn >= 0) {
    var sokl = $('<div>.</div>');
    sokl.addClass((btn == 0)?'podstavec':'podkartou');
    el.append(sokl);
  };       
}
function novaKarta(btn, data) {
  var html = $('<div class="karta_box"></div>');
  if (btn > 0) html.addClass('klikaci');
  if (btn >= 0) html.addClass('mazaci');
  html.attr('data-karta', data);
  return html;
}
function pridejKartu(html, btn, kr_html) {
  if (btn >= 0) kr_html.addClass('shadow');
  html.append(kr_html);
  
  pridejSokl(html, btn);
  
  return html;
}
function pridejTxtKartu(txt, btn) {
  var html = novaKarta(btn, -btn);
  return pridejKartu(html, btn, $('<div class="rub-karta">'+txt+'</div>'));
}
function pridejLicKartu(kr_ix, btn) {
  var html = novaKarta(btn, kr_ix);
  
  var karta = hra.karty[kr_ix];
  var kr_html = $('<div class="karta '
                + barvy[karta.barva] 
                + '">'
                + hodnoty[karta.hodnota]
                + '</div>');
  
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
   $('div#section_hrac').empty().append('<div class="hrac_na_tahu">' + t('player_on_move({1})', hra.actualPlayer().name) + '</div>');
   
   var vruce = $('div#vruce');
   vruce.empty();
   for(var kr_ix in hra.actualPlayer().vruce) {
     var karta = hra.actualPlayer().vruce[kr_ix];
     vruce.append(pridejLicKartu(karta, hra.povolenaKarta(karta)));
   };
   
   var nastole = $('div#nastole');
   nastole.empty();
   if (hra.isColorCard(hra.nastole[0])) {
     var karta = pridejLicKartu(hra.nastole[0], 0);
     karta.append(novaBarva(hra.dalsi_barva));
     nastole.append(karta);
   }
   else {
     nastole.append(pridejLicKartu(hra.nastole[0], 0));
   };
  
   nastole.append(pridejTxtKartu(pocetKaretText(hra.nastole.length-1), 0));
   
   var lizani = hra.povoleneLizani();
   if (lizani > 0) nastole.append(pridejTxtKartu(t('take_cards({1})', lizani), lizani));
   
   $('div.klikaci').click(vezmiKartu);
   
   $('div#section_dalsibarva').hide();
      
   var historie = $('div#historie');
   historie.empty();

   var zadna_historie = true;         
   hra.kazdyHrac(function(ix, hrac) {
     if (ix == 0) return;
     if (hrac.tah) {
       zadna_historie = false;
       historie.append('<div id="hrac-historie-'+ix+'" class="hrac_historie"></div>');
       var hr_hist = $('div#hrac-historie-'+ix);
       hr_hist.append('<div class="hrac_jmeno">' + hrac.name + '</name>'); 
       hr_hist.append(pridejTxtKartu(pocetKaretText(hrac.vruce.length), -1));
       if (hrac.tah.karta >= 0) {
         if (hra.isColorCard(hrac.tah.karta)) {
           var karta = pridejLicKartu(hrac.tah.karta, -1);
           karta.append(novaBarva(hrac.tah.barva));
           hr_hist.append(karta);
         }
         else {
           hr_hist.append(pridejLicKartu(hrac.tah.karta, -1));
         };
       }
       else 
       if (hrac.tah.lizal > 0) {
         hr_hist.append('<div class="hrac_zprava">' + t('taken_cards:{1}', hrac.tah.lizal) + '</div>');
       }
       else {
         hr_hist.append('<div class="hrac_zprava">' + t('skipped_due_a') + '</div>');
       }
     };
   });
   if (zadna_historie) {
     historie.append('<div id="hrac-historie-none" class="hrac_historie">' + t('no_moves_yet') + '</div>');
   };
   
   clearChoice();
}
function clickJdiNaTah() {
  nextView('predavka', 'stolek', pripravStolek);
}
function pripravVitez() {
  $('div#hrac_vitez').text(hra.actualPlayer().name);
}
function clickNovaHra() {
  window.pocitadlo++;
  if (window.pocitadlo === 2) {
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
  };
  hra.dalsiTah(getChoice(), getColor());
  if (hra.endOfGame()) {
    nextView('stolek', 'vitez', pripravVitez);
  }
  else {
    hra.nextPlayer();
    dalsiKolo('stolek');
  };
};

