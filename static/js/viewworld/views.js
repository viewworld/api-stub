(function(){

  var ViewWorld, Views;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

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

    template: _.template($('#template-menu').html()),

    events: {
      'click li a': 'goto'
    },

    initialize: function() {
      this.model.bind('change', this.render, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$('li').removeClass('active');
      if (this.model.get('current'))
        this.$('li#menu-'+this.model.get('current')).addClass('active');
      return this;
    },

    goto: function(event) {
      var route = $(event.target).data('route');
      ViewWorld.router.navigate(route, {trigger: true});
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


  var Page = Backbone.View.extend({

    go: function() {
      this.render();
    }

  });

  Views.FormsPage = Page.extend({

    tagName: 'div',
    template: _.template($('#template-forms-page').html()),

    render: function() {
      this.$el.html(this.template({}));
      var forms = new ViewWorld.Forms();
      var formList = new Views.FormList({
        el: '#form-list',
        model: forms,
      });
      forms.fetch();

      return this;
    },

  });

  Views.CollectionsPage = Page.extend({

    tagName: 'div',
    template: _.template($('#template-collections-page').html()),

    render: function() {
      this.$el.html(this.template({}));
      return this;
    }

  });


}).call(this);

/* vi: set sw=2 ts=2: */
