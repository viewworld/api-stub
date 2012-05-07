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
      Backbone.history.start({
        pushState: true,
        root: '/test/app/'
      }) || this.navigate('forms', {trigger: true});
    },

    renderTemplate: function(options) {
      if (options.sidebar) {
        this.template = new ViewWorld.Views.Template({template:'templates/three-columns'});
      } else {
        this.template = new ViewWorld.Views.Template({template:'templates/two-columns'});
      }
      this.template.render();
      this.menu = new ViewWorld.Views.Menu({el: this.template.$('#menu')})
    },

    forms: function() {
      this.renderTemplate({sidebar:true});
      forms = new ViewWorld.Views.Forms;
      forms.render();
    },

    form: function(formId) {
      this.renderTemplate({sidebar:true});
      var form = new ViewWorld.Models.Form({id: formId});
      var view = new ViewWorld.Views.Form({model: form});
      form.fetch();
    },

    collections: function() {
      this.renderTemplate({sidebar:true});
      collections =  new ViewWorld.Views.Collections;
      collections.render();
    },

    groups: function() {
      this.renderTemplate({sidebar:false});
      tree = new ViewWorld.Views.GroupsView;
      tree.render();
      $('#main-column').html(tree.$el);
    },

    editGroup: function(id) {
      this.renderTemplate({sidebar:false});
      form = new ViewWorld.Views.GroupFormView({model: new ViewWorld.Models.Group({id:id, parse: false})});
      form.model.fetch();
      $('#main-column').html(form.$el);
    },

    newGroup: function() {
      this.renderTemplate({sidebar:false});
      form = new ViewWorld.Views.GroupFormView({model: new ViewWorld.Models.Group({parse: false})});
      form.render();
      $('#main-column').html(form.$el);
    }

  });

  ViewWorld.app = {};
  ViewWorld.app.forms = new ViewWorld.Models.FormSet;
  ViewWorld.app.collections = new ViewWorld.Models.CollectionSet;
  ViewWorld.app.groups = new ViewWorld.Models.Groups;
  ViewWorld.app.groupTree = new ViewWorld.Models.GroupTree;

}).call(this);

/* vi: set sw=2 ts=2: */
