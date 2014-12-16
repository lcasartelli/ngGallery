
module = angular.module 'ngGallery'

module.service 'ngGalleryKey', ['$document', 'ngGalleryNav', ($document, nav) ->

  @LEFT_ARROW_KEY = 37
  @RIGHT_ARROW_KEY = 39
  @ESC_KEY = 27

  @closeByEscape = no


  onKeyDown = (event) ->
    if event.keyCode is @LEFT_ARROW_KEY
      nav.prevImage()
      
    else if event.keyCode is @RIGHT_ARROW_KEY
      nav.nextImage()

    else if event.keyCode is @ESC_KEY
      if @closeByEscape
        nav.close '$escape'


  # Exposed methods

  @bind = (opts) ->
    @closeByEscape = opts.closeByEscape
    body = $document.find 'body'
    if body?
      body.bind 'keydown', onKeyDown


  return
]