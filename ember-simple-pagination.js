Ember.SimplePaginationMixin = Ember.Mixin.create({
	page: 1,
	pageSize: 10,
	total: null,
	paginatedContent: null,
	paginationItemCount: 4,

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
		var _this = this;

		if(this.get('pageStart') == null) {
			return null;
		}

		this.didRequestRange().then(function(data) {
			_this.set('paginatedContent', data);
		}, function(cause) {
			//TODO: proper error handling
		});
	}.observes('pageStart').on('init'),

	paginationItems: function() {
		var result = [],
			totalPages = this.get('totalPages'),
			page = parseInt(this.get('page')),
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
	}.property('page', 'itemCount', 'totalPages'),

	previousPage: function() {
		var page = parseInt(this.get('page'));

		if(page < 1) {
			return null;
		}

		return page - 1;
	}.property('page'),

	nextPage: function() {
		var page = parseInt(this.get('page'));

		if(Ember.isEmpty(this.get('totalPages')) ||
			page >= this.get('totalPages'))
		{
			return null;
		}

		return page + 1;
	}.property('page', 'totalPages'),
	
	didRequestRange: Ember.K,
	didRequestTotal: Ember.K
});

Ember.SimplePaginationCachedMixin = Ember.Mixin.create({
	rangeCache: {},

	onPageChanged: function() {
		var _this = this,
			key;

		if(this.get('pageStart') == null) {
			return null;
		}

		key = this.get('pageStart')+'+'+this.get('pageSize');
		if(Ember.isEmpty(this.rangeCache[key])) {
			this.didRequestRange().then(function(data) {
				_this.get('rangeCache')[key] = data;
				_this.set('paginatedContent', data);
			}, function(cause) {
				//TODO: proper error handling
			});
		} else {
			this.set('paginatedContent', this.rangeCache[key]);
		}
	}.observes('pageStart').on('init'),

	clearCache: function() {
		this.set('rangeCache', {});
	}
});

Ember.SimplePaginationArrayMixin = Ember.Mixin.create({
	didRequestRange: function() {
		var _this = this,
			pageStart = this.get('pageStart'),
			pageEnd = this.get('pageEnd');

		return new Ember.RSVP.Promise(function(resolve, reject) {
			resolve(_this.get('data').slice(pageStart - 1, pageEnd));
		});
	},

	didRequestTotal: function() {
		var _this = this;

		return new Ember.RSVP.Promise(function(resolve, reject) {
			resolve(_this.get('data').length);
		});
	}
});
