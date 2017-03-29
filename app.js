var baseUrl = 'https://jsonplaceholder.typicode.com/posts';
var Post = Backbone.Model.extend();

var Posts = Backbone.Collection.extend({
    model: Post,
    url: baseUrl
});

var SideBarPostView = Backbone.View.extend({
    template: _.template($('#postSideBar').html()),
    events: {
        'click .post-title': 'displayPost'
    },
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'change', this.maintain);
        // this.listenTo(this.model, 'change:title', this.maintain);
    },
    maintain: function() {
        this.render();
        var id = this.model.get('id');
        this.$('.post-title[data-id='+ id +' ]').addClass('red');
    },    
    displayPost: function(evt) {
      //commented portions achieve same without the use of a view
      var view = new MainSectionView({model: this.model});
      //var contentTemplate = _.template('<h3> <%= id %> - <%= title %></h3><p><%= body %></p>');
      //contentTemplate(this.model.attributes);
      $('#main-section').empty();
      $('.red').removeClass('red');
      this.$(evt.currentTarget).addClass('red');
      $('#main-section').append(view.render().el);
      //$('#main-section').append(contentTemplate(this.model.attributes));
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
});

var MainSectionView = Backbone.View.extend({
    template: _.template($('#postItem').html()),
    events: {
        'click .post-delete': 'deletePost',
        'click .post-edit': 'editOpen',
        'click .edit-close': 'editClose',
        'click .edit-confirm': 'editPost'
    },
    initialize: function() {
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'change', this.render);
    },
    editOpen: function() {
        $('.post-content').hide();
        $('.editFields').show();
    },
    editClose: function() {
        // $('.editFields').hide();
        // $('.post-content').show();
        this.render();
    },
    editPost: function() {
        var title = this.$('input[name="edit-title"]').val();
        var body = this.$('textarea[name="edit-body"]').val();
        this.model.save({title: title, body: body});
        this.editClose();
    },
    deletePost: function(e) {
        this.model.destroy({success: function(model, response) {
            posts.remove(model);
        }})
    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
});

var AppView = Backbone.View.extend({
    el: '#mainArea',
    initialize: function() {
        this.$post_title = this.$('input[name="post-title"]');
        this.$post_body = this.$('textarea[name="post-body"]');
        this.$side_bar = this.$('#sidebar');
        this.$search = this.$('#search');

        this.listenTo(posts, 'add', this.addOne);
        this.listenTo(posts, 'reset', this.addAll);

        posts.fetch();
    },
    events: {
        'submit': 'extractFormData',
        'keyup #search': 'filterByTitle'
    },
    addOne: function(post) {
        var view = new SideBarPostView({ model: post });
        this.$side_bar.append(view.render().el);
    },
    addAll: function(posts) {
        posts.forEach(function(post) {
            this.addOne(post);
        }, this);
    },
    filterByTitle: function(e) {
        var title = this.$search.val();
        if (title.length) {
            var titleSubstrings = title.split(' ');
            var filteredPosts = posts.filter(function(post) {
                return titleSubstrings.every(function(substring){
                    return post.get('title').indexOf(substring) >= 0;
                });
            });
            if (filteredPosts.length) {
                $('.post-title').remove();
                this.$('#search-results').empty();
                this.addAll(filteredPosts);
            } else {
                $('.post-title').remove();
                this.$('#search-results').text('No results');
            }
        } else {
            this.$('#search-results').empty();
            this.addAll(posts);
        }
    },
    extractFormData: function(event) {
        event.preventDefault();
        var post_title = this.$post_title.val();
        var post_body = this.$post_body.val();
        var post_data = { userId: 66, title: post_title, body: post_body };
        posts.create(post_data, { wait: true });
        this.$post_title.val();
        this.$post_body.val();
    }
});

var posts = new Posts();
var appView = new AppView();