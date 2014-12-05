
module = angular.module 'ngGallery'

module.service 'ngGalleryNav', ['$document', ($document) ->

  @LEFT_ARROW_KEY = 37
  @RIGHT_ARROW_KEY = 39
  @ESC_KEY = 27


  onKeyDown = (event) ->
    if event.keyCode is @LEFT_ARROW_KEY
      @handler.prevImage()
      
    else if event.keyCode is @RIGHT_ARROW_KEY
      @handler.nextImage()

    if event.keyCode is @ESC_KEY
      @handler.close '$escape'


  # Exposed methods

  @bind = (actions) ->
    @handler = actions
    body = $document.find 'body'
    if body?
      body.bind 'keydown', onKeyDown
]