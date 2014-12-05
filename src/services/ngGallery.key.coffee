
module = angular.module 'ngGallery'

module.service 'ngGalleryKey', ['$document', ($document) ->

  @LEFT_ARROW_KEY = 37
  @RIGHT_ARROW_KEY = 39
  @ESC_KEY = 27


  onKeyDown = (event) ->
    if event.keyCode is @LEFT_ARROW_KEY
      @handler.prevImage()
      
    else if event.keyCode is @RIGHT_ARROW_KEY
      @handler.nextImage()

    else if event.keyCode is @ESC_KEY
      if closeByEscape # fix here!
        @handler.close '$escape'


  # Exposed methods

  @bind = (actions) ->
    @handler = actions
    body = $document.find 'body'
    if body?
      body.bind 'keydown', onKeyDown
]