
(function(){

  var ViewWorld;
  ViewWorld = this.ViewWorld = {};

  ViewWorld.Form = Backbone.Model.extend({

    defaults: {
      "title": "",
      "owner": "",
      "active": true,
      "deletable": false,
      "reportCount": 0,
      "collections": [],
      "fields": []
    },

    reports: function(models, options) {
      options || (options = {});
      options.formId = this.id;
      return new ViewWorld.Reports(models, options);
    }

  });

  ViewWorld.Forms = Backbone.Collection.extend({

    model: ViewWorld.Form,
    url: '/forms',

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

  ViewWorld.Report = Backbone.Model.extend({

    defaults: {
      "public": false,
      "data": {}
    }

  });

  ViewWorld.Reports = Backbone.Collection.extend({

    model: ViewWorld.Report,

    initialize: function(models, options) {
      if (options && options.formId) this.formId = options.formId;
    },

    url: function() {
      return '/forms/' + encodeURIComponent(this.formId) + '/reports';
    },

    parse: function(response) {
      return response.reports;
    }

  });


  ViewWorld.Collection = Backbone.Model.extend({

    defaults: {
      "title": "",
      "active": true,
      "reportCount": 0,
      "forms": [],
      "objects": []
    }

  });

  ViewWorld.Collections = Backbone.Collection.extend({

    model: ViewWorld.Collection,
    url: '/collections',

    parse: function(response) {
      return response.collections;
    },
    
    comparator: function(collection) {
      return collection.get('title');
    }

  });

}).call(this);


