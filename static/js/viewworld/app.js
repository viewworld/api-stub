(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

  ViewWorld.Router = Backbone.Router.extend({

    routes: {
      'forms': 'forms',
      'collections': 'collections',
    },

    pages: {
      'forms': new ViewWorld.Views.FormsPage({el: '#main-column'}),
      'collections': new ViewWorld.Views.CollectionsPage({el: '#main-column'}),
    },

    initialize: function(options) {
      if (options && options.menu) this.menu = options.menu;
    },

    forms: function() {
      this.pages['forms'].go();
      this.menu.set('current', 'forms');
    },

    collections: function() {
      this.pages['collections'].go();
      this.menu.set('current', 'collections');
    },

  });

  $(function(){
    menu = new ViewWorld.Menu();
    var menuview = new ViewWorld.Views.Menu({el: '#menu', model: menu});
    menuview.render();
    ViewWorld.router = new ViewWorld.Router({'menu': menu});
    Backbone.history.start({pushState: true, root: '/test/app/'});
  });

}).call(this);

/* vi: set sw=2 ts=2: */
