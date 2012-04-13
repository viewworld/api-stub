(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

  ViewWorld.Router = Backbone.Router.extend({

    routes: {
      'forms': 'forms',
      'collections': 'collections',
    },

    setup: function() {
      this.createSubViews();
      this.renderSubViews();
    },

    createSubViews: function() {
      this.menu = new ViewWorld.Views.Menu;
      this.forms = new ViewWorld.Views.Forms;
      this.collections = new ViewWorld.Views.Collections;
    },

    renderSubViews: function() {
      this.menu.render();
    },

    forms: function() {
      this.forms.render();
    },

    collections: function() {
      this.collections.render();
    },

  });

  ViewWorld.app = {};
  ViewWorld.app.forms = new ViewWorld.Models.FormSet;
  ViewWorld.app.collections = new ViewWorld.Models.CollectionSet;
  ViewWorld.app.router = new ViewWorld.Router;

  $(function(){
    ViewWorld.app.router.setup();
    Backbone.history.start({
      pushState: true,
      root: '/test/app/'
    }) || ViewWorld.app.router.navigate('forms', {trigger: true});
  });

}).call(this);

/* vi: set sw=2 ts=2: */
