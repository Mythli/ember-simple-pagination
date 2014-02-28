Ember.PaginationMixin = Ember.Mixin.create({
	page: 1,
	pageSize: 10,
	rangeCache: {},
	total: null,
	paginatedContent: null,


	init: function() {
		var _this = this;

		this.didRequestTotal().then(function(total) {
			_this.set('total', total);
		}, function(cause) {
			//TODO: proper error handling
		});
	},

	pageStart: function() {
		var newPageStart,
			page = parseInt(this.get('page'));

		if(Ember.isEmpty(this.get('total'))) {
			return null;
		}
		newPageStart = ((page * this.get('pageSize')) - this.get('pageSize')) + 1;
		if(newPageStart > this.get('total') ||  newPageStart < 1) {
			return null;
		}
		return newPageStart;
	}.property('page', 'total'),

	pageEnd: function() {
		if(this.get('pageStart') == null) {
			return null;
		}

		var newPageEnd = this.get('pageStart') + this.get('pageSize');
		if(newPageEnd >= this.get('total')) {
			newPageEnd = this.get('total') + 1;
		}

		return newPageEnd - 1;
	}.property('pageStart'),

	totalPages: function() {
		return Math.ceil(this.get('total') / this.get('pageSize'));
	}.property('total'),

	onPageChanged: function() {
		var _this = this,
			key;

		if(this.get('pageStart') == null) {
			return null;
		}

		key = this.get('pageStart')+'+'+this.get('pageSize');

		// Check if page is already cached or should be requested from the server
		if(Ember.isEmpty(this.rangeCache[key])) {
			this.didRequestRange(this.get('pageStart') - 1, this.get('pageSize')).then(function(data) {
				// Cache data in local array
				_this.rangeCache[key] = data;
				_this.set('paginatedContent', data);
			}, function(cause) {
				//TODO: proper error handling
			});
		} else {
			_this.set('paginatedContent', _this.rangeCache[key]);
		}
	}.observes('pageStart').on('init'),

	didRequestRange: Ember.K,
	didRequestTotal: Ember.K
});

Ember.PaginationView = Ember.View.extend({
	templateName: 'components/pagination',
	paginationItemCount: 4,

	paginationItems: function() {
		var result = [],
			totalPages = this.get('controller.totalPages'),
			page = parseInt(this.get('controller.page')),
			paginationItemCount = this.get('paginationItemCount'),
			length = (totalPages >= paginationItemCount) ? paginationItemCount : totalPages,
			startPos;

		if (page  <= Math.floor(paginationItemCount / 2) + 1 || totalPages <= paginationItemCount) {
			startPos = 1;
		} else {
			// Check to see if in the last section of pages
			if (page >= totalPages - (Math.ceil(paginationItemCount / 2) - 1)) {
				// Start pages so that the total number of pages is shown and the last page number is the last page
				startPos = totalPages - ((paginationItemCount - 1));
			} else {
				// Start pages so that current page is in the center
				startPos = page - (Math.ceil(paginationItemCount / 2) - 1);
			}
		}

		// Go through all of the pages and make an entry into the array
		for (var i = 0; i < length; i++) {
			var paginationItem = i + startPos;
			result.push({page: paginationItem, isActive: paginationItem == page});
		}

		return result;
	}.property('controller.page', 'itemCount', 'controller.totalPages'),

	previousPage: function() {
		if(this.get('controller.page') < 1) {
			return null;
		}

		return this.get('controller.page') - 1;
	}.property('controller.page'),

	nextPage: function() {
		if(Ember.isEmpty(this.get('controller.totalPages')) ||
			this.get('controller.page') >= this.get('controller.totalPages'))
		{
			return null;
		}

		return parseFloat(this.get('controller.page')) + 1;
	}.property('controller.page', 'controller.totalPages')
});