define(['text!template/index.html'], function(indexTemplate){
	var indexView= Backbone.View.extend({
		el: $('#content'),
		render: function(){
			this.$el.html(indexTemplate);
			}
		});
		
		return new indexView;
});

define(['text!templates/register.html'], function (registerTemplate) {
	var registerView = Backbone.View.extend({
		el: $('#content'),
		
		events: {
			"submit form": "register"
		},
		
		register: function () {
			$.post('/register', {
					firstName: $('input[name=firstName]').val(),
					lastName: $('input[name=lastName']).val(),
					email: $('input[name=email]').val(),
					password: $('input[name=password]').val(),
				}, function (data) {
					console.log(data);
				});
				return false;
			},
			
			render: function () {
			this.$el.html(registerTemplate);
		}
	});
	
	return registerView;
});

define(['text!temlplates/login.html'], function (loginTemplate){
	var loginView = Backbone.View.extend({
		el:$('#content'),
		
		events: {
			"submit form": "login"
			},
			
		login: function(){
			$.post('/login', {
				email: $('input[name=password]').val(),
				password: $('input[name=password]').val()
			}, function(data) {
				console.log(data);
			}).error(function(){
				$("#error").text('Unable to login.');
				$("#error").slideDown();
			});
			return false;
		},
		
		render: function () {
			this.$el.html(loginTemplate);
			$("#error").hide();
		}
	});
	
	return loginView;
	});

define(['text!templates/forgotpassword.html'], function (forgotpasswordTemplate) {
	var forgotpasswordView= Backbone.View.extend({
		el:$('#content'),
		
		events: {
			"submit form": "password"
		},
		
		password: function () {
			$.post('/forgotpassword', {
				email: $('input[name=email]').val()
				}, function (data) {
					console.log(data);
				});
				return false;
			},
			
			render: function () {
				this.$el.html(forgotpasswordTemplate);
			}
		});
		
		return forgotpasswordView;
	});
	
define(['SocialNetView', 'text!templates/index.html',
			'views/status', 'models/Status'],
			function (SocialNetView, indexTemplate, StatusView, Status) {
				var indexView= SocialNetView.extend({
					el: $('#content'),
					
					events: {
						"submit form": "updateStatus"
						},
						
					initialize: function () {
						this.collection.on('add', this.onStatusAdded, this);
						this.collection.on('reset', this.onStatusCollectionReset, this);
					},
					
					onStatusCollectionReset: function (collection) {
						var that = this;
						collection.each(function (model) {
							that.onStatusAdded(model);
						});
					},
					
					onStatusAdded: function (status) {
						var statusHtml= (new StatusView({model: status})).render().el;
						$(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
					},
					
					updateStatus: function () {
						var statusText= $('input[name=status]').val();
						var statusCollection = this.collection;
						$.post('/accounts/me/status', {
							status: statusText
						}, function (data) {
							statusCollection.add(new Status({status:statusText}));
						});
						return false;
					},
					
					render: function () {
						this.$el.html(indexTemplate);
					}
				});
				return indexView;
			});