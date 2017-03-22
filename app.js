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
    displayPost: function() {

    },
    render: function() {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
});
// var PostView = Backbone.View.extend({
//   className: 'post',
//   events: {
//     'click p': 'clickedParagraph',
//     'dblclick .post-title': 'highlightTitle',
//     'click .post-edit': 'openForm',
//     'click .post-delete': 'deletePost',
//     'click .edit-confirm': 'editPost',
//     'click .edit-close': 'closeForm',
//
//   },
//   template: _.template( $('#postItem').html()),
//   initialize: function () {
//     this.listenTo(this.model, 'change', this.render);
//     this.listenTo(this.model, 'destroy', this.remove);
//   },
//   render: function () {
//     this.$el.html(this.template(this.model.attributes));
//     this.$title = this.$('.post-title');
//     this.$post_body = this.$('.post-body');
//     return this;
//   },
//   clickedParagraph: function (e) {
//     this.$post_body.toggleClass('red');
//   },
//   highlightTitle: function (e) {
//     this.$title.css('background-color', '#c00');
//   },
//   deletePost: function (e) {
//     this.model.destroy({success: function(model, response) {
//       posts.remove(model);
//     }})
//   },
//   openForm: function (e) {
//     this.$(".post-content").hide();
//     this.$(".editFields").toggle();
//   },
//   closeForm: function (e) {
//     this.render();
//   },
//   editPost: function (e) {
//     var title = this.$("input[name='edit-title']").val();
//     var body = this.$("textarea[name='edit-body']").val();
//     this.model.save({title: title,body: body});
//   }
// });

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
        'keypress #search': 'filterByTitle'
    },
    addOne: function(post) {
        var view = new SideBarPostView({ model: post });
        this.$side_bar.append(view.render().el);
    },
    addAll: function(posts) {
        posts.forEach(function(post) {
          this.addOne(post);
        })
    },
    filterByTitle: function(e) {
        //check that keypressed is ENTER
        if (e.keyCode == 13) {
          var title = this.$search.value();
        }
        /*TODO: Filter collection and call addAll 
        passing filtered collection*/
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