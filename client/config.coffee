exports.config =

  paths:
    public: '../public'

  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^vendor/

      order:
        before: [
          'vendor/scripts/jquery.js'
          'vendor/scripts/underscore.js'
          'vendor/scripts/backbone.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo: 'css/app.css'

    templates:
      defaultExtension: 'jade'
      joinTo: 'js/app.js'
