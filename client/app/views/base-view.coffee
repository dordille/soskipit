module.exports = class BaseView extends Backbone.View

  uiMap: {}

  constructor: ->
    super
    @ui = {}


  template: (data) ->
    require("templates/#{ @templateName }") data

  viewData: () ->
    {}

  render: (data) =>
    @$el.html @template @viewData()
    @ui[key] = @$ selector for key, selector of @uiMap
    @