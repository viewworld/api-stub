
(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld || (ViewWorld = this.ViewWorld = {});

  ViewWorld.Form = Backbone.Model.extend({

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

    reports: function(models, options) {
      options || (options = {});
      options.form = this;
      return new ViewWorld.Reports(models, options);
    }

  });

  ViewWorld.Forms = Backbone.Collection.extend({

    model: ViewWorld.Form,
    url: ViewWorld.Form.prototype.urlRoot,

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
      return [ViewWorld.Form.prototype.urlRoot,
              encodeURIComponent(formId), 'reports'].join('/');
  };

  ViewWorld.Report = Backbone.Model.extend({

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

  ViewWorld.Reports = Backbone.Collection.extend({

    model: ViewWorld.Report,

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


  ViewWorld.Collection = Backbone.Model.extend({

    urlRoot: '/collections',

    defaults: {
      'title': '',
      'active': true,
      'reportCount': 0,
      'forms': [],
      'objects': []
    }

  });

  ViewWorld.Collections = Backbone.Collection.extend({

    model: ViewWorld.Collection,
    url: ViewWorld.Collection.prototype.urlRoot,

    parse: function(response) {
      return response.collections;
    },

    comparator: function(collection) {
      return collection.get('title');
    }

  });

  ViewWorld.Menu = Backbone.Model.extend({

    defaults: {
      'current': '',
      'inboxCount': 0,
      'awaitingReviewCount': 3,
      'awaitingReturnCount': 4
    }

  });

}).call(this);

/* vi: set sw=2 ts=2: */
