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
      'click .btn[data-role=toggle]': 'toggle'
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
      'text': _.template('<%= value %>'),
      'object': _.template('<%= field.title %> object')
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
        td.html(this.templates[field.type]({
          value: value,
          field: field
        }));
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

  Views.GroupsView = Backbone.View.extend({

    template: JST['groups/page'],

    events: {
     'click .select-all': 'selectAll',
     'click .delete-selected': 'deleteSelected',
     'click .new-group': 'newGroup'
    },

    initialize: function(){
      this.collection.bind('reset', this.render, this)
    },

    selectAll: function(){
      if (this.$el.find('input:not(:checked)').length > 0) {
        this.$el.find('input').attr('checked', true);
      } else {
        this.$el.find('input').attr('checked', false);
      }
    },

    deleteSelected: function(){
      $.each(this.$el.find('input:checked'), function(){
        ViewWorld.app.groupTree.groups.get($(this).data('id')).destroy({wait: true});
      });
    },

    newGroup: function(){
      ViewWorld.app.router.navigate('groups/new', {trigger: true})
    },

    render: function(){
      this.$el.html(this.template);
      this.groupTreeView = new ViewWorld.Views.GroupTreeView;
      this.groupTreeView.groupTree.groups.fetch();
      return this;
    }

  }),

  Views.GroupView = Backbone.View.extend({

    tagName: 'tr',
    template: JST['groups/group'],

    events: {
      'click .delete': 'delete',
      'click a.edit': 'edit'
    },

    initialize: function(options){
      this.model.set("level", options.group.level)
    },

    delete: function(){
      this.model.destroy({wait: true});
    },

    edit: function(event){
      var route = $(event.target).closest('a').data('route');
      ViewWorld.app.router.navigate(route, {trigger: true});
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  })

  Views.GroupTreeView = Backbone.View.extend({

    el: '#group-tree',

    initialize: function(){
      this.groupTree = ViewWorld.app.groupTree;
      this.groupTree.bind('rebuilt', this.render, this);
    },

    renderTree: function(groups){
      if ((typeof groups == 'undefined')||(groups == null)) return null;
      for(var i=0; i<groups.length; i++){
        var group = new ViewWorld.Views.GroupView({group: groups[i], model: groups[i].item});
        group.render();
        this.$el.append(group.el);
        this.renderTree(groups[i].children);
      };
    },

    render: function(){
      this.$el.html('');
      this.renderTree(this.groupTree.tree);
      return this;
    }

  }),

  Views.GroupFormView = Backbone.View.extend({

    template: JST['groups/form'],

    events: {
      'click .cancel': 'cancel',
      'click .delete': 'delete',
      'click .save': 'save'
    },

    initialize: function(){
      this.model.bind('change', this.render, this);
    },

    cancel: function(event){
      ViewWorld.app.router.navigate($(event.target).data('route'), {trigger: true})
    },

    delete: function(){
      this.model.destroy(
          {
              wait: true,
              success: function(model, response){
                  ViewWorld.app.router.navigate('groups', {trigger: true})
              }
          }
      );
    },

    save: function(){
      var data = {};
      this.$el.find('input,select').each(function(){
        data[$(this).attr('name')] = $(this).attr('value');
      });
      this.model.save(
          data,
          {
              wait: true,
              success: function(model, reposnse){
                ViewWorld.app.router.navigate('groups', {trigger: true})
              }
          }
      );
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }

  })

}).call(this);

/* vi: set sw=2 ts=2: */
