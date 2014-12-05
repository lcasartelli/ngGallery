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

    @images = []

    loadImages = (param) =>
      if Array.isArray param
        @images = param
        generateTemplate()
      else
        successFn = (response) =>
          if response?
            @images = response.data
            generateTemplate()
        
        errorFn = (reason) ->
          $log.error 'Loading images error', reason

        # load images request
        ($http.get param).then successFn, errorFn
    

    generateTemplate = () =>
      # todo: change template generation

      template = '<div class="gallery"><button class="gallery-close-btn ' + options.closeClass + '" data-ng-click="closeThisDialog()">' + options.closeLabel + '</button>'

      imageTemplate = (image) ->
        template += '<div class="gallery-item animate-show" data-ng-show="visibleID === ' + i + '" data-ng-click="closeGallery($event)"><span class="helper"></span><span  data-ng-click="nextImage()"><img src="' + options.prefix + images[i] + '"/></span></div>'

      imageTemplate image for image in @images

      template += '<div class="gallery-prev-next-container"><button class="gallery-prev-btn ' + options.prevClass + '" data-ng-click="prevImage()">' + options.prevLabel + '</button><button class="gallery-next-btn ' + options.nextClass + '" data-ng-click="nextImage()">' + options.nextLabel + '</button></div></div>'


    @open = (opts = {}) ->
      $log.info 'Hello lemon! :)'

      options = angular.extend {}, defaults, opts

      globalID = global.incGlobalID()

  ]
]