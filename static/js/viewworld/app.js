(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

  ViewWorld.Router = Backbone.Router.extend({

    routes: {
      'forms': 'forms',
      'forms/:form': 'form',
      'collections': 'collections',
      'groups': 'groups',
      'groups/:id/edit': 'editGroup',
      'groups/new': 'newGroup'
    },

    initialize: function() {
      this.createSubViews();
      this.renderSubViews();
      Backbone.history.start({
        pushState: true,
        root: '/test/app/'
      }) || this.navigate('forms', {trigger: true});
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

    form: function(formId) {
      var form = new ViewWorld.Models.Form({id: formId});
      var view = new ViewWorld.Views.Form({model: form});
      form.fetch();
    },

    collections: function() {
      this.collections.render();
    },

    groups: function() {
      tree = new ViewWorld.Views.GroupsView({collection: new ViewWorld.Models.Groups});
      tree.collection.fetch();
      $('#main-column').html(tree.$el);
    },

    editGroup: function(id) {
      form = new ViewWorld.Views.GroupFormView({model: new ViewWorld.Models.Group({id:id, parse: false})});
      form.model.fetch();
      $('#main-column').html(form.$el);
    },

    newGroup: function() {
      form = new ViewWorld.Views.GroupFormView({model: new ViewWorld.Models.Group({parse: false})});
      form.render();
      $('#main-column').html(form.$el);
    }

  });

  ViewWorld.app = {};
  ViewWorld.app.forms = new ViewWorld.Models.FormSet;
  ViewWorld.app.collections = new ViewWorld.Models.CollectionSet;
  ViewWorld.app.groupTree = new ViewWorld.Models.GroupTree;
  ViewWorld.app.groups = new ViewWorld.Models.Groups;

}).call(this);

/* vi: set sw=2 ts=2: */
