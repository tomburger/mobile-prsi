var hodnoty = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
var barvy = ['srdce', 'kary', 'zelena', 'zaludy'];
var hra = {
  init: function() {
    this.hraci = [];
    this.karty = [];
    this.nastole = [];
    this.lizani = 0;
    this.cekani = false;
    this.historie = [];
  },
  add_player: function(player) {
    this.hraci.push(player);
  },
  mix_cards: function() {
    var kr_index = 0;
    var karty = [];
    for(var hd_ix in hodnoty) {
      for(var br_ix in barvy) {
        karty[kr_index++] = {
          id: barvy[br_ix]+'-'+hodnoty[hd_ix],
          barva: br_ix, 
          hodnota: hd_ix
        };
      }
    }
    while (karty.length > 0) {
      var rnd_ix = Math.floor(Math.random()*karty.length)
      this.karty.push(karty.splice(rnd_ix, 1)[0]);
    }
  },
  give_cards: function() {
    var kr_trideni = 0;
    for(var ix in [1,2,3,4]) {
      for(var hr_ix in this.hraci) {
        this.hraci[hr_ix].vruce.push(kr_trideni++);
      }
    }
    while(kr_trideni<this.karty.length) {
      this.nastole.push(kr_trideni++);
    }
    this.dalsi_barva = this.karty[this.nastole[0]].barva;
    this.lizani = (this.hodnotaKarty(this.nastole[0]) == '7') ? 2 : 0;
    this.cekani = (this.hodnotaKarty(this.nastole[0]) == 'A');
  },
  povolenaKarta: function(karta) {
    var karta_barva = this.karty[karta].barva;
    var nastole_barva = this.dalsi_barva;
    var karta_hodnota = this.hodnotaKarty(karta);
    var nastole_hodnota = this.hodnotaKarty(this.nastole[0]);

    var povoleno = false;
    if (this.lizani > 0 && nastole_hodnota == '7') {
      povoleno = (karta_hodnota == nastole_hodnota)
    }
    else
    if (this.cekani && nastole_hodnota == 'A') {
      povoleno = (karta_hodnota == nastole_hodnota)
    }
    else {
      povoleno = ( this.isColorCard(karta)     // svrsek muze vzdycky
        || karta_barva == nastole_barva
        || karta_hodnota == nastole_hodnota
        );
    };
    return (povoleno? 1 : 0);
  },
  nextPlayer: function() {
    this.hraci.push(this.hraci.shift());
  },
  hodnotaKarty: function(ix) {
    return hodnoty[this.karty[ix].hodnota];
  },
  barvaKarty: function(ix) {
    return barvy[this.karty[ix].barva];
  },
  isColorCard: function(ix) {
    return this.hodnotaKarty(ix)=='Q';
  },
  actualPlayer: function() {
    return this.hraci[0];
  },
  endOfGame: function() {
    return this.actualPlayer().vruce.length==0;
  },
  povoleneLizani: function() {
    var nastole_hodnota = this.karty[this.nastole[0]].hodnota;

    var povoleno = 1;
    if (this.lizani > 0 && hodnoty[nastole_hodnota] == '7') {
      povoleno = this.lizani;
    }
    else if (this.cekani && hodnoty[nastole_hodnota] == 'A') {
      povoleno = 0;
    };
    return povoleno;
  },
  kazdyHrac: function(fn) {
    for(var hr_ix in this.hraci) {
      fn(hr_ix, this.hraci[hr_ix]);
    };
  },
  hraciForNextGame: function() {
    var nextGame = [];
    if (this.hraci && this.hraci.length > 0) {
      for(var hr_ix in this.hraci) {
        nextGame.push({
          name: this.hraci[hr_ix].name,
          bot: this.hraci[hr_ix].bot
        });
      };
      nextGame.push(nextGame.shift()); // winner goes last
    };
    return nextGame;
  },
  zapisHistorii: function(lizal, karta, barva) {
    this.hraci[0].tah = {
      'lizal': lizal, 
      'karta': karta, 
      'barva': barva
    };
    this.historie.unshift({
      'hrac': this.hraci[0].name, 
      'lizal': lizal, 
      'karta': karta, 
      'barva': barva
    });
  },
  dalsiTah: function(volba, barva) {
    if (volba=='') {
      this.cekani = false;
      this.zapisHistorii(0, -1, -1);
    }
    else {
      var volba_ix = parseInt(volba);
      if (volba_ix < 0) { // liznout ze stolu
        var karty = -volba_ix;
        this.zapisHistorii(karty, -1, -1);
        while (karty > 0) {
          this.hraci[0].vruce.push(this.nastole.pop());
          karty--;
        };
        this.lizani = 0;
      }
      else {               // vyhodit zvolenou kartu
        var idx = this.hraci[0].vruce.indexOf(volba_ix);
        if (idx != -1) {
          this.hraci[0].vruce.splice(idx, 1);
          this.nastole.unshift(volba_ix);
          if (hodnoty[this.karty[volba_ix].hodnota]=='7') {
            this.lizani += 2;
          };
          if (hodnoty[this.karty[volba_ix].hodnota]=='A') {
            this.cekani = true;
          };
          if (hodnoty[this.karty[volba_ix].hodnota]=='Q') {
            this.dalsi_barva = parseInt(barva);
          }
          else {
            this.dalsi_barva = this.karty[this.nastole[0]].barva;
          };
          this.zapisHistorii(0, volba_ix, this.dalsi_barva);
        };
      };
    };
  }
};

