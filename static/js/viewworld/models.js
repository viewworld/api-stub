
(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

  var Models;
  ViewWorld.Models = Models = {};

  Models.Form = Backbone.Model.extend({

    urlRoot: '/forms',

    defaults: {
      'title': '',
      'owner': '',
      'active': true,
      'deletable': false,
      'reportCount': 0,
      'collections': [],
      'fields': []
    },

    initialize: function(options) {
      options || (options = {});
      var reports = options.reports || {};
      this.reports = new Models.ReportSet(reports, {form: this});
    }

  });

  Models.FormSet = Backbone.Collection.extend({

    model: Models.Form,
    url: Models.Form.prototype.urlRoot,

    parse: function(response) {
      return response.forms;
    },

    comparator: function(form1, form2) {
      if (form1.get('active') !== form2.get('active')) {
        return form1.get('active') ? -1 : 1;
      } else {
        return form1.get('title').toLocaleLowerCase().localeCompare(
          form2.get('title').toLocaleLowerCase());
      }
    },

    active: function() {
      return this.filter(function(form) { return form.get('active'); });
    },

    inactive: function() {
      return this.without.apply(this, this.done());
    }

  });

  var reportUrl = function(formId) {
      return [Models.Form.prototype.urlRoot,
              encodeURIComponent(formId), 'reports'].join('/');
  };

  Models.Report = Backbone.Model.extend({

    defaults: {
      'public': false,
      'data': {}
    },

    initialize: function(attributes, options) {
      if (options && options.formId) {
        this.formId = options.formId;
        this.urlRoot = reportUrl(this.formId);
      }
    }

  });

  Models.ReportSet = Backbone.Collection.extend({

    model: Models.Report,

    initialize: function(models, options) {
      options || (options = {});
      if (options.form) this.form = options.form;
      else if (options.formId) this.formId = options.formId;
      else throw new Error('Either "form" or "formId" option must be specified');
    },

    url: function() {
      var id;
      if (this.form) id = this.form.id;
      else id = this.formId;
      return reportUrl(id);
    },

    parse: function(response) {
      return response.reports;
    }

  });


  Models.Collection = Backbone.Model.extend({

    urlRoot: '/collections',

    defaults: {
      'title': '',
      'active': true,
      'reportCount': 0,
      'forms': [],
      'objects': []
    }

  });

  Models.CollectionSet = Backbone.Collection.extend({

    model: Models.Collection,
    url: Models.Collection.prototype.urlRoot,

    parse: function(response) {
      return response.collections;
    },

    comparator: function(col1, col2) {
      if (col1.get('active') !== col2.get('active')) {
        return col1.get('active') ? -1 : 1;
      } else {
        return col1.get('title').toLocaleLowerCase().localeCompare(
          col2.get('title').toLocaleLowerCase());
      }
    },

    active: function() {
      return this.filter(function(form) { return form.get('active'); });
    },

    inactive: function() {
      return this.without.apply(this, this.done());
    }

  });

  Models.Group = Backbone.Model.extend({

    urlRoot: '/groups',

    defaults: {
      id: null,
      name: ''
    },

    initialize: function(){
      this.users = new Models.Users;
      this.users.url = '/groups/' + this.id + '/users';
    },

    parse: function(response) {
      if (response.group) {
        return response.group;
      } else {
        return response;
      }
    }

  }),

  Models.Groups = Backbone.Collection.extend({

    model: Models.Group,
    url: Models.Group.prototype.urlRoot,

    parse: function(response) {
      return response.groups;
    }

  }),

  Models.GroupTree = Backbone.Model.extend({

    initialize: function(){
      ViewWorld.app.groups.bind('reset add remove', this.rebuildTree, this);
    },

    buildTree: function(branch, list, level) {
      if (typeof branch == 'undefined') return null;
      if (level == undefined) { level = 1}
      var tree = [];
      for(var i=0; i<branch.length; i++)
        tree.push( {
          item: branch[i],
          children: this.buildTree(list[branch[i].id ], list, level+1),
          level: level
        });
      return tree;
    },

    rebuildTree: function() {
      this.grouped = ViewWorld.app.groups.groupBy(function(group){return group.get('parentId')});
      this.tree = this.buildTree(this.grouped[0], this.grouped);
      this.trigger('rebuilt');
    }

  }),

  Models.User = Backbone.Model.extend({

    urlRoot: '/users',

    defaults: {
      id: null,
      login: '',
      firstName: '',
      lastName: '',
      email: ''
    },

    parse: function(response) {
      if (response.user) {
        return response.user;
      } else {
        return response;
      }
    }

  }),

  Models.Users = Backbone.Collection.extend({

    model: Models.User,
    url: Models.User.prototype.urlRoot,

    parse: function(response) {
      return response.users;
    }

  })

}).call(this);

/* vi: set sw=2 ts=2: */
