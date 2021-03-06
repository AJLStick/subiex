/*  crypto.js by David Jerome @GlassToeStudio - GlassToeStudio@gmail.com

    9 September, 2017
    https://github.com/GlassToeStudio
    http://glasstoestudio.weebly.com/
    https://twitter.com/GlassToeStudio

    ------------------------------------------------------------------------
    Return current price of a given crypto-currency in $US

    The following command is uisng a free API from https://www.cryptocompare.com/ (CC BY-NC 3.0)
    The API request can be found here: https://www.cryptocompare.com/api#-api-data-price-

    Usage:
      !price <COIN> (COIN)...

    Example:
      !price BTC ETH

      ------ Current exchange rates for 1 BTC ------
                ETH.......... 14.47

    ------------------------------------------------------------------------

*/
const Subiex = require('../bot.js')
const request = require('request')
const Util = require('util')

Subiex.registerCommand('crypto', 'default', (message, bot) => {
  //  Init variables
  let symbols = (message.content.split(' ')).map(function (x) { return x.toUpperCase() })
  let fromSymbol = (symbols.shift())
  if (symbols.length === 0) symbols.push('USD')
  CrytpoComparePrice(fromSymbol, symbols, message)
}, ['crypt', 'price'], 'Get latest crypto exchange price in USD, or in other cryptos.', '<crypto-currency ticker> (crypto-currency ticker )')

/**
 * Return the exchange rate for one crypto currency in terms of other currencies.
 * @param  {string} fsym
 * @param  {string[]} tsyms
 * @param  {string} messge
 */
function CrytpoComparePrice (fsym, tsyms, message) {
  //  The API call string.
  let cryptoComparePrice = 'https://min-api.cryptocompare.com/data/price?fsym=' + fsym + '&tsyms=' + tsyms
  request(cryptoComparePrice, function (error, response, body) {
    if (error) message.channel.send('Not a valid crypto currency, try BTC or ETH.')
    let finalMessage = '**~~------~~** __Current exchange rates for 1 ' + fsym + '__ **~~------~~**\n```'
    try {
      let responseBody = JSON.parse(body)
      for (let sym = 0; sym < tsyms.length; sym++) {
        let price = responseBody[tsyms[sym]]
        if (price === undefined) price = '¯\\_(ツ)_/¯' // Not valid crypto currency ¯\_(ツ)_/¯
        if (tsyms[sym] === 'USD') price = '$' + price
        finalMessage += Util.format('%s %s\n', pad('.............', tsyms[sym], false), price)
      }
      message.channel.send(finalMessage + '```')
    } catch (error) {
      message.channel.send('<:doggo:328259712963313665>' + ' Not a valid crypto-currency, try BTC or ETH.')
    }
  })
}

/**
 * Pad a string on the left or right for better alignment.
 * @param  {string} pad
 * @param  {string} str
 * @param  {boolean} padLeft
 */
function pad (pad, str, padLeft) {
  if (typeof str === 'undefined') return pad
  if (padLeft) return (pad + str).slice(-pad.length)
  else return (str + pad).substring(0, pad.length)
}