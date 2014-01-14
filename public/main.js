//@uthor: sahel mastoureshgh
//Date: November 2013

var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "about"             : "about",
        "contact"           : "contact"
    },

	home: function() {
     	$('#homeId').addClass("active");	
      	$('#contactId').removeClass("active");	
   	    $('#aboutId').removeClass("active");	
		$('#AboutTag').hide();
		$('#ContactTag').hide();
		$('#mainNews').show();
		$('#newsResult').show();

	},
    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
            $('#AboutTag').append(this.aboutView.render().el);
        }
     	$('#aboutId').addClass("active");	
      	$('#contactId').removeClass("active");	
   	    $('#homeId').removeClass("active");	
        $('#AboutTag').show();
        $('#ContactTag').hide();
        $('#mainNews').hide();
        $('#newsResult').hide();
		
        
    },
    contact: function () {
    	 if (!this.contactView) {
            this.contactView = new ContactView();
            $('#ContactTag').append(this.contactView.render().el);
        }
	 $('#contactId').addClass("active");	
	 $('#aboutId').removeClass("active");	
	 $('#homeId').removeClass("active");	
     $('#ContactTag').show(); 	
     $('#AboutTag').hide();
     $('#mainNews').hide(); 	
     $('#newsResult').hide();	
       
    }

});

AboutView = Backbone.View.extend({

    

	template: _.template($('#AboutMe').html()),



	render: function() {
		this.$el.html(this.template());

		return this;
	}

});
ContactView = Backbone.View.extend({

    

	template: _.template($('#ContactMe').html()),



	render: function() {
		this.$el.html(this.template());

		return this;
	}

});




   

// News Model
var News = Backbone.Model.extend({
	defaults: {
		title: '',
		date: '',
		summary: '',
		link: '',
		guid: '',
		newsSource: ''

	}
});

// A List of AllNews
var AllNewsCollection = Backbone.Collection.extend({
	model: News
});


// View for all allnews
var AllNewsView = Backbone.View.extend({
	tagName: 'ul',

	initialize: function() {

		this.collection.on('add', this.render, this);

	},

	render: function() {
		this.$el.empty();
		this.collection.each(this.addOne, this);
		this.$el.find('li:first-child').remove(0);

		return this;
	},
	//add each news to view
	addOne: function(news) {
		var newsView = new NewsView({
			model: news
		});
		this.$el.append(newsView.render().el);


	}
});

// The View for a News
var NewsView = Backbone.View.extend({
	tagName: 'li',

	template: _.template($('#newsTemplate').html()),



	render: function() {
		this.$el.html(this.template(this.model.toJSON()));

		return this;
	}


});

// get news from diffrent rss and add it to collection 
//global function

function feedParser(url, source,number) {
	var allCollection = new AllNewsCollection({});
	newsName = {
		'AP': 'Associated Press'
	};

	$.jGFeed(url,
		function(feeds) {
			// Check for errors
			if (!feeds) {
				// there was an error
				return false;
			}
			// do whatever you want with feeds here
            //used regular expression to get what I want from feeds
			for (var i = 0; i < feeds.entries.length; i++) {
				var entry = feeds.entries[i];
				var newssrc;
				var myTitle;
				var newlink;
				if (source == 'google') {
					entry.link = entry.link.match(/url=[^\s]+/g);
					newlink = entry.link[0].substring(4);
					myTitle = entry.title.match(/.* - /g);
					myTitle = myTitle[0].substring(0, myTitle[0].length - 2);
					newssrc = entry.title.match(/ - .*/g);
					newssrc = newssrc[0].substring(2);
				}
				if (source == 'yahoo') {
					newlink = entry.link;
					myTitle = entry.title;
					newssrc = entry.contentSnippet.match(/\(.*\) /g);
					if (newssrc != null) {
						newssrc = newssrc[0].substring(1, newssrc[0].length - 2);
						if (newssrc == 'AP') {
							newssrc = 'Associated Press';
						}
					} else {
						newssrc = 'Yahoo';
					}


				}
				var mynews = new News({
					title: myTitle,
					date: entry.publishDate,
					summary: entry.contentSnippet,
					link: newlink,
					newsSource: newssrc

				});
				allCollection.add(mynews);

			}

		}, number);





	return allCollection;
}


$(document).ready(function() {

	
 (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
  fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
 
    app = new AppRouter();
    Backbone.history.start();
	var allgoogleCollection = new AllNewsCollection({});
	var allyahooCollection = new AllNewsCollection({});
	allgoogleCollection = feedParser("http://news.google.com/?output=rss", 'google',10);
	allyahooCollection = feedParser("http://rss.news.yahoo.com/rss/topstories", 'yahoo',10);

	
		var allnewsView = new AllNewsView({
			collection: allgoogleCollection
		});
	
	var allyahooView = new AllNewsView({
		collection: allyahooCollection
	});
	
  
	$('#newsResult').append(allnewsView.render().el);
	$('#newsResult').append(allyahooView.render().el);
	
	

});
