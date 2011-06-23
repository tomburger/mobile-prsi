var texts = {
  'at_least_2_players_needed': { EN: 'You need to name at least two players', CZ: 'Zadej jména alespoň dvou hráčů' },
  'player_on_move({1})': { EN: 'Currently player {1} is on move', CZ: 'Teď je na tahu hráč {1}' },
  'take_cards({1})': { EN: 'Take {1}', CZ: 'Lízni {1}' },
  'taken_cards:{1}': { EN: 'Taken {1}', CZ: 'Líznul {1}' },
  'skipped_due_a': { EN: 'Skipped', CZ: 'Vynechal' },
  'no_moves_yet': { EN: 'No moves done yet', CZ: 'Ještě nikdo nezahrál' },
  'decide_on_move_first': { EN: 'Decide about move first', CZ: 'Nejprv vyber jak budeš hrát' },
  '1_card': { EN: '1 card', CZ: '1 karta' },
  '2_4_cards{1}': { EN: '{1} cards', CZ: '{1} karty' },
  'more_cards{1}': { EN: '{1} cards', CZ: '{1} karet' },
  'game_header1': { EN: 'MauMau', CZ: 'Prší' },
  'game_header2': { EN: 'Mobile', CZ: 'na mobil' },
  'player_intro': { EN: 'MauMau is game for 2-5 players.', CZ: 'Prší je oblíbená česká karetní hra pro 2-5 hráčů' },
  'player_1': { EN: 'Player #1', CZ: 'První hráč' },
  'player_2': { EN: 'Player #2', CZ: 'Druhý hráč' },
  'player_3': { EN: 'Player #3', CZ: 'Třetí hráč' },
  'player_4': { EN: 'Player #4', CZ: 'Čtvrtý hráč' },
  'player_5': { EN: 'Player #5', CZ: 'Pátý hráč' },
  'start_game_button': { EN: 'Start game', CZ: 'Začni hru' },
  'add_one_player': { EN: 'Add one player', CZ: 'Přidat hráče' },
  'add_one_bot': { EN: 'Add autoplayer', CZ: 'Přidat automat' },
  'title_cards_on_desk': { EN: 'Cards on desk', CZ: 'Karty co jsou na stole' },
  'title_select_next_color': { EN: 'Select the next color', CZ: 'Vyber další barvu' },
  'title_cards_in_hand': { EN: 'Cards in your hand', CZ: 'Karty co máš v ruce' },
  'ready_next_button': { EN: 'Move on to next player', CZ: 'Na tahu je další hráč' },
  'title_other_players': { EN: 'Other players', CZ: 'Ostatní hráči' },
  'next_player_is': { EN: 'Next player is', CZ: 'Další hráč je' },
  'when_ready_click_button': { EN: 'When ready, click on button', CZ: 'Až budeš připraven, ťukni na tlačítko' },
  'ready_for_game_button': { EN: 'Ready for game', CZ: 'Připraven další tah' },
  'and_winner_is': { EN: 'WINNER', CZ: 'VÍTĚZ' },
  'celebrate_hint': { EN: 'Celebrate a bit and start another game', CZ: 'Trochu to oslavte, a šup na odvetu' },
  'new_game_button': { EN: 'New game', CZ: 'Nová hra' },
  
  'about_contact': { EN: 'Contact', CZ: 'Kontakt' },
  'facebook_homepage': { EN: 'Game has homepage on Facebook', CZ: 'Hra má stránku na Facebooku' },
  'twitter_contact': { EN: 'You can also contact author on Twitter', CZ: 'S autorem se také můžete spojit přes Twitter' },
  
  'about_rules': { EN: 'Rules of game', CZ: 'Pravidla' },

  'rules_1': {
  EN: 'Each player gets 4 cards, he holds them so that no one can see them', 
  CZ: 'Každý hráč obdrží na začátku 4 karty, které drží tak, aby je ostatní neviděli' },

  'rules_2': {
  EN: 'Next card is placed on desk showing the color',
  CZ: 'Další karta z balíčku se položí na stůl barvou nahoru' },

  'rules_3': {
  EN: 'Player, ready to play, puts on desk one of the cards in his hand', 
  CZ: 'Hráč, který je na řadě, vyhodí na stůl jednu z karet, které má v ruce' },

  'rules_4': {
  EN: 'Card must be either the same color, or the same value, as the last card put on the desk', 
  CZ: 'Karta musí být buď stejné barvy, nebo stejné hodnoty, jako poslední vyhozená karta' },

  'rules_5': {
  EN: 'If player has no such a card, he must take one card from pack', 
  CZ: 'Pokud hráč takovou kartu v ruce nemá, musí si líznout jednu kartu z balíčku' },

  'rules_6': {
  EN: 'Winner is who has no cards in his hand', 
  CZ: 'Vítězí ten, komu v ruce nezbude žádná karta' },

  'about_specials': { EN: 'Special cards', CZ: 'Speciální karty' },

  'specials_1': {
  EN: 'If player puts Seven, next player must take 2 cards from pack', 
  CZ: 'Jestliže hráč vyhodí sedmičku, musí si další hráč líznout 2 karty' },
   
  'specials_2': {
  EN: 'If next player has Seven in his hand, he can use it', 
  CZ: 'Pokud následující hráč má v ruce sedmičku, může jí použít' },
   
  'specials_3': {
  EN: 'Next in sequence must then take 4 cards from pack, if he has no Seven',  
  CZ: 'Další v pořadí si potom musí líznout 4 karty, pokud též nemá a nepoužije sedmičku' },

  'specials_4': {
  EN: 'If player puts an Ace card, next player skips his turn', 
  CZ: 'Jestliže hráč vyhodí eso (A), další hráč stojí' },

  'specials_5': {
  EN: 'If next player has also Ace card and uses it, further next player skips', 
  CZ: 'Má-li následující hráč také eso a použije ho, stojí další hráč v pořadí' },

  'specials_6': {
  EN: 'If player has Queen, he can puts it on any arbitrary card', 
  CZ: 'Jestliže má hráč královnu (Q), může jí položit na libovolnou kartu' },

  'specials_7': {
  EN: 'After puting it, player can choose color for next player to obey', 
  CZ: 'Po vyhození hráč volí barvu, kterou se musí řídit následující hráč' }
    
};
