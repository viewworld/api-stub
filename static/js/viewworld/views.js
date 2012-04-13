(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

  var Views;
  ViewWorld.Views = Views = {};

  Views.Breadcrumb = Backbone.View.extend({

    tagName: 'ul',
    className: 'breadcrumb',
    template: _.template($('#template-breadcrumb').html()),

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });


  Views.Menu = Backbone.View.extend({

    el: '#menu',
    template: _.template($('#template-menu').html()),

    events: {
      'click li a': 'goto'
    },

    initialize: function() {
      Backbone.history.bind('route', this.updateActive, this);
      this.active = null;
    },

    template_data: function() {
      return {
        'inboxCount': 0,
        'awaitingReviewCount': 0,
        'awaitingReturnCount': 0
      };
    },

    render: function() {
      this.$el.html(this.template(this.template_data()));
      this.$('li').removeClass('active');
      if (this.active)
        this.$('li#menu-'+this.active).addClass('active');
      return this;
    },

    updateActive: function(history, name) {
      this.active = name;
      this.render();
    },

    goto: function(event) {
      var route = $(event.target).data('route');
      ViewWorld.app.router.navigate(route, {trigger: true});
    }

  });

  var FormListItemView = Backbone.View.extend({

    tagName: 'div',
    template: _.template($('#template-form-list-item').html()),

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });

  Views.FormList = Backbone.View.extend({

    tagName: 'div',
    className: 'form-list',

    template: _.template($('#template-form-list-item').html()),

    initialize: function() {
      this.model.bind('add', this.addForm, this);
      this.model.bind('reset', this.addAllForms, this);
    },

    addForm: function(form) {
      var view = new FormListItemView({model: form});
      this.$el.append(view.render().el);
    },

    addAllForms: function() {
      this.model.each(this.addForm, this);
    },

  });

  Views.Forms = Backbone.View.extend({

    el: '#main-column',
    template: _.template($('#template-forms-page').html()),

    render: function() {
      this.$el.html(this.template({}));
      var formList = new Views.FormList({
        el: '#form-list',
        model: ViewWorld.app.forms,
      });
      ViewWorld.app.forms.fetch();

      return this;
    },

  });

  Views.Collections = Backbone.View.extend({

    el: '#main-column',
    template: _.template($('#template-collections-page').html()),

    render: function() {
      this.$el.html(this.template({}));
      return this;
    }

  });


}).call(this);

/* vi: set sw=2 ts=2: */
