import shuffle from './support/shuffle.js'
import { getDefaultLogger } from './support/logging.ts'
import { parse } from 'https://deno.land/std/flags/mod.ts'

const logger = await getDefaultLogger()

export class CardDeck {
  constructor(
    types = ['C', 'D', 'H', 'S'],
    values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
  ) {
    this.types = types
    this.values = values
    this.drawn_cards = []
    this.deck = []
  }

  generate_deck() {
    console.log('Generating deck...')

    this.types.forEach((type) => {
      this.values.forEach((value) => {
        let card = new Card(type, value)
        this.deck.push(card)
      })
    })

    return this.deck
  }

  shuffle(seed = Date.now()) {
    return shuffle(this.deck, seed)
  }

  draw_card() {
    if (this.deck.length === 0) this.generate_deck()

    let card = this.deck.pop()

    if (card === undefined) console.log(card)
    else {
      this.drawn_cards.push(card)
    }

    return card
  }

  return_card(card) {
    let c_index = this.drawn_cards.findIndex((c) => c === card)
    let returned_card = this.drawn_cards.splice(c_index)

    this.deck.push(returned_card[0])
  }
}

export class Card {
  constructor(type = '', rank = '') {
    this.rank = rank
    this.type = type
    this.name = `${this.type}${this.rank}`
  }

  show_card() {
    if (this.hidden === true) this.hidden = false
  }

  get_value() {
    if (this.hidden) return 0
  
    let r = parseInt(this.rank)

    const is_ace = (r) => r === 'A'
    const is_J_K_Q = (r) => r === 'J' || r === 'K' || r === 'Q'

    if (is_ace(this.rank)) return 11

    if (is_J_K_Q(this.rank)) return 10

    if (isNaN(r)) return this.rank
    
    return r
  }
}

export class CardHand {
  constructor(cards = []) {
    this.cards = cards
  }

  get points() {
    if (this.cards.length > 0 && this.points === 0) {
      return this.points_for()
    }

    return this._points
  }
  set points(points) {
    this._points = points
  }


  points_for(cards = this.cards) {
    let points = 0
    cards.forEach((c) => {
      points += c.get_value()
    })
    return points
  }

  names(cards = this.cards) {
    return cards.map((c) => c.name)
  }

  add(cards) {
    this.points += cards.map((c) => c.get_value)
    this.cards.push(cards)
  }
}

export class Player {
  constructor(name = '', hand = new CardHand(), deck = new CardDeck()) {
    this.name = name
    this.hand = hand
    this.deck = deck
  }

  get points() { return this.hand.points_for() }

  get card_names() { return this.hand.names() }

  get ranking() { return this._ranking }

  set ranking(rank) {
    const n_rank = parseInt(rank)
    const is_valid = () => isNaN(n_rank) && n_rank > 0
    
    if (!is_valid()) {
      alert(`Invalid ranking: ${rank} is not an Interger`)
    }

    this._ranking = n_rank
  }

  draw_cards(amount) {
    let picked_up = 0
    while (picked_up < amount) {
      this.hand.add(deck.draw_card())
      picked_up++
    }
  }
}

export class BlackJack {
  constructor(dealers_name = 'John', players = [], l_msg = 'You lose!', t_msg = 'You win!', w_msg = 'Draw!') {
    this.players = players
    this.playing = false
    this.deck = new CardDeck()
    this.dealer_name = dealers_name
    this.LOSE_MESSAGE = l_msg
    this.WIN_MESSAGE = t_msg
    this.DRAW_MESSAGE = w_msg
  }

  get dealer() {
    const n_players = this.players.length
    if (n_players === 0) this.add_player(this.dealer_name)
    return this.players[0]
  }

  play(seed) {
    this.playing = true
    this.deck.shuffle(seed)

    while (this.playing) {
      for (let player of this.players) {
        this.hands.push(this.take_turn(player))
      }
      this.compare_hands(this.players.map((p) => p.hands))
      this.playing = false
    }
  }

  add_player(name) {
    const n_players = this.players.length

    if (n_players === 0) this.players.push(this.dealer)

    this.players.push(new Player(name, (deck = this.deck)))
  }

  take_turn(player) {
    let taking_turn = true

    while (taking_turn) {
      if (player.name === this.dealer_name) {
        // Dealers turn
        player.pick_up_card(2)
        this.show_hand(player)
        taking_turn = this.dealer(player)
      } else {
        // Players turn
        player.pick_up_card(2)
        this.show_hand(player)
        taking_turn = this.input(player)
      }
    }
    return player.hand
  }

  input(player, action) {
    action = window.prompt(
      `${player.name}, What do you want to do? ("hit" or "stick")`
    )
    switch (action) {
      case 'hit': {
        this.deal_card_to(player)
        return true
      }
      case 'stick': {
        return false
      }
      default: {
        window.alert(`Unknown action: ${action}. try entering "hit" or "stick"`)
        return true
      }
    }
  }

  dealer(player) {
    const Dealer_Move = 'The Dealer has'
    let points = player.hand.points_for()

    const blackjack = () => points === 21,
          draw_card = () => points <= 15 && points >= 5,
          draw_card_two = () => points <= 5 && points >= 15

    // Dealer AI
    if (blackjack()) {
      logger.info(`${Dealer_Move} a Blackjack!`)
    } else if (draw_card()) {
      logger.info(`${Dealer_Move} drawn a card!`)
      player.hand.add(this.deck.draw_card())
    } else if (draw_card_two()) {
      logger.info(`${Dealer_Move} drawn 2 cards!`)
      player.hand.add([this.deck.draw_card(), this.deck.draw_card()])
    }

    return false
  }

  show_hand(player) {
    logger.info(
      `${player.name}'s hand is ${player.card_names().join(', ')}\n(${player.points} points)`
    )
  }

  compare_hands() {
    //let best_score = 0
    //for (var i = 0; i < players.length; i++) {
    //  this.players[i].points
    //}

    let dealers_points = Players[0].points
    let players_points = Players[1].points

    const win = players_points > dealers_points || dealers_points > 21
    const tie = players_points === dealers_points
    const lose = players_points < dealers_points || players_points > 21

    if (win) {
      logger.info(this.WIN_MESSAGE)
    } else if (tie) {
      logger.info(this.DRAW_MESSAGE)
    } else if (lose) {
      logger.info(this.LOSE_MESSAGE)
    }
  }
}

if (import.meta.main) {
  const { seed } = parse(Deno.args)
  const game = new BlackJack()
  game.add_player('Lily')
  game.play(seed)
  // play({ seed })
}
