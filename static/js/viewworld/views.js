(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

  var Views;
  ViewWorld.Views = Views = {};

  Views.Breadcrumb = Backbone.View.extend({

    tagName: 'ul',
    className: 'breadcrumb',
    template: JST['breadcrumb'],

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  });


  Views.Menu = Backbone.View.extend({

    el: '#menu',
    template: JST['menu'],

    events: {
      'click li a': 'goto'
    },

    initialize: function() {
      Backbone.history.bind('route', this.updateActive, this);
      this.activeItem = null;
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
      if (this.activeItem)
        this.$('li#menu-'+this.activeItem).addClass('active');
      return this;
    },

    updateActive: function(history, name) {
      this.activeItem = name;
      this.render();
    },

    goto: function(event) {
      var route = $(event.target).data('route');
      ViewWorld.app.router.navigate(route, {trigger: true});
    }

  });

  var FormListItemView = Backbone.View.extend({

    tagName: 'div',
    template: JST['forms/list-item'],

    events: {
      'click .btn[data-role=approve]': 'show',
      'click h3 a': 'show'
    },

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    show: function(event) {
      ViewWorld.app.router.navigate('forms/'+this.model.id, {trigger: true});
      event.preventDefault();
    }

  });

  Views.FormList = Backbone.View.extend({

    tagName: 'div',
    className: 'form-list',

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
    }

  });

  var CollectionListItemView = Backbone.View.extend({

    tagName: 'div',
    template: JST['collections/list-item'],

    events: {
      'click .btn[data-role=toggle]': 'toggle',
      'click .btn[data-role=approve]': 'show',
      'click h3 a' : 'show',
      'click li a' : 'showForm',
    },

    initialize: function(options) {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    toggle: function(event) {
      this.$('.btn[data-role=toggle]').toggleClass('active');
      this.$('.x-entry-body').slideToggle();
    },

    show: function(event) {
      ViewWorld.app.router.navigate('collections/'+this.model.id, {trigger: true});
      event.preventDefault();
    },

    showForm: function(event) {
      var formId = $(event.target).data('id');
      ViewWorld.app.router.navigate('forms/'+formId, {trigger: true});
      event.preventDefault();
    }

  });

  Views.CollectionList = Backbone.View.extend({

    tagName: 'div',

    initialize: function(options) {
      this.model.bind('add', this.addOne, this);
      this.model.bind('reset', this.addAll, this);
    },

    addOne: function(item) {
      var view = new CollectionListItemView({model: item});
      this.$el.append(view.render().el);
    },

    addAll: function() {
      this.model.each(this.addOne, this);
    },

  });

  Views.Forms = Backbone.View.extend({

    el: '#main-column',
    template: JST['forms/page'],

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
    template: JST['collections/page'],

    render: function() {
      this.$el.html(this.template({}));
      new Views.CollectionList({
        el: '#collection-list',
        model: ViewWorld.app.collections
      });

      ViewWorld.app.collections.fetch();
      return this;
    }

  });

  Views.ReportRow = Backbone.View.extend({

    tagName: 'tr',

    templates: {
      'number': _.template('<%= value %>'),
      'string': _.template('<%= value %>'),
      'object': _.template('object')
    },

    initialize: function(options) {
      if (options && options.fields)
        this.fields = options.fields;
      else
        this.fields = [];
    },

    render: function() {
      var data = this.model.get('data');
      _.each(this.fields, function(field) {
        var value = data[field.id];
        var td = $('<td>');
        td.html(this.templates[field.type]({value: value}));
        this.$el.append(td);
      }, this);
      return this;
    }

  });

  Views.Form = Backbone.View.extend({

    el: '#main-column',
    template: JST['form/page'],

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.reports = this.model.reports;
      this.reports.bind('reset', this.renderReports, this);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.reports.fetch();
      return this;
    },

    renderReports: function() {
      var tbody = this.$('table tbody');
      this.reports.each(function(report) {
        var rows = new Views.ReportRow({
          model: report,
          fields: this.model.get('fields')
        });
        tbody.append(rows.render().el);
      }, this);
    }

  });

  Views.Collection = Backbone.View.extend({

    el: '#main-column',
    template: JST['collection/page'],

    initialize: function() {
      this.model.bind('change', this.render, this);
      this.objects = this.model.objects;
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

  });

}).call(this);

/* vi: set sw=2 ts=2: */
