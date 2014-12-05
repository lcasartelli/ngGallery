
module = angular.module 'ngGallery'

module.service 'ngGalleryGlobal', [() ->

  globalID = 0


  # Exposed methods

  @incGlobalID = () ->
    globalID += 1


  @globalID = () ->
    globalID
]