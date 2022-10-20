import {
  assertEquals,
  assertArrayIncludes
} from 'https://deno.land/std/testing/asserts.ts'

import { Card, CardDeck, CardHand, BlackJack, Player } from './blackjack.js'

/* #region Card Deck */

const card_in = (deck, card) => deck.some((c) => c.name === card.name)

// Complete Deck of cards
// test to see if the generated deck of cards contains all the cards
Deno.test(
  'generate_deck(): has a complete deck of cards been generated',
  () => {
    const reference_deck = [
      'CA',
      'C2',
      'C3',
      'C4',
      'C5',
      'C6',
      'C7',
      'C8',
      'C9',
      'C10',
      'CJ',
      'CQ',
      'CK',
      'DA',
      'D2',
      'D3',
      'D4',
      'D5',
      'D6',
      'D7',
      'D8',
      'D9',
      'D10',
      'DJ',
      'DQ',
      'DK',
      'HA',
      'H2',
      'H3',
      'H4',
      'H5',
      'H6',
      'H7',
      'H8',
      'H9',
      'H10',
      'HJ',
      'HQ',
      'HK',
      'SA',
      'S2',
      'S3',
      'S4',
      'S5',
      'S6',
      'S7',
      'S8',
      'S9',
      'S10',
      'SJ',
      'SQ',
      'SK'
    ]
    const test_deck = new CardDeck().generate_deck()
    assertEquals(
      reference_deck,
      test_deck.map((c) => c.name)
    )
  }
)

// Draw Card
// returns a card
// remove card from deck
// add to the drawn_cards pile
Deno.test('draw_card(): draws a card from the deck and removes it', () => {
  const card_deck = new CardDeck()
  const drawn_card = card_deck.draw_card()
  assertEquals(card_in(card_deck.deck, drawn_card), false)
  assertEquals(card_in(card_deck.drawn_cards, drawn_card), true)
})

// return card
// from drawn_cards to the deck
Deno.test('return_card():', () => {
  const card_deck = new CardDeck()
  const drawn_card = card_deck.draw_card()

  assertEquals(card_in(card_deck.deck, drawn_card), false)
  assertEquals(card_in(card_deck.drawn_cards, drawn_card), true)

  card_deck.return_card(drawn_card)

  assertEquals(card_in(card_deck.deck, drawn_card), true)
  assertEquals(card_in(card_deck.drawn_cards, drawn_card), false)
})

/* #endregion */

/* #region Card*/

// check value
// checks if stated card gives the expected value
Deno.test(
  'check_value(): checks if stated card gives the expected value',
  () => {
    // const card_deck = new CardDeck()
    // const drawn_card = card_deck.draw_card()
    const ace_of_diamonds = new Card('D', 'A')
    const two_of_hearts = new Card('H', '2')
    const jack_of_spades = new Card('S', 'J')
    const eight_of_clubs = new Card('C', '8')
    assertEquals(ace_of_diamonds.get_value(), 11)
    assertEquals(two_of_hearts.get_value(), 2)
    assertEquals(jack_of_spades.get_value(), 10)
    assertEquals(eight_of_clubs.get_value(), 8)
  }
)

/* #endregion */

/* #region Card Hand*/

// Points for
// checks it the cards in the hand gives the correct values
Deno.test('points_for(): the total points of cards in hand', () => {
  const ace_of_diamonds = new Card('D', 'A')
  const two_of_hearts = new Card('H', '2')
  const jack_of_spades = new Card('S', 'J')
  const eight_of_clubs = new Card('C', '8')

  const test_hand_one = new CardHand([ace_of_diamonds, two_of_hearts])
  const test_hand_two = new CardHand([
    two_of_hearts,
    jack_of_spades,
    eight_of_clubs
  ])

  assertEquals(test_hand_one.points_for(), 13)
  assertEquals(test_hand_two.points_for(), 20)
  assertEquals(
    test_hand_one.points_for([
      new Card('D', 'A'),
      new Card('H', '2'),
      new Card('C', '7')
    ]),
    20
  )
})

// Names of Cards
// cards have the correct Type and rank = its name
Deno.test('names(): the names of all cards in hand', () => {
  const test_hand = new CardHand([
    new Card('D', 'A'),
    new Card('H', '7'),
    new Card('D', '2')
  ])

  assertEquals(test_hand.names(), ['DA', 'H7', 'D2'])
  assertEquals(
    test_hand.names([
      new Card('D', 'A'),
      new Card('H', '7'),
      new Card('S', '2'),
      new Card('D', '1'),
      new Card('H', 'K')
    ]),
    ['DA', 'H7', 'S2', 'D1', 'HK']
  )
})

// Add Card
// adds a card to the hand
// checks if it is added
Deno.test('add(): adds card to hand', () => {
  const test_hand = new CardHand([new Card('C', '2'), new Card('D', 'J')])
  const test_card = new Card('S', '6')
  test_hand.add(test_card)
  assertArrayIncludes(test_hand.cards, test_card)
})

/* #endregion */

/* #region Player*/

// Get points

// Draw cards

/* #endregion */

/* #region BlackJack*/

// Get Dealer
// when calling dealer should return the first player, aka, the dealer
// Deno.test('get play(): ')

// Play

// add player
// test to see if add_player() adds a new player to the players array
// Deno.test('add_player(): adds a new player to the game', () => {
//   const game = new BlackJack('Dealer Dave')
//   const test_player = new Player('TPlayer')
//   game.add_player(test_player)
//   assertArrayIncludes(game.players, test_player)
//   assertArrayIncludes(game.players, new Player('Dealers Dave'))
// })

// Player input

// Dealer AI

// Compare Hands

/* #endregion */
