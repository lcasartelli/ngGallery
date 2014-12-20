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

  @$get = ['$rootScope', '$document', '$compile', '$http', '$log', '$q', 'ngGalleryGlobal', 'ngGalleryKey', 'ngGalleryNav', ($rootScope, $document, $compile, $http, $log, $q, global, keys, nav) ->

    $body = $document.find 'body'
    @images = []
    @nav = nav


    

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

      # DEBUGGGGGGGG
      @visibleItemIndex = 0

      @closeGallery = () -> console.log 'aaa'
      @next = () -> console.log '111'
      @prev = () -> console.log '222'
      @close = () -> console.log 'close'


      template = '<div class="gallery"><button class="gallery-close-btn ' + opts.closeClass + '" data-ng-click="close()">' + opts.closeLabel + '</button>'

      imageTemplate = (images, i) ->
        template += '<div class="gallery-item animate-show" data-ng-click="next()" ><span class="helper"></span><span  ><img src="' + opts.prefix + image + '"/></span></div>'

      imageTemplate image, i for image, i in @images

      template += '<div class="gallery-prev-next-container"><button class="gallery-prev-btn ' + opts.prevClass + '" data-ng-click="closeGallery()">' + opts.prevLabel + '</button><button class="gallery-next-btn ' + opts.nextClass + '" data-ng-click="next()">' + opts.nextLabel + '</button></div></div>'


    inject = (template) =>
      htmlNode = $el '<div id="nggallery' + global.globalID() + '" class="nggallery"></div>'
      if htmlNode?
        htmlNode.html '<div class="nggallery-overlay"></div><div class="nggallery-content">' + template + '</div>'
        
        # append html to body
        $body.append htmlNode
        # compile html with scope (this)
        setTimeout (() => (($compile htmlNode) @)), 10
        
        console.log @
        null

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

      $q.when loadImages _loadParam, options
      .then (tmpl) ->
        _template += tmpl
        
        # bind navigation handler
        nav.bind options


        # keys handler
        keys.bind options

        # inject template
        inject _template


        
        # open event
        $rootScope.$emit 'ngGallery-opened', id: global.globalID()

    return open: @open, nav: @nav
  

  ]

  return
