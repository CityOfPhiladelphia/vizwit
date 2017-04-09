require('babel-polyfill')
var $ = require('jquery')
var _ = require('underscore')
var Backbone = require('backbone')
var vizwit = require('./vizwit')

var vent = _.clone(Backbone.Events)
var fieldsCache = {}

$(document).ready(function () {
  $('script.vizwit').each(function (scriptTag) {
    var parentNode = $(this).parent()
    var config = JSON.parse($(this).html())
    render(parentNode, config)
  })
})

function render (containerEl, config) {
  config.forEach(function (cards) {
    var rowEl = $('<div class="row"></div>')
    containerEl.append(rowEl)

    var cardSize = Math.round(12 / cards.length)

    cards.forEach(function (config) {
      var cardEl = $('<div class="col-md-' + cardSize + '"></div>')
      cardEl.css('min-height', '240px')
      rowEl.append(cardEl)

      vizwit.init(cardEl, config, {
        vent: vent,
        fieldsCache: fieldsCache
      })
    })
  })
}
