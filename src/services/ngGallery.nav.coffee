
module = angular.module 'ngGallery'

module.service 'ngGalleryNav', ['$document', '$interval', ($document, $interval) ->

  @visibleItemIndex = 0
  @itemsNum = 0
  
  @transitionDelay = 0 # delay next/prev transition

  @interval = null
  @timing = 0

  @infiniteLoop = no

  @closeByNavigation = no

  addDelay = (fn) ->
    if @transitionDelay > 0
      () ->
        $timeout fn, @transitionDelay
    else
      fn


  @next = () =>
    _next = () =>
      console.log @visibleItemIndex
      if @visibleItemIndex is @itemsNum
        if @infiniteLoop
          @visibleItemIndex = 0
        else
          if @closeByNavigation
            stopAuto()
            #scope.closeThisDialog()
            # todo: fix close
      else
        @visibleItemIndex += 1

    (addDelay _next)()


  @prev = () =>
    _prev = () =>
       if @visibleItemIndex isnt 0
          @visibleItemIndex -= 1
        else
          if @infiniteLoop
            @visibleItemIndex = @itemsNum

    (addDelay _prev)()


  startAuto = () =>
    # start auto play
    @interval = $interval (() => @next()), @timing


  stopAuto = () =>
    if @interval?
      $interval.cancel @interval

  @close = (dialog) =>
    # cleanInterval
    stopAuto()

    # view performCloseDialog source


  @closeGallery = ()->
    console.log 'do something'

  @bind = (opts) =>
    @transitionDelay = opts.transitionDelay
    @timing = opts.timing
    @infiniteLoop = opts.infiniteLoop
    @itemsNum = opts.images.length  - 1
    @closeByNavigation = opts.closeByNavigation

    console.log 'num', @itemsNum

    if @timing > 0
      startAuto()


  return
]