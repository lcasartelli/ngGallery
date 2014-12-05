module = angular.module 'ngGallery'

module.config ['$logProvider', ($logProvider) ->
  $logProvider.debugEnabled true
]

module.provider 'ngGallery', [() ->
  
  # Default params
  @defaults =
    images: []
    prefix: '', # url prefix
    # style
    prevClass: '',
    nextClass: '',
    prevLabel: '<',
    nextLabel: '>',
    closeLabel: 'x',
    closeClass: '',
    url: false,
    infiniteLoop: false,
    timing: 0
    # Close
    showClose: true,
    closeByDocument: true,
    closeByEscape: true,
    closeByNavigation: false,
    preCloseCallback: false

  @$get = ['$rootScope', '$http', '$log', 'ngGalleryGlobal', ($rootScope, $http, $log, global) ->


    loadImages = (param) ->
      if Array.isArray param
        generateTemplate(images)
      else
        ($http.get param).then ((result) -> generateTemplate result.data), ((err) -> $log.error 'Loading images error', err)
      

    @open = (opts = {}) ->
      $log.info 'Hello world! :)'

      options = angular.extend {}, defaults, opts

      globalID = global.incGlobalID()




  ]
]