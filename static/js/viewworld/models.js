
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

    comparator: function(form) {
      return form.get('title');
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

    comparator: function(collection) {
      return collection.get('title');
    }

  });

}).call(this);

/* vi: set sw=2 ts=2: */
