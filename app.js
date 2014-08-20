(function() {

  return {

    events: {
      'app.activated':'init'
    },

    requests:{ 

      createTarget: function() {

        return {
          url: '/api/v2/targets.json',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            "target": {
              "title": "YO",
              "type": "url_target",
              "active": true,
              "target_url": "http://api.justyo.co/yoall/",
              "method": "post",
              "attribute": "api_token=" + this.setting('token') + "&username=" + this.setting('username'), // Use settings in manifest.json to interpolate the values for token and username
              "username": "",
              "password": ""
            }
          })
        };
      },

      createTrigger: function(targetId) {

        return {
          url: '/api/v2/triggers.json',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({
            "trigger":{
              "title":"Yo there's an Urgent ticket",
              "active":true,
              "position":0,
              "all": [
                {"field": "priority", "operator": "value", "value": "urgent"}
              ],
              "actions": [
                {"field": "notification_target", "value": [targetId.toString(),"Ticket={{ticket.id}}"]}
              ]
            }
          })
        };
      },

    },

    init: function() {
      this.ajax('createTarget')
      .done(function(data){
        var targetId = data.target.id;
        services.notify("[YO app] target created.", 'notice');
        this.ajax('createTrigger', targetId)
          .done(_.bind(function(){
            services.notify("[YO App] trigger created.", 'notice');
          }, this))
          .fail(function(){
            services.notify("There was a problem creating the trigger for the YO app.", 'error');
          });
        })
      .fail(function(){
        services.notify("There was a problem creating the target for the YO app. Bummer :(", 'error');
      });
    }
  };

}());
