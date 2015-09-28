var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Card = require('./card');
var LoaderOn = require('../util/loader').on;
var LoaderOff = require('../util/loader').off;
var Template = require('../templates/callout.html');
var numbro = require('numbro');
var moment = require('moment');
	
module.exports = Card.extend({
	initialize: function(options) {
		Card.prototype.initialize.apply(this, arguments);
		
		// Save options to view
		options = options || {};
		this.vent = options.vent || null;
		this.filteredCollection = options.filteredCollection || null;
		
		// Listen to vent filters
		this.listenTo(this.vent, this.collection.dataset + '.filter', this.onFilter);
		
		// Listen to collection
		this.listenTo(this.collection, 'sync', this.render);
		this.listenTo(this.filteredCollection, 'sync', this.render);
		
		// Loading indicators
		this.listenTo(this.collection, 'request', LoaderOn);
		this.listenTo(this.collection, 'sync', LoaderOff);
		this.listenTo(this.filteredCollection, 'request', LoaderOn);
		this.listenTo(this.filteredCollection, 'sync', LoaderOff);
		
		this.collection.fetch();
	},
	render: function() {
		var data = {
			label: this.filteredCollection.getFilters().length ? this.filteredCollection.at(0).get('label') : this.collection.length ? this.collection.at(0).get('label') : null,
			value: this.collection.length ? this.collection.at(0).get('value') : null,
			filteredValue: this.filteredCollection.getFilters().length ? this.filteredCollection.at(0).get('value') : null
		};
		
		// Apply formatting if specified in config
		if(this.config.labelFormat) {
			if(data.label !== null) data.label = moment(new Date(data.label)).format(this.config.labelFormat);
		}
		
		if(this.config.valueFormat) {
			if(data.value !== null) data.value = numbro(data.value).format(this.config.valueFormat);
			if(data.filteredValue !== null) data.filteredValue = numbro(data.filteredValue).format(this.config.valueFormat);
		}
		 
		this.$('.card-content').empty().append(Template(data));
	},
	// When another chart is filtered, filter this collection
	onFilter: function(data) {
		this.filteredCollection.setFilter(data);
		this.filteredCollection.fetch();
		this.renderFilters();
	}
});