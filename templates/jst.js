(function(){

  window.JST = {};

  {% for key in templates %}
  window.JST['{{ key }}'] = _.template({{ templates[key] }});
  {% endfor %}

})();
