window.App = Ember.Application.create();

App.IndexController = Ember.ObjectController.extend(Ember.SimplePaginationMixin,
	Ember.SimplePaginationArrayMixin,
{
	queryParams: ['page'],


	data: [
		{
			title: "Harry Potter",
			price: 12.99
		}, {
			title: "Song Of Ice",
			price: 19.99
		}
		, {
			title: "Name Of The Wind",
			price: 10.99
		}, {
			title: "Redemption Ark",
			price: 21.99
		}, {
			title: "Leviathan Wakes",
			price: 10.99
		}, {
			title: "Eragon",
			price: 18.99
		}, {
			title: "The Elves",
			price: 12.99
		}, {
			title: "The Orks",
			price: 10.99
		}, {
			title: "The Trolls",
			price: 13.99
		},{
			title: "Harry Potter",
			price: 12.99
		}, {
			title: "Song Of Ice",
			price: 19.99
		}, {
			title: "Name Of The Wind",
			price: 10.99
		}, {
			title: "Redemption Ark",
			price: 21.99
		}, {
			title: "Leviathan Wakes",
			price: 10.99
		}, {
			title: "Eragon",
			price: 18.99
		}, {
			title: "The Elves",
			price: 12.99
		}, {
			title: "The Orks",
			price: 10.99
		}, {
			title: "The Trolls",
			price: 13.99
		}
	]
});