module = angular.module 'ngGallery', []

module.config ['$logProvider', ($logProvider) ->
  $logProvider.debugEnabled true
]

module.provider 'ngGallery', () ->
  $el = angular.element
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

  @$get = ['$rootScope', '$document', '$http', '$log', '$q', 'ngGalleryGlobal', 'ngGalleryKey', 'ngGalleryNav', ($rootScope, $document, $http, $log, $q, global, keys, nav) ->

    $body = $document.find 'body'
    @images = []

    loadImages = (param, opts) =>
      if Array.isArray param
        @images = param
        generateTemplate opts
      else
        successFn = (response) =>
          if response?
            @images = response.data
            generateTemplate opts
        
        errorFn = (reason) ->
          $log.error 'Loading images error', reason

        # load images request
        ($http.get param).then successFn, errorFn
    

    generateTemplate = (opts) =>
      # todo: change template generation

      template = '<div class="gallery"><button class="gallery-close-btn ' + opts.closeClass + '" data-ng-click="closeThisDialog()">' + opts.closeLabel + '</button>'

      imageTemplate = (image, i) ->
        template += '<div class="gallery-item animate-show" data-ng-show="nav.visibleItemIndex === ' + i + '" data-ng-click="closeGallery($event)"><span class="helper"></span><span  data-ng-click="nav.next()"><img src="' + opts.prefix + image + '"/></span></div>'

      imageTemplate image for image in @images

      template += '<div class="gallery-prev-next-container"><button class="gallery-prev-btn ' + opts.prevClass + '" data-ng-click="nav.prev()">' + opts.prevLabel + '</button><button class="gallery-next-btn ' + opts.nextClass + '" data-ng-click="nav.next()">' + opts.nextLabel + '</button></div></div>'


    inject = (template) ->
      htmlNode = $el '<div id="nggallery' + global.globalID() + '" class="nggallery"></div>'
      if htmlNode?
        htmlNode.html '<div class="nggallery-overlay"></div><div class="nggallery-content">' + template + '</div>'
        $body.append htmlNode
      else
        # todo: handle error


    @open = (opts = {}) ->
      $log.info 'Hello lemon! :)'

      options = angular.extend {}, @defaults, opts

      # set global id for current gallery
      global.incGlobalID()

      if options.url? and url_regex.test options.url
        _loadParam = options.url
      else
        _loadParam = options.images

      _template = ''

      if options.showClose
        _template += '<div class="nggallery-close"></div>'

      ($q.when loadImages _loadParam, options).then (tmpl) ->
        _template += tmpl
        # inject template
        inject _template

        # bind navigation handler
        nav.bind options
        # keys handler
        keys.bind options


        # open event
        $rootScope.$emit 'ngGallery-opened', id: global.globalID()

    return open: @open
  

  ]

  return
